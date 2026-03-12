import { useState } from 'react';
import { MapPin, DollarSign, Bed, Building2, Award, Users, Zap, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import SEO from '@/components/SEO';
import { RealEstateAgentSchema, OrganizationSchema } from '@/components/RealEstateSchema';
import { pageSEO } from '@/lib/seoUtils';

const WHATSAPP_NUMBER = '923392001927';

export default function Home() {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const { data: properties = [] } = trpc.properties.list.useQuery({
    area: selectedArea || undefined,
  });

  const areas = ['Scheme 33', 'Scheme 45', 'Gulshan-e-Iqbal', 'Gulshan-e-Johar'];

  const handleWhatsAppInquiry = (message: string) => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <>
      <SEO
        title={pageSEO.home.title}
        description={pageSEO.home.description}
        keywords={pageSEO.home.keywords}
        type="website"
      />
      <RealEstateAgentSchema />
      <OrganizationSchema />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-foreground to-foreground/90 text-background py-20 md:py-32">
          <div className="container">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Premium Property Investment in Karachi</h1>
            <p className="text-xl md:text-2xl text-background/90 mb-8">
              Sheikh & Shah Properties – <span className="text-accent font-semibold">Where Trust Meets Success</span>
            </p>

            {/* Search Section */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Find Your Perfect Property</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Location</label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">All Areas</option>
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Property Type</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                    <option>All Types</option>
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Link href="/properties" className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                    Search Properties
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <h2 className="text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-lg text-muted-foreground mb-12">Discover our hand-picked premium properties in Karachi</p>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.slice(0, 3).map((property) => (
                  <div key={property.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-48 bg-muted overflow-hidden">
                      {(() => {
                        const imageUrl = Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : property.imageUrl;
                        return imageUrl ? (
                          <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                            <Building2 size={48} className="text-muted-foreground" />
                          </div>
                        );
                      })()}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2">{property.title}</h3>
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
                      </div>
                      <Link href={`/property/${property.id}`} className="w-full bg-accent text-accent-foreground py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No properties available yet. Check back soon!</p>
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/properties" className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                View All Properties
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container">
            <h2 className="text-4xl font-bold mb-4 text-center">Our Services</h2>
            <p className="text-lg text-muted-foreground mb-12 text-center">Comprehensive real estate solutions for all your needs</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: DollarSign, title: 'Property Buying', description: 'Find your perfect property with our expert guidance' },
                { icon: Building2, title: 'Property Selling', description: 'Sell your property quickly at the best price' },
                { icon: Award, title: 'Investment Consultancy', description: 'Smart investment opportunities in prime locations' },
                { icon: Users, title: 'Project Marketing', description: 'Comprehensive marketing for your projects' },
              ].map((service, index) => (
                <div key={index} className="bg-background border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300">
                  <service.icon size={40} className="text-accent mb-4" />
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Areas We Cover */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <h2 className="text-4xl font-bold mb-4 text-center">Areas We Cover</h2>
            <p className="text-lg text-muted-foreground mb-12 text-center">Prime locations across Karachi</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {areas.map((area) => (
                <div key={area} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setSelectedArea(area)}>
                  <MapPin size={40} className="text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{area}</h3>
                  <p className="text-muted-foreground mb-4">Premium properties and investment opportunities</p>
                  <button onClick={() => setSelectedArea(area)} className="text-accent font-semibold hover:underline">
                    Explore →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container">
            <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Us</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Award, title: 'Trusted Advisors', description: 'Years of experience in premium real estate' },
                { icon: Zap, title: 'Best Opportunities', description: 'Investment opportunities in prime locations' },
                { icon: Users, title: 'Professional Team', description: 'Transparent and professional marketing' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <item.icon size={48} className="text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-foreground to-foreground/90 text-background">
          <div className="container text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
            <p className="text-xl text-background/90 mb-8">Contact us today for personalized assistance</p>
            <button
              onClick={() => handleWhatsAppInquiry('Hi, I am interested in your real estate services.')}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
