import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { Camera, Upload, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  imageUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  shape?: "circle" | "rounded" | "square";
  size?: "sm" | "md" | "lg" | "xl";
  aspectRatio?: "square" | "landscape" | "portrait";
  placeholder?: React.ReactNode;
  className?: string;
  showOverlay?: boolean;
  disabled?: boolean;
}

const sizeClasses = {
  sm: "w-24 h-24",
  md: "w-32 h-32",
  lg: "w-48 h-48",
  xl: "w-64 h-64",
};

const aspectRatioClasses = {
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
};

const shapeClasses = {
  circle: "rounded-full",
  rounded: "rounded-2xl",
  square: "rounded-lg",
};

export const ImageUpload = ({
  imageUrl,
  onUpload,
  onRemove,
  shape = "rounded",
  size = "lg",
  aspectRatio,
  placeholder,
  className,
  showOverlay = true,
  disabled = false,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (disabled) return;
      
      setError(null);
      setIsUploading(true);
      setSuccess(false);

      try {
        await onUpload(file);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  }, [disabled, isUploading]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [handleFile]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove();
    },
    [onRemove]
  );

  return (
    <div className={cn("relative group", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      <motion.div
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all duration-300",
          aspectRatio ? aspectRatioClasses[aspectRatio] : sizeClasses[size],
          shapeClasses[shape],
          isDragging && "ring-2 ring-accent ring-offset-2",
          disabled && "opacity-50 cursor-not-allowed",
          !imageUrl && "border-2 border-dashed border-border hover:border-accent/50 bg-muted/30"
        )}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
      >
        <AnimatePresence mode="wait">
          {imageUrl ? (
            <motion.img
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={imageUrl}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
            >
              {placeholder || (
                <>
                  <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Click or drag to upload
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    JPG, PNG, WebP (max 5MB)
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay on hover when image exists */}
        {showOverlay && imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm flex items-center justify-center gap-3"
          >
            <motion.button
              className="p-2 rounded-full bg-background/90 text-foreground hover:bg-background transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClick}
            >
              <Upload className="w-4 h-4" />
            </motion.button>
            <motion.button
              className="p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {/* Loading overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/80 flex items-center justify-center"
            >
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success indicator */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-green-500/80 flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-1 text-destructive text-xs"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag indicator */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0 border-2 border-accent bg-accent/10 flex items-center justify-center",
              shapeClasses[shape]
            )}
          >
            <Upload className="w-8 h-8 text-accent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
