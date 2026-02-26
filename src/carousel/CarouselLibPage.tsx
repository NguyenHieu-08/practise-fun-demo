import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import './CarouselPage.scss';
import 'antd/dist/reset.css';

const MAX_POSITIONS = 16;
const LIVE_COUNT = 6;

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

const CarouselLibPage = () => {
    const [entries, setEntries] = useState<CarouselEntry[]>(() => createInitialEntries());
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const initialEntriesRef = useRef<CarouselEntry[]>(entries);
    const nextIdRef = useRef(entries.length + 1);

    const activeCount = entries.length;

    const sortableItemIds = useMemo(() => entries.map((e) => e.id), [entries]);

    const sortedEntries = useMemo(
        () => [...entries].sort((a, b) => a.position - b.position),
        [entries]
    );

    const markDirty = useCallback(() => setHasUnsavedChanges(true), []);

    const handleToggleVisible = useCallback((id: string) => {
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, visible: !e.visible } : e)));
        markDirty();
    }, [markDirty]);

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

    const handleAddEntry = useCallback(() => {
        if (activeCount >= MAX_POSITIONS) return;
        setEntries((prev) => {
            const newEntry: CarouselEntry = {
                id: String(nextIdRef.current++),
                position: prev.length + 1,
                type: 'Single',
                sport: '',
                league: '',
                event: '',
                period: '',
                gradingUnits: '',
                marketType: '',
                header: '',
                expiryDateTime: '',
                country: 'Default',
                language: 'Default',
                visible: true,
            };
            return [...prev, newEntry];
        });
        markDirty();
    }, [activeCount, markDirty]);

    const handleSave = useCallback(() => {
        initialEntriesRef.current = entries;
        setHasUnsavedChanges(false);
    }, [entries]);

    const handleCancel = useCallback(() => {
        setEntries(initialEntriesRef.current);
        setHasUnsavedChanges(false);
    }, []);

    // const handleDragEnd = useCallback((event: DragEndEvent) => {
    //     const { active, over } = event;
    //     if (!over || active.id === over.id) return;
    //
    //     setEntries((prev) => {
    //         const sorted = [...prev].sort((a, b) => a.position - b.position);
    //         const oldIndex = sorted.findIndex((i) => i.id === active.id);
    //         const newIndex = sorted.findIndex((i) => i.id === over.id);
    //
    //         if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
    //
    //         const newSorted = arrayMove(sorted, oldIndex, newIndex);
    //         return newSorted.map((item, idx) => ({ ...item, position: idx + 1 }));
    //     });
    //
    //     markDirty();
    // }, [markDirty]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setEntries((prev) => {
            // Luôn sắp xếp theo position hiện tại để đảm bảo thứ tự chính xác
            let sorted = [...prev].sort((a, b) => a.position - b.position);

            const oldIndex = sorted.findIndex((i) => i.id === active.id);
            const newIndex = sorted.findIndex((i) => i.id === over.id);

            if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;

            const draggedEntry = sorted[oldIndex];

            // Tính vị trí đích sau reorder (1-based)
            const targetPosition = newIndex + 1;

            // Điều kiện mới: Không cho phép entry visible = false lên live (position <= 6)
            if (targetPosition <= LIVE_COUNT && draggedEntry.visible === false) {
                console.warn(`Entry ${draggedEntry.id} có visible = false, không thể kéo lên live`);
                // Có thể thêm thông báo UI: message.warning("Chỉ entry Visible mới được đưa lên live");
                return prev; // Revert – không thay đổi state
            }

            // Trường hợp kéo từ live xuống backup → áp dụng logic đẩy entry visible đầu tiên lên vị trí 6
            const isDraggingFromLiveToBackup =
                draggedEntry.position <= LIVE_COUNT && targetPosition > LIVE_COUNT;

            if (isDraggingFromLiveToBackup) {
                // 1. Thực hiện reorder trước
                let newSorted = arrayMove(sorted, oldIndex, newIndex);

                // 2. Tìm entry visible = true đầu tiên trong backup sau reorder
                const backupAfterMove = newSorted.filter((e) => e.position > LIVE_COUNT);
                const firstVisibleInBackup = backupAfterMove.find((e) => e.visible);

                if (firstVisibleInBackup) {
                    const currentBackupVisibleIndex = newSorted.findIndex(
                        (e) => e.id === firstVisibleInBackup.id
                    );

                    // Đẩy lên vị trí thứ 6 (index 5)
                    const targetLiveIndex = LIVE_COUNT - 1; // 5

                    if (currentBackupVisibleIndex !== targetLiveIndex) {
                        newSorted = arrayMove(newSorted, currentBackupVisibleIndex, targetLiveIndex);
                    }
                }

                // 3. Cập nhật position
                newSorted = newSorted.map((item, idx) => ({
                    ...item,
                    position: idx + 1,
                }));

                return newSorted;
            }

            // Các trường hợp khác (kéo trong live, trong backup, hoặc từ backup lên live hợp lệ)
            const newSorted = arrayMove(sorted, oldIndex, newIndex).map((item, idx) => ({
                ...item,
                position: idx + 1,
            }));

            return newSorted;
        });

        markDirty();
    }, [markDirty]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
        useSensor(KeyboardSensor)
    );

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!hasUnsavedChanges) return;
            event.preventDefault();
            event.returnValue = 'You have unsaved changes. If you leave now, they will be lost.';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const liveEntries = useMemo(() => sortedEntries.filter((e) => e.position <= LIVE_COUNT), [sortedEntries]);
    const backupEntries = useMemo(() => sortedEntries.filter((e) => e.position > LIVE_COUNT), [sortedEntries]);

    const COLUMNS_COUNT = 15;

    const tableData = useMemo<TableRecord[]>(() => [
        { id: 'section-live', isSection: 'live' },
        ...liveEntries,
        { id: 'section-backup', isSection: 'backup' },
        ...backupEntries,
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
                    <button type="button" className="btn btn--primary" disabled={activeCount >= MAX_POSITIONS} onClick={handleAddEntry}>
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
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={sortableItemIds} strategy={verticalListSortingStrategy} children={undefined}>
                        <Table<TableRecord>
                            className="carousel-table"
                            columns={columns}
                            dataSource={tableData}
                            pagination={false}
                            rowKey="id"
                            rowClassName={(record) => ('isSection' in record ? 'section-row' : 'carousel-row')}
                            components={{ body: { row: DraggableBodyRow } }}
                            onRow={(record) => ({
                                record,
                            })}
                        />
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};

const DraggableBodyRow = (props: any) => {
    const record = props.record;

    if (!record) {
        return <tr {...props} />;
    }

    const isSection = 'isSection' in record;

    if (isSection) {
        return <tr {...props} className={`${props.className || ''} section-row`} />;
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: record.id });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        background: isDragging ? '#e6f7ff' : undefined,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 20 : undefined,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            {...props}
            className={`${props.className || ''} ${isDragging ? 'dragging-row' : ''}`}
        />
    );
};


const DragHandle = ({ id }: { id: string }) => {
    const { attributes, listeners } = useSortable({ id });

    return (
        <span
            className="drag-handle"
            {...attributes}
            {...listeners}
            style={{
                fontSize: '1.4em',
                cursor: 'grab',
                display: 'inline-block',
                userSelect: 'none',
            }}
        >
      ≡
    </span>
    );
};

export default React.memo(CarouselLibPage);