import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, TrendingUp, Shield, DollarSign, Clock, Users } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?location=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = [
    { label: 'Flight Schools', value: '2,500+', icon: Users },
    { label: 'Verified Schools', value: '1,000+', icon: Shield },
    { label: 'Student Reviews', value: '50,000+', icon: TrendingUp },
    { label: 'Saved on Average', value: '$15,000', icon: DollarSign },
  ];

  const features = [
    {
      icon: Search,
      title: 'Search & Compare',
      description: 'Browse thousands of flight schools with normalized pricing, timelines, and program details.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Matching',
      description: 'Answer a few questions and get personalized school recommendations powered by AI.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Trust Tier Badges',
      description: 'See which schools are verified with operational data and proven student outcomes.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      title: 'Real Timeline Data',
      description: 'Know exactly how long training takes at each school based on actual student completion times.',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const popularSearches = [
    { location: 'Los Angeles, CA', icon: '🌴' },
    { location: 'Phoenix, AZ', icon: '🌵' },
    { location: 'Miami, FL', icon: '🏖️' },
    { location: 'Chicago, IL', icon: '🏙️' },
    { location: 'Austin, TX', icon: '🤠' },
    { location: 'Denver, CO', icon: '⛰️' },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6 animate-slideUp">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Powered by AI & Real Flight School Data</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-slideUp" style={{ animationDelay: '100ms' }}>
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Flight School
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto animate-slideUp" style={{ animationDelay: '200ms' }}>
            Compare 2,500+ flight schools with transparent pricing, verified data, and AI-powered recommendations. 
            Start your aviation journey the right way.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '300ms' }}>
            <div className="relative group">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where do you want to learn to fly? (City, State, or ZIP)"
                className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-lg group-hover:shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
              >
                Search
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-6 animate-slideUp" style={{ animationDelay: '400ms' }}>
            <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map(({ location, icon }) => (
                <button
                  key={location}
                  onClick={() => {
                    setSearchQuery(location);
                    navigate(`/search?location=${encodeURIComponent(location)}`);
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-blue-600 hover:bg-blue-50 transition-all text-sm font-medium text-gray-700 hover:text-blue-600 shadow-sm hover:shadow-md"
                >
                  <span>{icon}</span>
                  <span>{location}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-slideUp" style={{ animationDelay: '500ms' }}>
            <button
              onClick={() => navigate('/find-match')}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Sparkles className="h-5 w-5" />
              <span>Find My Perfect Match (AI)</span>
            </button>
            <button
              onClick={() => navigate('/search')}
              className="flex items-center space-x-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
            >
              <Search className="h-5 w-5" />
              <span>Browse All Schools</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon }, index) => (
              <div
                key={label}
                className="text-center animate-slideUp"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {value}
                </div>
                <div className="text-sm font-medium text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Flight School Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're changing how students find and choose flight schools. No more guesswork, just data-driven decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description, color }, index) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to start your aviation journey?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of students who found their perfect flight school through Flight School Pro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/find-match')}
              className="px-10 py-5 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-lg"
            >
              Get Started with AI Matching
            </button>
            <button
              onClick={() => navigate('/search')}
              className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg"
            >
              Explore Schools
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

