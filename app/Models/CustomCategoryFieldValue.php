<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomCategoryFieldValue extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'custom_category_field_values';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'task_id', 'config_id', 'value',
    ];

    public $timestamps = false;
    /**
     * Get the task that the field value belongs to.
     */
    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    /**
     * Get the custom category field that the field value belongs to.
     */
    public function field()
    {
        return $this->belongsTo(CustomCategoryField::class, 'config_id');
    }
}
