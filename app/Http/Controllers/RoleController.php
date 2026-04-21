<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('roles/index', [
            'roles' => Role::query()
                ->with('permissions')
                ->when($request->input('search'), function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhereHas('permissions', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%");
                        });
                })
                ->orderBy('name')
                ->paginate(10)
                ->withQueryString(),
            'permissions' => Permission::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $role = Role::create(['name' => $validated['name']]);

        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()
            ->route('roles.index', $request->only(['search', 'page']))
            ->with('success', trans('app.role_created_success'));
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name,' . $role->id],
        ]);

        $role->update($validated);

        return redirect()
            ->route('roles.index', $request->only(['search', 'page']))
            ->with('success', trans('app.role_updated_success'));
    }

    /**
     * Delete the specified role from storage.
     */
    public function destroy(Request $request, Role $role): RedirectResponse
    {
        $role->delete();

        return redirect()
            ->route('roles.index', $request->only(['search', 'page']))
            ->with('success', trans('app.role_deleted_success'));
    }
}
