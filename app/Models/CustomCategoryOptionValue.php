<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomCategoryOptionValue extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'custom_category_option_values';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'task_id', 'config_id', 'option_id',
    ];

    public $timestamps = false;
    /**
     * Get the task that the option value belongs to.
     */
    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    /**
     * Get the custom config category form that the option value belongs to.
     */
    public function form()
    {
        return $this->belongsTo(CustomConfigCategoryForm::class, 'config_id');
    }

    /**
     * Get the custom config category option that the option value belongs to.
     */
    public function option()
    {
        return $this->belongsTo(CustomConfigCategoryOption::class, 'option_id');
    }
}
