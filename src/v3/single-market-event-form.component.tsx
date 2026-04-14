import React, { useEffect, useMemo, useState } from "react";
import {CarouselType, sportOptions} from "../add-carousel-v2/response-data.constant";
import CarouselTypeSelect from "../add-carousel-v2/shards/carousel-type-select.component";
import HeaderInput from "../add-carousel-v2/shards/header-input.component";
import ExpiryDateTimeInput from "../add-carousel-v2/shards/expiry-datetime-input.component";
import VisibleToggle from "../add-carousel-v2/shards/visible-toggle.component";

interface ISingleMarketEventFormProps {
    // shared (owned by parent)
    carouselType: CarouselType;
    onCarouselTypeChange: (v: CarouselType) => void;
    header: string;
    onHeaderChange: (v: string) => void;
    expiryDateTime: string;
    setExpiryDateTime: (v: string) => void;
    visible: boolean;
    setVisible: (v: boolean) => void;

    // SME-specific
    sport: string;
    setSport: (v: string) => void;
    league: string;
    setLeague: (v: string) => void;
    matchOutright: "match" | "outright";
    setMatchOutright: (v: "match" | "outright") => void;
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
    carouselType, onCarouselTypeChange,
    header, onHeaderChange,
    expiryDateTime, setExpiryDateTime,
    visible, setVisible,
    sport, setSport,
    league, setLeague,
    matchOutright, setMatchOutright,
    event, setEvent,
    period, setPeriod,
    gradingUnit, setGradingUnit,
    marketType, setMarketType,
}: ISingleMarketEventFormProps) => {

    const [leagueOptions, setLeagueOptions] = useState<string[]>(["Select League"]);
    const [eventOptions, setEventOptions] = useState<string[]>(["Select Event"]);
    const [periodOptions, setPeriodOptions] = useState<string[]>(["Select Period"]);
    const [gradingUnitOptions, setGradingUnitOptions] = useState<string[]>(["Select Grading Unit"]);
    const [marketTypeOptions, setMarketTypeOptions] = useState<string[]>(["Select Market Type"]);

    const isLeagueDisabled = !sport || sport === "Select Sport";
    const isEventDisabled = isLeagueDisabled || !league || league === "Select League";
    const isPeriodDisabled = isEventDisabled || !event || event === "Select Event";
    const isGradingUnitDisabled = matchOutright === "match"
        ? (isPeriodDisabled || !period || period === "Select Period")
        : false;
    const isMarketTypeDisabled = matchOutright === "match"
        ? (isGradingUnitDisabled || !gradingUnit || gradingUnit === "Select Grading Unit")
        : false;

    const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSport(e.target.value);
        setLeague(""); setEvent(""); setPeriod("");
    };

    const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLeague(e.target.value);
        setEvent(""); setPeriod("");
    };

    const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEvent(e.target.value);
        setPeriod("");
    };

    return (
        <>
            {/*
             * Layout (2-col grid):
             *
             * [Carousel Type        ] [Header              ]
             * [Sport][Expiry]         [League][Visible]
             * [Match/Outright]        [Event][Period]           ← match only
             *                         [Grading Unit]            ← match only
             *                         [Market Type (outright)]  ← outright
             * [Market Type (match) full-width]
             */}

            {/* Row 1: Carousel Type | Header */}
            <div className="form-row">
                <div className="field-col">
                    <CarouselTypeSelect value={carouselType} onChange={onCarouselTypeChange} />
                </div>
                <div className="field-col">
                    <HeaderInput value={header} onChange={onHeaderChange} />
                </div>
            </div>

            {/* Row 2: [Sport + Expiry] | [League + Visible] */}
            <div className="form-row">
                {/* Left: Sport (compact) + Expiry */}
                <div className="field-col field-col--inline">
                    <div className="field-inline-group">
                        <div className="field-inline-label">
                            <label className="form-label">Sport <span className="required">*</span></label>
                            <select
                                value={sport}
                                onChange={handleSportChange}
                                className="select-compact"
                            >
                                {sportOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="field-inline-expiry">
                            <ExpiryDateTimeInput value={expiryDateTime} onChange={setExpiryDateTime} />
                        </div>
                    </div>
                </div>

                {/* Right: League (compact) + Visible */}
                <div className="field-col field-col--inline">
                    <div className="field-inline-group">
                        <div className="field-inline-label">
                            <label className="form-label">League <span className="required">*</span></label>
                            <select
                                value={league}
                                onChange={handleLeagueChange}
                                disabled={isLeagueDisabled}
                                className={`select-compact ${isLeagueDisabled ? "disabled" : ""}`}
                            >
                                {leagueOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="field-visible">
                            <VisibleToggle value={visible} onChange={setVisible} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Match/Outright | Event + Period (match) or Market Type (outright) */}
            <div className="form-row">
                {/* Left: Match/Outright radio */}
                <div className="field-col">
                    <label className="form-label">Match/Outright <span className="required">*</span></label>
                    <div className="radio-group">
                        <label className="radio-label">
                            <input type="radio" checked={matchOutright === "match"}
                                onChange={() => setMatchOutright("match")} />
                            Match
                        </label>
                        <label className="radio-label">
                            <input type="radio" checked={matchOutright === "outright"}
                                onChange={() => setMatchOutright("outright")} />
                            Outright
                        </label>
                    </div>
                </div>

                {/* Right: Event + Period (match) OR Market Type (outright) */}
                <div className="field-col">
                    {matchOutright === "match" ? (
                        <div className="field-inline-group">
                            <div className="field-inline-label">
                                <label className="form-label">Event <span className="required">*</span></label>
                                <select
                                    value={event}
                                    onChange={handleEventChange}
                                    disabled={isEventDisabled}
                                    className={`select-compact ${isEventDisabled ? "disabled" : ""}`}
                                >
                                    {eventOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div className="field-inline-label">
                                <label className="form-label">Period <span className="required">*</span></label>
                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    disabled={isPeriodDisabled}
                                    className={`select-compact ${isPeriodDisabled ? "disabled" : ""}`}
                                >
                                    {periodOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <>
                            <label className="form-label">Market Type <span className="required">*</span></label>
                            <select
                                value={marketType}
                                onChange={(e) => setMarketType(e.target.value)}
                                disabled={isMarketTypeDisabled}
                                className={`select-full ${isMarketTypeDisabled ? "disabled" : ""}`}
                            >
                                {marketTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </>
                    )}
                </div>
            </div>

            {/* Row 4 (match only): Grading Unit (right col) */}
            {matchOutright === "match" && (
                <div className="form-row">
                    <div className="field-col" /> {/* empty left */}
                    <div className="field-col">
                        <label className="form-label">Grading Unit <span className="required">*</span></label>
                        <select
                            value={gradingUnit}
                            onChange={(e) => setGradingUnit(e.target.value)}
                            disabled={isGradingUnitDisabled}
                            className={`select-compact ${isGradingUnitDisabled ? "disabled" : ""}`}
                        >
                            {gradingUnitOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {/* Row 5 (match only): Market Type full-width */}
            {matchOutright === "match" && (
                <div className="form-row form-row--single">
                    <div className="field-col field-col--full">
                        <label className="form-label">Market Type <span className="required">*</span></label>
                        <select
                            value={marketType}
                            onChange={(e) => setMarketType(e.target.value)}
                            disabled={isMarketTypeDisabled}
                            className={`select-full ${isMarketTypeDisabled ? "disabled" : ""}`}
                        >
                            {marketTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>
            )}
        </>
    );
};

export default SingleMarketEventForm;
