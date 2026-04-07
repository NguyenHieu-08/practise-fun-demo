import React from "react";

const VisibleToggle = ({value, onChange}: {
    value: boolean;
    onChange: (value: boolean) => void;
}) => (
    <div className="flex items-center gap-3">
        <label className="block text-sm font-medium text-gray-700">Visible</label>
        <div
            onClick={() => onChange(!value)}
            className={`w-11 h-6 flex items-center rounded-full cursor-pointer transition-colors ${
                value ? 'bg-green-500' : 'bg-gray-300'
            }`}
        >
            <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-0.5'
                }`}
            />
        </div>
    </div>
);

export default VisibleToggle;