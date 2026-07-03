'use client';

import { useState, useEffect, useRef } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { SlidersHorizontal, Tag, DollarSign, Star, RotateCcw, Users } from 'lucide-react';

interface FilterState {
  minRating: number;
  minPrice: number;
  maxPrice: number;
  showDiscounts: boolean;
  sortBy: string;
  tag: string;
  searchTerm: string;
  category: string;
}

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  initialCategory?: string;
}

export default function ProductFilter({ 
  onFilterChange,
  initialCategory = 'All',
}: FilterProps) {
  
  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => { onFilterChangeRef.current = onFilterChange; }, [onFilterChange]);

  const [filters, setFilters] = useState<FilterState>({
    minRating: 0,
    minPrice: 0,
    maxPrice: 250,
    showDiscounts: false,
    sortBy: 'default',
    tag: 'All',
    searchTerm: '',
    category: initialCategory,
  });

  
  
  useEffect(() => {
    const updated: FilterState = {
      minRating: 0,
      minPrice: 0,
      maxPrice: 250,
      showDiscounts: false,
      sortBy: 'default',
      tag: 'All',
      searchTerm: '',
      category: initialCategory,
    };
    setFilters(updated);
    onFilterChangeRef.current(updated);
  }, [initialCategory]);

  const apply = () => {
    onFilterChange(filters);
  };

  const clear = () => {
    const defaultFilters: FilterState = {
      minRating: 0,
      minPrice: 0,
      maxPrice: 250,
      showDiscounts: false,
      sortBy: 'default',
      tag: 'All',
      searchTerm: '',
      category: 'All',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white/[0.01] backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-xl sticky top-28 transition-all duration-300 hover:border-white/15">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={16} className="text-[#d4af37]" />
              <h4 className="text-white uppercase tracking-[0.2em] text-xs font-light">Filters</h4>
            </div>
            <button 
              onClick={clear} 
              className="text-gray-500 hover:text-white transition-all duration-300 p-1.5 hover:bg-white/5 rounded-full cursor-pointer"
              title="Reset Filters"
            >
                <RotateCcw size={14} />
            </button>
        </div>
        
        <div className="flex flex-col gap-6 pt-2">
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
              Search Products
            </label>
            <input 
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                placeholder="Search..."
                className="bg-black/40 border border-white/10 px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all duration-300 rounded-none w-full"
            />
          </div>

          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
              Sort By
            </label>
            <select 
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="bg-black/40 border border-white/10 px-3 py-2.5 text-xs text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all duration-300 rounded-none w-full cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23d4af37' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem',
                  backgroundRepeat: 'no-repeat',
                  paddingRight: '2.5rem'
                }}
            >
                <option value="default" className="bg-[#121212]">Default</option>
                <option value="price-asc" className="bg-[#121212]">Price: Low-High</option>
                <option value="price-desc" className="bg-[#121212]">Price: High-Low</option>
            </select>
          </div>

          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-medium flex items-center gap-2">
              <Users size={10} className="text-[#d4af37]" /> Category
            </label>
            <div className="flex flex-col gap-1.5 pt-1">
              {[
                { label: 'All Products', value: 'All', emoji: '✦' },
                { label: 'For Him', value: 'For Him', emoji: '♂' },
                { label: 'For Her', value: 'For Her', emoji: '♀' },
                { label: 'Seasonal', value: 'Seasonal', emoji: '◈' },
              ].map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFilters({ ...filters, category: cat.value })}
                  className={`flex items-center gap-3 px-3 py-2.5 text-[9px] tracking-widest uppercase border text-left transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                    filters.category === cat.value
                      ? 'bg-[#d4af37] border-[#d4af37] text-black font-bold'
                      : 'bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span className="text-sm leading-none">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-medium flex items-center gap-2">
              <Tag size={10} className="text-[#d4af37]" /> Collection
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {['All', 'Essential', 'New Arrival', 'Limited'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFilters({ ...filters, tag })}
                  className={`px-3 py-2 text-[9px] tracking-widest uppercase border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    filters.tag === tag
                      ? 'bg-[#d4af37] border-[#d4af37] text-black font-bold'
                      : 'bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-medium flex items-center gap-2">
              <Star size={10} className="text-[#d4af37]" /> Rating
            </label>
            <div className="flex flex-col gap-1.5 pt-1">
              {[
                { label: 'Any Rating', value: 0 },
                { label: '4.5+ Stars', value: 4.5 },
                { label: '4.0+ Stars', value: 4.0 },
                { label: '3.0+ Stars', value: 3.0 },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setFilters({ ...filters, minRating: r.value })}
                  className={`flex items-center justify-between px-3 py-2.5 text-[9px] tracking-widest uppercase border text-left transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                    filters.minRating === r.value
                      ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37] font-semibold'
                      : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span>{r.label}</span>
                  {r.value > 0 ? (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const isFilled = idx < Math.floor(r.value);
                        const isHalf = !isFilled && r.value % 1 !== 0 && idx === Math.floor(r.value);
                        return (
                          <Star
                            key={idx}
                            size={10}
                            className={
                              isFilled
                                ? 'fill-[#d4af37] text-[#d4af37]'
                                : isHalf
                                ? 'fill-[#d4af37]/60 text-[#d4af37]/60'
                                : 'text-gray-700'
                            }
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-600 text-[8px]">ALL RATINGS</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          
          <div className="flex flex-col gap-4 border-t border-b border-white/5 py-4 my-2">
            <div className="flex items-center justify-between">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-medium flex items-center gap-2">
                  <DollarSign size={10} className="text-[#d4af37]" /> Price Range
                </label>
                <label className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest cursor-pointer select-none">
                    <input 
                        type="checkbox" 
                        checked={filters.showDiscounts}
                        onChange={(e) => setFilters({...filters, showDiscounts: e.target.checked})}
                        className="accent-[#d4af37] cursor-pointer"
                    />
                    Discounts
                </label>
            </div>
            
            <div className="flex flex-col gap-3 px-1 pt-1">
              <Range
                step={10}
                min={0}
                max={250}
                values={[filters.minPrice, filters.maxPrice]}
                onChange={(values) => setFilters({...filters, minPrice: values[0], maxPrice: values[1]})}
                renderTrack={({ props, children }) => {
                  const { key, ...rest } = props as any;
                  return (
                    <div
                      key={key}
                      {...rest}
                      className="h-1 w-full bg-gray-800 rounded-md cursor-pointer"
                      style={{
                        background: getTrackBackground({
                          values: [filters.minPrice, filters.maxPrice],
                          colors: ['#222', '#d4af37', '#222'],
                          min: 0,
                          max: 250
                        })
                      }}
                    >
                      {children}
                    </div>
                  );
                }}
                renderThumb={({ props }) => {
                  const { key, ...rest } = props as any;
                  return (
                    <div
                      key={key}
                      {...rest}
                      className="h-3.5 w-3.5 bg-[#d4af37] rounded-full shadow-md focus:outline-none active:scale-95 transition-transform duration-200 cursor-grab active:cursor-grabbing"
                    />
                  );
                }}
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>${filters.minPrice}</span>
                <span>${filters.maxPrice}</span>
              </div>
            </div>
          </div>
          
          
          <button 
            onClick={apply}
            className="w-full bg-[#d4af37] text-black py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 hover:tracking-[0.25em] active:scale-98 cursor-pointer mt-2"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}