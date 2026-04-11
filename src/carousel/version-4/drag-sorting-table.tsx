import React, {useMemo} from 'react';
import type {DragEndEvent} from '@dnd-kit/core';
import {DndContext} from '@dnd-kit/core';
import type {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {SortableContext, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Table} from 'antd';

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

const DragSortingTable = <T extends { id: string }>(props: DragSortingTableProps<T>) => {
    const {
        columns,
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
        } = useSortable({id: rowId, disabled});

        const style: React.CSSProperties = {
            ...rowProps.style,
            transform: CSS.Translate.toString(transform),
            transition,
            ...(isDragging ? {position: 'relative', zIndex: 9999} : {}),
        };

        const contextValue = useMemo<RowContextProps>(
            () => ({setActivatorNodeRef, listeners}),
            [setActivatorNodeRef, listeners],
        );

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
            modifiers={[restrictToVerticalAxis]}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragCancel={onDragCancel}
            onDragEnd={onDragEnd}
        >
            <SortableContext items={sortableIds} strategy={verticalListSortingStrategy} children={undefined}>
                <Table<T>
                    rowKey={rowKey}
                    components={{body: {row: Row}}}
                    columns={columns}
                    dataSource={dataSource}
                    virtual={true}
                    {...rest}
                />
            </SortableContext>
        </DndContext>
    );
};

export default DragSortingTable;