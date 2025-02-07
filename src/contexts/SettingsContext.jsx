"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import LoadingScreen from '@/components/LoadingScreen';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  theme: 'custom',
  wallpaper: '/wallpapers/Wall.png'  // Keep it simple
};

export function SettingsProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [wallpaperLoaded, setWallpaperLoaded] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(DEFAULT_SETTINGS);

  const loadWallpaper = async (wallpaperPath) => {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ success: true, path: wallpaperPath });
      };

      img.onerror = () => {
        console.warn(`Failed to load wallpaper: ${wallpaperPath}`);
        resolve({ success: false, path: DEFAULT_SETTINGS.wallpaper });
      };

      // Add cache buster to prevent caching issues
      img.src = `${wallpaperPath}?t=${Date.now()}`;
    });
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/user-settings');
        
        if (response.status === 401 || !response.ok) {
          const { success, path } = await loadWallpaper(DEFAULT_SETTINGS.wallpaper);
          const finalSettings = {
            ...DEFAULT_SETTINGS,
            wallpaper: success ? path : DEFAULT_SETTINGS.wallpaper
          };
          
          setCurrentSettings(finalSettings);
          applySettings(finalSettings);
          setWallpaperLoaded(true);
          setIsLoading(false);
          return;
        }

        const settings = await response.json();
        const finalSettings = settings?.theme ? settings : DEFAULT_SETTINGS;
        const { success, path } = await loadWallpaper(finalSettings.wallpaper);
        
        const settingsToApply = {
          ...finalSettings,
          wallpaper: success ? path : DEFAULT_SETTINGS.wallpaper
        };

        setCurrentSettings(settingsToApply);
        applySettings(settingsToApply);
        setWallpaperLoaded(true);
      } catch (error) {
        console.error('Error loading settings:', error);
        setCurrentSettings(DEFAULT_SETTINGS);
        applySettings(DEFAULT_SETTINGS);
        setWallpaperLoaded(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const applySettings = (settings) => {
    if (settings.theme) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
    
    document.body.style.backgroundColor = 'var(--background)';
    
    if (settings.wallpaper) {
      try {
        document.documentElement.style.setProperty('--wallpaper', `url('${settings.wallpaper}')`);
        document.body.style.backgroundImage = `var(--wallpaper)`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed'; // Add this line
        document.body.style.minHeight = '100vh'; // Ensure full viewport height
      } catch (error) {
        console.error('Error applying wallpaper:', error);
        document.body.style.backgroundImage = 'none';
      }
    }
  };

  if (isLoading || !wallpaperLoaded) {
    return <LoadingScreen />;
  }

  return (
    <SettingsContext.Provider value={{ currentSettings, applySettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
