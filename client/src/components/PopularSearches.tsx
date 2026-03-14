import { Link } from 'wouter';
import { TrendingUp } from 'lucide-react';

interface PopularSearch {
  label: string;
  filters: {
    location?: string;
    propertyType?: string;
    bedrooms?: string;
  };
}

const POPULAR_SEARCHES: PopularSearch[] = [
  { label: '1 Bedroom Apartments in Scheme 33', filters: { location: 'Scheme 33', bedrooms: '1', propertyType: 'Apartment' } },
  { label: '2 Bedroom Flats in Gulshan-e-Iqbal', filters: { location: 'Gulshan-e-Iqbal', bedrooms: '2', propertyType: 'Apartment' } },
  { label: '3 Bedroom Houses in Scheme 45', filters: { location: 'Scheme 45', bedrooms: '3', propertyType: 'House' } },
  { label: 'Luxury Apartments Karachi', filters: { propertyType: 'Apartment' } },
  { label: 'Commercial Spaces in Gulshan-e-Johar', filters: { location: 'Gulshan-e-Johar', propertyType: 'Commercial' } },
  { label: 'Ready to Move Flats', filters: { propertyType: 'Apartment' } },
  { label: 'Investment Properties Karachi', filters: {} },
  { label: 'Plots in Scheme 33', filters: { location: 'Scheme 33', propertyType: 'Plot' } },
];

export default function PopularSearches() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={24} className="text-accent" />
        <h2 className="text-2xl font-bold">Popular Searches</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {POPULAR_SEARCHES.map((search, index) => (
          <Link
            key={index}
            href={`/properties?${new URLSearchParams(
              Object.entries(search.filters).filter(([, v]) => v)
            ).toString()}`}
            className="group p-4 bg-background border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-300 cursor-pointer"
          >
            <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
              {search.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
