import React, { useState } from "react";
import SingleMarketEventForm from "./single-market-event-form.component";
import HotParlayForm from "./hot-parlay-form.component";
import "./modal-entry.scss";
import {AddEntryModalProps, CarouselType, Leg} from "../add-carousel-v2/response-data.constant";
import CarouselTypeSelect from "../add-carousel-v2/shards/carousel-type-select.component";
import HeaderInput from "../add-carousel-v2/shards/header-input.component";
import ExpiryDateTimeInput from "../add-carousel-v2/shards/expiry-datetime-input.component";
import VisibleToggle from "../add-carousel-v2/shards/visible-toggle.component";

const AddEntryModal3 = ({ isOpen, onClose, onSave }: AddEntryModalProps) => {
    const [carouselType, setCarouselType] = useState<CarouselType>("single_market_event");
    const [header, setHeader] = useState("");
    const [expiryDateTime, setExpiryDateTime] = useState("2025-07-30T18:07");
    const [visible, setVisible] = useState(true);

    // Single Market Event state
    const [sport, setSport] = useState("");
    const [league, setLeague] = useState("");
    const [matchOutright, setMatchOutright] = useState<"match" | "outright">("match");
    const [eventSingle, setEventSingle] = useState("");
    const [periodSingle, setPeriodSingle] = useState("");
    const [gradingUnitSingle, setGradingUnitSingle] = useState("");
    const [marketTypeSingle, setMarketTypeSingle] = useState("");

    // Hot Parlay state
    const [legs, setLegs] = useState<Leg[]>([
        { id: "leg-1", sport: "", league: "", event: "", period: "", gradingUnit: "", marketType: "", participant: "" },
    ]);

    const addLeg = () => {
        const len = legs?.length || 1;
        setLegs((prev) => [
            ...prev,
            { id: `leg-${len + 1}`, sport: "", league: "", event: "", period: "", gradingUnit: "", marketType: "", participant: "" },
        ]);
    };

    const removeLeg = (id: string) => {
        if (legs.length === 1) return;
        setLegs((prev) => prev.filter((l) => l.id !== id));
    };

    const updateLeg = (id: string, field: keyof Omit<Leg, "id">, value: string) => {
        setLegs((prev) => prev.map((leg) => (leg.id === id ? { ...leg, [field]: value } : leg)));
    };

    const handleSave = () => {
        onSave({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                {/* Header */}
                <div className="modal-header">
                    <h2>Add Entry</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {carouselType === "hot_parlay" ? (
                        // ── HOT PARLAY LAYOUT ──────────────────────────────
                        <>
                            {/* Row 1: Carousel Type (full width) */}
                            <div className="field-row">
                                <div className="field-full">
                                    <CarouselTypeSelect value={carouselType} onChange={setCarouselType} />
                                </div>
                            </div>

                            {/* Row 2: Header (full width) */}
                            <div className="field-row">
                                <div className="field-full">
                                    <HeaderInput value={header} onChange={setHeader} />
                                </div>
                            </div>

                            {/* Row 3: Expiry + Visible */}
                            <div className="field-row">
                                <div className="field-half">
                                    <ExpiryDateTimeInput value={expiryDateTime} onChange={setExpiryDateTime} />
                                </div>
                                <div className="field-half">
                                    <VisibleToggle value={visible} onChange={setVisible} />
                                </div>
                            </div>

                            {/* Legs */}
                            <HotParlayForm
                                legs={legs}
                                onUpdateLeg={updateLeg}
                                onRemoveLeg={removeLeg}
                                onAddLeg={addLeg}
                            />
                        </>
                    ) : (
                        // ── SINGLE MARKET EVENT LAYOUT ─────────────────────
                        <SingleMarketEventForm
                            carouselType={carouselType}
                            onCarouselTypeChange={setCarouselType}
                            header={header}
                            onHeaderChange={setHeader}
                            sport={sport} setSport={setSport}
                            league={league} setLeague={setLeague}
                            matchOutright={matchOutright} setMatchOutright={setMatchOutright}
                            event={eventSingle} setEvent={setEventSingle}
                            period={periodSingle} setPeriod={setPeriodSingle}
                            gradingUnit={gradingUnitSingle} setGradingUnit={setGradingUnitSingle}
                            marketType={marketTypeSingle} setMarketType={setMarketTypeSingle}
                            expiryDateTime={expiryDateTime} setExpiryDateTime={setExpiryDateTime}
                            visible={visible} setVisible={setVisible}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-save" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default AddEntryModal3;
