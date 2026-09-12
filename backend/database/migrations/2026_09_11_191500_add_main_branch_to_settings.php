<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->string('main_branch_label')->default('الفرع الرئيسي');
            $table->string('main_branch_city')->default('دمشق، سوريا');
            $table->text('main_branch_text')->nullable();
        });

        DB::table('settings')->update([
            'main_branch_label' => 'الفرع الرئيسي',
            'main_branch_city' => 'دمشق، سوريا',
            'main_branch_text' => 'شبكة فروع منتشرة لتسليم الحوالات وصرف العملات بسرعة وخصوصية عالية.',
        ]);
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn(['main_branch_label', 'main_branch_city', 'main_branch_text']);
        });
    }
};
