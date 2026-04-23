import { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import DashboardLayout from "@/layouts/dasboard";
import { useTranslation } from "@/hooks/useTranslation";
import { usePermission } from "@/hooks/usePermission";
import { IconUsers, IconPlus, IconEdit, IconTrash, IconLock, IconUser } from "@/components/icons";
import type { Role, PaginationProps, User, SelectedItem } from "@/types/interfaces";
import DeleteModal from "@/components/DeleteModal";

export default function UsersIndex({ users, roles }: { users: PaginationProps<User>, roles: Role[] }) {
  const { t } = useTranslation();
  const { can } = usePermission();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(window.location.search).get('search') || '');
  const [preview, setPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    avatar: null as File | null,
    roles: [] as number[],
    _method: 'post',
  });

  const { data: passwordData, setData: setPasswordData, put: putPassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
    password: '',
    password_confirmation: '',
  });
  const [passwordUser, setPasswordUser] = useState<User | null>(null);

  useEffect(() => {
    if (data.avatar instanceof File) {
      const objectUrl = URL.createObjectURL(data.avatar);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (editingUser?.avatar) {
      setPreview('/' + editingUser.avatar);
    } else {
      setPreview(null);
    }
  }, [data.avatar, editingUser]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.get('/users',
        { search: searchQuery },
        { preserveState: true, replace: true }
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getQueryParams = () => {
    return new URLSearchParams({
      search: searchQuery,
      page: users.current_page.toString(),
    }).toString();
  }

  const submit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const queryParams = getQueryParams();
    const url = (editingUser ? `/users/${editingUser.id}` : '/users') + `?${queryParams}`;

    // Use post with _method spoofing for file uploads in Laravel updates
    post(url, {
      preserveScroll: true,
      onSuccess: () => {
        (document.getElementById('create_user_modal') as HTMLDialogElement).close();
        reset();
        setEditingUser(null);
      },
    });
  };

  const handleDelete = async () => {
    if (!selected) return;
    const queryParams = getQueryParams();

    return new Promise<void>((resolve) => {
      router.delete(`/users/${selected.id}?${queryParams}`, {
        onSuccess: () => {
          setSelected(null);
        },
        onFinish: () => resolve(),
      });
    });
  };

  const handleChangePassword = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordUser) return;

    putPassword(`/users/${passwordUser.id}/password`, {
      preserveScroll: true,
      onSuccess: () => {
        (document.getElementById('change_password_modal') as HTMLDialogElement).close();
        resetPassword();
        setPasswordUser(null);
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title={t('app.menu_users')} />

      <div className="flex flex-col gap-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-base-content">{t('app.menu_users')}</h2>
            <p className="text-sm text-base-content/60">{t('app.users_description')}</p>
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
            {can('create users') && (
              <button
                onClick={() => {
                  setEditingUser(null);
                  reset();
                  (document.getElementById('create_user_modal') as HTMLDialogElement).showModal();
                }}
                className="btn btn-primary btn-sm normal-case gap-1.5 border-none cursor-pointer whitespace-nowrap"
              >
                <IconPlus />
                {t('app.create_user')}
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
                  <th className="font-medium">{t('app.id')}</th>
                  <th className="font-medium">{t('app.name')}</th>
                  <th className="font-medium">{t('app.email')}</th>
                  <th className="font-medium">{t('app.menu_roles')}</th>
                  <th className="font-medium text-right">{t('app.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {(users.data.length > 0) && users.data.map((user) => (
                  <tr key={user.id} className="hover:bg-base-200/50 transition-colors">
                    <td className="text-base-content/50">#{user.id}</td>
                    <td>
                      <div className="flex items-center gap-2 font-medium text-base-content">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img src={'/' + user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <IconUser />
                          )}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="text-base-content/75 text-sm">{user.email}</td>
                    <td>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {user.roles?.map((role: any) => (
                          <span key={role.id} className="badge badge-ghost text-[10px] opacity-70">
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {can('update users') && (
                          <button
                            onClick={() => {
                              setPasswordUser(user);
                              resetPassword();
                              (document.getElementById('change_password_modal') as HTMLDialogElement).showModal();
                            }}
                            className="btn btn-ghost btn-xs text-warning hover:bg-warning/10 border-none bg-transparent cursor-pointer gap-1"
                          >
                            <IconLock />
                            {t('app.change_password')}
                          </button>
                        )}
                        {can('update users') && (
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setData({
                                name: user.name,
                                email: user.email,
                                password: '',
                                avatar: null,
                                roles: user.roles?.map((r: any) => r.id) || [],
                                _method: 'put',
                              });
                              (document.getElementById('create_user_modal') as HTMLDialogElement).showModal();
                            }}
                            className="btn btn-ghost btn-xs text-info hover:bg-info/10 border-none bg-transparent cursor-pointer gap-1"
                          >
                            <IconEdit />
                            {t('app.edit')}
                          </button>
                        )}
                        {can('delete users') && (
                          <button
                            onClick={() => {
                              setSelected({ id: user.id, name: user.name });
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
              {users.links.map((link, i) => (
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

      {/* Create User Modal */}
      <dialog id="create_user_modal" className="modal">
        <div className="modal-box max-w-2xl bg-base-100">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 border-none cursor-pointer">✕</button>
          </form>
          <h3 className="font-bold text-lg text-base-content">
            {editingUser ? t('app.edit_user') : t('app.create_user')}
          </h3>

          <form onSubmit={submit} className="mt-4 flex flex-col gap-5">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/70">{t('app.avatar')}</span>
              </label>
              <div className="flex flex-col items-center gap-2">
                <label className="relative group cursor-pointer">
                  <input
                    type="file"
                    onChange={e => setData('avatar', (e.target.files && e.target.files[0]) || null)}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="avatar">
                    <div className="w-24 h-24 rounded-xl ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-primary/10 flex items-center justify-center">
                      {preview ? (
                        <img src={preview} alt="Avatar preview" className="object-cover" />
                      ) : (
                        <div className="text-primary scale-150">
                          <IconUser />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white" >
                          <IconEdit />
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
                <span className="text-xs text-base-content/50">{t('app.click_to_change_avatar')}</span>
              </div>
              {errors.avatar && <span className="text-error text-xs mt-1 text-center">{errors.avatar}</span>}
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/70">{t('app.name')}</span>
              </label>
              <input
                type="text"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder={t('app.user_name_placeholder')}
                className={`input input-bordered w-full bg-base-100 ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && <span className="text-error text-xs mt-1">{errors.name}</span>}
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/70">{t('app.email')}</span>
              </label>
              <input
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                placeholder={t('app.email_placeholder')}
                className={`input input-bordered w-full bg-base-100 ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <span className="text-error text-xs mt-1">{errors.email}</span>}
            </div>

            {!editingUser && (
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-semibold text-base-content/70">{t('app.password_label')}</span>
                </label>
                <input
                  type="password"
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  placeholder={t('app.password_placeholder')}
                  className={`input input-bordered w-full bg-base-100 ${errors.password ? 'input-error' : ''}`}
                />
                {errors.password && <span className="text-error text-xs mt-1">{errors.password}</span>}
              </div>
            )}

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/70">{t('app.menu_roles')}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {roles.map((role) => (
                  <label key={role.id} className="label cursor-pointer justify-start gap-3 border border-base-300 rounded-xl px-4 py-2.5 hover:bg-base-200 transition-colors">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm rounded-md"
                      checked={data.roles.includes(role.id)}
                      onChange={(e) => {
                        const id = role.id;
                        const newRoles = e.target.checked
                          ? [...data.roles, id]
                          : data.roles.filter(r => r !== id);
                        setData('roles', newRoles);
                      }}
                    />
                    <span className="label-text text-[13px] font-medium text-base-content">{role.name}</span>
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

      {/* Change Password Modal */}
      <dialog id="change_password_modal" className="modal">
        <div className="modal-box max-w-md bg-base-100">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 border-none cursor-pointer">✕</button>
          </form>
          <h3 className="font-bold text-lg text-base-content">
            {t('app.change_password')} - {passwordUser?.name}
          </h3>

          <form onSubmit={handleChangePassword} className="mt-4 flex flex-col gap-5">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/70">{t('app.new_password')}</span>
              </label>
              <input
                type="password"
                value={passwordData.password}
                onChange={e => setPasswordData('password', e.target.value)}
                placeholder="••••••••"
                className={`input input-bordered w-full bg-base-100 ${passwordErrors.password ? 'input-error' : ''}`}
              />
              {passwordErrors.password && <span className="text-error text-xs mt-1">{passwordErrors.password}</span>}
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-base-content/70">{t('app.confirm_password')}</span>
              </label>
              <input
                type="password"
                value={passwordData.password_confirmation}
                onChange={e => setPasswordData('password_confirmation', e.target.value)}
                placeholder="••••••••"
                className="input input-bordered w-full bg-base-100"
              />
            </div>

            <div className="modal-action mt-2">
              <button type="submit" className="btn btn-primary px-8 normal-case border-none cursor-pointer" disabled={passwordProcessing}>
                {passwordProcessing && <span className="loading loading-spinner loading-xs"></span>}
                {t('app.save')}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <DeleteModal
        id="delete-modal"
        title={t('app.delete')}
        description={selected ? t('app.confirm_delete_user', { name: selected.name }) : ''}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}