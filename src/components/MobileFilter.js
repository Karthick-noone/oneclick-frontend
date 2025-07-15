import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './css/MobileFilter.css';
import axios from 'axios';
import { ApiUrl } from './ApiUrl';
import { ChevronDown, ChevronUp } from "lucide-react"; // using lucide icons
import FilterIcon from './img/settings.png';

const BRANDS = [
    'Apple', 'Samsung', 'OnePlus', 'Realme', 'Redmi', 'MI', 'Poco',
    'Vivo', 'Oppo', 'Motorola', 'Nokia', 'Google', 'Nothing', 'Sony', 'Infinix',
    'Tecno', 'Honor', 'iQOO', 'Asus', 'Lenovo',
];

const RAM_OPTIONS = ['2', '3', '4', '6', '8', '12', '16', '24'];
const STORAGE_OPTIONS = ['32', '64', '128', '256', '512', '1024'];

const MobileFilter = ({ showFilters, closeFilters }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [priceRange, setPriceRange] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [userInteractedWithPrice, setUserInteractedWithPrice] = useState(false);
    const [userHasInteracted, setUserHasInteracted] = useState(false);

    const [filters, setFilters] = useState({
        brand: searchParams.getAll('brand') || [],
        memory: searchParams.getAll('memory') || [],
        storage: searchParams.getAll('storage') || [],
        processor: searchParams.getAll('processor') || [],
        price: searchParams.get('price') || '100000',
    });

    // 👇 Manage open/closed state for each filter section
    const [openSections, setOpenSections] = useState({
        brand: false,
        memory: false,
        storage: false,
        price: false,
    });

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    useEffect(() => {
        if (!userInteractedWithPrice) return;
        const handler = setTimeout(() => {
            setFilters((prev) => ({
                ...prev,
                price: currentPrice.toString(),
            }));
        }, 1000);
        return () => clearTimeout(handler);
    }, [currentPrice, userInteractedWithPrice]);

    useEffect(() => {
        if (!userHasInteracted && !userInteractedWithPrice) return;
        const params = {};
        for (const key in filters) {
            const value = filters[key];
            if (Array.isArray(value) && value.length > 0) {
                value.forEach((val) => {
                    if (val) params[key] = [...(params[key] || []), val];
                });
            } else if (value) {
                if (key === 'price' && userInteractedWithPrice) {
                    params[key] = value;
                } else if (key !== 'price') {
                    params[key] = value;
                }
            }
        }
        setSearchParams(params);
    }, [filters, userInteractedWithPrice, userHasInteracted]);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await axios.get(`${ApiUrl}/fetchmobiles`);
                const data = res.data || [];
                const prices = data.map(p => parseInt(p.prod_price)).filter(p => !isNaN(p));
                if (prices.length > 0) {
                    const min = Math.floor(Math.min(...prices) / 1000) * 1000;
                    const max = Math.ceil(Math.max(...prices) / 1000) * 1000;
                    setPriceRange({ min, max });
                    const initialPrice = parseInt(searchParams.get('price') || max.toString());
                    setCurrentPrice(initialPrice);
                }
            } catch (err) {
                console.error("Failed to fetch price range:", err);
            }
        };
        fetchPrices();
    }, []);

    const toggleFilter = (key, value) => {
        setUserHasInteracted(true);
        const currentValues = filters[key];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        setFilters(prev => ({ ...prev, [key]: newValues }));
    };

    const clearFilters = () => {
        setFilters({
            brand: [],
            memory: [],
            storage: [],
            processor: [],
            price: '',
        });
        setCurrentPrice(priceRange.max);
        setUserInteractedWithPrice(false);
        setUserHasInteracted(false);
        setSearchParams({});
    };

    const FilterBox = ({ label, selected, onClick }) => (
        <div
            onClick={onClick}
            style={{
                border: '1px solid #ccc',
                padding: '6px 10px',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'center',
                backgroundColor: selected ? '#007bff' : 'transparent',
                color: selected ? '#fff' : '#000',
                userSelect: 'none',
                fontSize: '13px',
                width: 'fit-content',
                minWidth: '70px',
            }}
        >
            {label}
        </div>
    );

    const createRows = (items, itemsPerRow = 2) => {
        const rows = [];
        for (let i = 0; i < items.length; i += itemsPerRow) {
            rows.push(items.slice(i, i + itemsPerRow));
        }
        return rows;
    };

    return (
        <div className={`mobile-filter ${showFilters ? 'show' : ''}`}>
            <div className="responsive-filter-controls">
                <button
                    className="filter-close-btn"
                    onClick={closeFilters}
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: 'transparent',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                    }}
                >
                    ✕
                </button>
            </div>

            <div
                className="filter-content"
                style={{
                    display: "flex",
                    alignItems: "center", // vertically center icon & text
                    gap: "0.1rem", // space between icon and text
                    marginBottom: "15px",
                }}
            >
                <img src={FilterIcon} alt="Filter Icon" width="20" height="20" />
                <h2 style={{ margin: 0 }}>Filters</h2>


                <button
                    onClick={clearFilters}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#007bff',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        padding: 0,
                        marginLeft:'29px'
                    }}
                >
                    CLEAR ALL
                </button>
            </div>

            {/* Brand Filter */}
            <div className="filter-section">
                <div
                    className="filter-header"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '0.5rem 0' }}
                    onClick={() => toggleSection('brand')}
                >
                    <h4 style={{ margin: 0 }}>Brand</h4>
                    {openSections.brand ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {openSections.brand && (
                    <div className="filter-body">
                        {createRows(BRANDS).map((row, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '8px' }}>
                                {row.map(brand => (
                                    <FilterBox
                                        key={brand}
                                        label={brand}
                                        selected={filters.brand.includes(brand)}
                                        onClick={() => toggleFilter('brand', brand)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ borderBottom: '1px solid #ddd', margin: '0.2rem 0' }}></div>

            </div>

            {/* RAM Filter */}
            <div className="filter-section">
                <div
                    className="filter-header"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '0.5rem 0' }}
                    onClick={() => toggleSection('memory')}
                >
                    <h4 style={{ margin: 0 }}>RAM</h4>
                    {openSections.memory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {openSections.memory && (
                    <div className="filter-body">
                        {createRows(RAM_OPTIONS).map((row, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '8px' }}>
                                {row.map(memory => (
                                    <FilterBox
                                        key={memory}
                                        label={`${memory} GB`}
                                        selected={filters.memory.includes(memory)}
                                        onClick={() => toggleFilter('memory', memory)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ borderBottom: '1px solid #ddd', margin: '0.2rem 0' }}></div>

            </div>

            {/* Storage Filter */}
            <div className="filter-section">
                <div
                    className="filter-header"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '0.5rem 0' }}
                    onClick={() => toggleSection('storage')}
                >
                    <h4 style={{ margin: 0 }}>ROM</h4>
                    {openSections.storage ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {openSections.storage && (
                    <div className="filter-body">
                        {createRows(STORAGE_OPTIONS).map((row, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '8px' }}>
                                {row.map(storage => (
                                    <FilterBox
                                        key={storage}
                                        label={storage === '1024' ? '1 TB' : `${storage} GB`}
                                        selected={filters.storage.includes(storage)}
                                        onClick={() => toggleFilter('storage', storage)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ borderBottom: '1px solid #ddd', margin: '0.2rem 0' }}></div>

            </div>

            {/* Price Filter */}
            <div className="filter-section">
                <h4>Price Range (₹)</h4>
                <div className="range-slider-container">
                    <div className="range-values">
                        <span style={{ fontSize: '14px' }}>₹{priceRange.min}</span>
                        <span style={{ fontSize: '14px' }}>₹{currentPrice}</span>
                    </div>
                    <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={currentPrice}
                        onChange={(e) => {
                            const val = Math.round(parseInt(e.target.value) / 1000) * 1000;
                            setCurrentPrice(val);
                            setUserInteractedWithPrice(true); // user interacted
                        }}
                        className="single-thumb"
                    />

                </div>
                <div style={{ borderBottom: '1px solid #ddd', margin: '0.2rem 0' }}></div>

            </div>
        </div>
    );
};

export default MobileFilter;
