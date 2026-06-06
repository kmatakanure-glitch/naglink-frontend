import React, { useState } from 'react';
import toast from 'react-hot-toast';

const TruckImageUpload = ({ onUpload, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only image files are allowed (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    await onUpload(file);
    setUploading(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">Truck Image</label>
      {preview && (
        <div className="mb-2">
          <img src={preview} alt="Truck preview" className="h-32 w-auto rounded border object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full px-3 py-2 border rounded-lg"
        disabled={uploading}
      />
      {uploading && <p className="text-blue-600 text-sm mt-1">Uploading image...</p>}
      <p className="text-xs text-gray-500 mt-1">Upload a photo of the truck (JPEG, PNG, GIF, WEBP - Max 5MB)</p>
    </div>
  );
};

export default TruckImageUpload;