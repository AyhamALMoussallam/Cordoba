<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Branch extends Model
{
    protected $fillable = [
        'governorate_id',
        'address',
        'manager',
        'phone',
        'lat',
        'lng',
    ];

    protected function casts(): array
    {
        return [
            'lat' => 'float',
            'lng' => 'float',
        ];
    }

    public function governorate(): BelongsTo
    {
        return $this->belongsTo(Governorate::class);
    }

    public function toFrontend(): array
    {
        return [
            'id' => (string) $this->id,
            'governorateId' => (string) $this->governorate_id,
            'address' => $this->address,
            'manager' => $this->manager,
            'phone' => $this->phone,
            'lat' => $this->lat,
            'lng' => $this->lng,
        ];
    }
}
