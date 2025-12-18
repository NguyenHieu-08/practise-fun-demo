import React, { useState, useMemo, useCallback } from 'react';

interface VolunteerUploadOption {
    id: string;
    label: string;
    checked: boolean;
    type: 'toggle' | 'checkbox';
}

const VolunteerUploadSection: React.FC = () => {
    const [options, setOptions] = useState<VolunteerUploadOption[]>([
        { id: '1', label: 'Customer Volunteer Upload', checked: true, type: 'toggle' },
        { id: '2', label: 'Proof of Identity', checked: false, type: 'checkbox' },
        { id: '3', label: 'Proof of Address', checked: false, type: 'checkbox' },
        { id: '4', label: 'Selfie', checked: false, type: 'checkbox' },
    ]);

    const handleToggle = useCallback((id: string) => {
        setOptions(prev => prev.map(opt => opt.id === id ? { ...opt, checked: !opt.checked } : opt));
    }, []);

    return (
        <div className="section-card">
            <div className="section-card__header">
                <h3 className="section-card__title">VOLUNTEER UPLOAD</h3>
                <button className="btn btn--secondary">EDIT</button>
            </div>
            <div className="section-card__body">
                <div className="volunteer-upload-list">
                    {options.map(option => (
                        <div key={option.id} className="volunteer-upload-item">
                            <label className="volunteer-upload-item__label">{option.label}</label>
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

export default React.memo(VolunteerUploadSection);

