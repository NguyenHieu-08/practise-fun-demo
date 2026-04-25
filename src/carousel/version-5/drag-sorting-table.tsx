import React, { useCallback, useMemo, useState, useRef } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import {restrictToVerticalAxis, restrictToParentElement, restrictToFirstScrollableAncestor} from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Empty, Table } from 'antd';
import { Resizable } from 'react-resizable';
import type { ResizeCallbackData } from 'react-resizable';

export interface RowContextProps {
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
    listeners?: SyntheticListenerMap;
}

export const RowContext = React.createContext<RowContextProps>({});

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
    record?: any;
}

interface DragSortingTableProps<T extends { id: string }> {
    columns: any[];
    dataSource: T[];
    sortableIds: string[];
    onDragEnd: (event: DragEndEvent) => void;
    onDragStart?: (event: any) => void;
    onDragOver?: (event: any) => void;
    onDragCancel?: () => void;
    rowKey?: string;
    isSectionRow?: (record: T) => boolean;
    [key: string]: any;
}

// ==================== RESIZABLE HEADER ====================

const ResizableTitle = (props: any) => {
    const { onResize, width, resizable = true, ...restProps } = props;

    if (!resizable || width === undefined || width === null) {
        return <th {...restProps} style={{ cursor: 'default', ...restProps.style }} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={<span className="react-resizable-handle" onClick={(e) => e.stopPropagation()} />}
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

// ==================== MAIN COMPONENT ====================

const DragSortingTable = <T extends { id: string }>(props: DragSortingTableProps<T>) => {
    const {
        columns: originalColumns,
        dataSource,
        sortableIds,
        onDragEnd,
        onDragStart,
        onDragOver,
        onDragCancel,
        rowKey = 'id',
        isSectionRow = () => false,
        ...rest
    } = props;

    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const liveWidthsRef = useRef<Record<string, number>>({});   // Dùng ref để preview mượt

    // Handle resize - tối ưu cao nhất
    const handleResize = useCallback((key: string, minWidth: number = 60) => {
        return (_: any, { size }: ResizeCallbackData) => {
            // Cập nhật ref ngay lập tức để preview mượt (không gây re-render)
            liveWidthsRef.current[key] = Math.max(minWidth, Math.round(size.width));

            // Chỉ update state sau một khoảng thời gian ngắn (debounce nhẹ)
            if (!window.requestIdleCallback) {
                setTimeout(() => {
                    setColumnWidths(prev => ({ ...prev, [key]: liveWidthsRef.current[key] }));
                }, 8);
            } else {
                requestIdleCallback(() => {
                    setColumnWidths(prev => ({ ...prev, [key]: liveWidthsRef.current[key] }));
                });
            }
        };
    }, []);

    // Tạo columns
    const columns = useMemo(() => {
        return originalColumns.map((col: any) => {
            const key = col.key || col.dataIndex;
            const minW = col.minWidth || 60;
            const isResizable = col.resizable !== false;

            // Sử dụng width từ ref trước để preview nhanh
            const currentWidth = liveWidthsRef.current[key] ?? (columnWidths[key] ?? col.width);

            return {
                ...col,
                width: currentWidth,

                onHeaderCell: (columnFromAntd: any) => {
                    const baseProps = typeof col.onHeaderCell === 'function'
                        ? col.onHeaderCell(columnFromAntd) || {}
                        : {};

                    if (!isResizable) {
                        return { ...baseProps, width: currentWidth, resizable: false };
                    }

                    return {
                        ...baseProps,
                        width: currentWidth,
                        onResize: handleResize(key, minW),
                        resizable: true,
                    };
                },
            };
        });
    }, [originalColumns, columnWidths, handleResize]);

    // Row component
    const Row: React.FC<RowProps> = (rowProps) => {
        const record = rowProps.record as T | undefined;
        const rowId = rowProps['data-row-key'];
        const disabled = !record || isSectionRow(record);

        const {
            attributes,
            listeners,
            setNodeRef,
            setActivatorNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: rowId, disabled });

        const style: React.CSSProperties = {
            ...rowProps.style,
            transform: CSS.Translate.toString(transform),
            transition,
            ...(isDragging ? { position: 'relative', zIndex: 999 } : {}),
        };

        const contextValue = useMemo(() => ({ setActivatorNodeRef, listeners }), [setActivatorNodeRef, listeners]);

        return (
            <RowContext.Provider value={contextValue}>
                <tr
                    {...rowProps}
                    ref={setNodeRef}
                    style={style}
                    className={`${rowProps.className || ''} ${isDragging ? 'dragging-row' : ''}`.trim()}
                    {...(!disabled ? attributes : {})}
                />
            </RowContext.Provider>
        );
    };

    return (
        <DndContext
            modifiers={[restrictToVerticalAxis,restrictToFirstScrollableAncestor, restrictToParentElement]}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragCancel={onDragCancel}
            onDragEnd={onDragEnd}
        >
            <SortableContext items={sortableIds} strategy={verticalListSortingStrategy} children={undefined}>
                <Table<T>
                    rowKey={rowKey}
                    components={{
                        header: { cell: ResizableTitle },
                        body: { row: Row },
                    }}
                    columns={columns}
                    dataSource={dataSource}
                    locale={{ emptyText: <Empty description="No data" image={null} /> }}
                    scroll={{ x: 'max-content' }}
                    {...rest}
                />
            </SortableContext>
        </DndContext>
    );
};

export default DragSortingTable;