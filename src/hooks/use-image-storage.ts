import { useState, useEffect, useCallback } from "react";

interface ImageData {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: number;
}

interface UseImageStorageReturn {
  images: Record<string, ImageData | null>;
  uploadImage: (key: string, file: File) => Promise<void>;
  removeImage: (key: string) => void;
  getImage: (key: string) => ImageData | null;
  isLoading: boolean;
}

const STORAGE_KEY = "portfolio_images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export const useImageStorage = (): UseImageStorageReturn => {
  const [images, setImages] = useState<Record<string, ImageData | null>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load images from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setImages(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load images from storage:", error);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever images change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      } catch (error) {
        console.error("Failed to save images to storage:", error);
        // Handle quota exceeded
        if (error instanceof DOMException && error.name === "QuotaExceededError") {
          console.warn("Storage quota exceeded. Consider using cloud storage.");
        }
      }
    }
  }, [images, isLoading]);

  const uploadImage = useCallback(async (key: string, file: File): Promise<void> => {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Invalid file type. Allowed: JPG, PNG, WebP, SVG");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const imageData: ImageData = {
          id: `${key}_${Date.now()}`,
          url: reader.result as string,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: Date.now(),
        };

        setImages((prev) => ({
          ...prev,
          [key]: imageData,
        }));
        resolve();
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = useCallback((key: string) => {
    setImages((prev) => {
      const newImages = { ...prev };
      delete newImages[key];
      return newImages;
    });
  }, []);

  const getImage = useCallback((key: string): ImageData | null => {
    return images[key] || null;
  }, [images]);

  return {
    images,
    uploadImage,
    removeImage,
    getImage,
    isLoading,
  };
};

// Export types for use in components
export type { ImageData };
