import React, {useEffect, useMemo, useState} from "react";
import {sportOptions} from "./response-data.constant";

import VisibleToggle from "./shards/visible-toggle.component";

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

type FieldType = 'select' | 'radio' | 'text' | 'toggle' | 'datetime';

interface FormField {
    key: string;
    type: FieldType;
    label: string;
    value: any;
    onChange: (value: any) => void;
    options?: string[];
    disabled?: boolean;
    required?: boolean;
    colSpan?: 1 | 2;
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

    const formFields: FormField[] = [
        {
            key: 'sport',
            type: 'select',
            label: 'Sport',
            value: sport,
            onChange: setSport,
            options: sportOptions,
            required: true,
        },
        {
            key: 'expiry',
            type: 'datetime',
            label: 'Expiry Date/Time',
            value: '',
            onChange: () => {
            },
            colSpan: 1,
        },
        {
            key: 'league',
            type: 'select',
            label: 'League',
            value: league,
            onChange: setLeague,
            options: leagueOptions,
            disabled: isLeagueDisabled,
            required: true,
        },
        {
            key: 'visible',
            type: 'toggle',
            label: 'Visible',
            value: true,
            onChange: () => {
            },
        },
        {
            key: 'matchOutright',
            type: 'radio',
            label: 'Match/Outright',
            value: matchOutright,
            onChange: setMatchOutright,
            options: ['Match', 'Outright'],
            required: true,
        },
        // Các field động chỉ hiện khi là Match
        ...(matchOutright === 'match' ? [
            {
                key: 'event',
                type: 'select' as const,
                label: 'Event',
                value: event,
                onChange: setEvent,
                options: eventOptions,
                disabled: isEventDisabled,
                required: true,
            },
            {
                key: 'period',
                type: 'select' as const,
                label: 'Period',
                value: period,
                onChange: setPeriod,
                options: periodOptions,
                disabled: isPeriodDisabled,
                required: true,
            },
            {
                key: 'gradingUnit',
                type: 'select' as const,
                label: 'Grading Unit',
                value: gradingUnit,
                onChange: setGradingUnit,
                options: gradingUnitOptions,
                disabled: isGradingUnitDisabled,
                required: true,
            },
        ] : []),
        {
            key: 'marketType',
            type: 'select',
            label: 'Market Type',
            value: marketType,
            onChange: setMarketType,
            options: marketTypeOptions,
            disabled: isMarketTypeDisabled,
            required: true,
        },
    ];

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

    const renderField = (field: FormField) => {
        const baseClass = `form-contro ${field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

        switch (field.type) {
            case 'select':
                return (
                    <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <select
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            disabled={field.disabled}
                            className={baseClass}
                        >
                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                );

            case 'radio':
                return (
                    <div key={field.key} className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="flex gap-8">
                            {field.options?.map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={field.value === opt.toLowerCase()}
                                        onChange={() => field.onChange(opt.toLowerCase() as 'match' | 'outright')}
                                        className="accent-blue-600"
                                    />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 'toggle':
                return (
                    <div key={field.key}>
                        <VisibleToggle value={field.value} onChange={() => {
                        }}/>
                    </div>
                );

            case 'datetime':
                return <input key={field.key} type="date" value={field.value} onChange={() => {
                }} className={baseClass}/>;
            case 'text':
            default:
                return <input key={field.key} type="text" value={field.value} onChange={() => {
                }} className={baseClass}/>;
        }
    };

    return (
        <>
            <div className="form-grid">
                {formFields.map(renderField)}
            </div>
        </>
    );
};

export default SingleMarketEventForm;