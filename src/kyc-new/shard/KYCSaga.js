import { call, put, takeLatest } from 'redux-saga/effects';
import {
    fetchBlockingRulesStart,
    fetchBlockingRulesSuccess,
    fetchBlockingRulesFailure, fetchNotificationSuccess, fetchNotificationFailure, fetchNotificationStart,
    fetchVerificationPurposeFailure, fetchVerificationPurposeStart, fetchVerificationPurposeSuccess,
} from './KYCSlice';

function* fetchBlockingRulesSaga(action) {
    const ruleId = action.payload;
    try {
        const response = yield call(
            fetch,
            `http://localhost:3000/blockingRules/${ruleId}`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = yield response.json();

        yield put(fetchBlockingRulesSuccess(data));
    } catch (error) {
        yield put(fetchBlockingRulesFailure(error.message));
    }
}

function* fetchNotificationSaga() {
    try {
        const response = yield call(
            fetch,
            `http://localhost:3000/notification`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = yield response.json();

        yield put(fetchNotificationSuccess(data));
    } catch (error) {
        yield put(fetchNotificationFailure(error.message));
    }
}

function* fetchVerificationPurposeSaga() {
    try {
        const response = yield call(
            fetch,
            `http://localhost:3000/verificationPurposes`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = yield response.json();

        yield put(fetchVerificationPurposeSuccess(data));
    } catch (error) {
        yield put(fetchVerificationPurposeFailure(error.message));
    }
}

export function* KYCSaga() {
    yield takeLatest(fetchBlockingRulesStart, fetchBlockingRulesSaga);
    yield takeLatest(fetchNotificationStart, fetchNotificationSaga);
    yield takeLatest(fetchVerificationPurposeStart, fetchVerificationPurposeSaga);
}