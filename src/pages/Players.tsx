import React, { useState, useEffect } from 'react';
import { Plus, User, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../lib/api';
import PlayerModal, { PlayerData } from '../components/PlayerModal';

const Players: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlayers();
    }
  }, [user]);

  const fetchPlayers = async () => {
    if (!apiClient) return;
    
    try {
      const playersData = await apiClient.getPlayers();
      setPlayers(playersData || []);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlayer = async (playerData: PlayerData) => {
    if (!apiClient) return;

    try {
      if (editingPlayer && editingPlayer.id) {
        await apiClient.updatePlayer(editingPlayer.id, playerData);
      } else {
        await apiClient.createPlayer(playerData);
      }

      await fetchPlayers();
      setEditingPlayer(null);
    } catch (error) {
      console.error('Error saving player:', error);
    }
  };

  const handleEditPlayer = (player: PlayerData) => {
    setEditingPlayer(player);
    setShowModal(true);
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (!apiClient || !confirm('Are you sure you want to delete this player?')) return;

    try {
      await apiClient.deletePlayer(playerId);
      fetchPlayers();
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600">Please log in as an administrator to manage players.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Players</h1>
            <p className="text-gray-600 mt-2">Manage your football talent roster</p>
          </div>
          <button 
            onClick={() => {
              setEditingPlayer(null);
              setShowModal(true);
            }}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Player
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading players...</p>
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No players yet</h3>
            <p className="text-gray-600 mb-6">Start building your roster by adding your first player.</p>
            <button 
              onClick={() => {
                setEditingPlayer(null);
                setShowModal(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Player
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <div key={player.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    {player.image_url ? (
                      <img
                        src={player.image_url}
                        alt={player.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
                      <p className="text-sm text-gray-600">{player.position}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preferred Foot:</span>
                      <span className="font-medium">{player.preferred_foot}</span>
                    </div>
                    {player.current_club && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Club:</span>
                        <span className="font-medium">{player.current_club}</span>
                      </div>
                    )}
                  </div>
                  
                  {player.bio && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600 italic">"{player.bio}"</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEditPlayer(player)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlayer(player.id!)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PlayerModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPlayer(null);
        }}
        onSave={handleSavePlayer}
        player={editingPlayer}
      />
    </>
  );
};

export default Players;