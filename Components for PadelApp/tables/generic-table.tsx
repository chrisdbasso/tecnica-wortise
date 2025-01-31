import { Button } from "@/components/button";
import { type FieldOption, type FilterModel, FilterPopup } from "@/components/tables/table-filters";
import { useWindowSize } from "@/hooks/use-window-size";
import type { Theme } from "@emotion/react";

import { Block, FilterList } from "@mui/icons-material";
import {
    Box,
    LinearProgress,
    Paper,
    Skeleton,
    Stack,
    type SxProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    type TableContainerProps,
    TableHead,
    type TableProps,
    TableRow,
    type TableRowProps,
    TableSortLabel,
    Typography,
} from "@mui/material";
import { type ColumnDef, type RowData, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { GetDocListArgs } from "frappe-js-sdk/lib/db/types";
import { Fragment, useCallback, useMemo, useRef, useState } from "react";

export type TanstackTableProps<T extends RowData> = {
    tableProps?: TableProps;
    tableContainerProps?: TableContainerProps<typeof Paper>;
    getRowProps?: (row: T) => TableRowProps | undefined;
    emptyNode?: React.ReactNode;
    isLoading?: boolean;
    sx?: SxProps<Theme>;
    isFetching?: boolean;
    lastRowCallback?: () => void;
    heightDiff?: number;
    data: T[];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    columns: ColumnDef<T, any>[];
    actions?: React.ReactNode;
    onRowClick?: (row: T) => void;
} & (
    | {
          setOrdering?: undefined;
          ordering?: undefined;
      }
    | {
          setOrdering: (ordering: GetDocListArgs<T>["orderBy"]) => void;
          ordering: GetDocListArgs<T>["orderBy"];
      }
) &
    (
        | {
              setFilterModel?: undefined;
              filterModel?: undefined;
              fieldOptions?: undefined;
          }
        | {
              setFilterModel: (model: FilterModel[]) => void;
              filterModel: FilterModel[];
              fieldOptions: [FieldOption, ...FieldOption[]];
          }
    );

export default function GenericTable<T extends RowData>({
    getRowProps,
    emptyNode,
    tableProps,
    isLoading,
    tableContainerProps,
    sx,
    isFetching,
    lastRowCallback,
    filterModel,
    columns,
    data,
    setFilterModel,
    fieldOptions,
    onRowClick,
    heightDiff = 0,
    ordering,
    setOrdering,
    actions,
}: TanstackTableProps<T>) {
    const defaultData = useMemo(() => [], []);

    const table = useReactTable({
        data: data || defaultData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        state: {
            sorting: ordering ? [{ id: ordering.field.toString(), desc: ordering.order === "desc" }] : [],
        },
        onSortingChange: (updateOrValue) => {
            const values =
                typeof updateOrValue === "function"
                    ? updateOrValue(
                          ordering ? [{ id: ordering.field.toString(), desc: ordering.order === "desc" }] : [],
                      )
                    : updateOrValue;
            const value = values.pop();
            setOrdering?.(
                value
                    ? {
                          field: value.id,
                          order: value.desc ? "desc" : "asc",
                      }
                    : undefined,
            );
        },
    });
    const rows = table.getRowModel().rows;
    const chipRef = useRef<HTMLDivElement>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const observer = useRef<IntersectionObserver>();
    const lastOptionCallbackInner = useCallback(
        (node: HTMLElement | null) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(([entry]) => {
                if (entry?.isIntersecting) {
                    lastRowCallback?.();
                }
            });
            if (node) observer.current.observe(node);
        },
        [lastRowCallback],
    );
    const height = useWindowSize((s) => s.height);

    return (
        <>
            <Stack spacing={2}>
                {filterModel && (
                    <Stack direction="row" alignItems="center" spacing={2} flexWrap="nowrap">
                        <Box ref={chipRef} flexGrow={1} />
                        <FilterPopup
                            open={isFilterOpen}
                            containerRef={chipRef}
                            onClose={() => setIsFilterOpen(false)}
                            filterModel={filterModel}
                            setFilterModel={setFilterModel}
                            fieldOptions={fieldOptions}
                        />
                        <Button
                            onClick={() => setIsFilterOpen(true)}
                            variant="outlined"
                            sx={{ mb: 2 }}
                            startIcon={<FilterList />}
                        >
                            Administrar filtros
                        </Button>
                        {actions}
                    </Stack>
                )}
                <Box width={1}>
                    {isFetching ? <LinearProgress sx={{ height: 2 }} /> : <Box sx={{ height: 2 }} />}
                    <TableContainer
                        component={Paper}
                        {...tableContainerProps}
                        sx={{
                            maxHeight: height - heightDiff,
                            height: height - heightDiff,
                            minHeight: heightDiff,
                            ...sx,
                        }}
                    >
                        <Table stickyHeader {...tableProps}>
                            <TableHead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            // if (!table.options.enableRowSelection && header.id === 'select') return null;
                                            const value = header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext());
                                            return (
                                                <TableCell
                                                    key={header.id}
                                                    sortDirection={header.column.getIsSorted()}
                                                    {...header.column.columnDef.meta?.columnProps}
                                                    {...header.column.columnDef.meta?.headerCellProps}
                                                >
                                                    {header.column.getCanSort() ? (
                                                        <TableSortLabel
                                                            active={!!header.column.getIsSorted()}
                                                            direction={header.column.getIsSorted() || "asc"}
                                                            onClick={() => {
                                                                table.setSorting((prev) => {
                                                                    const desc = header.column.getNextSortingOrder();
                                                                    return [
                                                                        ...prev.filter(
                                                                            ({ id }) => id !== header.column.id,
                                                                        ),
                                                                        ...(desc !== false
                                                                            ? [
                                                                                  {
                                                                                      id: header.column.id,
                                                                                      desc: desc === "desc",
                                                                                  },
                                                                              ]
                                                                            : []),
                                                                    ];
                                                                });
                                                            }}
                                                        >
                                                            {value}
                                                        </TableSortLabel>
                                                    ) : (
                                                        value
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody>
                                {isLoading &&
                                    Array.from({ length: 5 }, (_, i) => i).map((i) => (
                                        <TableRow key={i}>
                                            <TableCell colSpan={table.getFlatHeaders().length}>
                                                <Skeleton width="100%" variant="rectangular" height={35} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {(!!rows.length &&
                                    !isLoading &&
                                    rows.map((row, index, arr) => {
                                        const isLast = index === arr.length - 1;
                                        return (
                                            <Fragment key={row.id}>
                                                <TableRow
                                                    key={row.id}
                                                    ref={isLast ? lastOptionCallbackInner : undefined}
                                                    onClick={() => onRowClick?.(row.original)}
                                                    sx={[
                                                        !!onRowClick && {
                                                            "&:hover": {
                                                                backgroundColor: "#f5f5f5",
                                                                cursor: "pointer",
                                                            },
                                                        },
                                                    ]}
                                                    {...getRowProps?.(row.original)}
                                                >
                                                    {row.getVisibleCells().map((cell) => {
                                                        // if (!table.options.enableRowSelection && cell.column.id === 'select')
                                                        //     return null;
                                                        return (
                                                            <TableCell
                                                                key={cell.id}
                                                                width={cell.column.getSize()}
                                                                {...cell.column.columnDef.meta?.columnProps}
                                                                {...cell.column.columnDef.meta?.rowCellProps}
                                                            >
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext(),
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            </Fragment>
                                        );
                                    })) ||
                                    (!isLoading && (
                                        <TableRow>
                                            <TableCell colSpan={table.getFlatHeaders().length}>
                                                <Stack
                                                    sx={{ py: 10 }}
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    spacing={2}
                                                >
                                                    <Block />
                                                    {emptyNode || <Typography>No hay datos disponibles</Typography>}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Stack>
        </>
    );
}
