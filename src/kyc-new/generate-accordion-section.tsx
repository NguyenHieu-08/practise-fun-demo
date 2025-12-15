import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import AccordionSectionComponent from "./AccordionSection";

export interface AccordionItem {
    id: number | string;
    label: string;
    name?: string;
    isSelected?: boolean;
    isDisabled?: boolean;
}

export interface AccordionSection<T extends AccordionItem = AccordionItem> {
    id: number | string;
    label: string;
    data: T[];
}

export interface AccordionConfig {
    // Behavior
    multipleOpen?: boolean;
    autoOpenSelected?: boolean;
    persistOpenState?: boolean;

    // Styling
    className?: string;
    sectionClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    gridClassName?: string;
    itemClassName?: string;
}

interface GenericAccordionProps<T extends AccordionItem = AccordionItem> {
    sections: AccordionSection<T>[];
    config?: AccordionConfig;
    onDataChange?: (sections: AccordionSection<T>[]) => void;
}

export interface AccordionHandle<T extends AccordionItem = AccordionItem> {
    getData: () => AccordionSection<T>[];
    getOpenSections: () => Record<string | number, boolean>;
    getSelectedItems: () => T[];
    reset: () => void;
}

const GenericAccordion = forwardRef<AccordionHandle, GenericAccordionProps>(
    ({ sections, config = {}, onDataChange }, ref) => {
        const {
            multipleOpen = true,
            autoOpenSelected = true,
            persistOpenState = true,
            className = ''
        } = config as Partial<AccordionConfig>;

        const [data, setData] = useState<AccordionSection[]>(() =>
            Array.isArray(sections) ? [...sections] : []
        );
        const [openSections, setOpenSections] = useState<Record<string | number, boolean>>({});

        // Initialize data and open states
        useEffect(() => {
            const newSections = Array.isArray(sections) ? sections : [];
            setData([...newSections]);

            if (autoOpenSelected && newSections.length > 0) {
                const initialOpenState: Record<string | number, boolean> = {};
                newSections.forEach((section) => {
                    const hasSelectedItems = section.data.some(item => !!item.isSelected);
                    initialOpenState[section.id] = section.data.length > 0 && hasSelectedItems;
                });
                setOpenSections(initialOpenState);
            }
        }, [sections, autoOpenSelected]);

        // Notify parent of data changes
        useEffect(() => {
            if (onDataChange) {
                onDataChange(data);
            }
        }, [data, onDataChange]);


        // Expose methods via ref
        useImperativeHandle(ref, () => ({
            getData: () => data,
            getOpenSections: () => openSections,
            getSelectedItems: () => {
                return data.flatMap(section =>
                    section.data.filter(item => item.isSelected)
                );
            }
        }), [data, openSections]);

        // Toggle section open/close
        const handleToggleSection = (sectionId: number | string) => {
            setOpenSections(prev => {
                if (multipleOpen) {
                    return { ...prev, [sectionId]: !prev[sectionId] };
                } else {
                    // Single open mode
                    const newState: Record<string | number, boolean> = {};
                    Object.keys(prev).forEach(key => {
                        newState[key] = false;
                    });
                    newState[sectionId] = !prev[sectionId];
                    return newState;
                }
            });
        };

        // Toggle individual item selection
        const handleToggleItem = (sectionId: number | string, itemId: number | string) => {
            setData(prev =>
                prev.map(section => {
                    if (section.id !== sectionId) return section;

                    const itemIndex = section.data.findIndex(item => item.id === itemId);
                    if (itemIndex === -1) return section;

                    const item = section.data[itemIndex];
                    if (item.isDisabled) return section;

                    const newData = [...section.data];
                    newData[itemIndex] = {
                        ...item,
                        isSelected: !item.isSelected
                    };

                    return { ...section, data: newData };
                })
            );
        };

        // Handle header checkbox change
        const handleHeaderCheckboxChange = (sectionId: number | string, checked: boolean) => {
            setData(prev =>
                prev.map(section => {
                    if (section.id !== sectionId) return section;

                    const newData = section.data.map(item => ({
                        ...item,
                        isSelected: item.isDisabled ? item.isSelected : checked
                    }));

                    return { ...section, data: newData };
                })
            );

            // Auto-open section when selecting all
            if (checked && persistOpenState) {
                setOpenSections(prev => ({ ...prev, [sectionId]: true }));
            }
        };

        // Check if header checkbox is checked
        const isHeaderChecked = (section: any): boolean => {
            return section.data.length === 0
                ? (openSections[section.id] ?? false)
                : section.data.some(doc => doc.isSelected);
        }

        return (
            <div className={`generic-accordion ${className}`.trim()}>
                {data.map((section, index) => {
                    const isOpen = openSections[section.id] && section.data.length > 0;

                    return (
                        <AccordionSectionComponent
                            key={section.id ?? `section-${index}`}
                            section={section}
                            isOpen={isOpen}
                            hasSelectedItems={isHeaderChecked(section)}
                            onToggleSection={() => handleToggleSection(section.id)}
                            onToggleItem={(itemId) => handleToggleItem(section.id, itemId)}
                            onHeaderCheckboxChange={(checked) =>
                                handleHeaderCheckboxChange(section.id, checked)
                            }
                            config={config}
                        />
                    );
                })}
            </div>
        );
    }
);

GenericAccordion.displayName = 'GenericAccordion';

export default GenericAccordion;