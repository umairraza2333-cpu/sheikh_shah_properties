import { describe, expect, it } from 'vitest';
import { generatePropertySEO, generateProjectSEO, createSlug, generateCanonicalURL, generateFAQSchema } from '../client/src/lib/seoUtils';

describe('SEO Utilities', () => {
  describe('generatePropertySEO', () => {
    it('should generate SEO data for a property', () => {
      const property = {
        title: 'Ahmed Arcade',
        bedrooms: 3,
        bathrooms: 2,
        location: 'Scheme 33',
        area: '2000',
        propertyType: 'Apartment',
        price: '5000000',
      };

      const seo = generatePropertySEO(property);

      expect(seo.title).toContain('3 Bed');
      expect(seo.title).toContain('Ahmed Arcade');
      expect(seo.title).toContain('Scheme 33');
      expect(seo.description).toContain('Ahmed Arcade');
      expect(seo.keywords).toContain('Scheme 33');
      expect(seo.keywords).toContain('Karachi');
    });

    it('should handle properties without bedrooms', () => {
      const property = {
        title: 'Commercial Space',
        bedrooms: null,
        location: 'Gulshan-e-Iqbal',
        propertyType: 'Commercial',
        price: '10000000',
      };

      const seo = generatePropertySEO(property);

      expect(seo.title).toContain('Commercial');
      expect(seo.title).toContain('Gulshan-e-Iqbal');
    });
  });

  describe('generateProjectSEO', () => {
    it('should generate SEO data for a project', () => {
      const project = {
        name: 'City Comfort Apartments',
        location: 'Scheme 45',
        description: 'Luxury residential project',
        status: 'completed',
      };

      const seo = generateProjectSEO(project);

      expect(seo.title).toContain('City Comfort Apartments');
      expect(seo.title).toContain('Completed');
      expect(seo.title).toContain('Scheme 45');
      expect(seo.description).toContain('City Comfort Apartments');
      expect(seo.keywords).toContain('Karachi');
    });
  });

  describe('createSlug', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(createSlug('Ahmed Arcade')).toBe('ahmed-arcade');
      expect(createSlug('Scheme 33 Apartment')).toBe('scheme-33-apartment');
      expect(createSlug('City Comfort - Apartments')).toBe('city-comfort-apartments');
    });

    it('should handle special characters', () => {
      expect(createSlug('Ahmed & Arcade')).toBe('ahmed-arcade');
      expect(createSlug('Luxury @ Scheme 33')).toBe('luxury-scheme-33');
    });

    it('should trim whitespace', () => {
      expect(createSlug('  Ahmed Arcade  ')).toBe('ahmed-arcade');
    });
  });

  describe('generateCanonicalURL', () => {
    it('should generate canonical URL', () => {
      const url = generateCanonicalURL('/property/123');
      expect(url).toBe('https://sheikhprop-p3nkkbke.manus.space/property/123');
    });

    it('should handle root path', () => {
      const url = generateCanonicalURL('/');
      expect(url).toBe('https://sheikhprop-p3nkkbke.manus.space/');
    });
  });

  describe('generateFAQSchema', () => {
    it('should generate FAQ schema', () => {
      const schema = generateFAQSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toBeInstanceOf(Array);
      expect(schema.mainEntity.length).toBeGreaterThan(0);
      expect(schema.mainEntity[0]['@type']).toBe('Question');
    });
  });
});
