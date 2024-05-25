<?php

namespace App\Lib\TableApi;

use Closure;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Expression as QueryExpression;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

trait SimpleTableApi
{
    public function simpleTableApi(Request $request, QueryBuilder $queryBuilder, array $tableColumn = [], array $options = []): array
    {
        // configuring per page
        $queryCallback = Arr::get($options, 'queryCallback');
        $defaultPageSize = Arr::get($options, 'pageSize', 50);
        $maxPageSize = Arr::get($options, 'maxPageSize', 1000);
        // get from request
        $pageSize = (int)$request->get('page_size', $defaultPageSize);
        // limit should be between 1 and 1000
        $pageSize = max(1, min($maxPageSize, $pageSize));

        // configuring page
        $defaultPageIndex = 0;
        // get from request
        $pageIndex = (int)$request->get('page_index', $defaultPageIndex);
        // page should be greater than -1
        $pageIndex = max(0, $pageIndex);

        // calculate offset
        $offset = $pageIndex * $pageSize;

        // configuring sorting
        $defaultSorting = Arr::wrap(Arr::get($options, 'sorting'));
        $defaultSorting = Arr::map($defaultSorting, fn($item) => ['id' => $item['column'], 'dir' => $item['dir']]);

        // set sorting from request
        // - format dari query:
        // sorting[0][id] = string
        // sorting[0][dir] = asc | desc
        $clientSorts = Arr::wrap($request->get('sorting'));
        // if request sorting empty use from default sorting
        $clientSorts = !empty($clientSorts) ? $clientSorts : $defaultSorting;

        // set filter from request
        $clientFilter = Arr::wrap($request->get('filter'));

        // set filter globals from request
        // - format dari query:
        // filter[global] = string
        $clientFilterGlobal = Str::of(Arr::get($clientFilter, 'global'))->trim();

        // set filter columns from request
        // - format dari query:
        // filter[columns][0][name or key] = string
        // filter[columns][0][value or val] = string
        // filter[columns][0][l] = 'or' | 'and'
        $clientFilterColumns = Collection::wrap(Arr::get($clientFilter, 'columns'));
        // setup request filter columns
        // make alias key => name, val => values and remove empty name and value
        $clientFilterColumns = $clientFilterColumns->map(function ($item) {
            $name = Arr::get($item, 'name') ?? Arr::get($item, 'key');
            $value = Arr::get($item, 'value') ?? Arr::get($item, 'val');

            // ada logical operator = or | and
            // ada operator = llike | rlike | like | = | != | > | >= | < | <=
            // cuma masih ini enaknya dikasi nama apa? sementara query nya pakai "l" untuk logical operator
            $logicalOperator = Arr::get($item, 'l', 'and');

            return [
                'name' => $name,
                'value' => $value,
                'l' => $logicalOperator
            ];
        })->filter(function ($item) {
            return !empty($item['name']) && !empty($item['value']);
        });

        // configuring column options
        $columnDef = Collection::make($tableColumn)->map(function ($item) use ($queryBuilder) {
            if (is_string($item)) {
                $name = $item;
                $columnQuery = $item;
            } else if (is_array($item)) {
                $name = $item['name'] ?? null;
                $columnQuery = $item['column'] ?? $name;
            }

            // set default columnQuery if not set
            // ex: before is "id" then set to "<table>.id" if it has join table
            if (
                isset($columnQuery) &&
                isset($name) &&
                ($queryBuilder->joins && count($queryBuilder->joins) > 0) &&
                is_string($columnQuery) && $name === $columnQuery) {
                $columnQuery = $queryBuilder->from . '.' . $columnQuery;
            }

            return [
                'name' => $name ?? null,
                'columnQuery' => $columnQuery ?? null,
                'render' => Arr::get($item, 'render'),
                'operator' => Arr::get($item, 'operator', 'like'),
                'filterQuery' => Arr::get($item, 'filterQuery'),
                'filterValue' => Arr::get($item, 'filterValue'),
                'columnType' => Arr::get($item, 'columnType', 'string'),
                'disableFilter' => Arr::get($item, 'disableFilter', false),
                'disableCaseInsensitive' => Arr::get($item, 'disableCaseInsensitive', false),
                'disableSort' => Arr::get($item, 'disableFilter', false),
                'disableGlobalFilter' => Arr::get($item, 'disableGlobalFilter', false),
                'hide' => Arr::get($item, 'hide', false)
            ];
        });

        // get total all rows
        $recordsTotal = $queryBuilder->getCountForPagination();

        $filterable = [];
        $sortable = [];

        $sorting = [];
        $globalFilters = [];
        $filters = [];

        $columnDef->each(function ($colOption) use (
            &$queryBuilder,
            &$filterable,
            &$sortable,
            &$sorting,
            &$globalFilters,
            &$filters,
            $clientSorts,
            $clientFilterGlobal,
            $clientFilterColumns
        ) {
            $name = $colOption['name'];
            $columnType = $colOption['columnType'];
            $columnOperator = $colOption['operator'];
            $columnQuery = $colOption['columnQuery'];
            $filterQuery = $colOption['filterQuery'] ?? $columnQuery;
            $sortQuery = $colOption['sortQuery'] ?? $columnQuery;

            $disableFilterCaseInsensitive = $colOption['disableCaseInsensitive'];
            if ($this->disableCaseInsensitiveColumnType($columnType)) {
                $disableFilterCaseInsensitive = true;
            }

            // build column sorting
            if (!$colOption['disableSort'] && $sortQuery && !empty($name)) {
                foreach ($clientSorts as $clientSort) {
                    $requestSortName = Str::of(Arr::get($clientSort, 'id'))->trim();
                    if ($requestSortName->isNotEmpty() && $requestSortName->toString() == $name) {
                        $dir = Arr::get($clientSort, 'dir', 'desc');
                        if (in_array($dir, ['asc', 'desc'])) {
                            $query = $this->parseQuery('sort', $queryBuilder, $columnOperator, $sortQuery, false, true);
                            $queryBuilder->orderBy($query, $dir);
                            $sorting[] = ['id' => $name, 'dir' => $dir];
                            $sortable[] = $name;
                        }
                    }
                }
            }

            // build column select
            if (!$colOption['disableFilter'] && $columnQuery && !empty($name)) {
                $selectQuery = $columnQuery;
                if (is_string($selectQuery)) {
                    $query = $selectQuery;
                    if ($selectQuery != $name) {
                        $query .= ' as ' . $name;
                    }
                    $queryBuilder->addSelect($query);
                    $filterable[] = $name;
                } else if ($selectQuery instanceof Closure) {
                    $query = call_user_func_array($selectQuery, [$queryBuilder->newQuery()]);
                    if ($query instanceof QueryBuilder) {
                        $queryBuilder->selectSub($query, $name);
                        $filterable[] = $name;
                    }
                } else if ($selectQuery instanceof QueryBuilder) {
                    $queryBuilder->selectSub($selectQuery, $name);
                    $filterable[] = $name;
                } else if ($selectQuery instanceof QueryExpression) {
                    $query = $selectQuery->getValue($queryBuilder->getGrammar());
                    $queryBuilder->selectRaw($query . ' as ' . $queryBuilder->grammar->wrap($name));
                    $filterable[] = $name;
                }
            }

            // build column filter
            if (!$colOption['disableFilter'] && $filterQuery && !empty($name)) {
                $clientFilterColumn = $clientFilterColumns->where('name', $name)->first();
                if ($clientFilterColumn) {
                    $value = $clientFilterColumn['value'];
                    [$op, $oValue] = $this->formatQueryOperatorValue($columnOperator, $value, $disableFilterCaseInsensitive);
                    if ($this->isValidLogicalOperatorValue($op, $value, $columnType)) {
                        $query = $this->parseQuery('filter', $queryBuilder, $columnOperator, $filterQuery, $value, $disableFilterCaseInsensitive);
                        if ($query && in_array($clientFilterColumn['l'], ['and', 'or'])) {
                            $filters[] = [$columnOperator, $columnType, $query, $op, $oValue, $clientFilterColumn['l']];
                        }
                    }
                }
            }

            // build global filters
            if (!$colOption['disableGlobalFilter'] && $filterQuery) {
                if ($clientFilterGlobal->isNotEmpty()) {
                    $value = $clientFilterGlobal->value();
                    [$op, $oValue] = $this->formatQueryOperatorValue($columnOperator, $value, $disableFilterCaseInsensitive);
                    if ($this->isValidLogicalOperatorValue($op, $value, $columnType)) {
                        $query = $this->parseQuery('filter', $queryBuilder, $columnOperator, $filterQuery, $value, $disableFilterCaseInsensitive);
                        $globalFilters[] = [$columnOperator, $columnType, $query, $op, $oValue, 'or'];
                    }
                }
            }
        });

        // group global search using
        $queryBuilder->where(function (QueryBuilder $query) use ($globalFilters) {
            foreach ($globalFilters as $globalFilter) {
                $columnOperator = array_shift($globalFilter);
                $columnType = array_shift($globalFilter);
                $this->filterColumnValue($query, $columnOperator, $columnType, $globalFilter);
            }
        });

        // group column search using
        $queryBuilder->where(function (QueryBuilder $query) use ($filters) {
            foreach ($filters as $filter) {
                $columnOperator = array_shift($filter);
                $columnType = array_shift($filter);
                $this->filterColumnValue($query, $columnOperator, $columnType, $filter);
            }
        });

        // allow use custom query builder via callback
        if ($queryCallback instanceof Closure) {
            $queryCallback($queryBuilder, [
                'sortable' => $sortable,
                'filterable' => $filterable,

                'columnDef' => $columnDef,
                'sorting' => $sorting,
                'filterGlobal' => $clientFilterGlobal,
                'filterColumns' => $clientFilterColumns
            ]);
        }

        // build queries
        $queryBuilder = $queryBuilder->skip($offset)->take($pageSize);

        // get total rows after filtering and pagination
        // $recordsFiltered = count($queryBuilder->wheres) ? $queryBuilder->getCountForPagination() : 0;
        // NOTE: sementara matikan dulu, nanti kita cari lagi masalahnya kenapa tidak keluar
        $recordsFiltered = $queryBuilder->getCountForPagination();

        $rows = $queryBuilder->get();

        // build rows
        $rows = $rows->map(function ($row) use ($columnDef) {
            $modifiedRow = (array)$row;
            $modifiedRowUnHide = (array)$row; // used for render option

            // build column
            $columnDef->each(function ($options) use (&$modifiedRow, &$modifiedRowUnHide, $row) {
                $name = Arr::get($options, 'name');
                $render = Arr::get($options, 'render');
                $value = Arr::get($modifiedRow, $name);

                if (!empty($name) && is_callable($render)) {
                    $reflection = new \ReflectionFunction($render);
                    $arguments = $reflection->getParameters();
                    if ($arguments) {
                        $row = call_user_func_array($render, [
                            $value,
                            Collection::make($modifiedRowUnHide),
                            Collection::make($row),
                        ]);
                        $modifiedRow[$name] = $row;
                        $modifiedRowUnHide[$name] = $row;
                    }
                }

                if (Arr::get($options, 'hide')) {
                    unset($modifiedRow[$name]);
                }
            });

            return $modifiedRow;
        });

        $viewColumns = $columnDef->filter(function ($item) {
            return !$item['hide'] && !$item['disableFilter'] && !empty($item['name']);
        })->map(fn($item) => [
            'name' => $item['name'],
            'operator' => $item['operator'],
            'columnType' => $item['columnType'] ?? 'string',
        ]);

        return [
            'columns' => $viewColumns,
            'recordsTotal' => $recordsTotal, // count any rows un filtered
            'recordsFiltered' => $recordsFiltered, // count any rows
            'rows' => $rows, // rows data
            'pageSize' => $pageSize, // total items per page
            'pageIndex' => $pageIndex, // current page start by 0
            'sorting' => $sorting
        ];
    }

