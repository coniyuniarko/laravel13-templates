import React, { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { useTranslation } from '@/hooks/useTranslation';
import { IconEye, IconEyeOff } from '@/components/icons';
import { LOCALES } from '@/types/consts';

export default function Login() {
  const { t, changeLocale, locale } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    email: '',
    password: '',
    remember: true,
  })

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>): void {
    e.preventDefault();
    form.post('/login', {
      onFinish: () => form.reset('password'),
    });
  }

  return (
    <>
      <Head title={t('app.login_title')} />
      <div className="flex gap-2 absolute top-8 right-8 z-50">
        {LOCALES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => changeLocale(code)}
            className={`px-3 py-1 rounded text-sm border ${locale === code
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex min-h-screen items-center justify-center bg-base-100 p-8">
        <div className="card lg:card-side bg-base-100 shadow-md w-full max-w-5xl border border-base-300">
          <figure className="h-[80vh]">
            <img src="/images/login.png" alt={t('app.login_illustration')} className="h-full w-full object-cover" />
          </figure>
          <div className="card-body lg:w-[450px] justify-center">
            <h2 className="card-title text-2xl font-bold">{t('app.welcome')}</h2>
            <div className="text-base-content/70 mb-4">{t('app.login_subtitle')}</div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">{t('app.email_label')}</span>
                </label>
                <input
                  type="email"
                  placeholder={t('app.email_placeholder')}
                  className={`input input-bordered w-full ${form.errors.email ? 'input-error' : ''}`}
                  value={form.data.email}
                  onChange={(e) => form.setData('email', e.target.value)}
                  required
                />
                {form.errors.email && <div className="text-error text-sm mt-1">{t(form.errors.email)}</div>}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">{t('app.password_label')}</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('app.password_placeholder')}
                    className={`input input-bordered w-full pr-10 ${form.errors.password ? 'input-error' : ''}`}
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                  >
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
                {form.errors.password && <div className="text-error text-sm mt-1">{form.errors.password}</div>}
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={form.data.remember}
                    onChange={(e) => form.setData('remember', e.target.checked)}
                  />
                  <span className="label-text">{t('app.remember_me')}</span>
                </label>
              </div>

              <div className="card-actions mt-2">
                <button className="btn btn-primary w-full" disabled={form.processing}>
                  {form.processing && <span className="loading loading-spinner loading-sm"></span>}
                  {t('app.sign_in')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}