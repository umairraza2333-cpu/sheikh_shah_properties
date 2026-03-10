import { storagePut } from "./storage";
import sharp from "sharp";
import type { Sharp } from "sharp";

export interface UploadedImage {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

/**
 * Optimize image for web using sharp
 * Reduces file size while maintaining quality
 */
async function optimizeImage(buffer: Buffer, format: 'jpeg' | 'png' | 'webp'): Promise<Buffer> {
  try {
    let transformer = sharp(buffer);

    // Resize if too large
    const metadata = await sharp(buffer).metadata();
    if (metadata.width && metadata.width > 2000) {
      transformer = transformer.resize(2000, 2000, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Compress based on format
    if (format === 'jpeg') {
      return await transformer.jpeg({ quality: 85, progressive: true }).toBuffer();
    } else if (format === 'webp') {
      return await transformer.webp({ quality: 85 }).toBuffer();
    } else {
      return await transformer.png({ compressionLevel: 9 }).toBuffer();
    }
  } catch (error) {
    console.error('Image optimization failed:', error);
    return buffer; // Return original if optimization fails
  }
}

/**
 * Upload image to S3 with optimization
 */
export async function uploadImage(
  buffer: Buffer,
  filename: string,
  folder: 'properties' | 'projects'
): Promise<UploadedImage> {
  try {
    // Determine format from filename
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const format = ext === 'jpg' ? 'jpeg' : (ext as 'png' | 'webp');

    // Optimize image
    const optimizedBuffer = await optimizeImage(buffer, format);

    // Generate unique key
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const key = `uploads/${folder}/${timestamp}-${random}-${filename}`;

    // Upload to S3
    const { url } = await storagePut(key, optimizedBuffer, `image/${format}`);

    return {
      url,
      key,
      size: optimizedBuffer.length,
      mimeType: `image/${format}`,
    };
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  files: Array<{ buffer: Buffer; filename: string }>,
  folder: 'properties' | 'projects'
): Promise<UploadedImage[]> {
  const results: UploadedImage[] = [];

  for (const file of files) {
    try {
      const result = await uploadImage(file.buffer, file.filename, folder);
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload ${file.filename}:`, error);
    }
  }

  return results;
}
