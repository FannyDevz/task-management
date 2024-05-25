<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings =   [
            [
                'key' => 'instancename',
                'label' => 'Instance Name',
                'value' => 'Digikarir'
            ],
            [
                'key' => 'instancelogo',
                'label' => 'Logo Instansi',
                'value' => 'logo.png'
            ],
            [
                'key' => 'domainname',
                'label' => 'Domainname',
                'value' => ''
            ],
            [
                'key' => 'phonenumber',
                'label' => 'Phone Number',
                'value' => ''
            ],
            [
                'key' => 'email',
                'label' => 'Email',
                'value' => ''
            ],
            [
                'key' => 'address',
                'label' => 'Address',
                'value' => ''
            ],
            [
                'key' => 'announcement',
                'label' => 'Announcement',
                'value' => ''
            ]
        ];



        foreach ($settings as $setting) {
            Setting::factory()->create([
                'key' => $setting['key'],
                'label' => $setting['label'],
                'value' => $setting['value'],
            ]);
        }
    }
}
