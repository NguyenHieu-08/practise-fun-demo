import React from "react";
import {
    eventOptions, gradingUnitOptions, leagueOptions,
    Leg, marketTypeOptions, participantOptions, periodOptions, sportOptions,
} from "../add-carousel-v2/response-data.constant";

interface LegItemProps {
    leg: Leg;
    index: number;
    onUpdate: (id: string, field: keyof Omit<Leg, "id">, value: string) => void;
    onRemove: (id: string) => void;
    canRemove: boolean;
}

const LegItem: React.FC<LegItemProps> = ({ leg, index, onUpdate, onRemove, canRemove }) => {
    const isLeagueDisabled  = !leg.sport    || leg.sport    === "Select Sport";
    const isEventDisabled   = isLeagueDisabled  || !leg.league   || leg.league   === "Select League";
    const isPeriodDisabled  = isEventDisabled    || !leg.event    || leg.event    === "Select Event";
    const isGUDisabled      = isPeriodDisabled   || !leg.period   || leg.period   === "Select Period";
    const isMTDisabled      = isGUDisabled       || !leg.gradingUnit || leg.gradingUnit === "Select Grading Unit";
    const isPartDisabled    = isMTDisabled        || !leg.marketType || leg.marketType  === "Select Market Type";

    return (
        <div className="leg-card">
            {/* Leg header */}
            <div className="leg-header">
                <span className="leg-title">
                    Leg {index + 1}:
                    <span className="leg-info">i</span>
                </span>
                {canRemove && (
                    <button className="btn-remove-leg" onClick={() => onRemove(leg.id)}>
                        ✕ Remove Leg
                    </button>
                )}
            </div>

            {/* Row: Sport | League */}
            <div className="leg-row">
                <div className="leg-field">
                    <label className="form-label">Sport <span className="required">*</span></label>
                    <select value={leg.sport} onChange={(e) => onUpdate(leg.id, "sport", e.target.value)} className="select-full">
                        {sportOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                </div>
                <div className="leg-field">
                    <label className="form-label">League <span className="required">*</span></label>
                    <select value={leg.league} onChange={(e) => onUpdate(leg.id, "league", e.target.value)}
                        disabled={isLeagueDisabled} className={`select-full ${isLeagueDisabled ? "disabled" : ""}`}>
                        {leagueOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                </div>
            </div>

            {/* Row: Event (full width) */}
            <div className="leg-row">
                <div className="leg-field leg-field--full">
                    <label className="form-label">Event <span className="required">*</span></label>
                    <select value={leg.event} onChange={(e) => onUpdate(leg.id, "event", e.target.value)}
                        disabled={isEventDisabled} className={`select-full ${isEventDisabled ? "disabled" : ""}`}>
                        {eventOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                </div>
            </div>

            {/* Row: Period | Grading Unit */}
            <div className="leg-row">
                <div className="leg-field">
                    <label className="form-label">Period <span className="required">*</span></label>
                    <select value={leg.period} onChange={(e) => onUpdate(leg.id, "period", e.target.value)}
                        disabled={isPeriodDisabled} className={`select-full ${isPeriodDisabled ? "disabled" : ""}`}>
                        {periodOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                </div>
                <div className="leg-field">
                    <label className="form-label">Grading Unit <span className="required">*</span></label>
                    <select value={leg.gradingUnit} onChange={(e) => onUpdate(leg.id, "gradingUnit", e.target.value)}
                        disabled={isGUDisabled} className={`select-full ${isGUDisabled ? "disabled" : ""}`}>
                        {gradingUnitOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                </div>
            </div>

            {/* Row: Market Type | Participant */}
            <div className="leg-row">
                <div className="leg-field">
                    <label className="form-label">Market Type <span className="required">*</span></label>
                    <select value={leg.marketType} onChange={(e) => onUpdate(leg.id, "marketType", e.target.value)}
                        disabled={isMTDisabled} className={`select-full ${isMTDisabled ? "disabled" : ""}`}>
                        {marketTypeOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                </div>
                <div className="leg-field">
                    <label className="form-label">Participant <span className="required">*</span></label>
                    <select value={leg.participant} onChange={(e) => onUpdate(leg.id, "participant", e.target.value)}
                        disabled={isPartDisabled} className={`select-full ${isPartDisabled ? "disabled" : ""}`}>
                        {participantOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default LegItem;
