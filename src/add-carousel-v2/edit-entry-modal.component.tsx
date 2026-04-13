// EditEntryModal.tsx
'use client';

import React, { useState, useEffect } from "react";
import { CarouselType, Leg } from "./response-data.constant";
import CarouselTypeSelect from "./shards/carousel-type-select.component";
import HeaderInput from "./shards/header-input.component";
import SingleMarketEventForm from "./single-market-event-form.component";
import HotParlayForm from "./hot-parlay-form.component";
import ExpiryDateTimeInput from "./shards/expiry-datetime-input.component";
import VisibleToggle from "./shards/visible-toggle.component";

interface EditEntryModalProps {
    isOpen: boolean;
    initialData: any;           // dữ liệu cần edit
    onClose: () => void;
    onSave: (data: any) => void;
}

const EditEntryModal: React.FC<EditEntryModalProps> = ({
                                                           isOpen,
                                                           initialData,
                                                           onClose,
                                                           onSave
                                                       }) => {
    const [carouselType, setCarouselType] = useState<CarouselType>('single_market_event');
    const [header, setHeader] = useState('');
    const [expiryDateTime, setExpiryDateTime] = useState('');
    const [visible, setVisible] = useState(true);

    // Single Market Event
    const [sport, setSport] = useState('');
    const [league, setLeague] = useState('');
    const [matchOutright, setMatchOutright] = useState<'match' | 'outright'>('match');
    const [eventSingle, setEventSingle] = useState('');
    const [periodSingle, setPeriodSingle] = useState('');
    const [gradingUnitSingle, setGradingUnitSingle] = useState('');
    const [marketTypeSingle, setMarketTypeSingle] = useState('');

    // Hot Parlay
    const [legs, setLegs] = useState<Leg[]>([]);

    // Load dữ liệu từ initialData
    useEffect(() => {
        if (isOpen && initialData) {
            setCarouselType(initialData.carouselType || 'single_market_event');
            setHeader(initialData.header || '');
            setExpiryDateTime(initialData.expiryDateTime || '');
            setVisible(initialData.visible ?? true);

            if (initialData.carouselType === 'single_market_event') {
                setSport(initialData.sport || '');
                setLeague(initialData.league || '');
                setMatchOutright(initialData.matchOutright || 'match');
                setEventSingle(initialData.event || '');
                setPeriodSingle(initialData.period || '');
                setGradingUnitSingle(initialData.gradingUnit || '');
                setMarketTypeSingle(initialData.marketType || '');
                setLegs([]);
            } else {
                setLegs(initialData.legs || []);
                // Reset single fields
                setSport(''); setLeague(''); setEventSingle(''); setPeriodSingle('');
                setGradingUnitSingle(''); setMarketTypeSingle('');
            }
        }
    }, [isOpen, initialData]);

    const handleSave = () => {
        const payload = {
            id: initialData?.id,
            carouselType,
            header: header.trim(),
            expiryDateTime,
            visible,
            ...(carouselType === 'single_market_event'
                ? {
                    sport,
                    league,
                    matchOutright,
                    event: eventSingle,
                    period: periodSingle,
                    gradingUnit: gradingUnitSingle,
                    marketType: marketTypeSingle,
                }
                : { legs }),
        };

        onSave(payload);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-[820px] bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex items-center justify-between text-white">
                    <h2 className="text-xl font-semibold">Edit Carousel Entry</h2>
                    <button onClick={onClose} className="text-3xl leading-none hover:text-blue-200">×</button>
                </div>

                <div className="p-6 bg-gray-100 max-h-[75vh] overflow-auto">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <CarouselTypeSelect value={carouselType} onChange={setCarouselType} />

                        {carouselType === 'single_market_event' ? (
                            <HeaderInput value={header} onChange={setHeader} />
                        ) : (
                            <div className="col-span-2">
                                <HeaderInput value={header} onChange={setHeader} />
                            </div>
                        )}

                        {/* Single Market Event */}
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

                        {/* Hot Parlay */}
                        {carouselType === 'hot_parlay' && (
                            <div className="col-span-2">
                                <div className="grid grid-cols-2 gap-8 mb-6">
                                    <ExpiryDateTimeInput value={expiryDateTime} onChange={setExpiryDateTime} />
                                    <VisibleToggle value={visible} onChange={setVisible} />
                                </div>

                                <HotParlayForm
                                    legs={legs}
                                    onUpdateLeg={(id, field, value) =>
                                        setLegs(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
                                    }
                                    onRemoveLeg={(id) => {
                                        if (legs.length === 1) return;
                                        setLegs(prev => prev.filter(l => l.id !== id));
                                    }}
                                    onAddLeg={() => {
                                        setLegs(prev => [...prev, {
                                            id: `leg-${Date.now()}`,
                                            sport: '', league: '', event: '', period: '', gradingUnit: '', marketType: '', participant: ''
                                        }]);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 bg-gray-100 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl font-medium">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditEntryModal;