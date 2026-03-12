import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  twitterHandle?: string;
}

/**
 * SEO Component for managing meta tags and Open Graph data
 * Usage: <SEO title="..." description="..." keywords="..." />
 */
export default function SEO({
  title,
  description,
  keywords = '',
  image = 'https://sheikhprop-p3nkkbke.manus.space/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  author = 'Sheikh & Shah Real Estate',
  publishedDate,
  modifiedDate,
  twitterHandle = '@SheikhShahRE',
}: SEOProps) {
  useEffect(() => {
    // Update page title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Update meta keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = keywords;
        document.head.appendChild(meta);
      }
    }

    // Update Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:creator', twitterHandle);

    // Update article-specific tags
    if (type === 'article') {
      updateMetaTag('article:author', author);
      if (publishedDate) {
        updateMetaTag('article:published_time', publishedDate);
      }
      if (modifiedDate) {
        updateMetaTag('article:modified_time', modifiedDate);
      }
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = url;
      document.head.appendChild(link);
    }
  }, [title, description, keywords, image, url, type, author, publishedDate, modifiedDate, twitterHandle]);

  return null;
}

/**
 * Helper function to update or create meta tags
 */
function updateMetaTag(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) ||
            document.querySelector(`meta[name="${property}"]`);

  if (tag) {
    tag.setAttribute('content', content);
  } else {
    const meta = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('article:')) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', property);
    }
    meta.content = content;
    document.head.appendChild(meta);
  }
}
