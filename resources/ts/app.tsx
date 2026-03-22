import './bootstrap.js'
import '../css/app.css'

import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import React from 'react'

createInertiaApp({
  resolve: (name: string) => {
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })
    return pages[`./pages/${name}.tsx`] as any
  },

  setup({ el, App, props }: { el: HTMLElement; App: any; props: any }) {
    createRoot(el).render(<App {...props} />)
  },

  title: (title: string) => `${title} - Laravel 12 Template`,
})