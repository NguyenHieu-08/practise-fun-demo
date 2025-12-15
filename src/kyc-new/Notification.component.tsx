import React from 'react';
import GenericAccordion, {AccordionHandle, AccordionItem, AccordionSection} from "./generate-accordion-section";
import {forwardRef, useImperativeHandle, useRef} from "react";
import {useSelector} from "react-redux";

export interface Notification extends AccordionSection {
    label: string;
    data: Array<AccordionItem>;
}

interface PropsModal {
    isFormEditable?: boolean;
    isView?: boolean;
}

const NotificationMethod = forwardRef<any, PropsModal>(
    ({isFormEditable = false}, ref) => {
        const accordionRef = useRef<AccordionHandle>(null);
        const {notificationMethods} = useSelector((state: any) => state.kyc);

        useImperativeHandle(ref, () => ({
            // Chuẩn hóa API: dùng lại đúng các method từ GenericAccordion
            getData: () => accordionRef.current?.getData() || [],
            getOpenSections: () => accordionRef.current?.getOpenSections() || {},
        }));

        return (
            <GenericAccordion
                ref={accordionRef}
                sections={notificationMethods || []}
                config={{
                    multipleOpen: false, // Single section mode
                    autoOpenSelected: true,
                    persistOpenState: true,
                }}
            />
        );
    }
);

export default NotificationMethod;