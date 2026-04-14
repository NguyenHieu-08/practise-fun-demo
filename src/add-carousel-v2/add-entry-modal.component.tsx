import {AddEntryModalProps, CarouselType, Leg} from "./response-data.constant";
import React, {useState} from "react";
import CarouselTypeSelect from "./shards/carousel-type-select.component";
import HeaderInput from "./shards/header-input.component";
import SingleMarketEventForm from "./single-market-event-form.component";
import ExpiryDateTimeInput from "./shards/expiry-datetime-input.component";
import VisibleToggle from "./shards/visible-toggle.component";
import HotParlayForm from "./hot-parlay-form.component";
import "./modal-entry.scss";

const AddEntryModal2 = ({isOpen, onClose, onSave}: AddEntryModalProps) => {
    const [carouselType, setCarouselType] = useState<CarouselType>('single_market_event');
    const [header, setHeader] = useState('');
    const [expiryDateTime, setExpiryDateTime] = useState('2025-07-30T18:07');
    const [visible, setVisible] = useState(true);

    // Single Market Event state
    const [sport, setSport] = useState('');
    const [league, setLeague] = useState('');
    const [matchOutright, setMatchOutright] = useState<'match' | 'outright'>('match');
    const [eventSingle, setEventSingle] = useState('');
    const [periodSingle, setPeriodSingle] = useState('');
    const [gradingUnitSingle, setGradingUnitSingle] = useState('');
    const [marketTypeSingle, setMarketTypeSingle] = useState('');

    // Hot Parlay state
    const [legs, setLegs] = useState<Leg[]>([
        {id: 'leg-1', sport: '', league: '', event: '', period: '', gradingUnit: '', marketType: '', participant: ''},
    ]);

    const addLeg = () => {
        const lengthLegs: number = legs?.length || 1;
        setLegs(prev => [...prev, {
            id: `leg-${lengthLegs + 1}`,
            sport: '', league: '', event: '', period: '', gradingUnit: '', marketType: '', participant: '',
        }]);
    };

    const removeLeg = (id: string) => {
        if (legs.length === 1) return;
        setLegs(prev => prev.filter(l => l.id !== id));
    };

    const updateLeg = (id: string, field: keyof Omit<Leg, 'id'>, value: string) => {
        setLegs(prev => prev.map(leg => leg.id === id ? {...leg, [field]: value} : leg));
    };

    const validateForm = (): boolean => {
        const errors: string[] = [];

        if (!carouselType) errors.push("Carousel Type is required");
        if (!header.trim()) errors.push("Header is required");
        if (!expiryDateTime) errors.push("Expiry Date/Time is required");

        if (carouselType === 'single_market_event') {
            if (!sport || sport === 'Select Sport') errors.push("Sport is required");
            if (!league || league === 'Select League') errors.push("League is required");
            if (!matchOutright) errors.push("Match/Outright is required");

            if (matchOutright === 'match') {
                if (!eventSingle || eventSingle === 'Select Event') errors.push("Event is required");
                if (!periodSingle || periodSingle === 'Select Period') errors.push("Period is required");
                if (!gradingUnitSingle || gradingUnitSingle === 'Select Grading Unit') errors.push("Grading Unit is required");
            }

            if (!marketTypeSingle || marketTypeSingle === 'Select Market Type') {
                errors.push("Market Type is required");
            }
        } else {
            if (legs.length === 0) errors.push("At least one leg is required");
        }

        if (errors.length > 0) {
            for (const error of errors) {
                alert(error);
            }
            return false;
        }

        return true;
    }

    const preparePayload = () => {
        const basePayload = {
            carouselType,
            header: header.trim(),
            expiryDateTime,
            visible,
        };

        if (carouselType === 'single_market_event') {
            return {
                ...basePayload,
                type: 'single_market_event',
                sport,
                league,
                matchOutright,
                marketTypeSingle,
                //only sending if it is Match
                ...(matchOutright === 'match' && {
                    eventSingle,
                    periodSingle,
                    gradingUnitSingle,
                }),
            };
        } else {
            return {
                ...basePayload,
                type: 'hot_parlay',
                legs: legs.map(leg => ({
                    sport: leg.sport,
                    league: leg.league,
                    event: leg.event,
                    period: leg.period,
                    gradingUnit: leg.gradingUnit,
                    marketType: leg.marketType,
                    participant: leg.participant,
                })),
            };
        }
    };

    const handleSave = () => {
        // if (!validateForm()) return;
        const payload = preparePayload();
        console.log("Payload:", payload);
        onSave(payload);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-add-entry">
            <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                    <h2 className="text-xl font-semibold">Add Entry</h2>
                    <button onClick={onClose} className="text-3xl leading-none hover:text-blue-200">×</button>
                </div>

                <div className="modal-body">
                    <div className="form-grid">
                        <CarouselTypeSelect value={carouselType} onChange={setCarouselType}/>

                        {/* Header - thay đổi vị trí theo type */}
                        {carouselType === 'single_market_event' ? (
                            <HeaderInput value={header} onChange={setHeader}/>
                        ) : (
                            <div className="col-span-2">
                                <HeaderInput value={header} onChange={setHeader}/>
                            </div>
                        )}

                        {/* ==================== SINGLE MARKET EVENT ==================== */}
                        {carouselType === 'single_market_event' && (
                            <SingleMarketEventForm
                                sport={sport} setSport={setSport}
                                league={league} setLeague={setLeague}
                                matchOutright={matchOutright} setMatchOutright={setMatchOutright}
                                event={eventSingle} setEvent={setEventSingle}
                                period={periodSingle} setPeriod={setPeriodSingle}
                                gradingUnit={gradingUnitSingle} setGradingUnit={setGradingUnitSingle}
                                marketType={marketTypeSingle} setMarketType={setMarketTypeSingle}
                            />
                        )}

                        {/*==================== HOT PARLAY ====================*/}
                        {carouselType === 'hot_parlay' && (
                            <div className="col-span-2">
                                <div className="grid grid-cols-2 gap-8 mb-6">
                                    <ExpiryDateTimeInput value={expiryDateTime} onChange={setExpiryDateTime}/>
                                    <VisibleToggle value={visible} onChange={setVisible}/>
                                </div>

                                <HotParlayForm
                                    legs={legs}
                                    onUpdateLeg={updateLeg}
                                    onRemoveLeg={removeLeg}
                                    onAddLeg={addLeg}
                                />
                            </div>
                        )}

                    </div>

                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button onClick={onClose} className="cancel">Cancel</button>
                    <button onClick={handleSave} className="save">Save</button>
                </div>
            </div>
        </div>
    );
};

export default AddEntryModal2;