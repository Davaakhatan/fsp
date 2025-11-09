import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Globe, Phone, Mail, DollarSign, Clock, Users, 
  Plane, Star, Check, AlertCircle, Calendar, Award, TrendingUp,
  MessageSquare, Send, ChevronLeft
} from 'lucide-react';
import { useSchool, useSchoolPrograms, useSchoolAircraft, useSchoolReviews, useSubmitInquiry } from '../hooks/useMarketplace';
import { TrustBadge } from '../components/TrustBadge';
import { useToast } from '../components/ToastProvider';

export const SchoolProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'fleet' | 'reviews'>('overview');
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  // Fetch data
  const { data: school, isLoading: schoolLoading } = useSchool(slug!);
  const { data: programs, isLoading: programsLoading } = useSchoolPrograms(school?.id || '');
  const { data: aircraft, isLoading: aircraftLoading } = useSchoolAircraft(school?.id || '');
  const { data: reviews, isLoading: reviewsLoading } = useSchoolReviews(school?.id || '');

  // Inquiry form
  const submitInquiry = useSubmitInquiry();
  const [inquiryForm, setInquiryForm] = useState({
    student_name: '',
    student_email: '',
    student_phone: '',
    program_interest: '',
    message: '',
  });

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    try {
      await submitInquiry.mutateAsync({
        school_id: school.id,
        ...inquiryForm,
        source: 'profile_page',
      });
      showToast('success', 'Inquiry sent! The school will contact you soon.');
      setShowInquiryForm(false);
      setInquiryForm({
        student_name: '',
        student_email: '',
        student_phone: '',
        program_interest: '',
        message: '',
      });
    } catch (error) {
      showToast('error', 'Failed to send inquiry. Please try again.');
    }
  };

  if (schoolLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading school profile...</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">School Not Found</h2>
          <p className="text-gray-600 mb-6">The school you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Search</span>
          </Link>
        </div>
      </div>
    );
  }

  const avgRating = reviews?.reduce((sum, r) => sum + r.rating, 0) / (reviews?.length || 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Search</span>
          </Link>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <TrustBadge tier={school.trust_tier} size="md" />
              <h1 className="text-4xl font-bold mt-4 mb-3">{school.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{school.city}, {school.state}</span>
                </div>
                
                {school.website && (
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-white transition-colors"
                  >
                    <Globe className="h-5 w-5" />
                    <span>Visit Website</span>
                  </a>
                )}
                
                {school.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>{school.phone}</span>
                  </div>
                )}
              </div>

              {reviews && reviews.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${i < Math.round(avgRating) ? 'text-yellow-400' : 'text-white/30'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-lg">{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={() => setShowInquiryForm(true)}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Request Information</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {programs && programs.length > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{programs.length}</div>
                <div className="text-sm text-gray-600">Programs</div>
              </div>
            )}
            {aircraft && aircraft.length > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{aircraft.length}</div>
                <div className="text-sm text-gray-600">Aircraft</div>
              </div>
            )}
            {school.total_instructors && (
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{school.total_instructors}</div>
                <div className="text-sm text-gray-600">Instructors</div>
              </div>
            )}
            {school.founded_year && (
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{new Date().getFullYear() - school.founded_year}+</div>
                <div className="text-sm text-gray-600">Years</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {(['overview', 'programs', 'fleet', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Description */}
            {school.description && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{school.description}</p>
              </div>
            )}

            {/* Training Types */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Training Options</h2>
              <div className="flex flex-wrap gap-4">
                {school.is_part_61 && (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <Check className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Part 61</span>
                  </div>
                )}
                {school.is_part_141 && (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Part 141</span>
                  </div>
                )}
                {school.is_veteran_approved && (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">VA Approved</span>
                  </div>
                )}
              </div>
            </div>

            {/* FSP Signals (for verified schools) */}
            {(school.trust_tier === 'premier' || school.trust_tier === 'verified_fsp') && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-200">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Verified Performance Data</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {school.fsp_avg_hours_to_ppl && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Avg PPL Hours</p>
                      <p className="text-3xl font-bold text-gray-900">{school.fsp_avg_hours_to_ppl.toFixed(1)}</p>
                      <p className="text-xs text-gray-500 mt-1">Based on actual student data</p>
                    </div>
                  )}
                  {school.fsp_schedule_reliability && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Schedule Reliability</p>
                      <p className="text-3xl font-bold text-gray-900">{school.fsp_schedule_reliability.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500 mt-1">On-time lesson rate</p>
                    </div>
                  )}
                  {school.fsp_student_satisfaction && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <p className="text-sm text-gray-600 mb-2">Student Satisfaction</p>
                      <p className="text-3xl font-bold text-gray-900">{school.fsp_student_satisfaction.toFixed(1)}/5.0</p>
                      <p className="text-xs text-gray-500 mt-1">Average rating from students</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <div className="space-y-6 animate-fadeIn">
            {programsLoading && <p className="text-center text-gray-600">Loading programs...</p>}
            
            {programs && programs.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <p className="text-gray-600">No programs listed yet.</p>
              </div>
            )}

            {programs && programs.map((program) => (
              <div key={program.id} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.program_name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full uppercase">
                        {program.program_type}
                      </span>
                      {program.training_type && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                          Part {program.training_type === 'part_61' ? '61' : '141'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {program.min_total_cost && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Cost Range</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${(program.min_total_cost / 1000).toFixed(0)}k - ${((program.max_total_cost || program.min_total_cost) / 1000).toFixed(0)}k
                      </p>
                    </div>
                  )}
                </div>

                {program.description && (
                  <p className="text-gray-700 mb-4">{program.description}</p>
                )}

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {program.min_duration_months && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600">Duration</p>
                        <p className="font-medium text-gray-900">
                          {program.min_duration_months}-{program.max_duration_months || program.min_duration_months} months
                        </p>
                      </div>
                    </div>
                  )}
                  {program.typical_hours && (
                    <div className="flex items-center space-x-2">
                      <Plane className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Typical Hours</p>
                        <p className="font-medium text-gray-900">{program.typical_hours} hours</p>
                      </div>
                    </div>
                  )}
                  {(program.financing_available || program.va_approved) && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Financing</p>
                        <p className="font-medium text-gray-900">
                          {program.financing_available ? 'Available' : program.va_approved ? 'VA Approved' : 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {program.cost_assumptions && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <strong>Cost Assumptions:</strong> {program.cost_assumptions}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Fleet Tab */}
        {activeTab === 'fleet' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {aircraftLoading && <p className="col-span-full text-center text-gray-600">Loading fleet...</p>}
            
            {aircraft && aircraft.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl p-12 text-center shadow-lg">
                <p className="text-gray-600">No aircraft listed yet.</p>
              </div>
            )}

            {aircraft && aircraft.map((plane) => (
              <div key={plane.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <Plane className="h-8 w-8 text-blue-600" />
                  {plane.has_glass_cockpit && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      Glass Cockpit
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {plane.make} {plane.model}
                </h3>
                
                {plane.registration && (
                  <p className="text-sm text-gray-600 mb-4">{plane.registration}</p>
                )}

                {plane.avionics_type && (
                  <p className="text-sm text-gray-700 mb-4">{plane.avionics_type}</p>
                )}

                {plane.hourly_rate_dual && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="text-2xl font-bold text-gray-900">${plane.hourly_rate_dual}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            {reviewsLoading && <p className="text-center text-gray-600">Loading reviews...</p>}
            
            {reviews && reviews.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              </div>
            )}

            {reviews && reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="font-bold text-gray-900">{review.student_name}</p>
                      {review.is_verified && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
                )}
                
                <p className="text-gray-700 leading-relaxed">{review.review_text}</p>

                {(review.rating_instructors || review.rating_aircraft || review.rating_facilities) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
                    {review.rating_instructors && (
                      <div>
                        <span className="text-gray-600">Instructors:</span>
                        <span className="ml-2 font-medium">{review.rating_instructors}/5</span>
                      </div>
                    )}
                    {review.rating_aircraft && (
                      <div>
                        <span className="text-gray-600">Aircraft:</span>
                        <span className="ml-2 font-medium">{review.rating_aircraft}/5</span>
                      </div>
                    )}
                    {review.rating_facilities && (
                      <div>
                        <span className="text-gray-600">Facilities:</span>
                        <span className="ml-2 font-medium">{review.rating_facilities}/5</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Request Information</h2>
                <button
                  onClick={() => setShowInquiryForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <AlertCircle className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.student_name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, student_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={inquiryForm.student_email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, student_email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={inquiryForm.student_phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, student_phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Interest</label>
                  <select
                    value={inquiryForm.program_interest}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, program_interest: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
                  >
                    <option value="">Select a program...</option>
                    {programs?.map((program) => (
                      <option key={program.id} value={program.program_type}>
                        {program.program_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="Tell us about your goals and what you'd like to know..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none resize-none"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={submitInquiry.isPending}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitInquiry.isPending ? 'Sending...' : 'Send Inquiry'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInquiryForm(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
