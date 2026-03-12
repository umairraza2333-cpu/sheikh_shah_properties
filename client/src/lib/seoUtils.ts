/**
 * SEO Utilities for generating keywords, descriptions, and slugs
 */

interface PropertySEOData {
  title: string;
  description: string;
  keywords: string;
}

interface ProjectSEOData {
  title: string;
  description: string;
  keywords: string;
}

/**
 * Generate SEO data for properties based on their attributes
 */
export function generatePropertySEO(property: any): PropertySEOData {
  const { title, bedrooms, bathrooms, location, area, propertyType, price } = property;

  // Generate title with keywords
  const bedroomText = bedrooms ? `${bedrooms} Bed` : '';
  const seoTitle = `${bedroomText} ${propertyType} in ${location} | ${title} | Sheikh & Shah Real Estate`;

  // Generate description
  const seoDescription = `${title} - ${bedroomText} luxury ${propertyType.toLowerCase()} in ${location}, Karachi. 
    ${area} sq ft. PKR ${price}. Premium property investment opportunity. Contact Sheikh & Shah Real Estate.`.replace(/\s+/g, ' ').trim();

  // Generate keywords
  const keywords = [
    title,
    `${bedroomText} apartment ${location}`,
    `${propertyType.toLowerCase()} in ${location}`,
    `Karachi ${propertyType.toLowerCase()}`,
    `${location} property Karachi`,
    `luxury apartments Karachi`,
    `ready to move ${location}`,
    `property investment Karachi`,
    `verified real estate listings Karachi`,
  ].join(', ');

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
  };
}

/**
 * Generate SEO data for projects
 */
export function generateProjectSEO(project: any): ProjectSEOData {
  const { name, location, description, status } = project;

  // Generate title
  const seoTitle = `${name} - ${status === 'completed' ? 'Completed' : 'Ongoing'} Project in ${location} | Sheikh & Shah Real Estate`;

  // Generate description
  const seoDescription = `${name} is a ${status} real estate project in ${location}, Karachi. 
    ${description}. Premium development by Sheikh & Shah Real Estate. Invest in prime Karachi locations.`.replace(/\s+/g, ' ').trim();

  // Generate keywords
  const keywords = [
    name,
    `${location} project Karachi`,
    `real estate project ${location}`,
    `${status} project Karachi`,
    `property investment ${location}`,
    `Karachi real estate projects`,
    `luxury apartments Karachi`,
    `Scheme 33 Karachi`,
    `Gulshan-e-Iqbal apartments`,
  ].join(', ');

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
  };
}

/**
 * Convert text to URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate page-specific SEO data
 */
export const pageSEO = {
  home: {
    title: 'Sheikh & Shah Real Estate | Premium Property Investment in Karachi',
    description: 'Discover premium properties and investment opportunities in Karachi. Sheikh & Shah Real Estate offers luxury apartments, projects, and verified listings in Scheme 33, Scheme 45, Gulshan-e-Iqbal, and more.',
    keywords: 'Sheikh and Shah, Karachi property, luxury apartments Karachi, real estate Karachi, property investment Karachi, Scheme 33, Scheme 45, Gulshan-e-Iqbal',
  },
  properties: {
    title: 'Properties for Sale in Karachi | Luxury Apartments & Real Estate | Sheikh & Shah',
    description: 'Browse our exclusive collection of premium properties in Karachi. Find 2, 3, and 4 bedroom apartments in Scheme 33, Scheme 45, Gulshan-e-Iqbal, and Gulshan-e-Johar. Verified listings with competitive prices.',
    keywords: '2 bed apartments Gulshan-e-Iqbal, 3 bed apartments Scheme 33 Karachi, ready to move flats Karachi, property listings Karachi, luxury apartments Karachi',
  },
  projects: {
    title: 'Real Estate Projects in Karachi | Ongoing & Completed | Sheikh & Shah',
    description: 'Explore our premium real estate development projects in Karachi. From Ahmed Arcade to City Comfort Apartments, discover verified projects in prime locations.',
    keywords: 'real estate projects Karachi, Ahmed Arcade, City Comfort Apartments, development projects Karachi, property investment opportunities',
  },
  about: {
    title: 'About Sheikh & Shah Real Estate | Trusted Property Advisors in Karachi',
    description: 'Learn about Sheikh & Shah Real Estate - your trusted partner for property buying, selling, and investment in Karachi. Years of experience in premium real estate solutions.',
    keywords: 'Sheikh and Shah, real estate advisors Karachi, property consultants, trusted real estate company',
  },
  contact: {
    title: 'Contact Sheikh & Shah Real Estate | Get in Touch | Karachi',
    description: 'Contact Sheikh & Shah Real Estate for property inquiries, consultations, and investment opportunities. Call +92 339 2001927 or visit our office in Scheme 33, Karachi.',
    keywords: 'contact real estate Karachi, property inquiry, Sheikh and Shah contact, real estate consultation',
  },
};

/**
 * Generate Open Graph image URL for properties
 */
export function generateOGImage(property: any): string {
  if (property.images && Array.isArray(property.images) && property.images.length > 0) {
    return property.images[0];
  }
  return property.imageUrl || 'https://sheikhprop-p3nkkbke.manus.space/og-image.jpg';
}

/**
 * Generate canonical URL
 */
export function generateCanonicalURL(path: string): string {
  return `https://sheikhprop-p3nkkbke.manus.space${path}`;
}

/**
 * Generate structured data for FAQ
 */
export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What properties does Sheikh & Shah Real Estate offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer luxury apartments, commercial properties, and verified real estate listings in prime Karachi locations including Scheme 33, Scheme 45, Gulshan-e-Iqbal, and Gulshan-e-Johar.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I invest in real estate with Sheikh & Shah?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We provide comprehensive investment consultancy and help you find the best property investment opportunities in Karachi. Contact us for personalized guidance.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are all listings verified?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all our property listings are verified and authentic. We ensure transparency and trust in every transaction.',
        },
      },
    ],
  };
}
