<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'whatsapp',
        'main_branch_label',
        'main_branch_city',
        'main_branch_text',
    ];

    public static function current(): self
    {
        return static::query()->firstOrCreate([], [
            'whatsapp' => '',
            'main_branch_label' => 'الفرع الرئيسي',
            'main_branch_city' => 'دمشق، سوريا',
            'main_branch_text' => 'شبكة فروع منتشرة لتسليم الحوالات وصرف العملات بسرعة وخصوصية عالية.',
        ]);
    }
}
