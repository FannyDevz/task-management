<?php

namespace Jay\Lib\TableApi;

use Illuminate\Support\Traits\Macroable;
// use Illuminate\Contracts\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Contracts\Database\Query\Builder as QueryBuilder;

class Table {
    use Macroable;

    // public static function eloquent(EloquentBuilder $builder) {
    //     return new EloquentEngineTable($builder);
    // }

    public static function query(QueryBuilder $builder) {
        return new QueryEngineTable($builder);
    }
}
