import { useState } from 'react';
import { Search, MapPin, DollarSign, Bed, CheckCircle, MapPinIcon, Building2, TrendingUp, Users } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function Home() {
  const [searchArea, setSearchArea] = useState('');
  const [searchBedrooms, setSearchBedrooms] = useState<number | undefined>();

  const { data: featuredProperties } = trpc.properties.featured.useQuery({ limit: 6 });

  const areas = ['Scheme 33', 'Scheme 45', 'Gulshan-e-Iqbal', 'Gulshan-e-Johar'];

  const services = [
    {
      icon: Building2,
      title: 'Property Buying',
      description: 'Find your perfect property with our expert guidance',
    },
    {
      icon: TrendingUp,
      title: 'Property Selling',
      description: 'Sell your property quickly at the best price',
    },
    {
      icon: Users,
      title: 'Investment Consultancy',
      description: 'Smart investment opportunities in prime locations',
    },
    {
      icon: MapPinIcon,
      title: 'Project Marketing',
      description: 'Comprehensive marketing for your projects',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] bg-gradient-to-br from-foreground via-foreground to-foreground/90 text-background overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 py-12 md:py-20 lg:py-24">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Premium Property Investment in Karachi
            </h1>
            <p className="text-lg md:text-xl text-background/90 mb-8">
              Sheikh & Shah Properties – <span className="text-accent font-semibold">Where Trust Meets Success</span>
            </p>

            {/* Search Section */}
            <div className="bg-background text-foreground rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Location Search */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-accent" size={20} />
                  <input
                    type="text"
                    placeholder="Select Area"
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {/* Bedrooms */}
                <div className="relative">
                  <Bed className="absolute left-3 top-3 text-accent" size={20} />
                  <select
                    value={searchBedrooms || ''}
                    onChange={(e) => setSearchBedrooms(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-background"
                  >
                    <option value="">Any Bedrooms</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                  </select>
                </div>

                {/* Search Button */}
                <Link href="/properties">
                  <a className="flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-lg hover:shadow-lg transition-all duration-300 font-semibold">
                    <Search size={20} />
                    <span>Search</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-muted-foreground text-lg">Discover our hand-picked premium properties</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties?.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <a className="group cursor-pointer">
                  <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    {/* Image */}
                    <div className="relative h-48 md:h-56 bg-muted overflow-hidden">
                      {property.imageUrl ? (
                        <img
                          src={property.imageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <Building2 size={48} className="text-muted-foreground" />
                        </div>
                      )}
                      {property.featured && (
                        <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{property.title}</h3>

                      <div className="flex items-center gap-2 text-accent font-bold text-lg mb-4">
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

                      <button className="w-full bg-accent text-accent-foreground py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                        View Details
                      </button>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/properties">
              <a className="btn-primary">View All Properties</a>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-background/80 text-lg">Comprehensive real estate solutions for all your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-background/10 backdrop-blur-sm border border-background/20 rounded-xl p-6 hover:bg-background/20 transition-all duration-300 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-accent text-foreground p-3 rounded-lg">
                      <Icon size={28} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-background/80 text-sm">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Areas We Cover Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Areas We Cover</h2>
            <p className="text-muted-foreground text-lg">Prime locations across Karachi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {areas.map((area) => (
              <div
                key={area}
                className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg hover:border-accent transition-all duration-300 cursor-pointer group"
              >
                <div className="flex justify-center mb-4">
                  <MapPin size={32} className="text-accent group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-2">{area}</h3>
                <p className="text-muted-foreground text-sm">Premium properties and investment opportunities</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-gradient-to-br from-foreground to-foreground/95 text-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-background/80 text-lg">Your trusted partner in real estate</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              'Trusted property advisors with years of experience',
              'Best investment opportunities in prime locations',
              'Professional and transparent marketing',
              'Fast and hassle-free property transactions',
            ].map((reason, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle size={24} className="text-accent flex-shrink-0 mt-1" />
                <p className="text-lg">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
