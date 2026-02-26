import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Table, message } from 'antd';
import './CarouselPage.scss';
import 'antd/dist/reset.css';

const MAX_POSITIONS = 16;
const LIVE_COUNT = 6;

type CarouselEntry = {
    id: string;
    position: number; // 1-based priority
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

const CarouselPage = () => {
    const [entries, setEntries] = useState<CarouselEntry[]>(() => createInitialEntries());
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const initialEntriesRef = useRef<CarouselEntry[]>(entries);
    const nextIdRef = useRef(entries.length + 1);

    const activeCount = entries.length;

    const sortedEntries = useMemo(
        () => [...entries].sort((a, b) => a.position - b.position),
        [entries]
    );

    const markDirty = useCallback(() => {
        setHasUnsavedChanges(true);
    }, []);

    const handleToggleVisible = useCallback((id: string) => {
        setEntries((prev) =>
            prev.map((e) => (e.id === id ? { ...e, visible: !e.visible } : e))
        );
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
            const position = prev.length + 1;
            const newEntry: CarouselEntry = {
                id: String(nextIdRef.current++),
                position,
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

    const handleDragStart = useCallback(
        (id: string) => (event: DragEvent) => {
            setDraggingId(id);
            event.dataTransfer!.effectAllowed = 'move';
        },
        []
    );

    const handleDragOver = useCallback(
        (event: DragEvent) => {
            event.preventDefault();
            event.dataTransfer!.dropEffect = 'move';
        },
        []
    );

    const handleDrop = useCallback(
        (targetId: string | null) => (event: DragEvent) => {
            event.preventDefault();
            if (!draggingId) return;

            setEntries((prev) => {
                let items = [...prev].sort((a, b) => a.position - b.position);

                const fromIndex = items.findIndex((e) => e.id === draggingId);
                if (fromIndex === -1) return prev;

                const draggedEntry = items[fromIndex];

                // Xác định vị trí đích
                let toIndex: number;
                if (targetId === null) {
                    // Drop vào phần backup (section-backup) → đẩy xuống cuối backup
                    toIndex = items.length - 1;
                } else {
                    toIndex = items.findIndex((e) => e.id === targetId);
                    if (toIndex === -1) return prev;
                }

                const targetPosition = toIndex + 1;

                // Kiểm tra kéo từ backup lên live và visible = false → chặn
                const isFromBackupToLive = draggedEntry.position > LIVE_COUNT && targetPosition <= LIVE_COUNT;
                if (isFromBackupToLive && draggedEntry.visible === false) {
                    message.warning("Chỉ entry có Visible = true mới được đưa lên phần Currently live");
                    return prev;
                }

                // Thực hiện di chuyển
                const [moved] = items.splice(fromIndex, 1);
                items.splice(toIndex, 0, moved);

                // Cập nhật position tạm thời
                items = items.map((e, idx) => ({ ...e, position: idx + 1 }));

                // Nếu kéo từ live xuống backup → đẩy entry visible đầu tiên trong backup lên vị trí 6
                const isFromLiveToBackup = draggedEntry.position <= LIVE_COUNT && targetPosition > LIVE_COUNT;
                if (isFromLiveToBackup) {
                    const backupAfter = items.filter((e) => e.position > LIVE_COUNT);
                    const firstVisibleInBackup = backupAfter.find((e) => e.visible);

                    if (firstVisibleInBackup) {
                        const currentIdx = items.findIndex((e) => e.id === firstVisibleInBackup.id);
                        const targetIdx = LIVE_COUNT - 1; // vị trí 6 (0-based)

                        if (currentIdx !== targetIdx && currentIdx !== -1) {
                            const [toMove] = items.splice(currentIdx, 1);
                            items.splice(targetIdx, 0, toMove);
                        }

                        items = items.map((e, idx) => ({ ...e, position: idx + 1 }));

                        message.success(
                            `Đã đẩy entry "${firstVisibleInBackup.header || firstVisibleInBackup.type}" lên vị trí live thứ 6`
                        );
                    }
                }

                return items;
            });

            setDraggingId(null);
            markDirty();
        },
        [draggingId, markDirty]
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

    const liveEntries = useMemo(
        () => sortedEntries.filter((e) => e.position <= LIVE_COUNT),
        [sortedEntries]
    );
    const backupEntries = useMemo(
        () => sortedEntries.filter((e) => e.position > LIVE_COUNT),
        [sortedEntries]
    );

    const COLUMNS_COUNT = 15;

    const tableData = useMemo(() => {
        const empty = {
            type: '',
            sport: '',
            league: '',
            event: '',
            period: '',
            gradingUnits: '',
            marketType: '',
            header: '',
            expiryDateTime: '',
            country: '',
            language: '',
            visible: false,
        };

        const liveSection = { id: 'section-live', position: '', ...empty, isSection: 'live' };
        const backupSection = { id: 'section-backup', position: '', ...empty, isSection: 'backup' };

        return [liveSection, ...liveEntries, backupSection, ...backupEntries];
    }, [liveEntries, backupEntries]);

    const columns = useMemo(() => {
        const renderSectionCell = (record: any, text?: any) => {
            if (record.isSection === 'live') {
                return { children: 'Currently live Carousel Entries', props: { colSpan: COLUMNS_COUNT } };
            }
            if (record.isSection === 'backup') {
                return { children: 'Carousel backup entries', props: { colSpan: COLUMNS_COUNT } };
            }
            return { children: text, props: { colSpan: 1 } };
        };

        const hideOnSection = (render?: (record: any, value: any) => any) => (value: any, record: any) => {
            if (record.isSection) {
                return { children: null, props: { colSpan: 0 } };
            }
            const content = render ? render(record, value) : value;
            return { children: content, props: { colSpan: 1 } };
        };

        return [
            {
                title: 'No',
                dataIndex: 'position',
                key: 'position',
                render: (_: any, record: any) => renderSectionCell(record, record.position),
            },
            {
                title: 'Drag',
                key: 'drag',
                render: hideOnSection((record) => (
                    <span
                        className="drag-handle"
                        draggable
                        onDragStart={handleDragStart(record.id)}
                    >
            ≡
          </span>
                )),
            },
            { title: 'Type', dataIndex: 'type', key: 'type', render: hideOnSection() },
            { title: 'Sport', dataIndex: 'sport', key: 'sport', render: hideOnSection() },
            { title: 'League', dataIndex: 'league', key: 'league', render: hideOnSection() },
            { title: 'Event', dataIndex: 'event', key: 'event', render: hideOnSection() },
            { title: 'Period', dataIndex: 'period', key: 'period', render: hideOnSection() },
            { title: 'Grading Units', dataIndex: 'gradingUnits', key: 'gradingUnits', render: hideOnSection() },
            { title: 'Market Type', dataIndex: 'marketType', key: 'marketType', render: hideOnSection() },
            { title: 'Header', dataIndex: 'header', key: 'header', render: hideOnSection() },
            { title: 'Expiry Date/Time', dataIndex: 'expiryDateTime', key: 'expiryDateTime', render: hideOnSection() },
            { title: 'Country', dataIndex: 'country', key: 'country', render: hideOnSection() },
            { title: 'Language', dataIndex: 'language', key: 'language', render: hideOnSection() },
            {
                title: 'Visible',
                key: 'visible',
                render: hideOnSection((record) => (
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
                render: hideOnSection((record) => (
                    <button
                        type="button"
                        className="remove-link"
                        onClick={() => handleRemove(record.id)}
                    >
                        Remove
                    </button>
                )),
            },
        ];
    }, [handleDragStart, handleToggleVisible, handleRemove]);

    return (
        <div className="carousel-page">
            <div className="carousel-page__header-bar">
                <span className="carousel-page__title">Website Carousel - Edit Mode</span>
            </div>

            <div className="carousel-page__toolbar">
                <div className="carousel-page__toolbar-left">
                    <button
                        type="button"
                        className="btn btn--primary"
                        disabled={activeCount >= MAX_POSITIONS}
                        onClick={handleAddEntry}
                    >
                        + Add Entry
                    </button>
                    <button type="button" className="btn btn--secondary">
                        Share with NEV
                    </button>
                </div>
                <div className="carousel-page__toolbar-right">
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
                        <span className="carousel-page__unsaved-label">You have unsaved changes</span>
                    )}
                </div>
            </div>

            <div className="carousel-page__table-wrapper">
                <Table
                    className="carousel-table"
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    rowKey="id"
                    rowClassName={(record: any) =>
                        record.isSection ? 'section-row' : 'carousel-row'
                    }
                    onRow={(record: any) => {
                        if (record.isSection === 'live') {
                            return {};
                        }
                        if (record.isSection === 'backup') {
                            return {
                                onDragOver: handleDragOver,
                                onDrop: handleDrop(null), // drop vào backup section → xử lý kéo xuống backup
                            };
                        }
                        return {
                            onDragOver: handleDragOver,
                            onDrop: handleDrop(record.id),
                        };
                    }}
                />
            </div>
        </div>
    );
};

export default React.memo(CarouselPage);