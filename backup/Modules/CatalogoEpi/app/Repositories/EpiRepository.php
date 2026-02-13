<?php

namespace Modules\CatalogoEpi\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Modules\CatalogoEpi\Models\Epi;
use Modules\CatalogoEpi\Models\EpiCategory;

class EpiRepository
{
    public static function paginatedList(int $perPage = 15): LengthAwarePaginator
    {
        return Epi::query()
            ->with('category')
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public static function stats(): Collection
    {
        return collect([
            'totalEpis' => Epi::count(),
            'categories' => EpiCategory::count(),
            'stockMinAlerts' => Epi::where('min_stock', '>', 0)->count(),
        ]);
    }

    public static function create(array $attributes): Epi
    {
        $slug = Str::slug($attributes['name']);

        if (Epi::where('slug', $slug)->withTrashed()->exists()) {
            $slug .= '-'.Str::random(6);
        }

        $attributes['slug'] = $slug;

        return Epi::create($attributes);
    }
}
