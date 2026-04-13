import React, {useContext, useEffect, useRef, useState} from 'react';
import {Popover, TableColumnsType} from 'antd';
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
    SECTION_TYPES
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

export const DragHandle = ({id}: {id: string}) => {
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

function CarouselTable<T extends BaseEntry>({
                                                entries: entriesProp,
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
    // Ensure entries is always an array
    const entries = Array.isArray(entriesProp) ? entriesProp : [];

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [invalidLiveDrop, setInvalidLiveDrop] = useState(false);
    const initialEntriesRef = useRef<T[]>(entries);
    const COLUMNS_COUNT = 15;

    const columns: TableColumnsType<TableRecord<CarouselEntry>> = React.useMemo(() => {
        const baseColumns: TableColumnsType<TableRecord<CarouselEntry>> = [
            {
                title: 'No',
                dataIndex: 'position',
                key: 'position',
                onCell: (record) => ('isSection' in record ? {colSpan: COLUMNS_COUNT} : {}),
                render: (_, record, index:number) => ('isSection' in record
                        ? (record.isSection === 'live' ? 'Currently live Carousel Entries' : 'Carousel backup entries')
                        : index
                ),
            },
            ...(isEditMode ? [{
                title: 'Drag',
                key: 'drag',
                width: 60,
                onCell: (record) => ('isSection' in record ? {colSpan: 0} : {}),
                render: (_, record) => ('isSection' in record ? null : <DragHandle id={record.id}/>),
            }] : []),
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                // render: (_, r) => ('isSection' in r ? null : r.type)
                render: (_, record) => {
                    if ('isSection' in record) return null;

                    const isParlay = record.type === 'Parlay' || record.type?.toLowerCase() === 'parlay';
                    const hasParlayData = record.parlayData && Array.isArray(record.parlayData) && record.parlayData.length > 0;

                    if (isParlay && hasParlayData) {
                        return (
                            <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                Parlay
                                <Popover
                                    title="Parlay Details"
                                    content={
                                        <div style={{maxWidth: 400}}>
                                            <p><strong>Number of legs:</strong> {record.parlayData.length}</p>
                                            {record.parlayData.map((leg: any, index: number) => (
                                                <div key={index} style={{
                                                    marginBottom: 8,
                                                    padding: 8,
                                                    background: '#f5f5f5',
                                                    borderRadius: 4
                                                }}>
                                                    <strong>Leg {index + 1}:</strong> {JSON.stringify(leg)}
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

                    // Trường hợp bình thường
                    return record.type;
                },
            },
            {
                title: 'Sport',
                dataIndex: 'sport',
                key: 'sport',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, r) => ('isSection' in r ? null : r.sport)
            },
            {
                title: 'League',
                dataIndex: 'league',
                key: 'league',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, r) => ('isSection' in r ? null : r.league)
            },
            {
                title: 'Event',
                dataIndex: 'event',
                key: 'event',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, r) => ('isSection' in r ? null : r.event)
            },
            {
                title: 'Period',
                dataIndex: 'period',
                key: 'period',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, r) => ('isSection' in r ? null : r.period)
            },
            {
                title: 'Grading Units',
                dataIndex: 'gradingUnits',
                key: 'gradingUnits',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, r) => ('isSection' in r ? null : r.gradingUnits)
            },
            {
                title: 'Market Type',
                dataIndex: 'marketType',
                key: 'marketType',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, r) => ('isSection' in r ? null : r.marketType)
            },
            {
                title: 'Header',
                dataIndex: 'header',
                key: 'header',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, r) => ('isSection' in r ? null : r.header)
            },
            {
                title: 'Expiry Date/Time',
                dataIndex: 'expiryDateTime',
                key: 'expiryDateTime',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, r) => ('isSection' in r ? null : r.expiryDateTime)
            },
            {
                title: 'Country',
                dataIndex: 'country',
                key: 'country',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, r) => ('isSection' in r ? null : r.country)
            },
            {
                title: 'Language',
                dataIndex: 'language',
                key: 'language',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, r) => ('isSection' in r ? null : r.language)
            },
            {
                title: 'Visible',
                key: 'visible',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, record) => ('isSection' in record ? null : (
                    <input
                        type="checkbox"
                        checked={record.visible}
                        disabled={!isEditMode}
                        onChange={() => handleToggleVisible(record.id)}
                    />
                )),
            },
            ...(isEditMode ? [{
                title: 'Actions',
                key: 'actions',
                onCell: (r) => ('isSection' in r ? {colSpan: 0} : {}),
                render: (_, record) => ('isSection' in record ? null : (
                    <div>
                        <button type="button" className="edit-link">Edit</button>
                        <button type="button" className="remove-link"
                            // onClick={() => handleRemove(record.id)}
                        >
                            Remove
                        </button>
                    </div>
                )),
            }] : [])
        ]
        return baseColumns;
    }, [isEditMode, entries]);

    // Update ref when entries prop changes from parent
    useEffect(() => {
        if (!hasUnsavedChanges) {
            initialEntriesRef.current = entries;
        }
    }, [entries, hasUnsavedChanges]);

    // Warn on page leave
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [hasUnsavedChanges]);

    // Derived data
    const sorted = sortByPosition(entries);
    const liveEntries = sorted.filter((e) => e.position <= liveCount);
    const backupEntries = sorted.filter((e) => e.position > liveCount);
    const sortableIds = entries.map((e) => e.id);

    // const tableData: TableRecord<T>[] = [
    //     {id: 'section-live', isSection: 'live'},
    //     ...liveEntries,
    //     ...(backupEntries.length > 0
    //         ? [{id: 'section-backup', isSection: 'backup' as const}, ...backupEntries]
    //         : []),
    // ];

    const tableData: TableRecord<T>[] = entries?.length > 0 ? [
        {id: 'section-live', isSection: 'live'},
        ...liveEntries,
        ...[{id: 'section-backup', isSection: 'backup' as const}, ...backupEntries],
    ] : [];


    // ==================== Handlers ====================

    const markDirty = () => setHasUnsavedChanges(true);

    const handleSave = () => {
        initialEntriesRef.current = entries;
        setHasUnsavedChanges(false);
        onSave?.(entries);
        onEditClick(false);
    };

    const handleCancel = () => {
        onEntriesChange(initialEntriesRef.current);
        setHasUnsavedChanges(false);
        onCancel?.(initialEntriesRef.current);
        onEditClick(false);
    };

    const isInvalidDrop = (activeId: string, overId: string): boolean => {
        const activeEntry = sorted.find((e) => e.id === activeId);
        const overEntry = sorted.find((e) => e.id === overId);
        if (!activeEntry || !overEntry) return false;
        return !activeEntry.visible && overEntry.position <= liveCount;
    };

    const handleDragStart = () => setInvalidLiveDrop(false);

    const handleDragOver = (event: DragOverEvent) => {
        const activeId = String(event.active?.id ?? '');
        const overId = event.over ? String(event.over.id) : '';
        setInvalidLiveDrop(activeId && overId ? isInvalidDrop(activeId, overId) : false);
    };

    const handleDragCancel = () => setInvalidLiveDrop(false);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        const activeId = String(active.id);
        const overId = over ? String(over.id) : '';

        setInvalidLiveDrop(false);

        if (!overId || activeId === overId) return;

        const oldIndex = sorted.findIndex((e) => e.id === activeId);
        const newIndex = sorted.findIndex((e) => e.id === overId);

        if (oldIndex === -1 || newIndex === -1) return;

        const draggedEntry = sorted[oldIndex];

        // Rule: Invisible entries cannot go to live zone
        if (!draggedEntry.visible && newIndex < liveCount) {
            return;
        }

        let newSorted = arrayMove(sorted, oldIndex, newIndex);

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
    };

    // Toggle visibility of an entry
    const handleToggleVisible = (id: string) => {
        const newEntries = entries.map((entry) =>
            entry.id === id ? {...entry, visible: !entry.visible} : entry
        );

        onEntriesChange(newEntries);
        markDirty();
    };

    // Row class name
    const getRowClassName = (record: TableRecord<T>): string => {
        if (isSectionRow(record)) {
            return invalidLiveDrop && record.isSection === SECTION_TYPES.LIVE
                ? `${CSS_CLASSES.SECTION_ROW} ${CSS_CLASSES.INVALID_DROP}`
                : CSS_CLASSES.SECTION_ROW;
        }
        const isLive = record.position <= liveCount;
        return invalidLiveDrop && isLive
            ? `${CSS_CLASSES.CAROUSEL_ROW} ${CSS_CLASSES.INVALID_DROP} not-allowed-drop`
            : CSS_CLASSES.CAROUSEL_ROW;
    };

    // Default buttons
    const defaultRightButtons: ToolbarButton[] = rightButtons.length > 0
        ? rightButtons
        : [
            {label: 'Save Changes', onClick: handleSave, disabled: !hasUnsavedChanges, type: 'primary'},
            {label: 'Cancel', onClick: handleCancel, type: 'secondary'},
        ];


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
                    //TODO: remove
                    {/*{defaultRightButtons.map((btn, i) => (*/}
                    {/*    <button*/}
                    {/*        key={i}*/}
                    {/*        type="button"*/}
                    {/*        className={`btn btn--${btn.type || BUTTON_TYPES.PRIMARY}`}*/}
                    {/*        disabled={btn.disabled}*/}
                    {/*        onClick={btn.onClick}*/}
                    {/*    >*/}
                    {/*        {btn.label}*/}
                    {/*    </button>*/}
                    {/*))}*/}
                    {/*{hasUnsavedChanges && (*/}
                    {/*    <span className={CSS_CLASSES.UNSAVED_LABEL}>{DEFAULT_UNSAVED_MESSAGE}</span>*/}
                    {/*)}*/}

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

// ===================== EXPORTS =====================

export {sortByPosition, reindexPositions, isSectionRow};
export default CarouselTable;
