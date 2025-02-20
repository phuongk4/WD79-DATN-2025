<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('name', RoleName::ADMIN)->first();
        $userRole = Role::where('name', RoleName::USER)->first();

        $admin = User::where('email', 'admin@gmail.com')->first();
        $user = User::where('email', 'user@gmail.com')->first();

        $user_roles = [
            [
                'user_id' => $admin->id,
                'role_id' => $adminRole->id
            ],
            [
                'user_id' => $user->id,
                'role_id' => $userRole->id
            ],
        ];

        DB::table('role_users')->insert($user_roles);
    }
}