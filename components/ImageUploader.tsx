'use client';

import { JournalImage } from '@/types/journal';
import { Trash2, Copy } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

interface ImageUploaderProps {
  images: JournalImage[];
  onImageAdd: (dataUrl: string, filename: string) => void;
  onImageRemove: (imageId: string) => void;
  onCopyReference?: (imageId: string) => void;
}

export default function ImageUploader({
  images,
  onImageAdd,
  onImageRemove,
  onCopyReference,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Please select an image file');
        return;
      }

      // Read file and convert to data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onImageAdd(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors text-sm"
        >
          + Add Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {images.map((image) => (
              <div key={image.id} className="space-y-2">
                <div className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <div className="relative w-full aspect-square">
                    <img
                      src={image.dataUrl}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onCopyReference && (
                      <button
                        onClick={() => onCopyReference(image.id)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                        title="Insert into content"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onImageRemove(image.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                    {image.filename}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
