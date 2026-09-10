<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rate extends Model
{
    protected $fillable = [
        'code',
        'name_ar',
        'flag',
        'buy',
        'sell',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'buy' => 'float',
            'sell' => 'float',
            'sort_order' => 'integer',
        ];
    }

    public function toFrontend(): array
    {
        return [
            'id' => (string) $this->id,
            'code' => $this->code,
            'nameAr' => $this->name_ar,
            'flag' => $this->flag,
            'buy' => $this->buy,
            'sell' => $this->sell,
            'sortOrder' => $this->sort_order,
            'updatedAt' => $this->updated_at?->toJSON(),
        ];
    }
}
