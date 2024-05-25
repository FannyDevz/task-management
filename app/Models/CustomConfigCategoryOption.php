<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomConfigCategoryOption extends Model
{
    public $timestamps = false;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'custom_config_category_options';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'config_id', 'optionname', 'order', 'hidden',
    ];

    /**
     * Get the custom config category form that the option belongs to.
     */
    public function customConfigCategoryForm()
    {
        return $this->belongsTo(CustomConfigCategoryForm::class, 'config_id');
    }

    /**
     * Get Task
     */
    public function task()
    {
        return $this->hasMany(CustomCategoryOptionValue::class, 'option_id');
    }
}
