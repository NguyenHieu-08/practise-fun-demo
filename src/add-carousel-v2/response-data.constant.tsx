// ==================== TYPES ====================
export type CarouselType = 'single_market_event' | 'hot_parlay';

export interface Leg {
    id: string;
    sport: string;
    league: string;
    event: string;
    period: string;
    gradingUnit: string;
    marketType: string;
    participant: string;
}

export interface AddEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

export interface IFunctionComponent {
    value: string;
    onChange: (value: any) => void;
}

// ==================== MOCK OPTIONS (dễ thay bằng API sau) ====================

export const sportOptions = ['Select Sport', 'Soccer'];
export const leagueOptions = ['Select League', 'English Premier League (EPL)'];
export const eventOptions = [
    'Select Event',
    'Manchester United vs Liverpool',
    'Arsenal vs Chelsea',
    'Manchester City vs Tottenham',
    'Newcastle vs Aston Villa',
    'Everton vs West Ham',
];
export const periodOptions = ['Select Period'];
export const gradingUnitOptions = ['Select Grading Unit', 'Goals'];
export const marketTypeOptions = ['Select Market Type', '1X2'];
export const participantOptions = ['Select Participant', 'Everton, Draw, West Ham'];