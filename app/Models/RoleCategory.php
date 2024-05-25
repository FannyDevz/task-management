<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleCategory extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'role_categories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'role_id', 'category_id',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get the role that owns the category.
     */
    public function role()
    {
        return $this->belongsTo(UserRole::class, 'role_id');
    }

    /**
     * Get the category that belongs to the role.
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }


}
