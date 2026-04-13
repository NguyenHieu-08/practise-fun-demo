import React, {useEffect, useMemo, useState} from "react";
import {sportOptions} from "./response-data.constant";

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

    const [leagueOptions, setLeagueOptions] = useState<string[]>(['Select League']);
    const [eventOptions, setEventOptions] = useState<string[]>(['Select Event']);
    const [periodOptions, setPeriodOptions] = useState<string[]>(['Select Period']);
    const [gradingUnitOptions, setGradingUnitOptions] = useState<string[]>(['Select Grading Unit']);
    const [marketTypeOptions, setMarketTypeOptions] = useState<string[]>(['Select Market Type']);

    // Tính toán disabled một lần bằng useMemo để tránh tính lại mỗi render
    const disabledStates = useMemo(() => {
        const isLeagueDisabled = !sport || sport === 'Select Sport';
        const isEventDisabled = isLeagueDisabled || !league || league === 'Select League';
        const isPeriodDisabled = isEventDisabled || !event || event === 'Select Event';
        const isGradingUnitDisabled = matchOutright === 'match'
            ? (isPeriodDisabled || !period || period === 'Select Period')
            : false;

        const isMarketTypeDisabled = matchOutright === 'match'
            ? (isGradingUnitDisabled || !gradingUnit || gradingUnit === 'Select Grading Unit')
            : false;

        return {
            isLeagueDisabled,
            isEventDisabled,
            isPeriodDisabled,
            isGradingUnitDisabled,
            isMarketTypeDisabled,
        };
    }, [sport, league, event, period, gradingUnit, matchOutright]);

    const {
        isLeagueDisabled,
        isEventDisabled,
        isPeriodDisabled,
        isGradingUnitDisabled,
        isMarketTypeDisabled
    } = disabledStates;

    // Load League khi Sport thay đổi và League được enable
    useEffect(() => {
        if (!isLeagueDisabled && sport && sport !== 'Select Sport') {
            // CALL API League
        }
    }, [sport, isLeagueDisabled]);

    // Load Event khi League thay đổi
    useEffect(() => {
        if (!isEventDisabled && league && league !== 'Select League') {
            // CALL API event
        }
    }, [league, isEventDisabled]);

    // Load Period khi Event thay đổi
    useEffect(() => {
        if (!isPeriodDisabled && event && event !== 'Select Event') {
            // CALL API period
        }
    }, [event, isPeriodDisabled]);

    // Load Grading Unit khi Period thay đổi (chỉ với Match)
    useEffect(() => {
        if (matchOutright === 'match' && !isGradingUnitDisabled && period && period !== 'Select Period') {
            // CALL API gradingUnit
        }
    }, [period, isGradingUnitDisabled, matchOutright]);

    // Load Market Type khi Grading Unit thay đổi (Match) hoặc khi chuyển sang Outright
    useEffect(() => {
        if (!isMarketTypeDisabled) {
            const parent = matchOutright === 'match' ? gradingUnit : sport;
            // CALL API marketType
        }
    }, [gradingUnit, matchOutright, isMarketTypeDisabled, sport]);

    // Reset options khi chuyển mode Match <-> Outright
    useEffect(() => {
        if (matchOutright === 'outright') {
            setGradingUnitOptions(['Select Grading Unit']);
            setPeriodOptions(['Select Period']);
        }
    }, [matchOutright]);

    const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setSport(newValue);
        if (newValue !== sport) {
            setLeague('');
            setEvent('');
            setPeriod('');
        }
    };

    const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setLeague(newValue);
        if (newValue !== league) {
            setEvent('');
            setPeriod('');
        }
    };

    const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setEvent(newValue);
        if (newValue !== event) {
            setPeriod('');
        }
    };

    return (
        <>
            {/* Sport + Expiry */}
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sport <span
                        className="text-red-500">*</span></label>
                    <select value={sport} onChange={handleSportChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white">
                        {sportOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <ExpiryDateTimeInput value="" onChange={() => {
                }}/>
            </div>

            {/* League + Visible */}
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">League <span
                        className="text-red-500">*</span></label>
                    <select
                        value={league}
                        onChange={handleLeagueChange}
                        disabled={isLeagueDisabled}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${isLeagueDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                        {leagueOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <VisibleToggle value={true} onChange={() => {
                }}/>
            </div>

            {/* Match / Outright */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Match/Outright <span
                    className="text-red-500">*</span></label>
                <div className="flex gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={matchOutright === 'match'}
                               onChange={() => setMatchOutright('match')} className="accent-blue-600"/>
                        <span>Match</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={matchOutright === 'outright'}
                               onChange={() => setMatchOutright('outright')} className="accent-blue-600"/>
                        <span>Outright</span>
                    </label>
                </div>
            </div>

            {matchOutright === 'match' && (
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event <span
                            className="text-red-500">*</span></label>
                        <select
                            value={event}
                            onChange={handleEventChange}
                            disabled={isEventDisabled}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${isEventDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            {eventOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Period <span
                            className="text-red-500">*</span></label>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            disabled={isPeriodDisabled}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${isPeriodDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            {periodOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grading Unit <span
                            className="text-red-500">*</span></label>
                        <select
                            value={gradingUnit}
                            onChange={(e) => setGradingUnit(e.target.value)}
                            disabled={isGradingUnitDisabled}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {gradingUnitOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market Type <span
                    className="text-red-500">*</span></label>
                <select
                    value={marketType}
                    onChange={(e) => setMarketType(e.target.value)}
                    disabled={isMarketTypeDisabled}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white ${isMarketTypeDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                    {marketTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
        </>
    );
};

export default SingleMarketEventForm;