import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {useSelector} from "react-redux";

const VerificationComponent = forwardRef((props, ref) => {
    const { verificationPurposeData } = useSelector((state) => state.kyc);
    const [verifiesPurpose, setVerifiesPurpose ] = useState([]);
    const [openSections, setOpenSections] = useState({});


    useEffect(() => {
        if(verificationPurposeData && verificationPurposeData.length > 0) {
            setVerifiesPurpose([...verificationPurposeData]);

            setOpenSections(() => {
                const initial = {};
                [...verificationPurposeData].forEach(section => {
                    initial[section.id] = section.documents.length > 0 && section.documents?.some(doc => doc.isSelected) !== false;
                });
                return initial;
            });
        }
    }, [verificationPurposeData]);

    // Expose dữ liệu ra ngoài qua ref
    useImperativeHandle(ref, () => ({
        getVerificationPurpose: () => verifiesPurpose,
        getOpenSections: () => openSections
    }));

    const onToggleSection = (key) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };


    const onToggleDocument = (sectionId, docIndex) => {
        setVerifiesPurpose(prev =>
            prev.map(section => {
                if (section.id !== sectionId) return section;

                const doc = section.documents[docIndex];
                if (doc?.isDisabled) return section;

                const newDocuments = [...section.documents];
                newDocuments[docIndex] = {
                    ...doc,
                    isSelected: !doc.isSelected
                };

                return { ...section, documents: newDocuments };
            })
        );
    };

    const handleVerificationHeaderChange = (e, sectionId) => {
        const isChecked = e.target.checked;

        setVerifiesPurpose(prev =>
            prev.map(section => {
                if (section.id !== sectionId) return section;

                // Nếu section KHÔNG có document (như Selfie)
                if (section.documents.length === 0) {
                    return section; // không cần thay đổi documents
                }

                // Nếu có document → chỉ bật/tắt những cái không bị disabled
                const newDocuments = section.documents.map(doc => ({
                    ...doc,
                    isSelected: doc.isDisabled ? doc.isSelected : isChecked
                }));

                return { ...section, documents: newDocuments };
            })
        );

        // Luôn mở section khi tick (kể cả Selfie)
        if (isChecked) {
            setOpenSections(prev => ({ ...prev, [sectionId]: true }));
        }
    };

    return (
        <div className="verification">
            <h3 className="verification__title">Specify Verification Purpose</h3>

            {verifiesPurpose.map(section => {
                const total = section.documents.length;
                const isOpen = openSections[section.id] && total > 0;

                return (
                    <div key={section.id} className="verification__section">
                        <div
                            className="verification__header"
                            onClick={() => total > 0 && onToggleSection(section.id)}
                        >
                            <div className="section-title">
                                <input
                                    type="checkbox"
                                    checked={
                                        section.documents.length === 0
                                            ? openSections[section.id] ?? false
                                            : section.documents.some(doc => doc.isSelected)
                                    }
                                    disabled={section.documents.some(doc => doc.isDisabled && doc.isSelected)}
                                    onChange={(e) => handleVerificationHeaderChange(e, section.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="section-checkbox"
                                />
                                {section.label}
                            </div>
                            <span className="toggle-icon">
                                {total > 0 ? (isOpen ? '−' : '+') : ''}
                            </span>
                        </div>

                        {isOpen && (
                            <div className="verification__body">
                                {section.documents.length === 0 ? (
                                    <p className="empty">No documents required</p>
                                ) : (
                                    <div className="verification__document-grid">
                                        {section.documents.map((doc, idx) => (
                                            <label
                                                key={idx}
                                                className="verification__document-item"
                                                data-disabled={doc.isDisabled}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={doc.isSelected}
                                                    onChange={() => onToggleDocument(section.id, idx)}
                                                    disabled={doc.isDisabled}
                                                />
                                                <span>{doc.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});

export default VerificationComponent;