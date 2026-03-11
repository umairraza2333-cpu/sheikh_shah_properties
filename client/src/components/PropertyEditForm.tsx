import { useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import ImageUpload from './ImageUpload';
import { X } from 'lucide-react';

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  location: z.string().min(1, 'Location is required'),
  area: z.string().min(1, 'Area is required'),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  propertyType: z.enum(['apartment', 'house', 'commercial', 'plot', 'office']),
  featured: z.boolean().default(false),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyEditFormProps {
  propertyId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PropertyEditForm({ propertyId, onSuccess, onCancel }: PropertyEditFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: '',
    location: '',
    area: 'Scheme 33',
    bedrooms: undefined,
    bathrooms: undefined,
    propertyType: 'apartment',
    featured: false,
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch property data
  const { data: property } = trpc.properties.byId.useQuery(propertyId, {
    onSuccess: (data) => {
      if (data) {
        setFormData({
          title: data.title,
          description: data.description || '',
          price: data.price.toString(),
          location: data.location,
          area: data.area,
          bedrooms: data.bedrooms || undefined,
          bathrooms: data.bathrooms || undefined,
          propertyType: data.propertyType,
          featured: data.featured || false,
        });
        setExistingImages(data.images || []);
        setUploadedImages(data.images || []);
      }
      setIsLoading(false);
    },
    onError: () => {
      toast.error('Failed to load property');
      setIsLoading(false);
    },
  });

  const updatePropertyMutation = trpc.properties.update.useMutation({
    onSuccess: () => {
      toast.success('Property updated successfully!');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update property');
    },
  });

  const uploadPropertyImageMutation = trpc.upload.propertyImage.useMutation({
    onSuccess: (result) => {
      setUploadedImages((prev) => [...prev, result.url]);
      toast.success('Image uploaded successfully');
    },
    onError: (error) => {
      toast.error('Failed to upload image');
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? parseInt(value) || undefined
            : value,
    }));
  };

  const handleImagesSelected = async (files: File[]) => {
    setSelectedImages(files);

    // Upload images one by one
    for (const file of files) {
      uploadPropertyImageMutation.mutate({ file });
    }
  };

  const handleRemoveImage = (index: number) => {
    if (index < existingImages.length) {
      // Removing existing image
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Removing newly uploaded image
      const newIndex = index - existingImages.length;
      setSelectedImages((prev) => prev.filter((_, i) => i !== newIndex));
    }
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    setUploadedImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      propertySchema.parse(formData);
      setIsSubmitting(true);

      updatePropertyMutation.mutate({
        id: propertyId,
        data: {
          ...formData,
          images: uploadedImages,
          imageUrl: uploadedImages[0],
        },
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue: any) => {
          toast.error(`${issue.path.join('.')}: ${issue.message}`);
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Property title"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 5000000"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Block A, Street 5"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Area <span className="text-red-500">*</span>
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-background"
            >
              <option value="Scheme 33">Scheme 33</option>
              <option value="Scheme 45">Scheme 45</option>
              <option value="Gulshan-e-Iqbal">Gulshan-e-Iqbal</option>
              <option value="Gulshan-e-Johar">Gulshan-e-Johar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-background"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="commercial">Commercial</option>
              <option value="plot">Plot</option>
              <option value="office">Office</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms || ''}
              onChange={handleInputChange}
              placeholder="Number of bedrooms"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms || ''}
              onChange={handleInputChange}
              placeholder="Number of bathrooms"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Property description"
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-border"
            />
            <label htmlFor="featured" className="text-sm font-semibold">
              Featured Property
            </label>
          </div>
        </div>
      </div>

      {/* Image Management */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Property Images</h3>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold mb-3">Current Images ({existingImages.length})</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {existingImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-24 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveExistingImage(imageUrl)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        type="button"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Upload */}
        <ImageUpload
          onImagesSelected={handleImagesSelected}
          selectedImages={selectedImages}
          onRemoveImage={handleRemoveImage}
          maxFiles={10}
        />

        {uploadedImages.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✓ {uploadedImages.length} total image(s) (including {existingImages.length} existing)
            </p>
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting || updatePropertyMutation.isPending}
          className="flex-1 bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || updatePropertyMutation.isPending ? 'Updating...' : 'Update Property'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-muted text-foreground py-3 rounded-lg font-semibold hover:bg-muted/80 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
