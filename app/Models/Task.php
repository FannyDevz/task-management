<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tasks';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'category_id', 'subject', 'point', 'extra_point', 'description', 'attachment', 'status'
    ];

    /**
     * Get the user that owns the task.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the category that the task belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     *  Get Config Option
     */

    public function option_values(){
        return $this->hasMany(CustomCategoryOptionValue::class, 'task_id');
    }

    /**
     *  Get Config Field
     */
    public function field_values(){
        return $this->hasMany(CustomCategoryFieldValue::class, 'task_id');
    }

}
