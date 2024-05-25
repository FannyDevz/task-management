<?php

namespace Jay\Lib\TableApi;

use Illuminate\Contracts\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Contracts\Database\Query\Builder as QueryBuilder;
use Illuminate\Database\Connection;
use Illuminate\Database\Query\Expression;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class QueryEngineTable extends EngineTableAbstract
{
    /**
     * Builder object.
     *
     * @var QueryBuilder
     */
    protected QueryBuilder $query;

    protected bool $prepared = false;

    public function __construct(QueryBuilder $builder)
    {
        $this->query = $builder;
        $this->columns = $builder->columns;
    }

    public function make()
    {
        $results = $this->prepareQuery()->results();
        return $results;
    }

    public function results(): Collection
    {
        $columns = Arr::pluck($this->columnDef['append'], 'column');
        dd($this);
        $this->query->select($columns);

        return $this->query->get();
    }

    protected function prepareQuery(): static
    {
        if (! $this->prepared) {
            $this->totalRecords = $this->totalCount();

            $this->filterRecords();
            // $this->ordering();
            // $this->paginate();
        }

        $this->prepared = true;

        return $this;
    }

    protected function filterRecords(): void
    {
        $initialQuery = clone $this->query;

        if (is_callable($this->filterCallback)) {
            call_user_func($this->filterCallback, $this->getQuery());
        }

        $this->columnSearch();
        // $this->searchPanesSearch();

        // If no modification between the original query and the filtered one has been made
        // the filteredRecords equals the totalRecords
        if ($this->query == $initialQuery) {
            $this->filteredRecords ??= $this->totalRecords;
        } else {
            $this->filteredCount();
        }
    }

    public function columnSearch(): void
    {
        // $columns = $this->request->columns();

        // foreach ($columns as $index => $column) {
        //     $column = $this->getColumnName($index);
        //
        //     if (is_null($column)) {
        //         continue;
        //     }
        //
        //     if (! $this->request->isColumnSearchable($index) || $this->isBlacklisted($column) && ! $this->hasFilterColumn($column)) {
        //         continue;
        //     }
        //
        //     if ($this->hasFilterColumn($column)) {
        //         $keyword = $this->getColumnSearchKeyword($index, true);
        //         $this->applyFilterColumn($this->getBaseQueryBuilder(), $column, $keyword);
        //     } else {
        //         $column = $this->resolveRelationColumn($column);
        //         $keyword = $this->getColumnSearchKeyword($index);
        //         $this->compileColumnSearch($index, $column, $keyword);
        //     }
        // }
    }

    public function hasFilterColumn(string $columnName): bool
    {
        return isset($this->columnDef['filter'][$columnName]);
    }

    public function count(): int
    {
        return $this->prepareCountQuery()->count();
    }

    public function prepareCountQuery(): QueryBuilder
    {
        $builder = clone $this->query;

        if ($this->isComplexQuery($builder)) {
            $builder->select(DB::raw('1'));
            // if ($this->ignoreSelectInCountQuery || ! $this->isComplexQuery($builder)) {
            //     return $this->getConnection()
            //         ->query()
            //         ->fromRaw('('.$builder->toSql().') count_row_table')
            //         ->setBindings($builder->getBindings());
            // }

            $builder = clone $this->query;

            return $this->getConnection()
                ->query()
                ->fromRaw('('.$builder->toSql().') count_row_table')
                ->setBindings($builder->getBindings());
        }

        $row_count = $this->wrap('row_count');
        $builder->select($this->getConnection()->raw("'1' as {$row_count}"));
        // if (! $this->keepSelectBindings) {
        //     $builder->setBindings([], 'select');
        // }

        return $builder;
    }

    public function getConnection(): Connection
    {
        /** @var Connection $connection */
        $connection = $this->query->getConnection();

        return $connection;
    }

    protected function castColumn(string $column): string
    {
        switch ($this->getConnection()->getDriverName()) {
            case 'pgsql':
                return 'CAST('.$column.' as TEXT)';
            case 'firebird':
                return 'CAST('.$column.' as VARCHAR(255))';
            default:
                return $column;
        }
    }

    protected function addTablePrefix($query, string $column): string
    {
        if (! str_contains($column, '.')) {
            $q = $this->getBaseQueryBuilder($query);
            $from = $q->from;

            /** @phpstan-ignore-next-line */
            if (! $from instanceof Expression) {
                if (str_contains($from, ' as ')) {
                    $from = explode(' as ', $from)[1];
                }

                $column = $from.'.'.$column;
            }
        }

        return $this->wrap($column);
    }

    protected function getBaseQueryBuilder($instance = null)
    {
        if (! $instance) {
            $instance = $this->query;
        }

        if ($instance instanceof EloquentBuilder) {
            return $instance->getQuery();
        }

        return $instance;
    }

    public function getQuery(): QueryBuilder
    {
        return $this->query;
    }

    protected function isComplexQuery($query): bool
    {
        return Str::contains(Str::lower($query->toSql()), ['union', 'having', 'distinct', 'order by', 'group by']);
    }

    protected function wrap(string $column): string
    {
        return $this->getConnection()->getQueryGrammar()->wrap($column);
    }
}
