import React, { useState, useMemo, useCallback } from 'react';
import BrandSelector from './components/BrandSelector';
import PurposeSection from './components/PurposeSection';
import DocumentTypeSection from './components/DocumentTypeSection';
import BlockingRuleSection from './components/BlockingRuleSection';
import NotificationSection from './components/NotificationSection';
import VolunteerUploadSection from './components/VolunteerUploadSection';
import CancelReasonSection from './components/CancelReasonSection';
import './KYCAdminPage.scss';

const KYCAdminPage: React.FC = () => {
    const [selectedBrand, setSelectedBrand] = useState('Pinacle888');

    const handleBrandChange = useCallback((brand: string) => {
        setSelectedBrand(brand);
    }, []);

    return (
        <div className="kyc-admin-page">
            <div className="kyc-admin-page__header">
                <BrandSelector 
                    selectedBrand={selectedBrand} 
                    onBrandChange={handleBrandChange} 
                />
            </div>

            <div className="kyc-admin-page__content">
                <div className="kyc-admin-page__row">
                    <div className="kyc-admin-page__col kyc-admin-page__col--left">
                        <PurposeSection />
                    </div>
                    <div className="kyc-admin-page__col kyc-admin-page__col--right">
                        <DocumentTypeSection />
                    </div>
                </div>

                <div className="kyc-admin-page__row">
                    <div className="kyc-admin-page__col kyc-admin-page__col--full">
                        <BlockingRuleSection />
                    </div>
                </div>

                <div className="kyc-admin-page__row">
                    <div className="kyc-admin-page__col kyc-admin-page__col--left">
                        <NotificationSection />
                    </div>
                    <div className="kyc-admin-page__col kyc-admin-page__col--right">
                        <VolunteerUploadSection />
                    </div>
                </div>

                <div className="kyc-admin-page__row">
                    <div className="kyc-admin-page__col kyc-admin-page__col--left">
                        <CancelReasonSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(KYCAdminPage);

