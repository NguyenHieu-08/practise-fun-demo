import React from "react";
import {CarouselType} from "../response-data.constant";

const CarouselTypeSelect = ({value, onChange}: {
    value: CarouselType;
    onChange: (value: CarouselType) => void;
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Carousel Type <span className="text-red-500">*</span>
        </label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as CarouselType)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        >
            <option value="single_market_event">Single Market Event</option>
            <option value="hot_parlay">Hot Parlay</option>
        </select>
    </div>
);

export default CarouselTypeSelect;