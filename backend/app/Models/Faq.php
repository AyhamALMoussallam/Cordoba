<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    protected $fillable = [
        'question',
        'answer',
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
            'question' => $this->question,
            'answer' => $this->answer,
            'sortOrder' => $this->sort_order,
        ];
    }
}
