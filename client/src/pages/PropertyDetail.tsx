import { useState } from 'react';
import { useRoute } from 'wouter';
import { MapPin, DollarSign, Bed, Bath, Ruler, MessageCircle, Phone, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';

const WHATSAPP_NUMBER = '923392001927';

export default function PropertyDetail() {
  const [, params] = useRoute('/properties/:id');
  const propertyId = params?.id ? parseInt(params.id) : null;
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: property, isLoading } = trpc.properties.byId.useQuery(propertyId || 0, {
    enabled: !!propertyId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Property not found</p>
          <Link href="/properties" className="text-accent hover:underline">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(property.images) && property.images.length > 0 ? property.images : (property.imageUrl ? [property.imageUrl] : []);

  const handleWhatsAppInquiry = () => {
    const message = `Hi, I'm interested in this property: ${property.title}. Price: ${property.price}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-8">
        <div className="container">
          <Link href="/properties" className="flex items-center gap-2 text-background/80 hover:text-background mb-4 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Properties</span>
          </Link>
          <h1 className="text-4xl font-bold">{property.title}</h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative h-96 md:h-[500px] bg-muted rounded-xl overflow-hidden mb-4">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage]}
                    alt={`${property.title} - Image ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <div className="text-center">
                      <div className="text-muted-foreground text-lg">No image available</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-accent' : 'border-border'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Property</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Property Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <DollarSign className="mx-auto text-accent mb-2" size={24} />
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-bold">{property.price}</p>
                </div>
                {property.bedrooms && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Bed className="mx-auto text-accent mb-2" size={24} />
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-bold">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Bath className="mx-auto text-accent mb-2" size={24} />
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-bold">{property.bathrooms}</p>
                  </div>
                )}
                <div className="text-center p-4 bg-muted rounded-lg">
                  <MapPin className="mx-auto text-accent mb-2" size={24} />
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="font-bold">{property.area}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Ruler className="mx-auto text-accent mb-2" size={24} />
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-bold capitalize">{property.propertyType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h3 className="text-2xl font-bold mb-6">Contact Agent</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Phone className="text-accent flex-shrink-0" size={20} />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <a href="tel:+923392001927" className="font-semibold text-foreground hover:text-accent transition-colors">
                      0339-2001927
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp Inquiry</span>
                </button>

                <button className="w-full bg-muted text-foreground py-3 rounded-lg font-semibold hover:bg-muted/80 transition-all duration-300">
                  Schedule Viewing
                </button>
              </div>

              {/* Property Status */}
              <div className="mt-6 p-4 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="font-bold capitalize text-accent">{property.status}</p>
              </div>

              {/* Location Info */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <MapPin className="text-accent flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <p className="font-semibold">{property.location}</p>
                    <p className="text-sm text-muted-foreground">{property.area}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
