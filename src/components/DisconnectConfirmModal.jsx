const DisconnectConfirmModal = ({ isOpen, onClose, onConfirm, platform }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-300 rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Disconnect {platform}?</h2>
        <p className="mb-6">
          Are you sure you want to disconnect your {platform} account? 
          You can always reconnect it later.
        </p>
        <div className="flex justify-end gap-2">
          <button 
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn btn-error"
            onClick={onConfirm}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisconnectConfirmModal;
