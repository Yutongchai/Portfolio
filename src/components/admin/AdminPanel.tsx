import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../contexts/AdminContext';
import { useContent } from '../../contexts/ContentContext';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const AdminPanel: React.FC = () => {
  const { isEditMode, isAuthenticated, toggleEditMode, login, logout } = useAdmin();
  const { exportContent, importContent, resetContent } = useContent();
  
  const [showPanel, setShowPanel] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setShowLogin(false);
      setPassword('');
      setShowPanel(true);
    } else {
      alert('Incorrect password!');
      setPassword('');
    }
  };

  const handleExport = () => {
    const content = exportContent();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-content-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  const handleImport = () => {
    try {
      importContent(importText);
      alert('Content imported successfully!');
      setShowImport(false);
      setImportText('');
    } catch (error) {
      alert('Failed to import content. Please check the JSON format.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all content to defaults? This cannot be undone!')) {
      resetContent();
      alert('Content reset successfully!');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        {/* Floating Admin Button */}
        <motion.button
          onClick={() => setShowLogin(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent hover:bg-cta text-accent-foreground shadow-accent flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Icon name="Settings" size={24} />
        </motion.button>

        {/* Login Modal */}
        <AnimatePresence>
          {showLogin && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
            >
              <motion.div
                className="bg-card rounded-2xl p-8 max-w-md w-full mx-4 shadow-elevation"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Admin Login</h2>
                  <button
                    onClick={() => setShowLogin(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter admin password"
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    fullWidth
                    className="bg-accent hover:bg-cta text-accent-foreground"
                  >
                    Login
                  </Button>
                </form>

                <p className="mt-4 text-sm text-muted-foreground text-center">
                  Default password: <code className="bg-muted px-2 py-1 rounded">admin123</code>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      {/* Floating Admin Button */}
      <motion.button
        onClick={() => setShowPanel(!showPanel)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-accent flex items-center justify-center transition-colors ${
          isEditMode
            ? 'bg-success hover:bg-success/90 text-success-foreground'
            : 'bg-accent hover:bg-cta text-accent-foreground'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Icon name={isEditMode ? 'Check' : 'Settings'} size={24} />
      </motion.button>

      {/* Admin Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 bg-card rounded-2xl shadow-elevation w-80 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Admin Panel</h3>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon name="X" size={18} />
                </button>
              </div>

              {/* Edit Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium text-foreground">Edit Mode</span>
                <button
                  onClick={toggleEditMode}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isEditMode ? 'bg-success' : 'bg-muted-foreground/30'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: isEditMode ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {isEditMode && (
                <div className="p-3 bg-success/10 border border-success rounded-lg">
                  <p className="text-xs text-success font-medium flex items-center gap-2">
                    <Icon name="Edit" size={14} />
                    Click on any content to edit
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowExport(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon name="Download" size={18} className="text-primary" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Export Content</div>
                    <div className="text-xs text-muted-foreground">Download JSON backup</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowImport(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon name="Upload" size={18} className="text-primary" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Import Content</div>
                    <div className="text-xs text-muted-foreground">Restore from backup</div>
                  </div>
                </button>

                <button
                  onClick={handleReset}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-error/10 rounded-lg transition-colors"
                >
                  <Icon name="RotateCcw" size={18} className="text-error" />
                  <div>
                    <div className="text-sm font-medium text-error">Reset to Default</div>
                    <div className="text-xs text-muted-foreground">Restore original content</div>
                  </div>
                </button>

                <div className="border-t border-border my-2 pt-2">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted rounded-lg transition-colors"
                  >
                    <Icon name="LogOut" size={18} className="text-foreground" />
                    <div className="text-sm font-medium text-foreground">Logout</div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExport(false)}
          >
            <motion.div
              className="bg-card rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-elevation max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Export Content</h2>
                <button
                  onClick={() => setShowExport(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Download your content as a JSON file for backup or transfer.
                </p>

                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto max-h-60">
                    {exportContent()}
                  </pre>
                </div>

                <Button
                  onClick={handleExport}
                  variant="default"
                  size="lg"
                  fullWidth
                  className="bg-accent hover:bg-cta text-accent-foreground"
                  iconName="Download"
                  iconPosition="left"
                >
                  Download JSON File
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImport && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImport(false)}
          >
            <motion.div
              className="bg-card rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-elevation"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Import Content</h2>
                <button
                  onClick={() => setShowImport(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Paste your exported JSON content here to restore it.
                </p>

                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full h-64 px-4 py-3 rounded-lg border border-input bg-background text-foreground font-mono text-xs focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Paste JSON content here..."
                />

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowImport(false)}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleImport}
                    variant="default"
                    size="lg"
                    className="flex-1 bg-accent hover:bg-cta text-accent-foreground"
                    iconName="Upload"
                    iconPosition="left"
                  >
                    Import Content
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPanel;
