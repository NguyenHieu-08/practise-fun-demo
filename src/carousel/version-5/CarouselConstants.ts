// ===================== CONSTANTS =====================

export const DEFAULT_MAX_POSITIONS = 16;
export const DEFAULT_LIVE_COUNT = 6;
export const DEFAULT_TITLE = 'Carousel - Edit Mode';
export const DEFAULT_UNSAVED_MESSAGE = 'You have unsaved changes';

export const SECTION_TYPES = {
    LIVE: 'live',
    BACKUP: 'backup',
};

export const BUTTON_TYPES: Record<string, string> = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
};

export const CSS_CLASSES: Record<string, string> = {
    PAGE: 'carousel-page',
    HEADER_BAR: 'carousel-page__header-bar',
    TITLE: 'carousel-page__title',
    TOOLBAR: 'carousel-page__toolbar',
    TOOLBAR_LEFT: 'carousel-page__toolbar-left',
    TOOLBAR_RIGHT: 'carousel-page__toolbar-right',
    UNSAVED_LABEL: 'carousel-page__unsaved-label',
    TABLE_WRAPPER: 'carousel-page__table-wrapper',
    TABLE: 'carousel-table',
    SECTION_ROW: 'section-row',
    CAROUSEL_ROW: 'carousel-row',
    INVALID_DROP: 'invalid-live-drop-target',
    DRAG_HANDLE: 'drag-handle',
};

export const BUTTON_LABELS: Record<string, string> = {
    SAVE: 'Save Changes',
    CANCEL: 'Cancel',
    ADD: '+ Add Entry',
};
