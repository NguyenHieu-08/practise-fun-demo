import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Empty, Popover, TableColumnsType} from 'antd';
import type {DragEndEvent, DragOverEvent} from '@dnd-kit/core';
import {arrayMove, useSortable} from '@dnd-kit/sortable';

import './CarouselPage4.scss';
import 'antd/dist/reset.css';

import DragSortingTable, {RowContext} from './drag-sorting-table';
import {
    BUTTON_TYPES,
    CSS_CLASSES,
    DEFAULT_LIVE_COUNT,
    DEFAULT_MAX_POSITIONS,
    DEFAULT_TITLE,
    DEFAULT_UNSAVED_MESSAGE,
    SECTION_TYPES,
} from './CarouselConstants';

import {CarouselEntry} from "./CarouselExample";

// ===================== TYPES =====================

export interface BaseEntry {
    id: string;
    position: number;
    visible: boolean;
}

export interface SectionRow {
    id: string;
    isSection: 'live' | 'backup';
    isNoData?: boolean;
}

export type TableRecord<T extends BaseEntry> = T | SectionRow;

export interface ToolbarButton {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    type?: 'primary' | 'secondary';
}

export interface CarouselTableProps<T extends BaseEntry> {
    entries?: T[];
    title?: string;
    maxPositions?: number;
    liveCount?: number;
    leftButtons?: ToolbarButton[];
    rightButtons?: ToolbarButton[];
    onEntriesChange: (entries: T[]) => void;
    onSave?: (entries: T[]) => void;
    onCancel?: (entries: T[]) => void;
    className?: string;
    isEditMode?: boolean;
    onEditClick?: (value: boolean) => void;
}

// ===================== HELPERS =====================

function sortByPosition<T extends BaseEntry>(entries: T[] | undefined | null): T[] {
    if (!entries || !Array.isArray(entries)) return [];
    return [...entries].sort((a, b) => a.position - b.position);
}

function reindexPositions<T extends BaseEntry>(entries: T[] | undefined | null): T[] {
    if (!entries || !Array.isArray(entries)) return [];
    return entries.map((item, idx) => ({...item, position: idx + 1}));
}

function isSectionRow<T extends BaseEntry>(record: TableRecord<T>): record is SectionRow {
    return record != null && 'isSection' in record;
}

// ===================== DRAG HANDLE =====================

const DragHandle = ({id}: { id: string }) => {
    const {attributes} = useSortable({id});
    const {setActivatorNodeRef, listeners} = useContext(RowContext);

    return (
        <span
            className={CSS_CLASSES.DRAG_HANDLE}
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            style={{fontSize: '1.4em', cursor: 'move', userSelect: 'none'}}
        >
            ≡
        </span>
    );
};

// ===================== MAIN COMPONENT =====================

