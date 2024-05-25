<?php

namespace Jay\Lib\TableApi;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Traits\Macroable;
use Illuminate\Contracts\Database\Query\Expression;
// use Illuminate\Database\Query\Expression;

abstract class EngineTableAbstract
{
    use Macroable;

    protected ?array $columns = [];

    /**
     * Total records.
     *
     * @var int|null
     */
    protected ?int $totalRecords = null;

    /**
     * Total filtered records.
     *
     * @var int|null
     */
    protected ?int $filteredRecords = null;

    protected $filterCallback = null;

    protected array $columnDef = [
        'index' => false,
        'append' => [],
        'edit' => [],
        'filter' => [],
        'order' => [],
        'only' => null,
        'hidden' => [],
        'visible' => [],
    ];

    /**
     * Count total items.
     *
     * @return int
     */
    public function totalCount(): int
    {
        return $this->totalRecords ??= $this->count();
    }

    /**
     * Count filtered items.
     *
     * @return int
     */
    public function filteredCount(): int
    {
        return $this->filteredRecords ??= $this->count();
    }

    public function addColumn($columnName, array $options = []): static
    {
        $name = $columnName;
        $columnQuery = $columnName;

        if (is_array($columnName)) {
            if ($columnName[0]) {
                $name = $columnName[0];
            }

            if (isset($columnName[1])) {
                $columnQuery = $columnName[1];
            }
        }

        if (Arr::has($options, 'query')) {
            $columnQuery = $options['query'];
        }

        // if (is_string($columnQuery)) {
        // } else if ($select instanceof Expression) {
        //     $query = $select->getValue(DB::getQueryGrammar());
        //     $selectQuery = DB::raw('('.$query.') AS `'.$name.'`');
        // } else {
        //     throw new \RuntimeException('Unsupported select type "' . gettype($select) . '" in column "' . $name . '"');
        // }

        $this->columnDef['append'][$name] = [
            'column' => $columnQuery,
            'options' => $options,
        ];

        return $this;
    }

    /**
     * Set auto filter off and run your own filter.
     * Overrides global search.
     *
     * @param  callable  $callback
     * @return $this
     */
    public function filter(callable $callback): static
    {
        $this->filterCallback = $callback;
        return $this;
    }

    public function rows() {
        $builder = clone $this->query;

        $columns = Arr::pluck($this->columnDef['append'], 'select');

        dd($this->columnDef, $columns);
        exit;

            // $query = $select->getValue(DB::getQueryGrammar());
            // $selectQuery = DB::raw('('.$query.') AS `'.$name.'`');

        $builder->select($columns);

        return $builder->get();
    }
}
