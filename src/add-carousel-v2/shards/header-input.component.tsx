import React from "react";

const HeaderInput = ({value, onChange}: {
    value: string;
    onChange: (value: string) => void;
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Header</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter header..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

export default HeaderInput;