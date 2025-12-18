import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';

interface BlockingRule {
    id: string;
    blockRules: string;
    casinoBonusIneligible: boolean;
    sbBonusIneligible: boolean;
    blockCasino: boolean;
    blockSBWagering: boolean;
    blockWithdrawals: boolean;
    betBuilderBonusIneligible: boolean;
    blockBetBuilder: boolean;
    status: 'ACTIVE' | 'INACTIVE';
    isNew?: boolean;
}

const BlockingRuleSection = () => {
    const [blockingRules, setBlockingRules] = useState([
        {
            id: '1',
            blockRules: 'Supicous',
            casinoBonusIneligible: true,
            sbBonusIneligible: true,
            blockCasino: true,
            blockSBWagering: true,
            blockWithdrawals: true,
            betBuilderBonusIneligible: true,
            blockBetBuilder: true,
            status: 'ACTIVE',
        },
        {
            id: '2',
            blockRules: 'Friendly',
            casinoBonusIneligible: false,
            sbBonusIneligible: false,
            blockCasino: false,
            blockSBWagering: false,
            blockWithdrawals: false,
            betBuilderBonusIneligible: false,
            blockBetBuilder: false,
            status: 'ACTIVE',
        },
        {
            id: '3',
            blockRules: 'No Block',
            casinoBonusIneligible: false,
            sbBonusIneligible: false,
            blockCasino: false,
            blockSBWagering: false,
            blockWithdrawals: false,
            betBuilderBonusIneligible: false,
            blockBetBuilder: false,
            status: 'ACTIVE',
        },
    ]) as any;

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newBlockingRule, setNewBlockingRule] = useState({
        blockRules: '',
        casinoBonusIneligible: false,
        sbBonusIneligible: false,
        blockCasino: false,
        blockSBWagering: false,
        blockWithdrawals: false,
        betBuilderBonusIneligible: false,
        blockBetBuilder: false,
        status: 'ACTIVE',
    } as any);

    const handleAdd = useCallback(() => {
        setIsAddingNew(true);
    }, []);

    const handleSaveNew = useCallback(() => {
        if (newBlockingRule.blockRules) {
            setBlockingRules(prev => [{
                id: Date.now().toString(),
                blockRules: newBlockingRule.blockRules!,
                casinoBonusIneligible: newBlockingRule.casinoBonusIneligible || false,
                sbBonusIneligible: newBlockingRule.sbBonusIneligible || false,
                blockCasino: newBlockingRule.blockCasino || false,
                blockSBWagering: newBlockingRule.blockSBWagering || false,
                blockWithdrawals: newBlockingRule.blockWithdrawals || false,
                betBuilderBonusIneligible: newBlockingRule.betBuilderBonusIneligible || false,
                blockBetBuilder: newBlockingRule.blockBetBuilder || false,
                status: newBlockingRule.status || 'ACTIVE',
            }, ...prev]);
            setNewBlockingRule({
                blockRules: '',
                casinoBonusIneligible: false,
                sbBonusIneligible: false,
                blockCasino: false,
                blockSBWagering: false,
                blockWithdrawals: false,
                betBuilderBonusIneligible: false,
                blockBetBuilder: false,
                status: 'ACTIVE',
            });
            setIsAddingNew(false);
        }
    }, [newBlockingRule]);

    const handleCancelNew = useCallback(() => {
        setIsAddingNew(false);
        setNewBlockingRule({
            blockRules: '',
            casinoBonusIneligible: false,
            sbBonusIneligible: false,
            blockCasino: false,
            blockSBWagering: false,
            blockWithdrawals: false,
            betBuilderBonusIneligible: false,
            blockBetBuilder: false,
            status: 'ACTIVE',
        });
    }, []);

    const handleCheckboxChange = useCallback((id: string, field: keyof BlockingRule, value: boolean) => {
        setBlockingRules(prev => prev.map(br => br.id === id ? { ...br, [field]: value } : br));
    }, []);

    const handleStatusChange = useCallback((id: string, newStatus: 'ACTIVE' | 'INACTIVE') => {
        setBlockingRules(prev => prev.map(br => br.id === id ? { ...br, status: newStatus } : br));
    }, []);

    const checkboxColumns = useMemo(() => [
        { key: 'casinoBonusIneligible', label: 'Casino Bonus Ineligible' },
        { key: 'sbBonusIneligible', label: 'SB Bonus Ineligible' },
        { key: 'blockCasino', label: 'Block Casino' },
        { key: 'blockSBWagering', label: 'Block SB Wagering' },
        { key: 'blockWithdrawals', label: 'Block Withdrawals' },
        { key: 'betBuilderBonusIneligible', label: 'Bet Builder Bonus Ineligible' },
        { key: 'blockBetBuilder', label: 'Block Bet Builder' },
    ], []);

    const columnHelper = createColumnHelper<BlockingRule>();
    const blockRulesInputRef = useRef(null);

    const handleBlockRulesChange = useCallback((e: any) => {
        setNewBlockingRule(prev => ({ ...prev, blockRules: e.target.value }));
    }, []);

    const columns = useMemo(() => [
        columnHelper.accessor('blockRules', {
            header: 'Block Rules',
            cell: (info) => info.row.original.isNew ? (
                <input 
                    ref={blockRulesInputRef}
                    type="text"
                    value={newBlockingRule.blockRules || ''}
                    onChange={handleBlockRulesChange}
                    className="input-field"
                    placeholder="Enter block rule name"
                    autoFocus
                />
            ) : (
                info.getValue()
            ),
        }),
        ...checkboxColumns.map(col => columnHelper.accessor(col.key as keyof BlockingRule, {
            id: col.key,
            header: col.label,
            cell: (info) => info.row.original.isNew ? (
                <input 
                    type="checkbox"
                    checked={newBlockingRule[col.key as keyof BlockingRule] as boolean || false}
                    onChange={(e) => setNewBlockingRule(prev => ({ ...prev, [col.key]: e.target.checked }))}
                    className="checkbox-field"
                />
            ) : (
                <input 
                    type="checkbox"
                    checked={info.getValue() as boolean}
                    onChange={(e) => handleCheckboxChange(info.row.original.id, col.key as keyof BlockingRule, e.target.checked)}
                    className="checkbox-field"
                />
            ),
        })),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => info.row.original.isNew ? (
                <select 
                    value={newBlockingRule.status || 'ACTIVE'}
                    onChange={(e) => setNewBlockingRule(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'INACTIVE' }))}
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
    ], [checkboxColumns, newBlockingRule, handleCheckboxChange, handleStatusChange, handleSaveNew, handleCancelNew, handleBlockRulesChange]);

    useEffect(() => {
        if (isAddingNew && blockRulesInputRef.current) {
            blockRulesInputRef.current.focus();
        }
    }, [isAddingNew]);

    const tableData = useMemo(() => {
        if (isAddingNew) {
            return [{ 
                id: 'new', 
                blockRules: '', 
                casinoBonusIneligible: false,
                sbBonusIneligible: false,
                blockCasino: false,
                blockSBWagering: false,
                blockWithdrawals: false,
                betBuilderBonusIneligible: false,
                blockBetBuilder: false,
                status: 'ACTIVE' as const, 
                isNew: true 
            }, ...blockingRules];
        }
        return blockingRules;
    }, [blockingRules, isAddingNew]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="section-card">
            <div className="section-card__header">
                <h3 className="section-card__title">BLOCKING RULE</h3>
                <button className="btn btn--primary" onClick={handleAdd}>ADD</button>
            </div>
            <div className="section-card__body section-card__body--scrollable">
                <table className="data-table data-table--wide">
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

export default React.memo(BlockingRuleSection);

