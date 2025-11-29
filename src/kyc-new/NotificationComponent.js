import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {useSelector} from "react-redux";

const NotificationComponent = forwardRef((props, ref) => {
    const {notificationData} = useSelector(
        (state) => state.kyc
    );
    const [notification, setNotification] = useState({
        enabled: false,
        channels: []
    });
    const [isOpened, setIsOpened] = useState(false);

    useEffect(() => {
        if(notificationData && Object.keys(notificationData).length > 0) {
            setNotification({...notificationData});
            setIsOpened(notificationData.enabled);
        }
    }, [notificationData])

    // Expose dữ liệu ra ngoài qua ref
    useImperativeHandle(ref, () => ({
        getNotification: () => notification,
        isEnabled: () => notification.enabled,
    }));

    const handleToggleEnabled = (e) => {
        e.preventDefault();
        setIsOpened(prev => !prev);
    }

    const handleSendNotificationChange = (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setIsOpened(isChecked);
        }

        setNotification(prev => ({
            ...prev,
            enabled: isChecked,
            channels: prev.channels.map(notify => ({
                ...notify,
                isSelected: notify.isDisabled ? notify.isSelected : isChecked
            }))
        }));
    }

    const onToggleChannel = (key) => {
        setNotification(prev => {
            const newChannels = prev.channels.map(notify => {
                if (notify.id !== key) return notify;
                return { ...notify, isSelected: !notify.isSelected };
            });
            const hasAnySelected = newChannels.some(notify => notify.isSelected);

            return {
                ...prev,
                channels: newChannels,
                enabled: hasAnySelected,
            };
        });
    };

    return (
        <div className="notification">
            <div
                className="notification__header"
                onClick={handleToggleEnabled}
            >
                <div className="toggle-title">
                    <input
                        type="checkbox"
                        checked={notification.enabled}
                        onChange={(e) => handleSendNotificationChange(e)}
                        onClick={(e) => e.stopPropagation()}
                        className="toggle-checkbox"
                    />
                    Send Notification
                </div>
                <span className="toggle-icon">
                    {isOpened ? '−' : '+'}
                </span>
            </div>

            {isOpened && notification.channels.length > 0 && (
                <div className="notification__body">
                    <div className="channel-grid">
                        {(notification.channels || []).map(notify => (
                            <label key={notify.id} htmlFor={notify.id}>
                                <input
                                    id={notify.id}
                                    type="checkbox"
                                    checked={notify.isSelected}
                                    disabled={notify.isDisabled}
                                    onChange={() => onToggleChannel(notify.id)}
                                />
                                <span>{notify.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});

export default NotificationComponent;