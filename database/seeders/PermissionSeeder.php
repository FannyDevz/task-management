<?php

namespace Database\Seeders;

use App\Models\PermissionList;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // USER
            [
                'cid' => 'users.index',
                'info' => 'Page Users - Melihatkan semua data user'
            ],
            [
                'cid' => 'users.store',
                'info' => 'Page Users - Menambahkan data user'
            ],
            [
                'cid' => 'users.update',
                'info' => 'Page Users - Mengedit data user'
            ],
            [
                'cid' => 'users.delete',
                'info' => 'Page Users - Menghapus data user'
            ],

            // ROLE
            [
                'cid' => 'roles.index',
                'info' => 'Role Page - Melihatkan semua data role'
            ],
            [
                'cid' => 'roles.store',
                'info' => 'Role Page - Menambahkan data role'
            ],
            [
                'cid' => 'roles.update',
                'info' => 'Role Page - Mengedit data role'
            ],
            [
                'cid' => 'roles.delete',
                'info' => 'Role Page - Menghapus role'
            ],

            // PERMISSION
            [
                'cid' => 'settings.index',
                'info' => 'Settings Page - Melihatkan page Settings'
            ],
            [
                'cid' => 'settings.update',
                'info' => 'Settings Page - Mengedit data Settings'
            ],
            // PERMISSION
            [
                'cid' => 'permissions.index',
                'info' => 'Permission Page - Melihatkan page permission'
            ],
            [
                'cid' => 'permissions.update',
                'info' => 'Permission Page - Mengedit data role permission'
            ],

            // TASK
            [
                'cid' => 'tasks.index',
                'info' => 'Task Page - Melihatkan semua data task pribadi'
            ],
            [
                'cid' => 'tasks.add',
                'info' => 'Add Task Page - Melihat halaman tambah task'
            ],
            [
                'cid' => 'tasks.store',
                'info' => 'Add Task Page - Menambahkan data task'
            ],
            [
                'cid' => 'tasks.update',
                'info' => 'Task Page - Mengedit data task'
            ],
            [
                'cid' => 'tasks.detail',
                'info' => 'Task Page - Melihat data Detail task'
            ],
            [
                'cid' => 'tasks.delete',
                'info' => 'Task Page - Menghapus data task'
            ],

            // ALL TASK

            [
                'cid' => 'tasks.all.index',
                'info' => 'All Task Page - Melihatkan semua task'
            ],
            [
                'cid' => 'tasks.all.update',
                'info' => 'All Task Page - Mengedit data task'
            ],
            [
                'cid' => 'tasks.all.detail',
                'info' => 'All Task Page - Melihat data Detail task'
            ],
            [
                'cid' => 'tasks.all.delete',
                'info' => 'All Task Page - Menghapus data task'
            ],
            [
                'cid' => 'tasks.change.status',
                'info' => 'All Task Page - Mengupdate status dan extra point task'
            ],
            [
                'cid' => 'tasks.bulk.delete',
                'info' => 'All Task Page - Menghapus Banyak task'
            ],


            // CATEGORY
            [
                'cid' => 'categories.index',
                'info' => 'Category Page - Melihatkan semua category'
            ],
            [
                'cid' => 'categories.store',
                'info' => 'Add Category - Menambahkan category'
            ],
            [
                'cid' => 'categories.update',
                'info' => 'Edit Category - Mengedit category'
            ],
            [
                'cid' => 'categories.delete',
                'info' => 'Delete Category - Menghapus category'
            ],



            // CONFIG-FIELD
            [
                'cid' => 'config.field.index',
                'info' => 'Config Field Page - Melihatkan semua config field'
            ],
            [
                'cid' => 'config.field.store',
                'info' => 'Add Config Field - Menambahkan config field'
            ],
            [
                'cid' => 'config.field.update',
                'info' => 'Edit Config Field - Mengedit config field'
            ],
            [
                'cid' => 'config.field.delete',
                'info' => 'Delete Config Field - Menghapus config field'
            ],

            // CONFIG-OPTION
            [
                'cid' => 'config.option.index',
                'info' => 'Config Option Page - Melihatkan semua config option'
            ],
            [
                'cid' => 'config.option.store',
                'info' => 'Add Config Option - Menambahkan config option'
            ],
            [
                'cid' => 'config.option.update',
                'info' => 'Edit Config Option - Mengedit config option'
            ],
            [
                'cid' => 'config.option.delete',
                'info' => 'Delete Config Option - Menghapus config option'
            ],
        ];

        foreach ($permissions as $permission) {
            PermissionList::factory()->create([
                'cid' => $permission['cid'],
                'info' => $permission['info'],
            ]);
        }
    }
}
