import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Search, SlidersHorizontal, X, DollarSign, Clock, Users, Plane } from 'lucide-react';
import { useSchoolSearch, useGeocoding } from '../hooks/useMarketplace';
import { TrustBadge } from '../components/TrustBadge';
import type { SearchFilters, TrustTier, ProgramType, TrainingType } from '@fsp/shared';

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract search parameters
  const locationQuery = searchParams.get('location') || '';
  const [searchInput, setSearchInput] = useState(locationQuery);
  
  // Filters state
  const [filters, setFilters] = useState<SearchFilters>({
    location: locationQuery,
    sort_by: 'distance',
  });

  // Geocode location if needed
  const { data: geocodeData, isLoading: isGeocoding } = useGeocoding(filters.location || '');
  
  // Create search filters with coordinates
  const searchFilters = React.useMemo(() => {
    if (geocodeData && filters.location) {
      return {
        ...filters,
        latitude: geocodeData.lat,
        longitude: geocodeData.lon,
        radius_miles: filters.radius_miles || 100, // Default 100 miles
      };
    }
    return filters;
  }, [filters, geocodeData]);

  // Fetch schools (will wait for geocoding if location is provided)
  const shouldSearch = !filters.location || geocodeData || !isGeocoding;
  const { data: schools, isLoading: isSearching, error } = useSchoolSearch(
    shouldSearch ? searchFilters : undefined
  );
  
  const isLoading = isGeocoding || isSearching;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, location: searchInput }));
    setSearchParams({ location: searchInput });
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = <T,>(key: keyof SearchFilters, value: T) => {
    setFilters(prev => {
      const currentArray = (prev[key] as T[]) || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const clearFilters = () => {
    setFilters({ location: locationQuery, sort_by: 'distance' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 w-full">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by city, state, or ZIP..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
              {Object.keys(filters).length > 2 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {Object.keys(filters).length - 2}
                </span>
              )}
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {isLoading ? 'Searching...' : `${schools?.length || 0} schools found`}
              {filters.location && ` near ${filters.location}`}
            </p>
            
            {/* Sort */}
            <select
              value={filters.sort_by || 'distance'}
              onChange={(e) => updateFilter('sort_by', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option value="distance">Distance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:w-80 space-y-6 animate-slideUp">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Distance */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Distance Radius
                  </label>
                  <select
                    value={filters.radius_miles || 100}
                    onChange={(e) => updateFilter('radius_miles', Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  >
                    <option value={25}>25 miles</option>
                    <option value={50}>50 miles</option>
                    <option value={100}>100 miles</option>
                    <option value={200}>200 miles</option>
                    <option value={500}>500 miles</option>
                  </select>
                </div>

                {/* Trust Tier */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Trust Level
                  </label>
                  <div className="space-y-2">
                    {(['premier', 'verified_fsp', 'community_verified'] as TrustTier[]).map((tier) => (
                      <label key={tier} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={(filters.trust_tiers || []).includes(tier)}
                          onChange={() => toggleArrayFilter('trust_tiers', tier)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <TrustBadge tier={tier} size="sm" showTooltip={false} />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Budget Range
                  </label>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min ($)"
                      value={filters.min_budget || ''}
                      onChange={(e) => updateFilter('min_budget', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max ($)"
                      value={filters.max_budget || ''}
                      onChange={(e) => updateFilter('max_budget', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>
                </div>

                {/* Program Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Programs Offered
                  </label>
                  <div className="space-y-2">
                    {(['ppl', 'ir', 'cpl', 'cfi', 'multi'] as ProgramType[]).map((program) => (
                      <label key={program} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(filters.program_types || []).includes(program)}
                          onChange={() => toggleArrayFilter('program_types', program)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 uppercase">{program}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Training Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Training Type
                  </label>
                  <div className="space-y-2">
                    {(['part_61', 'part_141'] as TrainingType[]).map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="training_type"
                          checked={filters.training_type === type}
                          onChange={() => updateFilter('training_type', type)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Part {type === 'part_61' ? '61' : '141'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.has_financing || false}
                      onChange={(e) => updateFilter('has_financing', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Financing Available</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.is_va_approved || false}
                      onChange={(e) => updateFilter('is_va_approved', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">VA Approved</span>
                  </label>
                </div>
              </div>
            </aside>
          )}

          {/* Results Grid */}
          <main className="flex-1">
            {isLoading && (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-red-800 font-medium">Error loading schools. Please try again.</p>
              </div>
            )}

            {!isLoading && schools && schools.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No schools found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search location</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!isLoading && schools && schools.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {schools.map((school) => (
                  <Link
                    key={school.id}
                    to={`/schools/${school.slug}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                            {school.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{school.city}, {school.state}</span>
                            {school.distance_miles && (
                              <span className="text-blue-600 font-medium">
                                • {Math.round(school.distance_miles)} mi
                              </span>
                            )}
                          </div>
                        </div>
                        <TrustBadge tier={school.trust_tier} size="sm" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {school.min_program_cost && (
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">From</p>
                              <p className="font-bold text-gray-900">
                                ${(school.min_program_cost / 1000).toFixed(0)}k
                              </p>
                            </div>
                          </div>
                        )}
                        {school.aircraft_count > 0 && (
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                              <Plane className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Fleet</p>
                              <p className="font-bold text-gray-900">{school.aircraft_count} aircraft</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Programs */}
                      {school.programs_offered && school.programs_offered.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {school.programs_offered.slice(0, 4).map((program) => (
                            <span
                              key={program}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full uppercase"
                            >
                              {program}
                            </span>
                          ))}
                          {school.programs_offered.length > 4 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              +{school.programs_offered.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Rating */}
                      {school.review_count > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${
                                  i < Math.round(school.avg_rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {school.avg_rating.toFixed(1)} ({school.review_count} reviews)
                          </span>
                        </div>
                      )}

                      {/* FSP Signals (for verified schools) */}
                      {school.trust_tier === 'premier' || school.trust_tier === 'verified_fsp' ? (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            {school.fsp_avg_hours_to_ppl && (
                              <div>
                                <p className="text-gray-500">Avg PPL Hours</p>
                                <p className="font-bold text-gray-900">{school.fsp_avg_hours_to_ppl.toFixed(1)}</p>
                              </div>
                            )}
                            {school.fsp_student_satisfaction && (
                              <div>
                                <p className="text-gray-500">Satisfaction</p>
                                <p className="font-bold text-gray-900">{school.fsp_student_satisfaction.toFixed(1)}/5.0</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
