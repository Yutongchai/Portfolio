import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../contexts/AdminContext';
import Icon from '../AppIcon';

interface InlineTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
}

const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  value,
  onChange,
  multiline = false,
  placeholder = 'Click to edit',
  className = '',
  label,
}) => {
  const { isEditMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (multiline) {
        (inputRef.current as HTMLTextAreaElement).select();
      } else {
        (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, multiline]);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  if (!isEditMode) {
    return <>{value}</>;
  }

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {label && (
          <label className="block text-xs font-medium text-primary mb-1">
            {label}
          </label>
        )}
        
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full px-3 py-2 rounded-lg border-2 border-primary bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-vertical min-h-[100px] ${className}`}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full px-3 py-2 rounded-lg border-2 border-primary bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
            placeholder={placeholder}
          />
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success hover:bg-success/90 text-success-foreground text-sm font-medium transition-colors"
          >
            <Icon name="Check" size={14} />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-sm font-medium transition-colors"
          >
            <Icon name="X" size={14} />
            Cancel
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-1">
          {multiline ? 'Press Ctrl+Enter to save, Esc to cancel' : 'Press Enter to save, Esc to cancel'}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={() => setIsEditing(true)}
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.01 }}
    >
      <div className={`relative inline-block transition-all ${className}`}>
        {value || <span className="text-muted-foreground italic">{placeholder}</span>}
        
        <motion.div
          className="absolute inset-0 border-2 border-dashed border-primary rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
        />
        
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          initial={false}
        >
          <Icon name="Edit" size={12} className="text-primary-foreground" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InlineTextEditor;
