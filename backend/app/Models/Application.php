<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    protected $fillable = [
        'position_id',
        'position_title',
        'name',
        'email',
        'phone',
        'cv_path',
        'cv_original_name',
    ];

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function toFrontend(): array
    {
        return [
            'id' => (string) $this->id,
            'positionId' => $this->position_id ? (string) $this->position_id : null,
            'positionTitle' => $this->position_title,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'cvName' => $this->cv_original_name,
            'createdAt' => $this->created_at?->toJSON(),
        ];
    }
}
