import React from "react";
import {
    eventOptions,
    gradingUnitOptions,
    leagueOptions, Leg,
    marketTypeOptions, participantOptions, periodOptions,
    sportOptions
} from "../response-data.constant";


const LegItem: React.FC<{
    leg: Leg;
    index: number;
    onUpdate: (id: string, field: keyof Omit<Leg, 'id'>, value: string) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
}> = ({ leg, index, onUpdate, onRemove, canRemove }) => (
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
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport <span className="text-red-500">*</span></label>
                <select value={leg.sport} onChange={(e) => onUpdate(leg.id, 'sport', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                    {sportOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grading Unit <span className="text-red-500">*</span></label>
                <select value={leg.gradingUnit} onChange={(e) => onUpdate(leg.id, 'gradingUnit', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                    {gradingUnitOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">League <span className="text-red-500">*</span></label>
                <select value={leg.league} onChange={(e) => onUpdate(leg.id, 'league', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                    {leagueOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market Type <span className="text-red-500">*</span></label>
                <select value={leg.marketType} onChange={(e) => onUpdate(leg.id, 'marketType', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                    {marketTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>

            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Event <span className="text-red-500">*</span></label>
                <select value={leg.event} onChange={(e) => onUpdate(leg.id, 'event', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                    {eventOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period <span className="text-red-500">*</span></label>
                <select value={leg.period} onChange={(e) => onUpdate(leg.id, 'period', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                    {periodOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participant <span className="text-red-500">*</span></label>
                <select value={leg.participant} onChange={(e) => onUpdate(leg.id, 'participant', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                    {participantOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
        </div>
    </div>
);


export default LegItem;

