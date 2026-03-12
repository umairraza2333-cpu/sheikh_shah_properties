import { useState } from 'react';
import { useRoute } from 'wouter';
import { Link } from 'wouter';
import { MapPin, DollarSign, Bed, Bath, Ruler, MessageCircle, Phone, ArrowLeft, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import SEO from '@/components/SEO';
import { PropertySchema } from '@/components/RealEstateSchema';
import Breadcrumb from '@/components/Breadcrumb';
import { generatePropertySEO, generateOGImage } from '@/lib/seoUtils';

const WHATSAPP_NUMBER = '923392001927';

export default function PropertyDetail() {
  const [, params] = useRoute('/property/:id');
  const [selectedImage, setSelectedImage] = useState(0);
  
  const propertyId = params?.id ? parseInt(params.id) : null;

  const { data: property, isLoading } = trpc.properties.byId.useQuery(propertyId || 0, {
    enabled: !!propertyId,
  });

  const seoData = property ? generatePropertySEO(property) : null;
  const images = property && Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : (property?.imageUrl ? [property.imageUrl] : []);

  const handleWhatsAppInquiry = () => {
    const message = `Hi, I'm interested in this property: ${property?.title}. Price: ${property?.price}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 size={48} className="mx-auto text-muted-foreground mb-4 animate-bounce" />
          <p className="text-lg text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground mb-4">Property not found</p>
          <Link href="/properties" className="text-accent hover:underline">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {seoData && (
        <>
          <SEO
            title={seoData.title}
            description={seoData.description}
            keywords={seoData.keywords}
            image={generateOGImage(property)}
            url={`https://sheikhprop-p3nkkbke.manus.space/property/${propertyId}`}
            type="product"
          />
          <PropertySchema
            name={property.title}
            description={property.description || ''}
            image={images}
            price={property.price}
            address={property.location}
            bedrooms={property.bedrooms || undefined}
            bathrooms={property.bathrooms || undefined}
            area={property.area || undefined}
            propertyType={property.propertyType}
            url={`https://sheikhprop-p3nkkbke.manus.space/property/${propertyId}`}
          />
        </>
      )}

      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="container py-8">
          <Breadcrumb
            items={[
              { label: 'Properties', href: '/properties' },
              { label: property.title },
            ]}
          />
        </div>

        <div className="container pb-16">
          {/* Back Button */}
          <Link href="/properties" className="inline-flex items-center gap-2 text-accent hover:underline mb-6">
            <ArrowLeft size={20} />
            Back to Properties
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Gallery */}
            <div className="lg:col-span-2">
              <div className="relative bg-muted rounded-xl overflow-hidden mb-4 h-96">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[selectedImage]}
                      alt={`${property.title} - Image ${selectedImage + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full transition-colors"
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
                          {selectedImage + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <Building2 size={48} className="text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-accent' : 'border-border'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Property Details */}
              <div className="bg-card border border-border rounded-xl p-6 mt-8">
                <h2 className="text-2xl font-bold mb-4">Property Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-3">
                      <Bed size={24} className="text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-3">
                      <Bath size={24} className="text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.area && (
                    <div className="flex items-center gap-3">
                      <Ruler size={24} className="text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Area</p>
                        <p className="font-semibold">{property.area} sq ft</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Building2 size={24} className="text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-semibold">{property.propertyType}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="bg-card border border-border rounded-xl p-6 mt-6">
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              {/* Price Card */}
              <div className="bg-card border border-border rounded-xl p-6 sticky top-20">
                <div className="flex items-center gap-2 text-accent font-bold text-3xl mb-4">
                  <DollarSign size={32} />
                  <span>{property.price}</span>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 mb-6 pb-6 border-b border-border">
                  <MapPin size={20} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{property.location}</p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 mb-3 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Chat on WhatsApp
                </button>

                <a
                  href={`tel:+${WHATSAPP_NUMBER}`}
                  className="w-full bg-card border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-muted transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
