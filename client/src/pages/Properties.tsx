import { useState, useMemo } from 'react';
import { MapPin, DollarSign, Bed, Bath, Building2, MessageCircle, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import AdvancedSearch from '@/components/AdvancedSearch';
import PopularSearches from '@/components/PopularSearches';
import SEO from '@/components/SEO';
import Breadcrumb from '@/components/Breadcrumb';

const WHATSAPP_NUMBER = '923392001927';

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

export default function Properties() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<SearchFilters>({
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

  const { data: properties = [] } = trpc.properties.list.useQuery({});

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Location filter
      if (filters.location !== 'All Areas' && property.location !== filters.location) {
        return false;
      }

      // Property type filter
      if (filters.propertyType !== 'All Types' && property.propertyType !== filters.propertyType) {
        return false;
      }

      // Price filters
      const price = parseInt(property.price.replace(/[^0-9]/g, ''));
      if (filters.minPrice && price < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && price > parseInt(filters.maxPrice)) {
        return false;
      }

      // Area filters
      const area = parseInt(property.area);
      if (filters.minArea && area < parseInt(filters.minArea)) {
        return false;
      }
      if (filters.maxArea && area > parseInt(filters.maxArea)) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms !== 'All' && property.bedrooms) {
        const bedroomCount = property.bedrooms.toString();
        if (filters.bedrooms === '5+' && property.bedrooms < 5) {
          return false;
        } else if (filters.bedrooms !== '5+' && bedroomCount !== filters.bedrooms) {
          return false;
        }
      }

      // Bathrooms filter
      if (filters.bathrooms !== 'All' && property.bathrooms) {
        const bathroomCount = property.bathrooms.toString();
        if (filters.bathrooms === '4+' && property.bathrooms < 4) {
          return false;
        } else if (filters.bathrooms !== '4+' && bathroomCount !== filters.bathrooms) {
          return false;
        }
      }

      return true;
    });
  }, [properties, filters]);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleWhatsAppInquiry = (propertyId: number, propertyTitle: string) => {
    const message = `Hi, I'm interested in the property: ${propertyTitle}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <>
      <SEO
        title="Properties for Sale & Rent in Karachi | Sheikh & Shah Real Estate"
        description="Browse premium properties in Karachi including apartments, houses, and commercial spaces in Scheme 33, Scheme 45, Gulshan-e-Iqbal, and Gulshan-e-Johar."
        keywords="properties Karachi, apartments for sale, houses for rent, real estate Karachi, Scheme 33, Gulshan-e-Iqbal"
        url="https://sheikhprop-p3nkkbke.manus.space/properties"
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-foreground to-foreground/90 text-background py-12">
          <div className="container">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Properties' },
              ]}
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-2 mt-4">Find Your Perfect Property</h1>
            <p className="text-background/80 text-lg">Browse our exclusive collection of premium properties in Karachi</p>
          </div>
        </div>

        <div className="container py-12">
          {/* Advanced Search */}
          <AdvancedSearch onSearch={handleSearch} initialFilters={filters} />

          {/* Popular Searches */}
          <PopularSearches />

          {/* Results Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {filteredProperties.length} Properties Found
            </h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-card border border-border rounded-lg hover:border-accent transition-colors">
                Newest
              </button>
              <button className="px-4 py-2 bg-card border border-border rounded-lg hover:border-accent transition-colors">
                Price: Low to High
              </button>
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => {
                const images = Array.isArray(property.images) && property.images.length > 0
                  ? property.images
                  : (property.imageUrl ? [property.imageUrl] : []);

                return (
                  <Link
                    key={property.id}
                    href={`/property/${property.id}`}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-accent"
                  >
                    <div className="relative h-64 bg-muted overflow-hidden">
                      {images.length > 0 ? (
                        <img
                          src={images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <Building2 size={48} className="text-muted-foreground" />
                        </div>
                      )}
                      {images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                          {images.length} Photos
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    <div className="p-4">
                      {/* Price */}
                      <div className="flex items-center gap-1 text-accent font-bold text-2xl mb-2">
                        <DollarSign size={24} />
                        <span>{property.price}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {property.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <MapPin size={16} />
                        <span className="text-sm">{property.location}</span>
                      </div>

                      {/* Details */}
                      <div className="flex gap-4 text-sm mb-4 pb-4 border-b border-border">
                        {property.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed size={16} className="text-accent" />
                            <span>{property.bedrooms} Bed</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-1">
                            <Bath size={16} className="text-accent" />
                            <span>{property.bathrooms} Bath</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="flex items-center gap-1">
                            <Building2 size={16} className="text-accent" />
                            <span>{property.area} sqft</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={e => {
                            e.preventDefault();
                            handleWhatsAppInquiry(property.id, property.title);
                          }}
                          className="flex-1 bg-accent text-accent-foreground py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                        >
                          <MessageCircle size={16} />
                          Inquire
                        </button>
                        <button
                          onClick={e => {
                            e.preventDefault();
                            setLocation(`/property/${property.id}`);
                          }}
                          className="flex-1 bg-card border border-border text-foreground py-2 rounded-lg hover:border-accent transition-colors flex items-center justify-center gap-2 font-semibold"
                        >
                          View Details
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Properties Found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters to find more properties</p>
              <button
                onClick={() => setFilters({
                  location: 'All Areas',
                  propertyType: 'All Types',
                  minPrice: '',
                  maxPrice: '',
                  minArea: '',
                  maxArea: '',
                  bedrooms: 'All',
                  bathrooms: 'All',
                  transactionType: 'buy',
                })}
                className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
