
import React, {useEffect, useRef, useState} from 'react';
import VerificationComponent from './VerificationComponent';
import BlockingRulesComponent from './BlockingRulesComponent';
import NotificationComponent from './NotificationComponent';
import {fetchBlockingRulesStart, fetchNotificationStart, fetchVerificationPurposeStart} from "./shard/KYCSlice";
import { useDispatch } from 'react-redux';
import './KYCDocumentRequest.scss';

const KYCDocumentRequestModal = ({ isOpen, onClose, onCreate }) => {
    const dispatch = useDispatch();

    const blockingRuleRef = useRef();
    const notificationRef = useRef();
    const verificationPurposeRef = useRef();

    useEffect(() => {
        dispatch(fetchBlockingRulesStart(1));
        dispatch(fetchNotificationStart());
        dispatch(fetchVerificationPurposeStart());
    }, []);

    const handleCreate = () => {

        const payload = {
            verifies: {},        // ← KHỞI TẠO NGAY TỪ ĐẦU → không bao giờ undefined
            notification: [],
            blockingRules: {}
        };

        // === 1. Notification ===
        if (notificationRef.current?.isEnabled()) {
            payload.notification = notificationRef.current?.getNotification()
                .channels.filter(notify => notify.isSelected)
                .map(notify => parseInt(notify.id));
        }

        // === 2. Verification Purpose ===
        const verificationData = verificationPurposeRef.current?.getVerificationPurpose() || [];
        const openSections = verificationPurposeRef.current?.getOpenSections() || {};

        verificationData.forEach(section => {
            const sectionId = section.id;

            if (section.documents.length > 0) {
                const selectedDocIds = section.documents
                    .filter(doc => doc.isSelected)
                    .map(doc => doc.id);

                if (selectedDocIds.length > 0) {
                    payload.verifies[sectionId] = selectedDocIds;
                }
            } else {
                if (openSections[sectionId]) {
                    payload.verifies[sectionId] = [0];
                }
            }
        });

        if (Object.keys(payload.verifies).length === 0) {
            delete payload.verifies;
        }

        // === 3. Blocking Rules ===
        payload.blockingRules = extractBooleanValues(blockingRuleRef.current?.getBlockingRules());
        onCreate?.(payload);
        console.log("Gửi về backend:", payload);
        alert("Lưu thành công!");
    };

    function extractBooleanValues(data) {
        const result = {};
        for (const key in data) {
            result[key] = data[key].value;
        }
        return result;
    }


    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px', fontFamily: 'Segoe UI, Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: '#fff', borderRadius: '8px', maxWidth: '900px',
                maxHeight: '90vh', overflow: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                <div style={{
                    backgroundColor: '#007bff', color: 'white', padding: '16px 20px',
                    fontSize: '18px', fontWeight: 'bold', borderRadius: '8px 8px 0 0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <span>Create new KYC Document Request</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ padding: '24px' }}>
                    <VerificationComponent ref={verificationPurposeRef}/>

                    <BlockingRulesComponent ref={blockingRuleRef}/>

                    <NotificationComponent ref={notificationRef}/>

                    <div style={{ textAlign: 'right', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                        <button onClick={onClose} style={{
                            padding: '10px 20px', marginRight: '12px',
                            backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
                        }}>Close</button>
                        <button onClick={handleCreate} style={{
                            padding: '10px 28px', backgroundColor: '#007bff', color: 'white',
                            border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                        }}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KYCDocumentRequestModal;