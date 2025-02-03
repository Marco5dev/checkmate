"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLink, faUnlink } from "@fortawesome/free-solid-svg-icons";
import DisconnectConfirmModal from './DisconnectConfirmModal';

const ConnectedAccounts = ({ user, onDisconnect }) => {
  const [isConnecting, setIsConnecting] = useState({});
  const [disconnectModal, setDisconnectModal] = useState({
    isOpen: false,
    platform: null
  });

  const getPlatformInfo = (platformId) => {
    return user.connectedPlatforms?.find(p => p.provider === platformId);
  };

  const handleConnect = async (platform) => {
    setIsConnecting(prev => ({ ...prev, [platform]: true }));
    try {
      await signIn(platform, {
        callbackUrl: window.location.origin + '/profile',
        redirect: true
      });
    } catch (error) {
      toast.error(`Failed to connect to ${platform}`);
      setIsConnecting(prev => ({ ...prev, [platform]: false }));
    }
  };

  const isDisconnectDisabled = (platform) => {
    const platformInfo = getPlatformInfo(platform);
    return user.provider === platform && user.password_changes === 0;
  };

  const handleDisconnect = async (platform) => {
    setDisconnectModal({
      isOpen: true,
      platform: platform
    });
  };

  const confirmDisconnect = async () => {
    const platform = disconnectModal.platform;
    try {
      const response = await fetch(`/api/auth/disconnect/${platform}`, {
        method: "POST",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      
      toast.success(`Disconnected from ${platform}`);
      onDisconnect(platform);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDisconnectModal({ isOpen: false, platform: null });
    }
  };

  const platforms = [
    {
      id: "github",
      name: "GitHub",
      icon: faGithub,
      isConnected: getPlatformInfo('github'),
      className: "bg-gray-800 hover:bg-gray-700",
      canDisconnect: user.hasPassword,
    },
  ];

  return (
    <>
      <div className="space-y-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="flex items-center justify-between p-4 rounded-lg bg-base-200"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${platform.className}`}
              >
                <FontAwesomeIcon icon={platform.icon} size="lg" />
              </div>
              <div>
                <h3 className="font-semibold">{platform.name}</h3>
                <p className="text-sm opacity-70">
                  {platform.isConnected
                    ? `Connected as ${getPlatformInfo(platform.id)?.username}`
                    : `Connect with ${platform.name}`}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                platform.isConnected
                  ? handleDisconnect(platform.id)
                  : handleConnect(platform.id)
              }
              disabled={isConnecting[platform.id] || isDisconnectDisabled(platform.id)}
              className={`btn btn-sm ${
                platform.isConnected
                  ? "btn-error btn-outline"
                  : "btn-primary btn-outline"
              } ${isDisconnectDisabled(platform.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isConnecting[platform.id] ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={platform.isConnected ? faUnlink : faLink}
                    className="mr-2"
                  />
                  {platform.isConnected ? "Disconnect" : "Connect"}
                </>
              )}
            </button>
          </div>
        ))}
        {user.password_changes === 0 && (
          <div className="text-sm text-warning mt-2">
            Set a password in your profile to manage platform connections
          </div>
        )}
      </div>

      <DisconnectConfirmModal
        isOpen={disconnectModal.isOpen}
        onClose={() => setDisconnectModal({ isOpen: false, platform: null })}
        onConfirm={confirmDisconnect}
        platform={disconnectModal.platform}
      />
    </>
  );
};

export default ConnectedAccounts;
