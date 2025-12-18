import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';

interface DocumentType {
    id: string;
    documentType: string;
    purpose: string;
    status: 'ACTIVE' | 'INACTIVE';
    isNew?: boolean;
}

const DocumentTypeSection: React.FC = () => {
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([
        { id: '1', documentType: 'National ID', purpose: 'POI', status: 'ACTIVE' },
        { id: '2', documentType: 'Passport', purpose: 'POI', status: 'ACTIVE' },
        { id: '3', documentType: "Driver's license", purpose: 'POI', status: 'ACTIVE' },
    ]);

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newDocumentType, setNewDocumentType] = useState<Partial<DocumentType>>({
        documentType: '',
        purpose: 'POI',
        status: 'ACTIVE',
    });

    const purposes = useMemo(() => ['POI', 'POA', 'SELFIE'], []);

    const handleAdd = useCallback(() => {
        setIsAddingNew(true);
    }, []);

    const handleSaveNew = useCallback(() => {
        if (newDocumentType.documentType) {
            setDocumentTypes(prev => [{
                id: Date.now().toString(),
                documentType: newDocumentType.documentType!,
                purpose: newDocumentType.purpose!,
                status: newDocumentType.status!,
            }, ...prev]);
            setNewDocumentType({ documentType: '', purpose: 'POI', status: 'ACTIVE' });
            setIsAddingNew(false);
        }
    }, [newDocumentType]);

    const handleCancelNew = useCallback(() => {
        setIsAddingNew(false);
        setNewDocumentType({ documentType: '', purpose: 'POI', status: 'ACTIVE' });
    }, []);

    const handleStatusChange = useCallback((id: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
        setDocumentTypes(prev => prev.map(dt => dt.id === id ? { ...dt, status: newStatus } : dt));
    }, []);

    const handlePurposeChange = useCallback((id: string, newPurpose: string) => {
        setDocumentTypes(prev => prev.map(dt => dt.id === id ? { ...dt, purpose: newPurpose } : dt));
    }, []);

    const columnHelper = createColumnHelper<DocumentType>();
    const documentTypeInputRef = useRef(null);

    const handleDocumentTypeChange = useCallback((e: any) => {
        setNewDocumentType(prev => ({ ...prev, documentType: e.target.value }));
    }, []);

    const columns = useMemo(() => [
        columnHelper.accessor('documentType', {
            header: 'Document Type',
            cell: (info) => info.row.original.isNew ? (
                <input 
                    ref={documentTypeInputRef}
                    type="text"
                    value={newDocumentType.documentType || ''}
                    onChange={handleDocumentTypeChange}
                    className="input-field"
                    placeholder="Enter document type"
                    autoFocus
                />
            ) : (
                info.getValue()
            ),
        }),
        columnHelper.accessor('purpose', {
            header: 'Purpose',
            cell: (info) => info.row.original.isNew ? (
                <select 
                    value={newDocumentType.purpose || 'POI'}
                    onChange={(e) => setNewDocumentType(prev => ({ ...prev, purpose: e.target.value }))}
                    className="select-field"
                >
                    {purposes.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            ) : (
                <select 
                    value={info.getValue()}
                    onChange={(e) => handlePurposeChange(info.row.original.id, e.target.value)}
                    className="select-field"
                >
                    {purposes.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => info.row.original.isNew ? (
                <select 
                    value={newDocumentType.status || 'ACTIVE'}
                    onChange={(e) => setNewDocumentType(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'INACTIVE' }))}
                    className="select-field"
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
    ], [newDocumentType, purposes, handleStatusChange, handlePurposeChange, handleSaveNew, handleCancelNew, handleDocumentTypeChange]);

    useEffect(() => {
        if (isAddingNew && documentTypeInputRef.current) {
            documentTypeInputRef.current.focus();
        }
    }, [isAddingNew]);

    const tableData = useMemo(() => {
        if (isAddingNew) {
            return [{ 
                id: 'new', 
                documentType: newDocumentType.documentType || '', 
                purpose: newDocumentType.purpose || 'POI', 
                status: (newDocumentType.status || 'ACTIVE') as const, 
                isNew: true 
            }, ...documentTypes];
        }
        return documentTypes;
    }, [documentTypes, isAddingNew, newDocumentType]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="section-card">
            <div className="section-card__header">
                <h3 className="section-card__title">DOCUMENT TYPE</h3>
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

export default React.memo(DocumentTypeSection);

