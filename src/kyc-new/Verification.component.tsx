import React, {forwardRef, useMemo, useRef} from 'react';
import {useSelector} from 'react-redux';
import GenericAccordion, {AccordionHandle, AccordionItem, AccordionSection} from "./generate-accordion-section";


export interface Verification extends AccordionSection {
    id: number;
    label: string;
    data: Array<AccordionItem & { isDisabled?: boolean }>;
}

const VerificationPurpose = forwardRef((props, ref) => {
    const accordionRef = useRef<AccordionHandle>(null);
    const {verificationPurpose} = useSelector((state: any) => state.kyc);

    // Expose methods to parent component
    React.useImperativeHandle(ref, () => ({
        // Chuẩn hóa API: dùng lại đúng các method từ GenericAccordion
        getData: () => accordionRef.current?.getData() || [],
        getOpenSections: () => accordionRef.current?.getOpenSections() || {},
        getSelectedItems: () => accordionRef.current?.getSelectedItems() || [],
    }));

    return (
        <GenericAccordion
            ref={accordionRef}
            sections={[...(verificationPurpose || [])]}
            config={{
                multipleOpen: true,
                autoOpenSelected: true,
                persistOpenState: true,
            }}
        />
    );
});

export default VerificationPurpose;
