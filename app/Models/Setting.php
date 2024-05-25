<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $table = 'settings';

    protected $fillable = [
        'key',
        'label',
        'value',
    ];

    public function getLabel($value){
        return $this->where('key', $value)->first()->label;
    }

    public function getSetting($value){
        return $this->where('key', $value)->first()->value;
    }


}
