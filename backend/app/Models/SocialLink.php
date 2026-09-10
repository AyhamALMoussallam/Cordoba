<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    protected $fillable = [
        'platform',
        'label',
        'url',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function toFrontend(): array
    {
        return [
            'id' => (string) $this->id,
            'platform' => $this->platform,
            'label' => $this->label,
            'url' => $this->url,
        ];
    }
}
