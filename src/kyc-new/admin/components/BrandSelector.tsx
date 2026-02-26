import React, { useMemo, useCallback } from 'react';

interface BrandSelectorProps {
    selectedBrand: string;
    onBrandChange: (brand: string) => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({ selectedBrand, onBrandChange }) => {
    const brands = useMemo(() => ['Pinacle888'], []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onBrandChange(e.target.value);
    }, [onBrandChange]);

    return (
        <div className="brand-selector">
            <label className="brand-selector__label">Brand</label>
            <select 
                className="brand-selector__select"
                value={selectedBrand} 
                onChange={handleChange}
            >
                {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>
        </div>
    );
};

export default React.memo(BrandSelector);



