import { Head, useForm } from '@inertiajs/react'

export default function Login() {
  const form = useForm({
    email: '',
    password: '',
    remember: false,
  })

  function handleSubmit(e: React.SubmitEvent): void {
    e.preventDefault();
  }

  return (
    <>
      <Head title="Login" />

      <div className="flex min-h-screen items-center justify-center bg-info-content">
        <div className="w-full max-w-md rounded-lg bg-base-100 p-8 shadow-md">
          <h1 className="mb-6 text-center text-3xl font-bold">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                className="input w-full"
                value={form.data.email}
                onChange={(e) => form.setData('email', e.target.value)}
              />
              {form.errors.email && <p className="label text-red-600">{form.errors.email}</p>}
            </fieldset>

             <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                className="input w-full"
                value={form.data.password}
                onChange={(e) => form.setData('password', e.target.value)}
              />
              {form.errors.password && <p className="label text-red-600">{form.errors.password}</p>}
            </fieldset>

            <button
              type="submit"
              disabled={form.processing}
              className="w-full rounded-md bg-indigo-600 py-2 px-4 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {form.processing ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}