import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    verificationPurposeData: {},
    verificationPurposeLoading: false,
    verificationPurposeError: null,
    blockingRuleData: {},
    blockingRuleLoading: false,
    blockingRuleError: null,
    notificationData: {},
    notificationLoading: false,
    notificationError: null,
};

const KYCSlice = createSlice({
    name: 'kyc',
    initialState,
    reducers: {
        fetchBlockingRulesStart(state, action) {
            state.blockingRuleLoading = true;
            state.blockingRuleError = null;
        },
        fetchBlockingRulesSuccess(state, action) {
            const apiData = action.payload;
            state.blockingRuleLoading = false;
            state.blockingRuleData = Object.fromEntries(
                Object.entries(apiData).map(([key, value]) => [
                    key,
                    {
                        value: Boolean(value),
                        isDisabled: value === true,
                    },
                ])
            );
        },
        fetchBlockingRulesFailure(state, action) {
            state.blockingRuleLoading = false;
            state.blockingRuleError = action.payload;
        },


        // Notification
        fetchNotificationStart(state, action) {
            state.notificationLoading = true;
            state.notificationError = null;
        },
        fetchNotificationSuccess(state, action) {
            state.notificationLoading = false;
            const data = action.payload || [];
            let result = {
                enabled: false,
                channels: []
            };
            if (Object.keys(data).length > 0) {
                result = {
                    enabled: data.some(item => item.isSelected === true),
                    channels: [...data].map(item => ({
                        ...item,
                        isDisabled: item.isSelected === true
                    }))
                };
            }
            state.notificationData = {...result}
        },
        fetchNotificationFailure(state, action) {
            state.notificationLoading = false;
            state.notificationError = action.payload;
        },

        // Verification Purpose
        fetchVerificationPurposeStart(state, action) {
            state.verificationPurposeLoading = true;
            state.verificationPurposeError = null;
        },
        fetchVerificationPurposeSuccess(state, action) {
            state.verificationPurposeLoading = false;
            const data = [...(action.payload || [])].map(payload => ({
                ...payload,
                documents: payload?.documents.map(doc => ({
                    ...doc,
                    isDisabled: doc.isSelected
                }))
            })) || [];
            state.verificationPurposeData = [...data]
        },
        fetchVerificationPurposeFailure(state, action) {
            state.verificationPurposeLoading = false;
            state.verificationPurposeError = action.payload;
        }

    },
});

export const {
    fetchBlockingRulesStart,
    fetchBlockingRulesSuccess,
    fetchBlockingRulesFailure,

    fetchNotificationStart,
    fetchNotificationSuccess,
    fetchNotificationFailure,

    fetchVerificationPurposeStart,
    fetchVerificationPurposeSuccess,
    fetchVerificationPurposeFailure


} = KYCSlice.actions;

export default KYCSlice.reducer;