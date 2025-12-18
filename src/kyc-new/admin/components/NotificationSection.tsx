import React, { useState, useMemo, useCallback } from 'react';

interface NotificationOption {
    id: string;
    label: string;
    checked: boolean;
    type: 'toggle' | 'checkbox';
}

const NotificationSection: React.FC = () => {
    const [options, setOptions] = useState<NotificationOption[]>([
        { id: '1', label: 'Default Notification', checked: true, type: 'toggle' },
        { id: '2', label: 'Email', checked: false, type: 'checkbox' },
        { id: '3', label: 'Personal Message', checked: false, type: 'checkbox' },
        { id: '4', label: 'On-Screen Announcement', checked: false, type: 'checkbox' },
    ]);

    const handleToggle = useCallback((id: string) => {
        setOptions(prev => prev.map(opt => opt.id === id ? { ...opt, checked: !opt.checked } : opt));
    }, []);

    return (
        <div className="section-card">
            <div className="section-card__header">
                <h3 className="section-card__title">NOTIFICATION</h3>
                <button className="btn btn--secondary">EDIT</button>
            </div>
            <div className="section-card__body">
                <div className="notification-list">
                    {options.map(option => (
                        <div key={option.id} className="notification-item">
                            <label className="notification-item__label">{option.label}</label>
                            {option.type === 'toggle' ? (
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={option.checked}
                                        onChange={() => handleToggle(option.id)}
                                        className="toggle-switch__input"
                                    />
                                    <span className={`toggle-switch__slider ${option.checked ? 'toggle-switch__slider--active' : ''}`}></span>
                                </label>
                            ) : (
                                <input
                                    type="checkbox"
                                    checked={option.checked}
                                    onChange={() => handleToggle(option.id)}
                                    className="checkbox-field"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(NotificationSection);

