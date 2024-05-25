<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomConfigCategoryForm extends Model
{
    public $timestamps = false;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'custom_config_category_forms';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'category_id', 'formname', 'formtype', 'detail', 'order', 'hidden', 'required',
    ];

    /**
     * Get the category that the form belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Get Options
     */
    public function options()
    {
        return $this->hasMany(CustomConfigCategoryOption::class, 'config_id');
    }

    /**
     * Get Task
     */
    public function task()
    {
        return $this->hasMany(CustomCategoryOptionValue::class, 'config_id');
    }
}
