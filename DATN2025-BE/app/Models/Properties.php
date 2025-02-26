<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Properties extends Model
{
    use HasFactory;


    /**
     * The attributes that belong to the Property
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function attributes()
    {
        return $this->belongsTo(Attributes::class);
    }
}
