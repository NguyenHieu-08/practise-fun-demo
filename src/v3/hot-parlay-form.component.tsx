import React from "react";
import {Leg} from "../add-carousel-v2/response-data.constant";
import LegItem from "../add-carousel-v2/shards/leg-item.component";


const HotParlayForm = ({ legs, onUpdateLeg, onRemoveLeg, onAddLeg }: {
    legs: Leg[];
    onUpdateLeg: (id: string, field: keyof Omit<Leg, "id">, value: string) => void;
    onRemoveLeg: (id: string) => void;
    onAddLeg: () => void;
}) => (
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

        <button className="btn-add-leg" onClick={onAddLeg}>
            + Add Leg
        </button>
    </>
);

export default HotParlayForm;
