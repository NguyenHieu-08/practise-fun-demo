import React from "react";

const ExpiryDateTimeInput = ({ value, onChange }: {
    value: string;
    onChange: (value: string) => void;
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date/Time</label>
        <input
            type="datetime-local"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

export default ExpiryDateTimeInput;