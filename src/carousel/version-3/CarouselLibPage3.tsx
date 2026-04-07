import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import type { TableColumnsType } from 'antd';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import {arrayMove, useSortable} from '@dnd-kit/sortable';

import './CarouselPage3.scss';
import 'antd/dist/reset.css';
import DragSortingTable, {RowContext} from "./drag-sorting-table";
import AddEntryModal from "../../add-carousel/add-entry-modal.component";

const MAX_POSITIONS = 16; // Maximum number of carousel entries allowed
const LIVE_COUNT = 6; // Number of positions shown in the "live" carousel section

type CarouselEntry = {
    id: string;
    position: number;
    type: string;
    sport: string;
    league: string;
    event: string;
    period: string;
    gradingUnits: string;
    marketType: string;
    header: string;
    expiryDateTime: string;
    country: string;
    language: string;
    visible: boolean;
};

type TableRecord = CarouselEntry | {
    id: string;
    isSection: 'live' | 'backup';
    [key: string]: any;
};

const createInitialEntries = (): CarouselEntry[] => [
    { id: '1', position: 1, type: 'Single', sport: 'Soccer', league: 'FIFA - CUF', event: 'RMA vs BAR', period: 'Match', gradingUnits: '1x2', marketType: 'El Clasico', header: 'El Clasico', expiryDateTime: '30-07-2025 18:01:08', country: 'Default', language: 'Default', visible: true },
    { id: '2', position: 2, type: 'Banner', sport: '', league: '', event: '', period: '', gradingUnits: '', marketType: 'Summer Promo', header: 'Combo Boost', expiryDateTime: '30-07-2025 18:01:08', country: 'Default', language: 'Default', visible: true },
    { id: '3', position: 3, type: 'Parlay', sport: 'Parlay: [treetop]', league: 'summer Promo', event: 'MUN vs LIV', period: '1x2', gradingUnits: 'Handicap', marketType: 'Combo Boost', header: 'Super Odds', expiryDateTime: '30-07-2025 18:01:08', country: 'Default', language: 'Default', visible: true },
    { id: '4', position: 4, type: 'Link/Freetext', sport: 'AUSTRALIA: NSW', league: '', event: '', period: '1st Half', gradingUnits: '', marketType: 'Super Odds', header: 'Super Odds', expiryDateTime: '30-07-2025 18:01:08', country: 'Default', language: 'English', visible: true },
    { id: '5', position: 5, type: 'Single', sport: 'Single', league: 'NBA', event: 'MUN vs LIV', period: '1st Half', gradingUnits: 'Corners', marketType: 'Summer Promo', header: 'Sumer Promo', expiryDateTime: '30-07-2025 18:01:08', country: 'Default', language: 'Default', visible: true },
    { id: '6', position: 6, type: 'Parlay', sport: 'Temis', league: 'NBA', event: 'MUN vs LIV', period: '1x2', gradingUnits: '', marketType: 'Super Odds', header: 'Doher', expiryDateTime: '30-07-2025 18:01:08', country: 'Default', language: 'English', visible: true },
    { id: '7', position: 7, type: 'Single', sport: 'Soccer', league: 'NBA', event: 'MUN vs LIV', period: '1st Half', gradingUnits: 'Corners', marketType: 'Summer Promo', header: 'Summer Promo', expiryDateTime: '30-07-2025 18:00', country: 'Default', language: 'Default', visible: false },
    { id: '8', position: 8, type: 'Link/Freetext', sport: 'Tennis', league: 'NBA', event: 'MUN vs LIV', period: '1st Half', gradingUnits: '', marketType: 'Combo Boost', header: 'Summer Odds', expiryDateTime: '30-07-2025 18:01', country: 'Default', language: 'Default', visible: true },
    { id: '9', position: 9, type: 'Parlay', sport: 'Single', league: 'NBA', event: 'MUN vs LIV', period: 'Over Time', gradingUnits: '1x2', marketType: 'Super Odds', header: 'Super Odds', expiryDateTime: '30-07-2025 18:01', country: 'Default', language: 'Default', visible: false },
    { id: '10', position: 10, type: 'Single', sport: 'Tennis', league: 'NBA', event: 'MUN vs LIV', period: '1st Half', gradingUnits: '', marketType: 'Combo Boost', header: 'Summer Promo', expiryDateTime: '30-07-2025 18:01', country: 'Default', language: 'Default', visible: true },
];


