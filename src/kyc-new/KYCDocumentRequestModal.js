import React, {useEffect, useRef} from 'react';
import BlockingRulesComponent from './BlockingRulesComponent';
import {fetchBlockingRulesStart, fetchNotificationStart, fetchVerificationPurposeStart} from "./shard/KYCSlice";
import {useDispatch} from 'react-redux';
import './KYCDocumentRequest.scss';
import VerificationPurpose from "./Verification.component";
import NotificationMethod from "./Notification.component";

const KYCDocumentRequestModal = ({isOpen, onClose, onCreate}) => {
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
            verifies: {},       // { sectionId: [docId1, docId2] } hoặc { sectionId: [0] } nếu mở mà không chọn doc
            notification: [],   // [channelId1, channelId2]
            blockingRules: {}   // { ruleKey: true/false }
        };

        // ==================== 1. NOTIFICATION ====================
        const notificationData = notificationRef.current?.getData?.() || [];

        // Lấy tất cả các channel được chọn từ tất cả các section (thường chỉ có 1 section)
        const selectedChannelIds = notificationData
            .flatMap(section => section.data)
            .filter(item => item.isSelected)
            .map(item => parseInt(item.id))
        ;

        if (selectedChannelIds.length > 0) {
            payload.notification = selectedChannelIds;
        } else {
            // Nếu không chọn channel nào → có thể bỏ key hoặc gửi mảng rỗng tùy backend
            delete payload.notification; // hoặc giữ [] tùy yêu cầu API
        }

        // ==================== 2. VERIFICATION PURPOSE ====================
        const verificationData = verificationPurposeRef.current?.getData?.() || [];
        const openSections = verificationPurposeRef.current?.getOpenSections?.() || {};

        let hasAnyVerification = false;

        verificationData.forEach(section => {
            const sectionId = section.id;

            const selectedDocs = section.data
                .filter((doc) => doc.isSelected)
                .map((doc) => doc.id);

            if (selectedDocs.length > 0) {
                payload.verifies[sectionId] = selectedDocs;
                hasAnyVerification = true;
                return;
            }

            if (section.data.length === 0 && openSections[sectionId]) {
                payload.verifies[sectionId] = [0];
                hasAnyVerification = true;
            }
        });

        // Nếu không có verification nào được chọn/mở → xóa key verifies
        if (!hasAnyVerification) {
            delete payload.verifies;
        }

        // ==================== 3. BLOCKING RULES ====================
        const blockingRulesData = blockingRuleRef.current?.getBlockingRules?.();
        if (blockingRulesData && typeof blockingRulesData === 'object') {
            payload.blockingRules = extractBooleanValues(blockingRulesData);
        } else {
            delete payload.blockingRules;
        }

        // ==================== GỬI DỮ LIỆU ====================
        console.log("Payload gửi về backend:", payload);
        onCreate?.(payload);
        alert("Lưu thành công!");
    };

    // Helper function – giữ nguyên hoặc cải thiện nhẹ
    function extractBooleanValues(data) {
        const result = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                result[key] = !!data[key].value; // ép về boolean chắc chắn
            }
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
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '28px',
                        cursor: 'pointer'
                    }}>×
                    </button>
                </div>

                <div style={{padding: '24px'}}>
                    {/*<VerificationComponent ref={verificationPurposeRef}/>*/}
                    <VerificationPurpose ref={verificationPurposeRef}/>

                    <BlockingRulesComponent ref={blockingRuleRef}/>

                    {/*<NotificationComponent ref={notificationRef}/>*/}
                    <NotificationMethod ref={notificationRef}/>

                    <div style={{textAlign: 'right', paddingTop: '20px', borderTop: '1px solid #eee'}}>
                        <button onClick={onClose} style={{
                            padding: '10px 20px',
                            marginRight: '12px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>Close
                        </button>
                        <button onClick={handleCreate} style={{
                            padding: '10px 28px', backgroundColor: '#007bff', color: 'white',
                            border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                        }}>Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KYCDocumentRequestModal;