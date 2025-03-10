import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { File, Pagination } from '@/types';
import { WhenVisible } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    files: File[];
    filesPagination: Pagination<File[]>;
}

export function PaginatedFilesTable<TData, TValue>({ columns, files, filesPagination }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data: files as TData[],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const whenVisibleParams = {
        data: {
            page: filesPagination.current_page + 1,
        },
        only: ['files', 'filesPagination'],
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        style={{
                                            minWidth: header.column.columnDef.size,
                                            maxWidth: header.column.columnDef.size,
                                        }}
                                    >
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        style={{
                                            minWidth: cell.column.columnDef.size,
                                            maxWidth: cell.column.columnDef.size,
                                        }}
                                        key={cell.id}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <WhenVisible
                fallback={<LoadingSpinner type="long" className="mr-2 h-4 w-4 animate-spin" />}
                always={filesPagination.current_page < filesPagination.last_page}
                params={whenVisibleParams}
            >
                <div></div>
            </WhenVisible>
        </div>
    );
}
