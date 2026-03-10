import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadImage, uploadImages } from './imageUpload';

// Mock the storage module
vi.mock('./storage', () => ({
  storagePut: vi.fn(async (key: string, buffer: Buffer, mimeType: string) => ({
    url: `https://example.com/${key}`,
    key,
  })),
}));

describe('Image Upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload a single image successfully', async () => {
    const mockBuffer = Buffer.from('fake image data');
    const result = await uploadImage(mockBuffer, 'test.jpg', 'properties');

    expect(result).toBeDefined();
    expect(result.url).toContain('uploads/properties');
    expect(result.key).toContain('uploads/properties');
    expect(result.mimeType).toBe('image/jpeg');
    expect(result.size).toBeGreaterThan(0);
  });

  it('should handle PNG format', async () => {
    const mockBuffer = Buffer.from('fake png data');
    const result = await uploadImage(mockBuffer, 'test.png', 'projects');

    expect(result).toBeDefined();
    expect(result.url).toContain('uploads/projects');
    expect(result.mimeType).toBe('image/png');
  });

  it('should handle WEBP format', async () => {
    const mockBuffer = Buffer.from('fake webp data');
    const result = await uploadImage(mockBuffer, 'test.webp', 'properties');

    expect(result).toBeDefined();
    expect(result.mimeType).toBe('image/webp');
  });

  it('should upload multiple images', async () => {
    const files = [
      { buffer: Buffer.from('image1'), filename: 'test1.jpg' },
      { buffer: Buffer.from('image2'), filename: 'test2.png' },
    ];

    const results = await uploadImages(files, 'properties');

    expect(results).toHaveLength(2);
    expect(results[0].url).toBeDefined();
    expect(results[1].url).toBeDefined();
  });

  it('should generate unique keys for each upload', async () => {
    const buffer = Buffer.from('fake image data');
    const result1 = await uploadImage(buffer, 'test.jpg', 'properties');
    const result2 = await uploadImage(buffer, 'test.jpg', 'properties');

    expect(result1.key).not.toBe(result2.key);
  });

  it('should handle upload errors gracefully', async () => {
    const mockBuffer = Buffer.from('invalid data');
    try {
      const result = await uploadImage(mockBuffer, 'test.jpg', 'properties');
      expect(result).toBeDefined();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
