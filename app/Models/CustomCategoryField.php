<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomCategoryField extends Model
{

    public $timestamps = false;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'custom_category_fields';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'category_id', 'fieldname', 'fieldtype', 'detail', 'order', 'hidden', 'required',
    ];

    /**
     * Get the category that the field belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    /**
     * Get Task
     */
    public function task()
    {
        return $this->hasMany(CustomCategoryFieldValue::class, 'config_id');
    }
}
