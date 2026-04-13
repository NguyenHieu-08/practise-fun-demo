// shards/leg-item.component.tsx
import React, {useEffect, useState} from "react";
import {
    eventOptions,
    gradingUnitOptions,
    leagueOptions,
    Leg,
    marketTypeOptions,
    participantOptions,
    periodOptions,
    sportOptions
} from "../response-data.constant";


interface LegItemProps {
    leg: Leg;
    index: number;
    onUpdate: (id: string, field: keyof Omit<Leg, 'id'>, value: string) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
}

const LegItem: React.FC<LegItemProps> = ({leg, index, onUpdate, onRemove, canRemove}) => {

    // const [leagueOptions, setLeagueOptions] = useState<string[]>(['Select League']);
    // const [eventOptions, setEventOptions] = useState<string[]>(['Select Event']);
    // const [periodOptions, setPeriodOptions] = useState<string[]>(['Select Period']);
    // const [gradingUnitOptions, setGradingUnitOptions] = useState<string[]>(['Select Grading Unit']);
    // const [marketTypeOptions, setMarketTypeOptions] = useState<string[]>(['Select Market Type']);
    // const [participantOptions, setParticipantOptions] = useState<string[]>(['Select Participant']);

    const [loading, setLoading] = useState<Record<string, boolean>>({});

    // Cascade Disabled Logic
    const isEventDisabled = !leg.sport || leg.sport === 'Select Sport';
    const isPeriodDisabled = isEventDisabled || !leg.league || leg.league === 'Select League';
    const isGradingUnitDisabled = isPeriodDisabled || !leg.event || leg.event === 'Select Event';
    const isMarketTypeDisabled = isGradingUnitDisabled || !leg.period || leg.period === 'Select Period';
    const isParticipantDisabled = isMarketTypeDisabled || !leg.gradingUnit || leg.gradingUnit === 'Select Grading Unit';

    // Trigger API khi field trước được chọn
    useEffect(() => {
        if (leg.sport && leg.sport !== 'Select Sport') {
            // CALL API league
        }
    }, [leg.sport]);

    useEffect(() => {
        if (leg.league && leg.league !== 'Select League') {
            // CALL API event
        }
    }, [leg.league]);

    useEffect(() => {
        if (leg.event && leg.event !== 'Select Event') {
            // CALL API period
        }
    }, [leg.event]);

    useEffect(() => {
        if (leg.period && leg.period !== 'Select Period') {
            // CALL API gradingUnit
        }
    }, [leg.period]);

    useEffect(() => {
        if (leg.gradingUnit && leg.gradingUnit !== 'Select Grading Unit') {
            // CALL API marketType
        }
    }, [leg.gradingUnit]);

    useEffect(() => {
        if (leg.marketType && leg.marketType !== 'Select Market Type') {
            // CALL API participant
        }
    }, [leg.marketType]);

    return (
        <div className="mb-8 border border-gray-300 rounded-2xl p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-600">Leg {index + 1}:</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">i</span>
                </div>
                {canRemove && (
                    <button
                        onClick={() => onRemove(leg.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                        ✕ Remove Leg
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {/* Sport */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sport <span
                        className="text-red-500">*</span></label>
                    <select
                        value={leg.sport}
                        onChange={(e) => onUpdate(leg.id, 'sport', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        {sportOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* League */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">League <span
                        className="text-red-500">*</span></label>
                    <select
                        value={leg.league}
                        onChange={(e) => onUpdate(leg.id, 'league', e.target.value)}
                        disabled={isEventDisabled}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${isEventDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                        {leagueOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Event */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event <span
                        className="text-red-500">*</span></label>
                    <select
                        value={leg.event}
                        onChange={(e) => onUpdate(leg.id, 'event', e.target.value)}
                        disabled={isPeriodDisabled}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${isPeriodDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                        {eventOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Period */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period <span
                        className="text-red-500">*</span></label>
                    <select
                        value={leg.period}
                        onChange={(e) => onUpdate(leg.id, 'period', e.target.value)}
                        disabled={isGradingUnitDisabled}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${isGradingUnitDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                        {periodOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Grading Unit */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grading Unit <span
                        className="text-red-500">*</span></label>
                    <select
                        value={leg.gradingUnit}
                        onChange={(e) => onUpdate(leg.id, 'gradingUnit', e.target.value)}
                        disabled={isMarketTypeDisabled}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${isMarketTypeDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                        {gradingUnitOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Market Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Market Type <span
                        className="text-red-500">*</span></label>
                    <select
                        value={leg.marketType}
                        onChange={(e) => onUpdate(leg.id, 'marketType', e.target.value)}
                        disabled={isParticipantDisabled}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${isParticipantDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                        {marketTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Participant */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Participant <span
                        className="text-red-500">*</span></label>
                    <select
                        value={leg.participant}
                        onChange={(e) => onUpdate(leg.id, 'participant', e.target.value)}
                        disabled={isParticipantDisabled}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${isParticipantDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                        {participantOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default LegItem;