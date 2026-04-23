import { useEffect, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/dasboard";
import { useTranslation } from "@/hooks/useTranslation";
import { IconUser, IconEdit } from "@/components/icons";
import type { PageProps } from "@/types/interfaces";

export default function Profile() {
  const { props: { auth } } = usePage<PageProps>();
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    name: auth.user.name || '',
    avatar: null as File | null,
    _method: 'put',
  });

  useEffect(() => {
    if (data.avatar instanceof File) {
      const objectUrl = URL.createObjectURL(data.avatar);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (auth.user.avatar) {
      setPreview('/' + auth.user.avatar);
    } else {
      setPreview(null);
    }
  }, [data.avatar, auth.user.avatar]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/profile', {
      preserveScroll: true,
    });
  };

  return (
    <DashboardLayout>
      <Head title={t('app.profile')} />

      <div className="max-w-2xl mx-auto w-full py-8">
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body gap-6">
            <div>
              <h2 className="text-xl font-bold text-base-content">{t('app.profile')}</h2>
              <p className="text-sm text-base-content/60">{t('app.profile_description')}</p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6">
              {/* Avatar Section */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-semibold text-base-content/70">{t('app.avatar')}</span>
                </label>
                <div className="flex flex-col items-center gap-3">
                  <label className="relative group cursor-pointer">
                    <input
                      type="file"
                      onChange={e => setData('avatar', (e.target.files && e.target.files[0]) || null)}
                      className="hidden"
                      accept="image/*"
                    />
                    <div className="avatar">
                      <div className="w-32 h-32 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-primary/10 flex items-center justify-center">
                        {preview ? (
                          <img src={preview} alt="Avatar preview" className="object-cover w-full h-full" />
                        ) : (
                          <div className="text-primary scale-[2.5]">
                            <IconUser />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-white">
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

              {/* Name field */}
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

              {/* Email field (Read Only) */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-semibold text-base-content/70">{t('app.email')}</span>
                </label>
                <input
                  type="email"
                  value={auth.user.email}
                  disabled
                  className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="btn btn-primary px-10 normal-case border-none cursor-pointer" disabled={processing}>
                  {processing && <span className="loading loading-spinner loading-xs"></span>}
                  {t('app.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}