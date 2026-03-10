import { useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import ImageUpload from './ImageUpload';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['ongoing', 'completed', 'planning']),
  totalUnits: z.coerce.number().optional(),
  completedUnits: z.coerce.number().optional(),
  featured: z.boolean().default(false),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSuccess?: () => void;
}

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    location: '',
    status: 'ongoing',
    totalUnits: undefined,
    completedUnits: undefined,
    featured: false,
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProjectMutation = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast.success('Project created successfully!');
      setFormData({
        name: '',
        description: '',
        location: '',
        status: 'ongoing',
        totalUnits: undefined,
        completedUnits: undefined,
        featured: false,
      });
      setSelectedImages([]);
      setUploadedImages([]);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create project');
    },
  });

  const uploadProjectImageMutation = trpc.upload.projectImage.useMutation({
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
      uploadProjectImageMutation.mutate({ file });
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      projectSchema.parse(formData);
      setIsSubmitting(true);

      createProjectMutation.mutate({
        ...formData,
        images: uploadedImages,
        imageUrl: uploadedImages[0],
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Project Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Project name"
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
              placeholder="Project location"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-background"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="planning">Planning</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Total Units</label>
            <input
              type="number"
              name="totalUnits"
              value={formData.totalUnits || ''}
              onChange={handleInputChange}
              placeholder="Total number of units"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Completed Units</label>
            <input
              type="number"
              name="completedUnits"
              value={formData.completedUnits || ''}
              onChange={handleInputChange}
              placeholder="Number of completed units"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Project description"
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
              Featured Project
            </label>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Project Images</h3>
        <ImageUpload
          onImagesSelected={handleImagesSelected}
          selectedImages={selectedImages}
          onRemoveImage={handleRemoveImage}
          maxFiles={10}
        />
        {uploadedImages.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✓ {uploadedImages.length} image(s) uploaded successfully
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting || createProjectMutation.isPending}
          className="flex-1 bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
