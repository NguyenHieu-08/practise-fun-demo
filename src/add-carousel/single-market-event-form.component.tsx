import React from "react";
import {
    eventOptions,
    gradingUnitOptions,
    leagueOptions,
    marketTypeOptions,
    periodOptions,
    sportOptions
} from "./response-data.constant";
import VisibleToggle from "./shards/visible-toggle.component";
import ExpiryDateTimeInput from "./shards/expiry-datetime-input.component";

interface ISingleMarketEventFormProps {
    sport: string;
    setSport: (v: string) => void;
    league: string;
    setLeague: (v: string) => void;
    matchOutright: 'match' | 'outright';
    setMatchOutright: (v: 'match' | 'outright') => void;
    event: string;
    setEvent: (v: string) => void;
    period: string;
    setPeriod: (v: string) => void;
    gradingUnit: string;
    setGradingUnit: (v: string) => void;
    marketType: string;
    setMarketType: (v: string) => void;
}

const SingleMarketEventForm = ({
                                   sport, setSport,
                                   league, setLeague,
                                   matchOutright, setMatchOutright,
                                   event, setEvent,
                                   period, setPeriod,
                                   gradingUnit, setGradingUnit,
                                   marketType, setMarketType,
                               }: ISingleMarketEventFormProps) => {


    return <>
        {/* Sport + Expiry */}
        <div className="grid grid-cols-2 gap-8">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport <span className="text-red-500">*</span></label>
                <select value={sport} onChange={(e) => setSport(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                    {sportOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
            <ExpiryDateTimeInput value="" onChange={() => {}} /> {/* sẽ được pass từ parent */}
        </div>

        {/* League + Visible */}
        <div className="grid grid-cols-2 gap-8">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">League <span className="text-red-500">*</span></label>
                <select value={league} onChange={(e) => setLeague(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                    {leagueOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
            <VisibleToggle value={true} onChange={() => {}} /> {/* sẽ được pass từ parent */}
        </div>

        {/* Match / Outright */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Match/Outright <span className="text-red-500">*</span></label>
            <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={matchOutright === 'match'} onChange={() => setMatchOutright('match')} className="accent-blue-600" />
                    <span>Match</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={matchOutright === 'outright'} onChange={() => setMatchOutright('outright')} className="accent-blue-600" />
                    <span>Outright</span>
                </label>
            </div>
        </div>

        {/* Chỉ hiện khi chọn Match */}
        {matchOutright === 'match' && (
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event <span className="text-red-500">*</span></label>
                    <select value={event} onChange={(e) => setEvent(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                        {eventOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period <span className="text-red-500">*</span></label>
                    <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                        {periodOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grading Unit <span className="text-red-500">*</span></label>
                    <select value={gradingUnit} onChange={(e) => setGradingUnit(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                        {gradingUnitOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>
        )}

        {/* Market Type luôn hiện */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Market Type <span className="text-red-500">*</span></label>
            <select value={marketType} onChange={(e) => setMarketType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                {marketTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    </>;
}

export default SingleMarketEventForm;