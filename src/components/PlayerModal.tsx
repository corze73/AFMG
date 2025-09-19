import React, { useState } from 'react';
import { X, Upload, User, Loader2 } from 'lucide-react';
import apiClient from '../lib/api';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: PlayerData) => void;
  player?: PlayerData | null;
}

export interface PlayerData {
  id?: string;
  name: string;
  position: string;
  preferred_foot: string;
  current_club: string;
  image_url?: string;
  bio?: string;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ isOpen, onClose, onSave, player }) => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<PlayerData>({
    name: '',
    position: '',
    preferred_foot: 'Right',
    current_club: '',
    image_url: '',
    bio: ''
  });

  // Update form data when player prop changes
  React.useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || '',
        position: player.position || '',
        preferred_foot: player.preferred_foot || 'Right',
        current_club: player.current_club || '',
        image_url: player.image_url || '',
        bio: player.bio || ''
      });
    } else {
      setFormData({
        name: '',
        position: '',
        preferred_foot: 'Right',
        current_club: '',
        image_url: '',
        bio: ''
      });
    }
  }, [player]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !apiClient) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Upload image using the API client (which handles Cloudinary)
      const imageUrl = await apiClient.uploadImage(file);
      setFormData({ ...formData, image_url: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {player ? 'Edit Player' : 'Add New Player'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Upload */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              {formData.image_url ? (
                <img
                  src={formData.image_url}
                  alt="Player"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors">
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Player Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter player name"
              required
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position *
            </label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select position</option>
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Defender">Defender</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Forward">Forward</option>
              <option value="Winger">Winger</option>
              <option value="Striker">Striker</option>
            </select>
          </div>

          {/* Preferred Foot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Foot *
            </label>
            <select
              value={formData.preferred_foot}
              onChange={(e) => setFormData({ ...formData, preferred_foot: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="Right">Right</option>
              <option value="Left">Left</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {/* Current Club */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Club
            </label>
            <input
              type="text"
              value={formData.current_club}
              onChange={(e) => setFormData({ ...formData, current_club: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter current club (optional)"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => {
                const words = e.target.value.split(/\s+/).filter(word => word.length > 0);
                if (words.length <= 50) {
                  setFormData({ ...formData, bio: e.target.value });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="Brief description of the player (max 50 words)"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio ? formData.bio.split(/\s+/).filter(word => word.length > 0).length : 0}/50 words
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            {player ? 'Update Player' : 'Add Player'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerModal;