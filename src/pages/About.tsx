import React from 'react';
import { Shield, Users, Globe, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          About AFMG
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Aspire Football Management Group is dedicated to nurturing football talent and creating pathways to professional success.
        </p>
      </div>

      {/* Content will be added here when you provide the about page content */}
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
        <div className="max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">THE ACADEMY VISION</h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              At Aspire Football Academy, our vision is to help, support, teach, develop, and progress young 
              footballers on their footballing journey to achieve their goals and dreams. Aligned with our academy 
              culture and values, we aim to create an environment where the skills learned within football are 
              transferrable to everyday life.
            </p>
            
            <p className="text-lg">
              We at AFA will actively work alongside players and parents with an ethos of <strong>"person before the 
              player."</strong> Our belief is that a successful combination and management of this ideology help the player 
              achieve success both in their footballing journey and in life. Aspire Football Academy provides a safe, 
              fun, and competitive environment driven by a passion to help young football players succeed.
            </p>
            
            <p className="text-lg">
              A footballing journey, like any other journey, is met with successes and failures. Our vision is to 
              remain alongside the player, helping to build character, resilience, and to teach young football 
              players to grow and learn from their failures, as well as watching them embrace and learn from their 
              successes. To support this journey, we provide a number of footballing pathways to promote a 
              reward structure for their commitment to aspiring to achieve their goals.
            </p>
            
            <p className="text-lg">
              Aspire Football Academy has relationships with professional and semi-professional football clubs in 
              both England and internationally. AFA also provides support in accessing coaching and refereeing 
              courses to ensure alternative pathways at a key stage of a footballing journey.
            </p>
            
            <p className="text-lg">
              The Aspire Football Academy is made up of a coaching team of ex-professional and semi-professional 
              football players who are parents first and have an unrivalled passion to help create a 
              football environment that is conducive to learning, development, and progression, to achieve 
              continued success for the next generation of football-inspired children on their footballing journey.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Player-Centric</h3>
          <p className="text-gray-600 text-sm">
            Every decision we make prioritizes our players' success and well-being.
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Network</h3>
          <p className="text-gray-600 text-sm">
            Extensive connections with clubs, scouts, and opportunities worldwide.
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h3>
          <p className="text-gray-600 text-sm">
            Committed to maintaining the highest standards in everything we do.
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrity</h3>
          <p className="text-gray-600 text-sm">
            Transparent, honest, and ethical practices in all our relationships.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;