    private function filterColumnValue(
        QueryBuilder $queryBuilder,
        string       $columnOperator,
        string       $columnType,
        string|array $value
    ): void
    {
        if ($columnOperator == 'between') {
            [$start, $end] = [$value[2][0], $value[2][1] ?? null];
            if (!$end) {
                $end = $start;
            }

            if ($columnType == 'datetime' || $columnType == 'date') {
                if ($this->isValidateDateString($start) && $this->isValidateDateString($end)) {
                    $queryBuilder->whereBetween($value[0], [$start, $end]);
                }
            } else if ($columnType == 'number' || $columnType == 'float') {
                if (is_numeric($start) && is_numeric($end)) {
                    $queryBuilder->whereBetween($value[0], [$start, $end]);
                }
            }
        } else {
            $queryBuilder->where(...$value);
        }
    }

    private function parseQuery(
        string $calledBy,
        QueryBuilder $queryBuilder,
        string $columnOperator,
        QueryBuilder|QueryExpression|Closure|string $columnQuery,
        $filterValue = false,
        $disabledFilterCascade = false
    )
    {
        if (is_string($columnQuery)) {
            if ($disabledFilterCascade) {
                $query = $queryBuilder->raw($columnQuery);
            } else {
                $query = $queryBuilder->raw('LOWER(' . $columnQuery . ')');
            }
        } else if ($columnQuery instanceof Closure) {
            $query = call_user_func_array($columnQuery, [$queryBuilder->newQuery(), $calledBy, $filterValue]);
        } else if ($columnQuery instanceof QueryExpression) {
            $q = $columnQuery->getValue($queryBuilder->getGrammar());
            if (Str::of($q)->contains('SELECT')) {
                // replace select column.name to LOWER(column.name)
                // - example: select column.name from table
                // - result: select LOWER(column.name) from table
                $q = preg_replace('/SELECT\s+(.*)\s+FROM/', 'SELECT LOWER($1) FROM', $q);
                $query = $queryBuilder->raw('(' . $q . ')');
            } else {
                if ($disabledFilterCascade) {
                    $query = $queryBuilder->raw($q);
                } else {
                    $query = $queryBuilder->raw('LOWER(' . $q . ')');
                }
            }
        }

        return $query ?? null;
    }

