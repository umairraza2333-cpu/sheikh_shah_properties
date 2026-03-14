import { useState } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchFilters {
  location: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  bedrooms: string;
  bathrooms: string;
  transactionType: 'buy' | 'rent' | 'projects';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

const LOCATIONS = ['Scheme 33', 'Scheme 45', 'Gulshan-e-Iqbal', 'Gulshan-e-Johar', 'All Areas'];
const PROPERTY_TYPES = ['Apartment', 'House', 'Commercial', 'Plot', 'Office', 'All Types'];
const BEDROOMS = ['1', '2', '3', '4', '5+', 'All'];
const BATHROOMS = ['1', '2', '3', '4+', 'All'];

export default function AdvancedSearch({ onSearch, initialFilters }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: initialFilters?.location || 'All Areas',
    propertyType: initialFilters?.propertyType || 'All Types',
    minPrice: initialFilters?.minPrice || '',
    maxPrice: initialFilters?.maxPrice || '',
    minArea: initialFilters?.minArea || '',
    maxArea: initialFilters?.maxArea || '',
    bedrooms: initialFilters?.bedrooms || 'All',
    bathrooms: initialFilters?.bathrooms || 'All',
    transactionType: initialFilters?.transactionType || 'buy',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      location: 'All Areas',
      propertyType: 'All Types',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      bedrooms: 'All',
      bathrooms: 'All',
      transactionType: 'buy',
    });
  };

  const hasActiveFilters = 
    filters.location !== 'All Areas' ||
    filters.propertyType !== 'All Types' ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minArea ||
    filters.maxArea ||
    filters.bedrooms !== 'All' ||
    filters.bathrooms !== 'All';

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      {/* Transaction Type Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border pb-4">
        {(['buy', 'rent', 'projects'] as const).map(type => (
          <button
            key={type}
            onClick={() => handleFilterChange('transactionType', type)}
            className={`px-4 py-2 font-semibold capitalize transition-colors ${
              filters.transactionType === type
                ? 'text-accent border-b-2 border-accent -mb-4'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {type === 'buy' ? 'Buy' : type === 'rent' ? 'Rent' : 'Projects'}
          </button>
        ))}
      </div>

      {/* Main Search Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Location */}
        <div className="relative">
          <label className="block text-sm font-semibold text-muted-foreground mb-2">Location</label>
          <select
            value={filters.location}
            onChange={e => handleFilterChange('location', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-10 pointer-events-none text-muted-foreground" />
        </div>

        {/* Property Type */}
        <div className="relative">
          <label className="block text-sm font-semibold text-muted-foreground mb-2">Property Type</label>
          <select
            value={filters.propertyType}
            onChange={e => handleFilterChange('propertyType', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {PROPERTY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-10 pointer-events-none text-muted-foreground" />
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2">Min Price</label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={e => handleFilterChange('minPrice', e.target.value)}
            placeholder="Min"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-semibold text-muted-foreground mb-2">Max Price</label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={e => handleFilterChange('maxPrice', e.target.value)}
            placeholder="Max"
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-accent hover:underline text-sm font-semibold mb-4 flex items-center gap-2"
      >
        {showAdvanced ? 'Hide' : 'Show'} More Filters
        <ChevronDown size={16} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-background rounded-lg border border-border">
          {/* Min Area */}
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Min Area (sq ft)</label>
            <input
              type="number"
              value={filters.minArea}
              onChange={e => handleFilterChange('minArea', e.target.value)}
              placeholder="Min"
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Max Area */}
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Max Area (sq ft)</label>
            <input
              type="number"
              value={filters.maxArea}
              onChange={e => handleFilterChange('maxArea', e.target.value)}
              placeholder="Max"
              className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Bedrooms */}
          <div className="relative">
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Bedrooms</label>
            <select
              value={filters.bedrooms}
              onChange={e => handleFilterChange('bedrooms', e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {BEDROOMS.map(bed => (
                <option key={bed} value={bed}>{bed}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-10 pointer-events-none text-muted-foreground" />
          </div>

          {/* Bathrooms */}
          <div className="relative">
            <label className="block text-sm font-semibold text-muted-foreground mb-2">Bathrooms</label>
            <select
              value={filters.bathrooms}
              onChange={e => handleFilterChange('bathrooms', e.target.value)}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {BATHROOMS.map(bath => (
                <option key={bath} value={bath}>{bath}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-10 pointer-events-none text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={handleSearch}
          className="flex-1 min-w-[200px] bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <Search size={20} />
          Search Properties
        </Button>

        {hasActiveFilters && (
          <Button
            onClick={handleReset}
            variant="outline"
            className="px-6 py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <X size={20} />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
