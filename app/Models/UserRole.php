<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_roles';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'slug', 'name',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     *
     * Get the user that owns the role.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }

//    public function permissions()
//    {
//        return $this->hasMany(RolePermission::class, 'role_id');
//    }

    public function permissions()
    {
        return $this->belongsToMany(PermissionList::class, 'role_permissions', 'role_id', 'permission_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'role_categories', 'role_id', 'category_id');
    }
}
