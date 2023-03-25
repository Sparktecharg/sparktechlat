import { flexRender, Table } from '@tanstack/react-table';
import { memo, useCallback } from 'react';

export type TableViewProps = {
    table: Table<any>;
};

const TableView = ({ table }: TableViewProps) => {
    const renderHeader = useCallback(() => {
        const headerGroups = table.getHeaderGroups();
        return headerGroups.map((headerGroup) => {
            const headers = headerGroup.headers;
            return (
                <tr key={headerGroup.id} className="first:hidden">
                    {headers.map((header) => {
                        if (header.isPlaceholder) return false;
                        return (
                            <th
                                key={header.id}
                                className="px-3 last:1/2 lg:last:w-1/4"
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </th>
                        );
                    })}
                </tr>
            );
        });
    }, [table]);

    const renderBody = useCallback(() => {
        const rows = table.getRowModel().rows;
        return rows.map((row) => {
            const cells = row.getVisibleCells();
            return (
                <tr
                    key={row.id}
                    className="hover:bg-gray-50 hover:text-black transition delay-75 ease-in"
                >
                    {cells.map((cell) => {
                        return (
                            <td
                                key={cell.id}
                                className="pl-3 py-3 text-xs text-left truncate"
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        );
                    })}
                </tr>
            );
        });
    }, [table]);

    return (
        <section className="overflow-scroll">
            <table className="w-full divide-y text-left divide-gray-200 table-auto sm:overflow-x-auto lg:table-fixed">
                <thead>{renderHeader()}</thead>
                <tbody>{renderBody()}</tbody>
            </table>
            <div className="text-gray-400 p-2">
                {table.getRowModel().rows.length} total
            </div>
        </section>
    );
};

export const CustomTable = TableView;
