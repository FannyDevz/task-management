<?php

namespace Database\Seeders;

use App\Models\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserRole::factory()->create([
            'slug' => 'admin',
            'name' => 'Admin',
        ]);
        UserRole::factory()->create([
            'slug' => 'billing',
            'name' => 'Billing',
        ]);
        UserRole::factory()->create([
            'slug' => 'cs',
            'name' => 'Customer Service',
        ]);
        UserRole::factory()->create([
            'slug' => 'developer',
            'name' => 'Developer',
        ]);
    }
}
