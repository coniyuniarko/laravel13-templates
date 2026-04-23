import './bootstrap.js'
import '../css/app.css'

import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { APP_NAME } from './types/consts.js'
import { TranslationProvider } from './context/TranslationContext'

createInertiaApp({
  resolve: (name: string) => {
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })
    return pages[`./pages/${name}.tsx`] as any
  },

  setup({ el, App, props }: { el: HTMLElement; App: any; props: any }) {
    createRoot(el).render(
      <TranslationProvider>
        <App {...props} />
      </TranslationProvider>
    )
  },

  title: (title: string) => `${title} - ${APP_NAME}`,
})