import LegItem from "./shards/leg-item.component";
import {Leg} from "./response-data.constant";
import React from "react";

const HotParlayForm: React.FC<{
    legs: Leg[];
    onUpdateLeg: (id: string, field: keyof Omit<Leg, 'id'>, value: string) => void;
    onRemoveLeg: (id: string) => void;
    onAddLeg: () => void;
}> = ({ legs, onUpdateLeg, onRemoveLeg, onAddLeg }) => (
    <>
        {legs.map((leg, index) => (
            <LegItem
                key={leg.id}
                leg={leg}
                index={index}
                onUpdate={onUpdateLeg}
                onRemove={onRemoveLeg}
                canRemove={legs.length > 1}
            />
        ))}

        <button
            onClick={onAddLeg}
            className="w-full py-4 border border-dashed border-green-500 text-green-600 hover:bg-green-50 rounded-2xl font-medium flex items-center justify-center gap-2 transition-colors"
        >
            <span className="text-xl">+</span> Add Leg
        </button>
    </>
);

export default HotParlayForm;