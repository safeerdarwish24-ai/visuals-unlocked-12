import React, { createContext, useContext, ReactNode } from "react";
import { useImageStorage, ImageData } from "@/hooks/use-image-storage";

interface ImageStorageContextType {
  images: Record<string, ImageData | null>;
  uploadImage: (key: string, file: File) => Promise<void>;
  removeImage: (key: string) => void;
  getImage: (key: string) => ImageData | null;
  isLoading: boolean;
}

const ImageStorageContext = createContext<ImageStorageContextType | null>(null);

export const ImageStorageProvider = ({ children }: { children: ReactNode }) => {
  const imageStorage = useImageStorage();

  return (
    <ImageStorageContext.Provider value={imageStorage}>
      {children}
    </ImageStorageContext.Provider>
  );
};

export const useImageStorageContext = (): ImageStorageContextType => {
  const context = useContext(ImageStorageContext);
  if (!context) {
    throw new Error("useImageStorageContext must be used within ImageStorageProvider");
  }
  return context;
};
