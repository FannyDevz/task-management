<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'categories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'info', 'default_point',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Get Config Option
     */

    public function forms()
    {
        return $this->hasMany(CustomConfigCategoryForm::class, 'category_id');
    }

    /**
     * Get Config Fields
     */

    public function fields()
    {
        return $this->hasMany(CustomCategoryField::class, 'category_id');
    }


    /**
     * Get the roles that owns the permission.
     */
//    public function roles()
//    {
//        return $this->hasMany(RoleCategory::class, 'category_id');
//    }

    public function roles()
    {
        return $this->belongsToMany(UserRole::class, 'role_categories', 'category_id', 'role_id');
    }
}
