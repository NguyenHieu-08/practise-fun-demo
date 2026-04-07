import React, {useState} from 'react';
import CarouselTable from './CarouselLibPage4';

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
        visible: true
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
        visible: true
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
        visible: true
    },
    {
        id: '7',
        position: 7,
        type: 'Single',
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
        visible: false
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
        visible: true
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
        visible: false
    },
    {
        id: '10',
        position: 10,
        type: 'Single',
        sport: 'Tennis',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1st Half',
        gradingUnits: '',
        marketType: 'Combo Boost',
        header: 'Summer Promo',
        expiryDateTime: '30-07-2025 18:01',
        country: 'Default',
        language: 'Default',
        visible: true
    },
    {
        id: '11',
        position: 11,
        type: 'Single',
        sport: 'Tennis',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1st Half',
        gradingUnits: '',
        marketType: 'Combo Boost',
        header: 'Summer Promo',
        expiryDateTime: '30-07-2025 18:01',
        country: 'Default',
        language: 'Default',
        visible: true
    },
    {
        id: '12',
        position: 12,
        type: 'Single',
        sport: 'Tennis',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1st Half',
        gradingUnits: '',
        marketType: 'Combo Boost',
        header: 'Summer Promo',
        expiryDateTime: '30-07-2025 18:01',
        country: 'Default',
        language: 'Default',
        visible: true
    },
    {
        id: '13',
        position: 13,
        type: 'Single',
        sport: 'Tennis',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1st Half',
        gradingUnits: '',
        marketType: 'Combo Boost',
        header: 'Summer Promo',
        expiryDateTime: '30-07-2025 18:01',
        country: 'Default',
        language: 'Default',
        visible: true
    },
    {
        id: '14',
        position: 14,
        type: 'Single',
        sport: 'Tennis',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1st Half',
        gradingUnits: '',
        marketType: 'Combo Boost',
        header: 'Summer Promo',
        expiryDateTime: '30-07-2025 18:01',
        country: 'Default',
        language: 'Default',
        visible: true
    },
    {
        id: '15',
        position: 15,
        type: 'Single',
        sport: 'Tennis',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1st Half',
        gradingUnits: '',
        marketType: 'Combo Boost',
        header: 'Summer Promo',
        expiryDateTime: '30-07-2025 18:01',
        country: 'Default',
        language: 'Default',
        visible: true
    },
    {
        id: '16',
        position: 16,
        type: 'Single',
        sport: 'Tennis',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1st Half',
        gradingUnits: '',
        marketType: 'Combo Boost',
        header: 'Summer Promo',
        expiryDateTime: '30-07-2025 18:01',
        country: 'Default',
        language: 'Default',
        visible: true
    },
    {
        id: '17',
        position: 17,
        type: 'Single',
        sport: 'Tennis',
        league: 'NBA',
        event: 'MUN vs LIV',
        period: '1st Half',
        gradingUnits: '',
        marketType: 'Combo Boost',
        header: 'Summer Promo',
        expiryDateTime: '30-07-2025 18:01',
        country: 'Default',
        language: 'Default',
        visible: true
    },
];


const MyPage: React.FC = () => {
    const [entries, setEntries] = useState<CarouselEntry[]>(createInitialEntries);

    return (
        <CarouselTable
            entries={entries}
            title="My Carousel"
            liveCount={6}
            onEntriesChange={setEntries}
            onSave={(data) => console.log('Save:', data)}
            leftButtons={[
                {label: '+ Add', onClick: () => console.log('Add'), type: 'primary'},
            ]}
        />
    );
};

export default MyPage;