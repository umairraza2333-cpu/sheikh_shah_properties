import { useEffect } from 'react';

interface RealEstateAgentSchemaProps {
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: string;
  image?: string;
  url?: string;
  socialProfiles?: string[];
}

interface PropertySchemaProps {
  name: string;
  description: string;
  image: string | string[];
  price: string;
  priceCurrency?: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  propertyType?: string;
  url?: string;
  availability?: string;
  agent?: {
    name: string;
    phone?: string;
  };
}

interface ProjectSchemaProps {
  name: string;
  description: string;
  image: string | string[];
  address: string;
  url?: string;
  developer?: string;
  startDate?: string;
  completionDate?: string;
  status?: string;
}

/**
 * Real Estate Agent Schema Component
 * Adds structured data for the company
 */
export function RealEstateAgentSchema({
  name = 'Sheikh & Shah Real Estate',
  description = 'Premium real estate solutions in Karachi',
  phone = '+92 339 2001927',
  email = 'info@sheikhshah.com',
  address = 'Scheme 33, Karachi, Pakistan',
  logo = 'https://sheikhprop-p3nkkbke.manus.space/logo.png',
  image = 'https://sheikhprop-p3nkkbke.manus.space/og-image.jpg',
  url = 'https://sheikhprop-p3nkkbke.manus.space',
  socialProfiles = [
    'https://www.facebook.com/sheikhshah',
    'https://www.instagram.com/sheikhshah',
    'https://www.whatsapp.com/message/...',
  ],
}: RealEstateAgentSchemaProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name,
      description,
      image,
      logo,
      url,
      telephone: phone,
      email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.split(',')[0],
        addressLocality: 'Karachi',
        addressRegion: 'Sindh',
        postalCode: '75500',
        addressCountry: 'PK',
      },
      sameAs: socialProfiles,
      priceRange: '$$$$',
      areaServed: ['Scheme 33', 'Scheme 45', 'Gulshan-e-Iqbal', 'Gulshan-e-Johar'],
    };

    addSchemaToHead(schema);
  }, [name, description, phone, email, address, logo, image, url, socialProfiles]);

  return null;
}

/**
 * Property Schema Component
 * Adds structured data for individual properties
 */
export function PropertySchema({
  name,
  description,
  image,
  price,
  priceCurrency = 'PKR',
  address,
  bedrooms,
  bathrooms,
  area,
  propertyType = 'Apartment',
  url = typeof window !== 'undefined' ? window.location.href : '',
  availability = 'InStock',
  agent = { name: 'Sheikh & Shah Real Estate' },
}: PropertySchemaProps) {
  useEffect(() => {
    const images = Array.isArray(image) ? image : [image];

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateProperty',
      name,
      description,
      image: images,
      url,
      price,
      priceCurrency,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.split(',')[0],
        addressLocality: address.includes('Gulshan') ? 'Gulshan-e-Iqbal' : 'Karachi',
        addressRegion: 'Sindh',
        addressCountry: 'PK',
      },
      numberOfRooms: bedrooms,
      numberOfBathroomsUnitConfiguration: bathrooms,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: area,
        unitCode: 'SQM',
      },
      propertyType,
      availability,
      realEstateAgent: {
        '@type': 'RealEstateAgent',
        name: agent.name,
        telephone: agent.phone,
      },
    };

    addSchemaToHead(schema);
  }, [name, description, image, price, priceCurrency, address, bedrooms, bathrooms, area, propertyType, url, availability, agent]);

  return null;
}

/**
 * Project Schema Component
 * Adds structured data for development projects
 */
export function ProjectSchema({
  name,
  description,
  image,
  address,
  url = typeof window !== 'undefined' ? window.location.href : '',
  developer = 'Sheikh & Shah Real Estate',
  startDate,
  completionDate,
  status = 'In Progress',
}: ProjectSchemaProps) {
  useEffect(() => {
    const images = Array.isArray(image) ? image : [image];

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateProject',
      name,
      description,
      image: images,
      url,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.split(',')[0],
        addressLocality: 'Karachi',
        addressRegion: 'Sindh',
        addressCountry: 'PK',
      },
      developer: {
        '@type': 'Organization',
        name: developer,
      },
      startDate,
      completionDate,
      status,
    };

    addSchemaToHead(schema);
  }, [name, description, image, address, url, developer, startDate, completionDate, status]);

  return null;
}

/**
 * Organization Schema Component
 * Adds structured data for the organization
 */
export function OrganizationSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Sheikh & Shah Real Estate',
      url: 'https://sheikhprop-p3nkkbke.manus.space',
      logo: 'https://sheikhprop-p3nkkbke.manus.space/logo.png',
      description: 'Premium real estate solutions and property investment opportunities in Karachi',
      telephone: '+92 339 2001927',
      email: 'info@sheikhshah.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Scheme 33',
        addressLocality: 'Karachi',
        addressRegion: 'Sindh',
        postalCode: '75500',
        addressCountry: 'PK',
      },
      sameAs: [
        'https://www.facebook.com/sheikhshah',
        'https://www.instagram.com/sheikhshah',
        'https://www.whatsapp.com/message/...',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        telephone: '+92 339 2001927',
        email: 'info@sheikhshah.com',
        areaServed: ['Scheme 33', 'Scheme 45', 'Gulshan-e-Iqbal', 'Gulshan-e-Johar'],
      },
    };

    addSchemaToHead(schema);
  }, []);

  return null;
}

/**
 * Helper function to add schema to document head
 */
function addSchemaToHead(schema: any) {
  // Remove existing schema if present
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Create and add new schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}
