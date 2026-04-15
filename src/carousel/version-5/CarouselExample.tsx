import React, {useState} from 'react';
import AddEntryModal3 from "../../v3/AddEntryModal2";
import CarouselTable5 from "./CarouselTable5";

// Define entry type
export type CarouselEntry = {
    id: string;
    position: number;
    type: string;
    sport: string;
    league: string;
    event: string;
    period: string;
    gradingUnits: string;
    marketType: string;
    header: string;
    expiryDateTime: string;
    country: string;
    language: string;
    visible: boolean;
    parlayData?: Array<{
        leg: number;
        event: string;
        market: string;
        selection: string;
        odds: number;
    }>;
};

// Sample data
const createInitialEntries = (): CarouselEntry[] => [
    {
        id: '1',
        position: 1,
        type: 'Single',
        sport: 'Soccer',
        league: 'FIFA - CUF',
        event: 'RMA vs BAR',
        period: 'Match',
        gradingUnits: '1x2',
        marketType: 'El Clasico',
        header: 'El Clasico',
        expiryDateTime: '30-07-2025 18:01:08',
        country: 'Default',
        language: 'Default',
        visible: false
    },
    {
        id: '2',
        position: 2,
        type: 'Banner',
        sport: '',
        league: '',
        event: '',
        period: '',
        gradingUnits: '',
        marketType: 'Summer Promo',
        header: 'Combo Boost',
        expiryDateTime: '30-07-2025 18:01:08',
        country: 'Default',
        language: 'Default',
        visible: true
    },
    {
        id: '3',
        position: 3,
        type: 'Parlay',
        sport: 'Parlay: [treetop]',
        league: 'summer Promo',
        event: 'MUN vs LIV',
        period: '1x2',
        gradingUnits: 'Handicap',
        marketType: 'Combo Boost',
        header: 'Super Odds',
        expiryDateTime: '30-07-2025 18:01:08',
        country: 'Default',
        language: 'Default',
        visible: true,
        // ==================== THÊM PARLAY DATA ====================
        parlayData: [
            {leg: 1, event: 'MUN vs LIV', market: '1x2', selection: 'MUN Win', odds: 1.85},
            {leg: 2, event: 'Real Madrid vs Barcelona', market: 'Over/Under', selection: 'Over 2.5', odds: 1.95},
            {leg: 3, event: 'Liverpool vs Chelsea', market: 'Both Teams To Score', selection: 'Yes', odds: 1.75}
        ]
    },
    {
        id: '4',
        position: 4,
        type: 'Link/Freetext',
        sport: 'AUSTRALIA: NSW',
        league: '',
        event: '',
        period: '1st Half',
        gradingUnits: '',
        marketType: 'Super Odds',
        header: 'Super Odds',
        expiryDateTime: '30-07-2025 18:01:08',
        country: 'Default',
        language: 'English',
        visible: true
    },
    {
        id: '5',
        position: 5,
        type: 'Single',
        sport: 'Single',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1st Half',
        gradingUnits: 'Corners',
        marketType: 'Summer Promo',
        header: 'Sumer Promo',
        expiryDateTime: '30-07-2025 18:01:08',
        country: 'Default',
        language: 'Default',
        visible: true
    },
    {
        id: '6',
        position: 6,
        type: 'Parlay',
        sport: 'Temis',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1x2',
        gradingUnits: '',
        marketType: 'Super Odds',
        header: 'Doher',
        expiryDateTime: '30-07-2025 18:01:08',
        country: 'Default',
        language: 'English',
        visible: true,
        // ==================== THÊM PARLAY DATA ====================
        parlayData: [
            {leg: 1, event: 'Golden State Warriors vs LA Lakers', market: 'Spread', selection: 'GSW -5.5', odds: 1.90},
            {leg: 2, event: 'Boston Celtics vs Miami Heat', market: 'Total Points', selection: 'Over 218.5', odds: 1.87}
        ]
    },
    {
        id: '7',
        position: 7,
        type: 'Single TEST',
        sport: 'Soccer',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1st Half',
        gradingUnits: 'Corners',
        marketType: 'Summer Promo',
        header: 'Summer Promo',
        expiryDateTime: '30-07-2025 18:00',
        country: 'Default',
        language: 'Default',
        visible: true
    },
    {
        id: '8',
        position: 8,
        type: 'Link/Freetext',
        sport: 'Tennis',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1st Half',
        gradingUnits: '',
        marketType: 'Combo Boost',
        header: 'Summer Odds',
        expiryDateTime: '30-07-2025 18:01',
        country: 'Default',
        language: 'Default',
        visible: false
    },
    {
        id: '9',
        position: 9,
        type: 'Parlay',
        sport: 'Single',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: 'Over Time',
        gradingUnits: '1x2',
        marketType: 'Super Odds',
        header: 'Super Odds',
        expiryDateTime: '30-07-2025 18:01',
        country: 'Default',
        language: 'Default',
        visible: false,
        // ==================== THÊM PARLAY DATA ====================
        parlayData: [
            {leg: 1, event: 'MUN vs LIV', market: '1x2', selection: 'Draw', odds: 3.20},
            {leg: 2, event: 'Man City vs Arsenal', market: 'Asian Handicap', selection: 'Man City -1', odds: 2.10}
        ]
    },
];


const MyPage: React.FC = () => {
    // const [entries, setEntries] = useState<CarouselEntry[]>([createInitialEntries()?.[0]]);
    // const [entries, setEntries] = useState<CarouselEntry[]>([...createInitialEntries()].slice(0,2));
    const [entries, setEntries] = useState<CarouselEntry[]>([]);
    // const [entries, setEntries] = useState<CarouselEntry[]>(createInitialEntries);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    console.log(entries);

    const openEdit = (item: any) => {
        setEditingItem(item);
        setIsEditOpen(true);
    };

    return <>
        <CarouselTable5
            entries={entries}
            title="My Carousel"
            liveCount={6}
            onEntriesChange={setEntries}
            onSave={(data) => console.log('Save:', data)}
            leftButtons={[
                {label: '+ Add', onClick: () => setModalOpen(true), type: 'primary', disabled: entries.length >= 16},
            ]}
            isEditMode={isEditMode}
            onEditClick={setIsEditMode}
        />

        <br/>
        <AddEntryModal3
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={(data) => {
                console.log('Data lưu:', data);
                // Gọi API ở đây
            }}
        />

        {/*<EditEntryModal*/}
        {/*    isOpen={true}*/}
        {/*    initialData={editingItem}*/}
        {/*    onClose={() => {*/}
        {/*        setIsEditOpen(false);*/}
        {/*        setEditingItem(null);*/}
        {/*    }}*/}
        {/*    onSave={(data) => {*/}
        {/*        console.log("Update:", data);*/}
        {/*        // Gọi API update ở đây*/}
        {/*        setIsEditOpen(false);*/}
        {/*    }}*/}
        {/*/>*/}
    </>;
};

export default MyPage;