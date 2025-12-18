import React, { useState, useMemo, useCallback } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';

interface Purpose {
    id: string;
    code: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
}

const PurposeSection: React.FC = () => {
    const [purposes, setPurposes] = useState<Purpose[]>([
        { id: '1', code: 'POI', name: 'Proof of Identity', status: 'ACTIVE' },
        { id: '2', code: 'POA', name: 'Proof of Address', status: 'ACTIVE' },
        { id: '3', code: 'SELFIE', name: 'Selfie', status: 'ACTIVE' },
    ]);

    const handleStatusChange = useCallback((id: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
        setPurposes(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    }, []);

    const columnHelper = createColumnHelper<Purpose>();

    const columns = useMemo(() => [
        columnHelper.accessor('code', {
            header: 'Code',
        }),
        columnHelper.accessor('name', {
            header: 'Name',
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => (
                <select 
                    value={info.getValue()} 
                    onChange={(e) => handleStatusChange(info.row.original.id, e.target.value as 'ACTIVE' | 'INACTIVE')}
                    className="status-select"
                >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                </select>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: (info) => (
                <div className="action-buttons">
                    {info.row.index === 0 && (
                        <>
                            <button className="action-btn action-btn--check">✓</button>
                            <button className="action-btn action-btn--close">×</button>
                        </>
                    )}
                    {info.row.index > 0 && (
                        <>
                            <button className="action-btn action-btn--edit">✎</button>
                        </>
                    )}
                </div>
            ),
        }),
    ], [handleStatusChange]);

    const table = useReactTable({
        data: purposes,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="section-card">
            <div className="section-card__header">
                <h3 className="section-card__title">PURPOSE</h3>
            </div>
            <div className="section-card__body">
                <table className="data-table">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(PurposeSection);