const CarouselLibPage3 = () => {
    // State: list of all carousel entries
    const [entries, setEntries] = useState<CarouselEntry[]>(() => createInitialEntries());

    // State: track whether there are unsaved changes
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // State: indicate if user is trying to drop an invisible entry into live zone (validation feedback)
    const [invalidLiveDrop, setInvalidLiveDrop] = useState(false);

    // Ref: store initial entries for cancel action
    const initialEntriesRef = useRef<CarouselEntry[]>(entries);

    // Ref: generate next unique ID for new entries
    const nextIdRef = useRef(entries.length + 1);

    const [modalOpen, setModalOpen] = useState(false);

    // Derived value: total number of active entries
    const activeCount = entries.length;

    const sortableItemIds = useMemo(() => entries.map((e) => e.id), [entries]);

    const sortedEntries = useMemo(
        () => [...entries].sort((a, b) => a.position - b.position),
        [entries]
    );

    // Callback: mark form as dirty when any change occurs
    const markDirty = useCallback(() => setHasUnsavedChanges(true), []);

    // Toggle visibility of an entry
    const handleToggleVisible = useCallback((id: string) => {
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, visible: !e.visible } : e)));
        markDirty();
    }, [markDirty]);

    // Remove an entry and re-index positions
    const handleRemove = useCallback((id: string) => {
        setEntries((prev) => {
            const remaining = prev
                .filter((e) => e.id !== id)
                .sort((a, b) => a.position - b.position)
                .map((e, index) => ({ ...e, position: index + 1 }));
            return remaining;
        });
        markDirty();
    }, [markDirty]);

    const handleSave = useCallback(() => {
        initialEntriesRef.current = entries;
        setHasUnsavedChanges(false);
    }, [entries]);

    const handleCancel = useCallback(() => {
        setEntries(initialEntriesRef.current);
        setHasUnsavedChanges(false);
    }, []);

    // Helper: check if dropping an invisible entry into live zone
    const evaluateInvalidLiveDrop = useCallback((activeId: string | null, overId: string | null) => {
        if (!activeId || !overId) return false;

        const sorted = [...entries].sort((a, b) => a.position - b.position);
        const activeEntry = sorted.find((e) => e.id === activeId);
        const overEntry = sorted.find((e) => e.id === overId);

        if (!activeEntry || !overEntry) return false;
        return activeEntry.visible === false && overEntry.position <= LIVE_COUNT;
    }, [entries]);

    // Drag events handlers
    const handleDragStart = useCallback((event: DragStartEvent) => {
        setInvalidLiveDrop(false);
    }, []);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const activeId = String(event.active?.id ?? '');
        const overId = event.over ? String(event.over.id) : null;
        setInvalidLiveDrop(evaluateInvalidLiveDrop(activeId || null, overId));
    }, [evaluateInvalidLiveDrop]);

    const handleDragCancel = useCallback(() => {
        setInvalidLiveDrop(false);
    }, []);

    // Main drag end logic: reorder entries with special rules
    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        const activeId = String(active.id);
        const overId = over ? String(over.id) : null;

        if (!overId || activeId === overId) {
            setInvalidLiveDrop(false);
            return;
        }

        setEntries((prev) => {
            // Luôn sắp xếp theo position hiện tại để đảm bảo thứ tự chính xác
            let sorted = [...prev].sort((a, b) => a.position - b.position);

            const oldIndex = sorted.findIndex((i) => i.id === activeId);
            const newIndex = sorted.findIndex((i) => i.id === overId);

            if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;

            const draggedEntry = sorted[oldIndex];

            // Rule 1: Invisible entries cannot be dropped into live zone (positions 1-6)
            const isDroppingIntoLiveZone = newIndex < LIVE_COUNT;
            if (draggedEntry.visible === false && isDroppingIntoLiveZone) {
                console.warn(`Entry ${draggedEntry.id} có visible = false, không thể kéo lên live`);
                return prev; // Revert – không thay đổi state
            }

            const targetPosition = newIndex + 1;

            // Rule 2: When dragging from live to backup, promote the first visible backup entry to position 6
            const isDraggingFromLiveToBackup =
                draggedEntry.position <= LIVE_COUNT && targetPosition > LIVE_COUNT;

            if (isDraggingFromLiveToBackup) {
                // 1. Place a reorder first
                let newSorted = arrayMove(sorted, oldIndex, newIndex);

                // 2. Find the first item showing = true in the backup after rearranging.
                const backupAfterMove = newSorted.filter((e) => e.position > LIVE_COUNT);
                const firstVisibleInBackup = backupAfterMove.find((e) => e.visible);

                if (firstVisibleInBackup) {
                    const currentBackupVisibleIndex = newSorted.findIndex(
                        (e) => e.id === firstVisibleInBackup.id
                    );

                    // push position 6 (0-based index 5)
                    const targetLiveIndex = LIVE_COUNT - 1;

                    if (currentBackupVisibleIndex !== targetLiveIndex) {
                        newSorted = arrayMove(newSorted, currentBackupVisibleIndex, targetLiveIndex);
                    }
                }

                // Re-index positions
                newSorted = newSorted.map((item, idx) => ({
                    ...item,
                    position: idx + 1,
                }));

                return newSorted;
            }

            // Other cases (pulling from live, from backup, or from backup to live is valid)
            const newSorted = arrayMove(sorted, oldIndex, newIndex).map((item, idx) => ({
                ...item,
                position: idx + 1,
            }));

            return newSorted;
        });

        setInvalidLiveDrop(false);
        markDirty();
    }, [markDirty]);

    // Prevent accidental page leave with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!hasUnsavedChanges) return;
            event.preventDefault();
            event.returnValue = 'You have unsaved changes. If you leave now, they will be lost.';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // Split entries into live and backup sections
    const liveEntries = useMemo(() => sortedEntries.filter((e) => e.position <= LIVE_COUNT), [sortedEntries]);
    const backupEntries = useMemo(() => sortedEntries.filter((e) => e.position > LIVE_COUNT), [sortedEntries]);

    const COLUMNS_COUNT = 15; // Table data with section headers

    const tableData = useMemo<TableRecord[]>(() => [
        { id: 'section-live', isSection: 'live' },
        ...liveEntries,
        ...(backupEntries?.length > 0 ? [
            {id: 'section-backup', isSection: 'backup'},
            ...backupEntries,
        ] : []),
    ], [liveEntries, backupEntries]);

    const columns = useMemo<TableColumnsType<TableRecord>>(() => [
        {
            title: 'No',
            dataIndex: 'position',
            key: 'position',
            onCell: (record) => ('isSection' in record ? { colSpan: COLUMNS_COUNT } : {}),
            render: (_, record) => ('isSection' in record
                    ? (record.isSection === 'live' ? 'Currently live Carousel Entries' : 'Carousel backup entries')
                    : record.position
            ),
        },
        {
            title: 'Drag',
            key: 'drag',
            width: 60,
            onCell: (record) => ('isSection' in record ? { colSpan: 0 } : {}),
            render: (_, record) => ('isSection' in record ? null : <DragHandle id={record.id} />),
        },
        { title: 'Type', dataIndex: 'type', key: 'type', onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}), render: (_, r) => ('isSection' in r ? null : r.type) },
        { title: 'Sport', dataIndex: 'sport', key: 'sport', onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}), render: (_, r) => ('isSection' in r ? null : r.sport) },
        { title: 'League', dataIndex: 'league', key: 'league', onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}), render: (_, r) => ('isSection' in r ? null : r.league) },
        { title: 'Event', dataIndex: 'event', key: 'event', onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}), render: (_, r) => ('isSection' in r ? null : r.event) },
        { title: 'Period', dataIndex: 'period', key: 'period', onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}), render: (_, r) => ('isSection' in r ? null : r.period) },
        { title: 'Grading Units', dataIndex: 'gradingUnits', key: 'gradingUnits', onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}), render: (_, r) => ('isSection' in r ? null : r.gradingUnits) },
        { title: 'Market Type', dataIndex: 'marketType', key: 'marketType', onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}), render: (_, r) => ('isSection' in r ? null : r.marketType) },
        { title: 'Header', dataIndex: 'header', key: 'header', onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}), render: (_, r) => ('isSection' in r ? null : r.header) },
        { title: 'Expiry Date/Time', dataIndex: 'expiryDateTime', key: 'expiryDateTime', onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}), render: (_, r) => ('isSection' in r ? null : r.expiryDateTime) },
        { title: 'Country', dataIndex: 'country', key: 'country', onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}), render: (_, r) => ('isSection' in r ? null : r.country) },
        { title: 'Language', dataIndex: 'language', key: 'language', onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}), render: (_, r) => ('isSection' in r ? null : r.language) },
        {
            title: 'Visible',
            key: 'visible',
            onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}),
            render: (_, record) => ('isSection' in record ? null : (
                <input
                    type="checkbox"
                    checked={record.visible}
                    onChange={() => handleToggleVisible(record.id)}
                />
            )),
        },
        {
            title: 'Actions',
            key: 'actions',
            onCell: (r) => ('isSection' in r ? { colSpan: 0 } : {}),
            render: (_, record) => ('isSection' in record ? null : (
                <button type="button" className="remove-link" onClick={() => handleRemove(record.id)}>
                    Remove
                </button>
            )),
        },
    ], [handleToggleVisible, handleRemove]);

    return (
        <div className="carousel-page">
            <div className="carousel-page__header-bar">
                <span className="carousel-page__title">Website Carousel - Edit Mode</span>
            </div>

            <div className="carousel-page__toolbar">
                <div className="carousel-page__toolbar-left">
                    <button type="button" className="btn btn--primary" disabled={activeCount >= MAX_POSITIONS} onClick={() => setModalOpen(true)}>
                        + Add Entry
                    </button>
                    <button type="button" className="btn btn--secondary">Share with NEV</button>
                </div>
                <div className="carousel-page__toolbar-right">
                    <button type="button" className="btn btn--primary" disabled={!hasUnsavedChanges} onClick={handleSave}>
                        Save Changes
                    </button>
                    <button type="button" className="btn btn--secondary" onClick={handleCancel}>Cancel</button>
                    {hasUnsavedChanges && <span className="carousel-page__unsaved-label">You have unsaved changes</span>}
                </div>
            </div>

            <div className="carousel-page__table-wrapper">
                <DragSortingTable
                    className={"carousel-table"}
                    columns={columns}
                    dataSource={tableData}
                    sortableIds={sortableItemIds}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragCancel={handleDragCancel}
                    onDragEnd={handleDragEnd}
                    rowKey="id"
                    isSectionRow={(record: TableRecord) => 'isSection' in record}
                    pagination={false}
                    rowClassName={(record) => {
                        if ('isSection' in record) {
                            if (record.isSection === 'live' && invalidLiveDrop) {
                                return 'section-row invalid-live-drop-target';
                            }
                            return 'section-row';
                        }

                        const isLiveRow = record.position <= LIVE_COUNT;
                        if (invalidLiveDrop && isLiveRow) {
                            return 'carousel-row invalid-live-drop-target';
                        }
                        return 'carousel-row';
                    }}
                    onRow={(record) => ({
                        record,
                    })}
                />
            </div>

            <AddEntryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={(data) => {
                    console.log('Data lưu:', data);
                    // Gọi API ở đây
                }}
            />
        </div>
    );
};

// Drag handle component (used in the "Drag" column)
const DragHandle = ({ id }: { id: string }) => {
    const { attributes } = useSortable({ id });
    const { setActivatorNodeRef, listeners } = useContext(RowContext);

    return (
        <span
            className="drag-handle"
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            style={{
                fontSize: '1.4em',
                cursor: 'move',
                display: 'inline-block',
                userSelect: 'none',
            }}
        >
          ≡
        </span>
    );
};

export default React.memo(CarouselLibPage3);