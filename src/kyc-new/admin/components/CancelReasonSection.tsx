import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';

interface CancelReason {
    id: string;
    reason: string;
    status: 'ACTIVE' | 'INACTIVE';
    isNew?: boolean;
}

const CancelReasonSection: React.FC = () => {
    const [cancelReasons, setCancelReasons] = useState<CancelReason[]>([
        { id: '1', reason: 'Duplicate Request', status: 'ACTIVE' },
        { id: '2', reason: 'Error in request', status: 'ACTIVE' },
        { id: '3', reason: 'Other', status: 'ACTIVE' },
    ]);

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newReason, setNewReason] = useState('');

    const handleAdd = useCallback(() => {
        setIsAddingNew(true);
    }, []);

    const handleSaveNew = useCallback(() => {
        if (newReason.trim()) {
            setCancelReasons(prev => [{
                id: Date.now().toString(),
                reason: newReason.trim(),
                status: 'ACTIVE',
            }, ...prev]);
            setNewReason('');
            setIsAddingNew(false);
        }
    }, [newReason]);

    const handleCancelNew = useCallback(() => {
        setIsAddingNew(false);
        setNewReason('');
    }, []);

    const handleStatusChange = useCallback((id: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
        setCancelReasons(prev => prev.map(cr => cr.id === id ? { ...cr, status: newStatus } : cr));
    }, []);

    const columnHelper = createColumnHelper<CancelReason>();
    const reasonInputRef = useRef(null);

    const handleReasonChange = useCallback((e: any) => {
        setNewReason(e.target.value);
    }, []);

    const columns = useMemo(() => [
        columnHelper.accessor('reason', {
            header: 'Reason',
            cell: (info) => info.row.original.isNew ? (
                <input 
                    ref={reasonInputRef}
                    type="text"
                    value={newReason}
                    onChange={handleReasonChange}
                    className="input-field"
                    placeholder="Enter cancel reason"
                    autoFocus
                />
            ) : (
                info.getValue()
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => info.row.original.isNew ? (
                <select 
                    value="ACTIVE"
                    className="select-field"
                    disabled
                >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                </select>
            ) : (
                <select 
                    value={info.getValue()}
                    onChange={(e) => handleStatusChange(info.row.original.id, e.target.value as 'ACTIVE' | 'INACTIVE')}
                    className="select-field"
                >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                </select>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: (info) => info.row.original.isNew ? (
                <div className="action-buttons">
                    <button className="action-btn action-btn--check" onClick={handleSaveNew}>✓</button>
                    <button className="action-btn action-btn--close" onClick={handleCancelNew}>×</button>
                </div>
            ) : (
                <div className="action-buttons">
                    <button className="action-btn action-btn--edit">✎</button>
                    <button className="action-btn action-btn--delete">🗑</button>
                </div>
            ),
        }),
    ], [newReason, handleStatusChange, handleSaveNew, handleCancelNew, handleReasonChange]);

    useEffect(() => {
        if (isAddingNew && reasonInputRef.current) {
            reasonInputRef.current.focus();
        }
    }, [isAddingNew]);

    const tableData = useMemo(() => {
        if (isAddingNew) {
            return [{ id: 'new', reason: newReason, status: 'ACTIVE' as const, isNew: true }, ...cancelReasons];
        }
        return cancelReasons;
    }, [cancelReasons, isAddingNew, newReason]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="section-card">
            <div className="section-card__header">
                <h3 className="section-card__title">CANCEL REASON</h3>
                <button className="btn btn--primary" onClick={handleAdd}>ADD</button>
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

export default React.memo(CancelReasonSection);

