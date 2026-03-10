import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  maxFiles?: number;
  selectedImages?: File[];
  onRemoveImage?: (index: number) => void;
}

export default function ImageUpload({
  onImagesSelected,
  maxFiles = 5,
  selectedImages = [],
  onRemoveImage,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFiles = (files: File[]): File[] => {
    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB per file

    return files.filter((file) => {
      if (!validFormats.includes(file.type)) {
        toast.error(`${file.name} - Invalid format. Supported: JPG, PNG, WEBP`);
        return false;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} - File size exceeds 10MB`);
        return false;
      }

      return true;
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);

    if (validFiles.length + selectedImages.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    if (validFiles.length > 0) {
      onImagesSelected([...selectedImages, ...validFiles]);
      toast.success(`${validFiles.length} image(s) added`);
    }
  }, [selectedImages, maxFiles, onImagesSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = validateFiles(files);

    if (validFiles.length + selectedImages.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    if (validFiles.length > 0) {
      onImagesSelected([...selectedImages, ...validFiles]);
      toast.success(`${validFiles.length} image(s) added`);
    }

    // Reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-accent bg-accent/10'
            : 'border-border bg-muted/50 hover:border-accent'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="bg-accent/20 p-3 rounded-lg">
            <Upload className="text-accent" size={24} />
          </div>
          <div>
            <p className="font-semibold text-foreground">Drag and drop images here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: JPG, PNG, WEBP (Max 10MB each, up to {maxFiles} images)
          </p>
          <label className="mt-2">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInput}
              className="hidden"
              disabled={isUploading}
            />
            <span className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold cursor-pointer hover:shadow-lg transition-all">
              {isUploading ? (
                <>
                  <Loader2 className="inline mr-2 animate-spin" size={16} />
                  Uploading...
                </>
              ) : (
                'Browse Files'
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-3">
            Selected Images ({selectedImages.length}/{maxFiles})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative group">
                <div className="relative h-24 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => onRemoveImage?.(index)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images selected yet</p>
        </div>
      )}
    </div>
  );
}
