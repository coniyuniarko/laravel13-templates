<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // User::factory(10)->create();

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
        ]);
        $user1 = User::factory()->create([
            'name' => 'Test User 1',
            'email' => 'test1@example.com',
            'password' => 'password',
        ]);

        Permission::firstOrCreate(['name' => 'create users']);
        Permission::firstOrCreate(['name' => 'read users']);
        Permission::firstOrCreate(['name' => 'update users']);
        Permission::firstOrCreate(['name' => 'delete users']);

        Permission::firstOrCreate(['name' => 'create roles']);
        Permission::firstOrCreate(['name' => 'read roles']);
        Permission::firstOrCreate(['name' => 'update roles']);
        Permission::firstOrCreate(['name' => 'delete roles']);

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(['create users', 'read users', 'update users', 'delete users']);
        $adminRole->givePermissionTo(['create roles', 'read roles', 'update roles', 'delete roles']);

        $user->assignRole('admin');
        $user1->assignRole('admin');
    }
}
