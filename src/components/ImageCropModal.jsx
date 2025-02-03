"use client";

import { useState, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropModal = ({ isOpen, onClose, imageUrl, onCropComplete }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imgRef, setImgRef] = useState(null);

  // Center the crop when image loads
  const onImageLoad = useCallback((img) => {
    setImgRef(img);

    // Calculate the smallest dimension
    const minDimension = Math.min(img.width, img.height);
    const size = (minDimension * 1); // 90% of the smallest dimension

    // Center the crop
    setCrop({
      unit: 'px',
      width: size,
      height: size,
      x: (img.width - size) / 2,
      y: (img.height - size) / 2
    });
  }, []);

  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.naturalWidth / imgRef.width;
    const scaleY = imgRef.naturalHeight / imgRef.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      imgRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 1);
    });
  };

  const handleSave = async () => {
    const croppedBlob = await getCroppedImg();
    if (croppedBlob) {
      onCropComplete(croppedBlob);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-200 p-4 rounded-lg max-w-2xl w-full">
        <h3 className="text-lg font-bold mb-4">Crop Image</h3>
        <div className="max-h-[60vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              src={imageUrl}
              alt="Crop me"
              className="w-96"
              onLoad={(e) => onImageLoad(e.currentTarget)}
            />
          </ReactCrop>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button 
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!completedCrop?.width || !completedCrop?.height}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
