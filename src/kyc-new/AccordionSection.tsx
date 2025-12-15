import React from 'react';
import {AccordionConfig, AccordionItem, AccordionSection} from "./generate-accordion-section";

interface AccordionSectionComponentProps<T extends AccordionItem> {
    key?: any,
    section: AccordionSection<T>;
    isOpen: boolean;
    hasSelectedItems: boolean;
    onToggleSection: () => void;
    onToggleItem: (itemId: number | string) => void;
    onHeaderCheckboxChange: (checked: boolean) => void;
    config?: AccordionConfig;
}

function AccordionSectionComponent<T extends AccordionItem>({
                                                                section,
                                                                isOpen,
                                                                hasSelectedItems,
                                                                onToggleSection,
                                                                onToggleItem,
                                                                onHeaderCheckboxChange,
                                                                config = {}
                                                            }: AccordionSectionComponentProps<T>) {
    const {
        sectionClassName = '',
        headerClassName = '',
        bodyClassName = '',
        gridClassName = 'accordion-section-document-grid',
        itemClassName = 'accordion-section-document-item'
    } = config;

    const hasItems = section.data.length > 0;
    const displayLabel = section.label || '';

    // Check if header checkbox should be disabled (when a disabled item is selected)
    const isHeaderDisabled = [...(section.data || [])].some(
        item => item.isDisabled && item.isSelected
    );

    return (
        <div className={`accordion-section ${sectionClassName}`.trim()}>
            <div
                className={`accordion-section-header ${headerClassName}`.trim()}
                onClick={() => hasItems && onToggleSection()}
                style={{ cursor: hasItems ? 'pointer' : 'default' }}
            >
                <div className="accordion-section-header-content">
                    <input
                        type="checkbox"
                        checked={hasSelectedItems}
                        disabled={isHeaderDisabled}
                        onChange={(e) => {
                            e.stopPropagation();
                            onHeaderCheckboxChange(e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="accordion-section-checkbox"
                    />
                    <span className="accordion-section-label">{displayLabel}</span>
                </div>

                {hasItems && (
                    <span className="accordion-section-toggle-icon">
                        {isOpen ? '−' : '+'}
                    </span>
                )}
            </div>

            {isOpen && hasItems && (
                <div className={`accordion-section-body ${bodyClassName}`.trim()}>
                    <div className={gridClassName}>
                        {section.data.map((item) => {
                            const itemLabel = item.name || item.label || '';
                            return (
                                <label
                                    key={item.id}
                                    className={`${itemClassName} ${
                                        item.isDisabled ? 'disabled' : ''
                                    }`.trim()}
                                >
                                    <input
                                        type="checkbox"
                                        checked={item.isSelected || false}
                                        disabled={item.isDisabled || false}
                                        onChange={() => onToggleItem(item.id)}
                                    />
                                    <span>{itemLabel}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccordionSectionComponent;