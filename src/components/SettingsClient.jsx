"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faImage, faLanguage, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { useSettings } from '@/contexts/SettingsContext';
import { useRouter } from 'next/navigation';

const AVAILABLE_THEMES = [
  { name: "custom", label: "Default (Dark)" },
  { name: "light", label: "Light" },
  { name: "dark", label: "Dark" },
  { name: "cupcake", label: "Cupcake" },
  { name: "synthwave", label: "Synthwave" },
  { name: "halloween", label: "Halloween" },
  { name: "forest", label: "Forest" },
  { name: "luxury", label: "Luxury" },
  { name: "dracula", label: "Dracula" },
];

export default function SettingsClient({ session }) {
  const router = useRouter();
  const [navigationPath, setNavigationPath] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('');
  const [currentWallpaper, setCurrentWallpaper] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [wallpapers, setWallpapers] = useState([]);
  const [isWallpapersLoading, setIsWallpapersLoading] = useState(true);
  const { currentSettings, applySettings } = useSettings();

  // Load initial settings
  useEffect(() => {
    if (currentSettings) {
      setCurrentTheme(currentSettings.theme);
      setCurrentWallpaper(currentSettings.wallpaper);
    }
  }, [currentSettings]);

  // Add wallpapers fetch
  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        setIsWallpapersLoading(true);
        const response = await fetch('/api/wallpapers');
        const data = await response.json();
        setWallpapers(data);
      } catch (error) {
        console.error('Error loading wallpapers:', error);
        toast.error('Failed to load wallpapers');
      } finally {
        setIsWallpapersLoading(false);
      }
    };

    fetchWallpapers();
  }, []);

  // Preview both theme and wallpaper together
  const previewChanges = (changes) => {
    const newSettings = {
      ...pendingChanges,
      ...changes
    };
    
    // Apply preview changes together
    if (newSettings.theme) {
      document.documentElement.setAttribute('data-theme', newSettings.theme);
    }
    if (newSettings.wallpaper) {
      document.documentElement.style.setProperty('--wallpaper', `url('${newSettings.wallpaper}')`);
      document.body.style.backgroundImage = `var(--wallpaper)`;
    }
    
    setPendingChanges(newSettings);
    setHasUnsavedChanges(true);
  };

  // Handle discarding changes with modal confirmation
  const handleDiscardChanges = () => {
    // Open modal for confirmation
    document.getElementById('confirm-discard-modal').showModal();
  };

  const confirmDiscard = () => {
    // Revert to original settings
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.style.setProperty('--wallpaper', `url('${currentWallpaper}')`);
    document.body.style.backgroundImage = `var(--wallpaper)`;
    
    setPendingChanges({});
    setHasUnsavedChanges(false);
    toast.success('Changes discarded', {
      icon: '↩️',
      duration: 2000,
    });
    // Close modal
    document.getElementById('confirm-discard-modal').close();
  };

  // Save all changes together
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasUnsavedChanges) return;
    
    const loadingToast = toast.loading('Saving changes...');
    
    try {
      const response = await fetch('/api/user-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingChanges)
      });

      if (!response.ok) throw new Error('Failed to update settings');

      setCurrentTheme(pendingChanges.theme || currentTheme);
      setCurrentWallpaper(pendingChanges.wallpaper || currentWallpaper);
      setHasUnsavedChanges(false);
      setPendingChanges({});
      
      toast.success('Settings updated successfully', {
        id: loadingToast,
        icon: '✅',
        duration: 2000,
      });
    } catch (error) {
      toast.error('Failed to update settings', {
        id: loadingToast,
        icon: '❌',
        duration: 3000,
      });
      // Revert changes on error
      confirmDiscard();
    }
  };

  // Handle beforeunload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Add navigation guard
  useEffect(() => {
    const handleClick = (e) => {
      if (!hasUnsavedChanges) return;
      
      const anchor = e.target.closest('a');
      const button = e.target.closest('button');
      
      if (!anchor && !button) return;
      
      // Ignore certain buttons (save, discard, modal buttons)
      if (button && (
        button.type === 'submit' || 
        button.closest('.modal-box') ||
        button.classList.contains('btn-ghost')
      )) {
        return;
      }

      // Get the navigation path
      const href = anchor?.getAttribute('href') || button?.dataset?.href;
      if (!href) return;

      e.preventDefault();
      e.stopPropagation();
      
      setNavigationPath(href);
      document.getElementById('confirm-navigation-modal').showModal();
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [hasUnsavedChanges]);

  const handleNavigate = () => {
    if (!navigationPath) return;
    
    // Revert changes
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.style.setProperty('--wallpaper', `url('${currentWallpaper}')`);
    document.body.style.backgroundImage = `var(--wallpaper)`;
    
    setPendingChanges({});
    setHasUnsavedChanges(false);
    
    // Close modal and navigate
    document.getElementById('confirm-navigation-modal').close();
    router.push(navigationPath);
  };

  return (
    <>
      <div className="w-[95%] h-5/6 mt-24 flex">
        <form onSubmit={handleSubmit} className="w-full bg-base-300 p-6 rounded-lg overflow-auto relative">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          {/* Theme Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faPalette} />
              Theme
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  className={`btn ${(pendingChanges.theme || currentTheme) === theme.name ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => previewChanges({ theme: theme.name })}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Updated Wallpaper Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faImage} />
              Wallpaper
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isWallpapersLoading ? (
                // Loading skeleton
                [...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-base-200 rounded-lg"></div>
                  </div>
                ))
              ) : wallpapers.length === 0 ? (
                <p className="text-gray-500">No wallpapers found</p>
              ) : (
                wallpapers.map((wallpaper) => (
                  <div
                    key={wallpaper.value}
                    className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-4 ${
                      (pendingChanges.wallpaper || currentWallpaper) === wallpaper.path ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => previewChanges({ wallpaper: wallpaper.path })}
                  >
                    <img
                      src={wallpaper.path}
                      alt={wallpaper.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                      <p className="text-white text-center capitalize">
                        {wallpaper.name.replace(/-/g, ' ')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Language Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faLanguage} />
              Language
            </h2>
            <div className="flex items-center gap-4">
              <select className="select select-bordered opacity-50" disabled>
                <option>English</option>
                <option>العربية</option>
                <option>Deutsch</option>
                <option>Français</option>
              </select>
              <div className="flex items-center gap-2 text-warning">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Coming soon</span>
              </div>
            </div>
          </div>

          {/* Updated footer buttons */}
          <div className="flex justify-end gap-2 pt-4">
            {!hasUnsavedChanges ? (
              <button
                type="button"
                onClick={() => window.history.back()}
                className="btn btn-primary"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleDiscardChanges}
                  className="btn btn-ghost"
                >
                  Discard Changes
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Navigation Confirmation Modal */}
      <dialog id="confirm-navigation-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Unsaved Changes</h3>
          <p className="py-4">You have unsaved changes. Would you like to save them before leaving?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button 
                className="btn btn-ghost"
                onClick={() => handleNavigate()}
              >
                Discard & Leave
              </button>
              <button 
                className="btn btn-error"
                onClick={() => document.getElementById('confirm-navigation-modal').close()}
              >
                Stay
              </button>
              <button 
                className="btn btn-primary"
                onClick={async (e) => {
                  e.preventDefault();
                  await handleSubmit(e);
                  handleNavigate();
                }}
              >
                Save & Leave
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Cancel</button>
        </form>
      </dialog>

      {/* Confirmation Modal */}
      <dialog id="confirm-discard-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Discard Changes?</h3>
          <p className="py-4">Are you sure you want to discard all changes? This action cannot be undone.</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-ghost">Cancel</button>
              <button 
                className="btn btn-error" 
                onClick={confirmDiscard}
              >
                Discard Changes
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Cancel</button>
        </form>
      </dialog>
    </>
  );
}