    private function disableCaseInsensitiveColumnType($columnType): bool
    {
        return $columnType == 'time' || $columnType == 'date' || $columnType == 'datetime' || $columnType == 'number' || $columnType == 'float';
    }

    /**
     * Format query operator
     *
     * Use case jika ada operator "llike" maka operator menjadi "like" kemudian value menjadi "%like"
     *
     * @param string $operator
     * @param string $value
     * @param bool $disableFilterCascade
     * @return array|string[]
     */
    private function formatQueryOperatorValue(string $operator, string $value, ?bool $disableFilterCascade = false): array
    {
        if (!$disableFilterCascade) {
            $value = Str::of($value)->lower()->toString();
        }

        switch ($operator) {
            case 'llike':
                return ['like', '%' . $value];
            case 'rlike':
                return ['like', $value . '%'];
            case 'like':
                return ['like', '%' . $value . '%'];
            case 'between':
                return [$operator, explode(',', $value)];
            default:
                return [$operator, $value];
        }
    }

    /**
     * Check is valid logical operator
     *
     * @param string $operator Operator is database operator like ">", ">=", "<", "<=" or null
     * @param string $value
     * @param string|null $columType
     * @return bool
     */
    private function isValidLogicalOperatorValue(string $operator, string $value, ?string $columType): bool
    {
        $exactOperators = ['>', '>=', '<', '<='];
        if (in_array($operator, $exactOperators)) {
            if ($columType == 'date' || $columType == 'datetime') {
                return $this->isValidateDateString($value);
            } else if (!is_numeric($value)) {
                return false;
            }
        } else if ($operator == '=') {
            if ($columType == 'number' || $columType == 'float') {
                if (!is_numeric($value)) {
                    return false;
                }
            } else if ($columType == 'date' || $columType == 'datetime') {
                return $this->isValidateDateString($value);
            }
        }

        return true;
    }

    private function isValidateDateString($dateString): bool
    {
        $pattern = '/^\d{4}-\d{2}-\d{2}(?:\s\d{2}:\d{2}:\d{2})?$/';
        if (preg_match($pattern, $dateString)) {
            return true;
        } else {
            return false;
        }
    }
}
