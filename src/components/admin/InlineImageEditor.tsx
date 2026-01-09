import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../contexts/AdminContext';
import Icon from '../AppIcon';
import AppImage from '../AppImage';

interface InlineImageEditorProps {
  value: string;
  onChange: (value: string) => void;
  alt?: string;
  className?: string;
  label?: string;
  aspectRatio?: string;
}

const InlineImageEditor: React.FC<InlineImageEditorProps> = ({
  value,
  onChange,
  alt = 'Image',
  className = '',
  label,
  aspectRatio = '16/9',
}) => {
  const { isEditMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [previewUrl, setPreviewUrl] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setEditValue(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setEditValue(url);
    setPreviewUrl(url);
  };

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setPreviewUrl(value);
    setIsEditing(false);
  };

  if (!isEditMode) {
    return (
      <AppImage
        src={value}
        alt={alt}
        className={className}
        style={{ aspectRatio }}
      />
    );
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-xs font-medium text-primary mb-1">
          {label}
        </label>
      )}

      <motion.div
        className="relative group cursor-pointer"
        onClick={() => setIsEditing(true)}
        whileHover={{ scale: 1.02 }}
      >
        <AppImage
          src={value}
          alt={alt}
          className={`transition-all ${className}`}
          style={{ aspectRatio }}
        />

        <motion.div
          className="absolute inset-0 border-2 border-dashed border-primary rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
          initial={false}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2">
              <Icon name="Image" size={18} />
              Click to change image
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
          >
            <motion.div
              className="bg-card rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-elevation"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Edit Image</h3>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Preview */}
                <div className="relative rounded-lg overflow-hidden bg-muted">
                  {previewUrl ? (
                    <AppImage
                      src={previewUrl}
                      alt="Preview"
                      className="w-full"
                      style={{ aspectRatio }}
                    />
                  ) : (
                    <div
                      className="w-full flex items-center justify-center bg-muted text-muted-foreground"
                      style={{ aspectRatio }}
                    >
                      <Icon name="Image" size={48} />
                    </div>
                  )}
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editValue}
                    onChange={handleUrlChange}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Or Upload Image
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-input hover:border-primary hover:bg-muted transition-colors"
                  >
                    <Icon name="Upload" size={18} />
                    <span className="text-sm font-medium">Choose File</span>
                  </button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Uploaded images are stored as base64 in localStorage. For production, consider using an image hosting service.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 rounded-lg border border-input hover:bg-muted text-foreground font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 rounded-lg bg-success hover:bg-success/90 text-success-foreground font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="Check" size={18} />
                    Save Image
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InlineImageEditor;