function CarouselTable5<T extends BaseEntry>({
                                                 entries: entriesProp = [],
                                                 title = DEFAULT_TITLE,
                                                 maxPositions = DEFAULT_MAX_POSITIONS,
                                                 liveCount = DEFAULT_LIVE_COUNT,
                                                 leftButtons = [],
                                                 rightButtons = [],
                                                 onEntriesChange,
                                                 onSave,
                                                 onCancel,
                                                 className = '',
                                                 isEditMode = false,
                                                 onEditClick,
                                             }: CarouselTableProps<T>) {
    // ===================== STATE & REFS =====================
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [invalidLiveDrop, setInvalidLiveDrop] = useState(false);

    const initialEntriesRef = useRef<T[]>(entriesProp);
    const COLUMNS_COUNT = 15;

    // Sync initial entries when prop changes and there are no unsaved changes
    useEffect(() => {
        if (!hasUnsavedChanges) {
            initialEntriesRef.current = entriesProp;
        }
    }, [entriesProp, hasUnsavedChanges]);

    // Warn user before leaving page with unsaved changes
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = DEFAULT_UNSAVED_MESSAGE;
            }
        };

        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [hasUnsavedChanges]);

    // ===================== DERIVED DATA (Core Business Logic) =====================
    const sortedEntries = useMemo(() => sortByPosition(entriesProp), [entriesProp]);

    const processedData = useMemo(() => {
        if (!sortedEntries.length) {
            return {
                liveEntries: [],
                backupEntries: [],
                // tableData: [{ id: 'section-live', isSection: 'live' as const }],
                tableData: [],
                sortableIds: [],
                finalEntries: [],
            };
        }

        // 1. Separate visible entries
        const visibleEntries = sortedEntries.filter(e => e.visible);

        // 2. Live entries: max `liveCount` visible entries
        const liveEntries = visibleEntries.slice(0, liveCount);

        // 3. Backup: remaining visible + all invisible
        const liveIds = new Set(liveEntries.map(e => e.id));
        const backupEntries = sortedEntries.filter(e => !liveIds.has(e.id));

        // 4. Re-assign positions
        const finalLive = liveEntries.map((item, idx) => ({...item, position: idx + 1}));
        const finalBackup = backupEntries.map((item, idx) => ({
            ...item,
            position: liveCount + idx + 1,
        }));

        const finalEntries = [...finalLive, ...finalBackup];

        // 5. Build table data with section headers
        // const tableData: TableRecord<T>[] = [
        //     { id: 'section-live', isSection: 'live' as const },
        //     ...finalLive,
        //     { id: 'section-backup', isSection: 'backup' as const },
        //     ...finalBackup,
        // ];

        const tableData: TableRecord<T>[] = [];

        // === SECTION LIVE ===
        tableData.push({id: 'section-live', isSection: 'live' as const});

        if (finalLive.length > 0) {
            tableData.push(...finalLive);
        } else {
            tableData.push({
                id: 'no-data',
                isSection: 'live',
                isNoData: true
            } as any);
        }

        // === SECTION BACKUP ===
        tableData.push({id: 'section-backup', isSection: 'backup' as const});

        if (finalBackup.length > 0) {
            tableData.push(...finalBackup);
        } else {
            tableData.push({
                id: 'no-data',
                isSection: 'backup',
                isNoData: true
            } as any);
        }

        const sortableIds = finalEntries.map(e => e.id);

        return {
            liveEntries: finalLive,
            backupEntries: finalBackup,
            tableData,
            sortableIds,
            finalEntries,
        };
    }, [sortedEntries, liveCount]);

    const {tableData, sortableIds, finalEntries} = processedData;

    // ===================== HANDLERS =====================

    const markDirty = useCallback(() => setHasUnsavedChanges(true), []);

    const handleSave = useCallback(() => {
        initialEntriesRef.current = finalEntries;
        setHasUnsavedChanges(false);
        onSave?.(finalEntries);
        onEditClick?.(false);
    }, [finalEntries, onSave, onEditClick]);

    const handleCancel = useCallback(() => {
        onEntriesChange(initialEntriesRef.current);
        setHasUnsavedChanges(false);
        onCancel?.(initialEntriesRef.current);
        onEditClick?.(false);
    }, [onEntriesChange, onCancel, onEditClick]);

    /** Check if dropping invisible entry into live section */
    const isInvalidDrop = useCallback((activeId: string, overId: string): boolean => {
        const activeEntry = sortedEntries.find(e => e.id === activeId);
        const overEntry = sortedEntries.find(e => e.id === overId);

        if (!activeEntry || !overEntry) return false;

        return !activeEntry.visible && overEntry.position <= liveCount;
    }, [sortedEntries, liveCount]);

    const handleDragStart = useCallback(() => setInvalidLiveDrop(false), []);
    const handleDragCancel = useCallback(() => setInvalidLiveDrop(false), []);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const activeId = String(event.active?.id ?? '');
        const overId = event.over ? String(event.over.id) : '';

        setInvalidLiveDrop(activeId && overId ? isInvalidDrop(activeId, overId) : false);
    }, [isInvalidDrop]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const {active, over} = event;
        const activeId = String(active.id);
        const overId = over ? String(over.id) : '';

        setInvalidLiveDrop(false);

        if (!over || activeId === overId) return;

        const oldIndex = finalEntries.findIndex(e => e.id === activeId);
        const newIndex = finalEntries.findIndex(e => e.id === overId);

        if (oldIndex === -1 || newIndex === -1) return;

        const draggedEntry = finalEntries[oldIndex];

        let newSorted = arrayMove(finalEntries, oldIndex, newIndex) as T[];

        // Rule: When dragging from live to backup, promote first visible backup
        const isDraggingToBackup =
            draggedEntry.position <= liveCount && newIndex + 1 > liveCount;

        if (isDraggingToBackup) {
            const backupVisible = newSorted
                .slice(liveCount)
                .find((e) => e.visible);

            if (backupVisible) {
                const backupIdx = newSorted.findIndex((e) => e.id === backupVisible.id);
                if (backupIdx !== liveCount - 1) {
                    newSorted = arrayMove(newSorted, backupIdx, liveCount - 1);
                }
            }
        }


        onEntriesChange(reindexPositions(newSorted));
        markDirty();
    }, [finalEntries, liveCount, onEntriesChange, markDirty]);

    /** Toggle visibility + re-index positions */
    const handleToggleVisible = useCallback((id: string) => {
        const newEntries = finalEntries.map(entry =>
            entry.id === id ? {...entry, visible: !entry.visible} : entry
        );

        onEntriesChange(reindexPositions(newEntries));
        markDirty();
    }, [finalEntries, onEntriesChange, markDirty]);

    // ===================== COLUMNS DEFINITION =====================

    const columns: TableColumnsType<TableRecord<CarouselEntry>> = useMemo(() => {
        const baseColumns: TableColumnsType<TableRecord<CarouselEntry>> = [
            {
                title: 'No',
                dataIndex: 'position',
                key: 'id',
                onCell: (record) => (isSectionRow(record) ? {colSpan: COLUMNS_COUNT} : {}),
                render: (_, record, index) => {
                    if ('isSection' in record) {
                        if (record.isNoData) {
                            // return <div className={"custom-no-data"}>No data</div>;
                            return <Empty description="No data"/>;
                        }
                        return record.isSection === 'live'
                            ? 'Currently live Carousel Entries'
                            : 'Carousel backup entries';
                    }

                    if (index > liveCount) {
                        index -= 1;
                    }

                    return index;
                }
            },
            // Drag column - only in edit mode
            ...(isEditMode
                ? [
                    {
                        title: 'Drag',
                        key: 'drag',
                        width: 60,
                        onCell: (record) => (isSectionRow(record) ? {colSpan: 0} : {}),
                        render: (_, record) =>
                            isSectionRow(record) ? null : <DragHandle id={record.id}/>,
                    },
                ]
                : []),

            // Type column with Parlay popover
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                onCell: (record) => (isSectionRow(record) ? {colSpan: 0} : {}),
                render: (_, record) => {
                    if (isSectionRow(record)) return null;

                    const isParlay = record.type === 'Parlay' || record.type?.toLowerCase() === 'parlay';
                    const hasParlayData =
                        record.parlayData && Array.isArray(record.parlayData) && record.parlayData.length > 0;

                    if (isParlay && hasParlayData) {
                        return (
                            <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                Parlay
                                <Popover
                                    title="Parlay Details"
                                    content={
                                        <div style={{maxWidth: 400}}>
                                            <p><strong>Number of legs:</strong> {record.parlayData.length}</p>
                                            {record.parlayData.map((leg: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    style={{
                                                        marginBottom: 8,
                                                        padding: 8,
                                                        background: '#f5f5f5',
                                                        borderRadius: 4,
                                                    }}
                                                >
                                                    <strong>Leg {idx + 1}:</strong> {JSON.stringify(leg)}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    trigger="hover"
                                    placement="right"
                                    mouseEnterDelay={0.3}
                                >
                                    <span className="info-icon">i</span>
                                </Popover>
                            </div>
                        );
                    }

                    return record.type;
                },
            },

            // Other data columns
            {title: 'Sport', dataIndex: 'sport', key: 'sport', onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {})},
            {title: 'League', dataIndex: 'league', key: 'league', onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {})},
            {title: 'Event', dataIndex: 'event', key: 'event', onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {})},
            {title: 'Period', dataIndex: 'period', key: 'period', onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {})},
            {
                title: 'Grading Units',
                dataIndex: 'gradingUnits',
                key: 'gradingUnits',
                onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {})
            },
            {
                title: 'Market Type',
                dataIndex: 'marketType',
                key: 'marketType',
                onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {})
            },
            {title: 'Header', dataIndex: 'header', key: 'header', onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {})},
            {
                title: 'Expiry Date/Time',
                dataIndex: 'expiryDateTime',
                key: 'expiryDateTime',
                onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {})
            },
            {
                title: 'Country',
                dataIndex: 'country',
                key: 'country',
                onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {})
            },
            {
                title: 'Language',
                dataIndex: 'language',
                key: 'language',
                onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {})
            },

            // Visible checkbox
            {
                title: 'Visible',
                key: 'visible',
                onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {}),
                render: (_, record) =>
                    isSectionRow(record) ? null : (
                        <input
                            type="checkbox"
                            checked={record.visible}
                            disabled={!isEditMode}
                            onChange={() => handleToggleVisible(record.id)}
                        />
                    ),
            },

            // Actions column - only in edit mode
            ...(isEditMode
                ? [
                    {
                        title: 'Actions',
                        key: 'actions',
                        onCell: (r) => (isSectionRow(r) ? {colSpan: 0} : {}),
                        render: (_, record) =>
                            isSectionRow(record) ? null : (
                                <div>
                                    <button type="button" className="edit-link">Edit</button>
                                    <button type="button" className="remove-link">
                                        Remove
                                    </button>
                                </div>
                            ),
                    },
                ]
                : []),
        ];

        return baseColumns;
    }, [isEditMode, liveCount, handleToggleVisible]);

    // ===================== ROW STYLING =====================

    const getRowClassName = useCallback((record: TableRecord<T>): string => {
        if (isSectionRow(record)) {
            return invalidLiveDrop && record.isSection === SECTION_TYPES.LIVE
                ? `${CSS_CLASSES.SECTION_ROW} ${CSS_CLASSES.INVALID_DROP}`
                : CSS_CLASSES.SECTION_ROW;
        }

        const isLive = record.position <= liveCount;
        return invalidLiveDrop && isLive
            ? `${CSS_CLASSES.CAROUSEL_ROW} ${CSS_CLASSES.INVALID_DROP} not-allowed-drop`
            : CSS_CLASSES.CAROUSEL_ROW;
    }, [invalidLiveDrop, liveCount]);

    // ===================== RENDER =====================

    return (
        <div className={`${CSS_CLASSES.PAGE} ${className}`}>
            <div className={CSS_CLASSES.HEADER_BAR}>
                <span className={CSS_CLASSES.TITLE}>{title}</span>
            </div>

            <div className={CSS_CLASSES.TOOLBAR}>
                <div className={CSS_CLASSES.TOOLBAR_LEFT}>
                    {leftButtons.map((btn, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`btn btn--${btn.type || BUTTON_TYPES.PRIMARY}`}
                            disabled={btn.disabled}
                            onClick={btn.onClick}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                <div className={CSS_CLASSES.TOOLBAR_RIGHT}>
                    {isEditMode ? (
                        <>
                            <button
                                type="button"
                                className="btn btn--primary"
                                disabled={!hasUnsavedChanges}
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="btn btn--secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            {hasUnsavedChanges && (
                                <span className={CSS_CLASSES.UNSAVED_LABEL}>
                                    {DEFAULT_UNSAVED_MESSAGE}
                                </span>
                            )}
                        </>
                    ) : (
                        onEditClick && (
                            <button
                                type="button"
                                className="btn btn--primary"
                                onClick={() => onEditClick(true)}
                            >
                                Edit
                            </button>
                        )
                    )}
                </div>
            </div>

            <div className={CSS_CLASSES.TABLE_WRAPPER}>
                <DragSortingTable
                    rowKey="id"
                    className={CSS_CLASSES.TABLE}
                    columns={columns}
                    dataSource={tableData}
                    sortableIds={sortableIds}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragCancel={handleDragCancel}
                    onDragEnd={handleDragEnd}
                    isSectionRow={isSectionRow}
                    pagination={false}
                    rowClassName={getRowClassName}
                    onRow={(record) => ({record})}
                />
            </div>
        </div>
    );
}

export default CarouselTable5;