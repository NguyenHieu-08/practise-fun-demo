import {AddEntryModalProps, CarouselType, Leg} from "./response-data.constant";
import React, {useState} from "react";
import CarouselTypeSelect from "./shards/carousel-type-select.component";
import HeaderInput from "./shards/header-input.component";
import SingleMarketEventForm from "./single-market-event-form.component";
import ExpiryDateTimeInput from "./shards/expiry-datetime-input.component";
import VisibleToggle from "./shards/visible-toggle.component";
import HotParlayForm from "./hot-parlay-form.component";

const AddEntryModal = ({ isOpen, onClose, onSave }: AddEntryModalProps) => {
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
        { id: 'leg-1', sport: '', league: '', event: '', period: '', gradingUnit: '', marketType: '', participant: '' },
    ]);

    const addLeg = () => {
        setLegs(prev => [...prev, {
            id: `leg-${Date.now()}`,
            sport: '', league: '', event: '', period: '', gradingUnit: '', marketType: '', participant: '',
        }]);
    };

    const removeLeg = (id: string) => {
        if (legs.length === 1) return;
        setLegs(prev => prev.filter(l => l.id !== id));
    };

    const updateLeg = (id: string, field: keyof Omit<Leg, 'id'>, value: string) => {
        setLegs(prev => prev.map(leg => leg.id === id ? { ...leg, [field]: value } : leg));
    };

    const handleSave = () => {
        const data = {
            carouselType,
            header,
            expiryDateTime,
            visible,
            ...(carouselType === 'single_market_event'
                ? { sport, league, matchOutright, event: eventSingle, period: periodSingle, gradingUnit: gradingUnitSingle, marketType: marketTypeSingle }
                : { legs })
        };
        onSave(data);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-[820px] bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex items-center justify-between text-white">
                    <h2 className="text-xl font-semibold">Add Entry</h2>
                    <button onClick={onClose} className="text-3xl leading-none hover:text-blue-200">×</button>
                </div>

                <div className="p-6 bg-gray-100 max-h-[70vh] overflow-auto">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <CarouselTypeSelect value={carouselType} onChange={setCarouselType} />

                        {/* Header - thay đổi vị trí theo type */}
                        {carouselType === 'single_market_event' ? (
                            <HeaderInput value={header} onChange={setHeader} />
                        ) : (
                            <div className="col-span-2">
                                <HeaderInput value={header} onChange={setHeader} />
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

                        {/* ==================== HOT PARLAY ==================== */}
                        {carouselType === 'hot_parlay' && (
                            <div className="col-span-2">
                                <div className="grid grid-cols-2 gap-8 mb-6">
                                    <ExpiryDateTimeInput value={expiryDateTime} onChange={setExpiryDateTime} />
                                    <VisibleToggle value={visible} onChange={setVisible} />
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
                <div className="px-6 py-5 bg-gray-100 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-medium">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">Save</button>
                </div>
            </div>
        </div>
    );
};

export default AddEntryModal;