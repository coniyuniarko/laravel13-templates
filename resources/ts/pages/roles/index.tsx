import { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import DashboardLayout from "@/layouts/dasboard";
import { useTranslation } from "@/hooks/useTranslation";
import { usePermission } from "@/hooks/usePermission";
import { IconSettings, IconUsers, IconPlus, IconEdit, IconTrash, IconRoles } from "@/components/icons";
import type { Role, PaginationProps, Permission, SelectedItem } from "@/types/interfaces";
import DeleteModal from "@/components/DeleteModal";

export default function RolesIndex({ roles, permissions }: { roles: PaginationProps<Role>, permissions: Permission[] }) {
  const { t } = useTranslation();
  const { can } = usePermission();
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(window.location.search).get('search') || '');
  const [permSearch, setPermSearch] = useState('');
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    permissions: [] as number[],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      router.get('/roles',
        { search: searchQuery },
        { preserveState: true, replace: true }
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getQueryParams = () => {
    return new URLSearchParams({
      search: searchQuery,
      page: roles.current_page.toString(),
    }).toString();
  }

  const submit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const queryParams = getQueryParams();
    const url = (editingRole ? `/roles/${editingRole.id}` : '/roles') + `?${queryParams}`;
    const method = editingRole ? put : post;

    method(url, {
      preserveScroll: true,
      onSuccess: () => {
        (document.getElementById('create_role_modal') as HTMLDialogElement).close();
        reset();
        setEditingRole(null);
      },
    });
  };

  const handleDelete = async () => {
    if (!selected) return;
    const queryParams = getQueryParams();

    return new Promise<void>((resolve) => {
      router.delete(`/roles/${selected.id}?${queryParams}`, {
        onSuccess: () => {
          setSelected(null);
        },
        onFinish: () => resolve(),
      });
    });
  };

  return (
    <DashboardLayout>
      <Head title={t('app.menu_roles')} />

      <div className="flex flex-col gap-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-base-content">{t('app.menu_roles')}</h2>
            <p className="text-sm text-base-content/60">{t('app.roles_description')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="form-control w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('app.search_placeholder')}
                className="input input-bordered input-sm w-full bg-base-100"
              />
            </div>
            {can('create roles') && (
              <button
                onClick={() => {
                  setEditingRole(null);
                  setPermSearch('');
                  reset();
                  (document.getElementById('create_role_modal') as HTMLDialogElement).showModal();
                }}
                className="btn btn-primary btn-sm normal-case gap-1.5 border-none cursor-pointer whitespace-nowrap"
              >
                <IconPlus />
                {t('app.create_role')}
              </button>
            )}
          </div>
        </div>

        {/* Table Card */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="text-base-content/40 border-b border-base-300">
                  <th className="font-medium">ID</th>
                  <th className="font-medium">{t('app.role_name')}</th>
                  <th className="font-medium">{t('app.permissions')}</th>
                  <th className="font-medium text-right">{t('app.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {(roles.data.length > 0) && roles.data.map((role) => (
                  <tr key={role.id} className="hover:bg-base-200/50 transition-colors">
                    <td className="text-base-content/50">#{role.id}</td>
                    <td>
                      <div className="flex items-center gap-2 font-medium text-base-content">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <IconRoles />
                        </div>
                        {role.name}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.map((p) => (
                          <span key={p.id} className="badge badge-ghost text-[10px] opacity-70">
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {can('update roles') && (
                          <button
                            onClick={() => {
                              setEditingRole(role);
                              setPermSearch('');
                              setData({
                                name: role.name,
                                permissions: role.permissions?.map(p => p.id) || [],
                              });
                              (document.getElementById('create_role_modal') as HTMLDialogElement).showModal();
                            }}
                            className="btn btn-ghost btn-xs text-info hover:bg-info/10 border-none bg-transparent cursor-pointer gap-1"
                          >
                            <IconEdit />
                            {t('app.edit')}
                          </button>
                        )}
                        {can('delete roles') && (
                          <button
                            onClick={() => {
                              setSelected({ id: role.id, name: role.name });
                              (document.getElementById('delete-modal') as HTMLDialogElement).showModal();
                            }}
                            className="btn btn-ghost btn-xs text-error hover:bg-error/10 border-none bg-transparent cursor-pointer gap-1"
                          >
                            <IconTrash />
                            {t('app.delete')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-base-300 flex justify-center">
            <div className="join">
              {roles.links.map((link, i) => (
                <Link
                  key={i}
                  href={link.url || "#"}
                  data={{ search: searchQuery }}
                  preserveState
                  preserveScroll
                  className={`join-item btn btn-sm ${link.active ? 'btn-active' : ''} ${!link.url ? 'btn-disabled' : ''}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Role Modal */}
      <dialog id="create_role_modal" className="modal">
        <div className="modal-box max-w-2xl bg-base-100">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 border-none cursor-pointer">✕</button>
          </form>
          <h3 className="font-bold text-lg text-base-content">
            {editingRole ? t('app.edit_role') : t('app.create_role')}
          </h3>

          <form onSubmit={submit} className="mt-4 flex flex-col gap-5">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/70">{t('app.role_name')}</span>
              </label>
              <input
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder={t('app.role_name_placeholder')}
                className={`input input-bordered w-full bg-base-100 ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && <span className="text-error text-xs mt-1">{errors.name}</span>}
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/70">{t('app.permissions')}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {permissions
                  .filter(p => p.name.toLowerCase().includes(permSearch.toLowerCase()))
                  .map((permission) => (
                    <label key={permission.id} className="label cursor-pointer justify-start gap-3 border border-base-300 rounded-xl px-4 py-2.5 hover:bg-base-200 transition-colors">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm rounded-md"
                        checked={data.permissions.includes(permission.id)}
                        onChange={(e) => {
                          const id = permission.id;
                          const newPermissions = e.target.checked
                            ? [...data.permissions, id]
                            : data.permissions.filter(p => p !== id);
                          setData('permissions', newPermissions);
                        }}
                      />
                      <span className="label-text text-[13px] font-medium text-base-content">{permission.name}</span>
                    </label>
                  ))}
              </div>
            </div>

            <div className="modal-action mt-2">
              <button type="submit" className="btn btn-primary px-8 normal-case border-none cursor-pointer" disabled={processing}>
                {processing && <span className="loading loading-spinner loading-xs"></span>}
                {t('app.save')}
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <DeleteModal
        id="delete-modal"
        title={t('app.delete')}
        description={selected ? t('app.confirm_delete_role', { name: selected.name }) : ''}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}