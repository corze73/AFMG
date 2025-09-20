import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Trophy, Target, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../lib/api';
import ContactForm from '../components/ContactForm';
import '../utils/healthCheck';

interface Player {
  id?: string;
  name: string;
  position: string;
  preferred_foot: string;
  current_club?: string;
  image_url?: string;
  bio?: string;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchPlayers();
    
    // Force refresh every 5 seconds to ensure preview stays updated
    const interval = setInterval(fetchPlayers, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPlayers = async () => {
    if (!apiClient) {
      console.warn('API client not available. Please check your environment variables.');
      setLoading(false);
      return;
    }
    
    try {
      const data = await apiClient.getPlayers();
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      console.warn('Unable to fetch players. Please check your API configuration and network connection.');
      setPlayers([]); // Ensure players array is set to empty on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <img 
          src="/Academy Badge.png" 
          alt="Aspire Football Academy Logo" 
          className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-yellow-400"
        />
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Aspire Football Management Group
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Nurturing football talent and creating pathways to professional success. 
          Developing the next generation of football stars through expert coaching and mentorship.
        </p>
        
        {user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/players"
              className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-lg"
            >
              Manage Players
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-lg"
            >
              Learn More
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        )}
      </div>

      {/* Leadership Team Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-white mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Davis Haule</h3>
            <p className="text-red-100">Director & Founder</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Brian Haule</h3>
            <p className="text-red-100">Technical Director</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cory Charles</h3>
            <p className="text-red-100">Head Of Adult Pathway</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Coaching</h3>
          <p className="text-gray-600">
            Learn from ex-professional and semi-professional players who understand the journey to success.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Professional Pathways</h3>
          <p className="text-gray-600">
            Direct connections with professional and semi-professional clubs in England and internationally.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Holistic Development</h3>
          <p className="text-gray-600">
            Person before player - developing character, resilience, and life skills alongside football talent.
          </p>
        </div>
      </div>

      {/* Players Section */}
      <div id="players" className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Our Players</h2>
        
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading players...</p>
          </div>
        ) : players.length === 0 ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Coming Soon</h3>
            <p className="text-gray-600">Player profiles will be featured here</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <div 
                key={player.id} 
                className="group relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 mx-auto"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)',
                  height: '320px',
                  width: '220px'
                }}
              >
                {/* Geometric overlay pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `
                      linear-gradient(45deg, transparent 30%, rgba(156, 163, 175, 0.3) 30%, rgba(156, 163, 175, 0.3) 35%, transparent 35%),
                      linear-gradient(-45deg, transparent 30%, rgba(156, 163, 175, 0.2) 30%, rgba(156, 163, 175, 0.2) 35%, transparent 35%),
                      linear-gradient(135deg, transparent 60%, rgba(156, 163, 175, 0.1) 60%, rgba(156, 163, 175, 0.1) 65%, transparent 65%)
                    `,
                    backgroundSize: '40px 40px, 40px 40px, 80px 80px'
                  }}
                />
                
                {/* Basic Card - Always Visible */}
                <div className="relative p-4 z-10 h-full flex flex-col">
                  <div className="flex items-center space-x-4 mb-4">
                    {user && player.image_url ? (
                      <img
                        src={player.image_url}
                        alt={player.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                        <User className="w-7 h-7 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 leading-tight">
                        {user ? player.name : `Player ${players.indexOf(player) + 1}`}
                      </h3>
                      <p className="text-sm text-gray-600">{player.position}</p>
                    </div>
                  </div>
                  
                  {user && (
                    <div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Preferred Foot:</span>
                        <span className="font-medium">{player.preferred_foot}</span>
                      </div>
                      {player.current_club && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Club:</span>
                          <span className="font-medium text-right">{player.current_club}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Expanded Card - Visible on Hover */}
                {user && player.bio && (
                  <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-full group-hover:translate-y-0"
                       style={{ height: '100px' }}>
                    <div className="h-full">
                      <h4 className="text-xs font-semibold text-gray-800 mb-2">Player Bio:</h4>
                      <div className="h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <p className="text-xs text-gray-700 italic leading-relaxed pr-2">"{player.bio}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Form Section */}
      <div id="contact-form">
        <ContactForm />
      </div>

    </div>
  );
};

export default Home;