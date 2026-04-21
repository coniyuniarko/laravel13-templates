import type { PageProps } from '@/types/interfaces'
import { usePage } from '@inertiajs/react'

export function usePermission() {
    const { auth } = usePage<PageProps>().props

    const can = (permission: string): boolean => {
        return auth.permissions.includes(permission)
    }

    const hasRole = (role: string): boolean => {
        return auth.roles.includes(role)
    }

    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some(role => auth.roles.includes(role))
    }

    const canAny = (permissions: string[]): boolean => {
        return permissions.some(p => auth.permissions.includes(p))
    }

    return { can, hasRole, hasAnyRole, canAny }
}