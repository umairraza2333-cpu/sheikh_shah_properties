import { useState } from 'react';
import { MapPin, DollarSign, Bed, Bath, Building2, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';

const WHATSAPP_NUMBER = '923392001927';

export default function Properties() {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | undefined>();

  const { data: properties = [] } = trpc.properties.list.useQuery({
    area: selectedArea || undefined,
    bedrooms: selectedBedrooms,
  });

  const areas = ['Scheme 33', 'Scheme 45', 'Gulshan-e-Iqbal', 'Gulshan-e-Johar'];

  const handleWhatsAppInquiry = (propertyId: number, propertyTitle: string) => {
    const message = `Hi, I'm interested in the property: ${propertyTitle}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Our Properties</h1>
          <p className="text-background/80 text-lg">Browse our exclusive collection of premium properties</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Filters</h3>

              {/* Area Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Area</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedArea('')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedArea === ''
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    All Areas
                  </button>
                  {areas.map((area) => (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedArea === area
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Bedrooms</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedBedrooms(undefined)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedBedrooms === undefined
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    Any
                  </button>
                  {[1, 2, 3, 4].map((bed) => (
                    <button
                      key={bed}
                      onClick={() => setSelectedBedrooms(bed)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedBedrooms === bed
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {bed} Bedroom{bed > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSelectedArea('');
                  setSelectedBedrooms(undefined);
                }}
                className="w-full bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors font-semibold"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No properties found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-muted overflow-hidden">
                      {(() => {
                        const imageUrl = Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : property.imageUrl;
                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={property.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                            <Building2 size={48} className="text-muted-foreground" />
                          </div>
                        );
                      })()}
                      <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {property.propertyType}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">{property.title}</h3>

                      <div className="flex items-center gap-2 text-accent font-bold text-xl mb-4">
                        <DollarSign size={20} />
                        <span>{property.price}</span>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{property.location}</span>
                        </div>
                        {property.bedrooms && (
                          <div className="flex items-center gap-2">
                            <Bed size={16} />
                            <span>{property.bedrooms} Bedrooms</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-2">
                            <Bath size={16} />
                            <span>{property.bathrooms} Bathrooms</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {property.description}
                      </p>

                      <div className="flex gap-2">
                        <Link
                          href={`/properties/${property.id}`}
                          className="flex-1 bg-accent text-accent-foreground py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleWhatsAppInquiry(property.id, property.title)}
                          className="flex-1 bg-muted text-foreground py-2 rounded-lg font-semibold hover:bg-muted/80 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <MessageCircle size={16} />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
