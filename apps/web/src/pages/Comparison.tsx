import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, CheckCircle2, XCircle, DollarSign, Clock, Users, Plane, Star, Award } from 'lucide-react';
import { useSchoolComparison } from '../hooks/useMarketplace';
import { TrustBadge } from '../components/TrustBadge';

export const Comparison: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get school IDs from URL params (e.g., ?schools=id1,id2,id3)
  const schoolIdsParam = searchParams.get('schools');
  const schoolIds = schoolIdsParam ? schoolIdsParam.split(',') : [];
  
  // Fetch schools for comparison
  const { data: schools, isLoading, error } = useSchoolComparison(schoolIds);

  const removeSchool = (schoolId: string) => {
    const newIds = schoolIds.filter(id => id !== schoolId);
    if (newIds.length === 0) {
      navigate('/search');
    } else {
      setSearchParams({ schools: newIds.join(',') });
    }
  };

  const addSchool = () => {
    navigate('/search?compare=true');
  };

  if (schoolIds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Award className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare Flight Schools</h1>
          <p className="text-gray-600 mb-8">
            Select schools from the search results to compare their programs, pricing, and features side-by-side.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <span>Browse Schools</span>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error || !schools) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="h-24 w-24 text-red-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Loading Schools</h1>
          <p className="text-gray-600 mb-8">{error?.message || 'Failed to load schools for comparison'}</p>
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Search</span>
          </Link>
        </div>
      </div>
    );
  }

  const ComparisonRow = ({ label, icon: Icon, values }: { label: string; icon: any; values: (string | number | React.ReactNode)[] }) => (
    <div className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="w-64 flex-shrink-0 p-4 font-medium text-gray-700 flex items-center space-x-2 border-r border-gray-200">
        <Icon className="h-5 w-5 text-gray-400" />
        <span>{label}</span>
      </div>
      <div className="flex flex-1">
        {values.map((value, idx) => (
          <div key={idx} className="flex-1 p-4 border-r border-gray-200 last:border-r-0">
            {value}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Search</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Compare Flight Schools</h1>
          <p className="text-gray-600">Side-by-side comparison of {schools.length} schools</p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* School Headers */}
          <div className="flex border-b-2 border-gray-200 bg-gray-50">
            <div className="w-64 flex-shrink-0 p-6 border-r-2 border-gray-200">
              <h2 className="font-bold text-gray-900">Features</h2>
            </div>
            <div className="flex flex-1">
              {schools.map((school) => (
                <div key={school.id} className="flex-1 p-6 border-r-2 border-gray-200 last:border-r-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link
                        to={`/schools/${school.slug}`}
                        className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {school.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {school.city}, {school.state}
                      </p>
                    </div>
                    <button
                      onClick={() => removeSchool(school.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <TrustBadge tier={school.trust_tier} size="sm" />
                </div>
              ))}
              {schools.length < 4 && (
                <div className="flex-1 p-6 flex items-center justify-center border-r-2 border-gray-200 last:border-r-0">
                  <button
                    onClick={addSchool}
                    className="px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-600 hover:text-blue-600 transition-all font-medium"
                  >
                    + Add School
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comparison Rows */}
          <ComparisonRow
            label="Trust Tier"
            icon={Award}
            values={schools.map((s) => (
              <span className="font-semibold capitalize">
                {s.trust_tier.replace('_', ' ')}
              </span>
            ))}
          />

          <ComparisonRow
            label="Rating"
            icon={Star}
            values={schools.map((s) => (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {s.avg_rating > 0 ? s.avg_rating.toFixed(1) : 'N/A'}
                </span>
                {s.avg_rating > 0 && (
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(s.avg_rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
                <span className="text-sm text-gray-500">({s.review_count})</span>
              </div>
            ))}
          />

          <ComparisonRow
            label="Price Range"
            icon={DollarSign}
            values={schools.map((s) => (
              <div>
                {s.min_program_cost && s.max_program_cost ? (
                  <>
                    <div className="text-2xl font-bold text-gray-900">
                      ${(s.min_program_cost / 1000).toFixed(0)}k - ${(s.max_program_cost / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Total program cost</div>
                  </>
                ) : (
                  <span className="text-gray-400">Not specified</span>
                )}
              </div>
            ))}
          />

          <ComparisonRow
            label="Fleet Size"
            icon={Plane}
            values={schools.map((s) => (
              <div>
                <div className="text-2xl font-bold text-gray-900">{s.aircraft_count || 0}</div>
                <div className="text-xs text-gray-500 mt-1">aircraft</div>
              </div>
            ))}
          />

          <ComparisonRow
            label="Instructors"
            icon={Users}
            values={schools.map((s) => (
              <div>
                <div className="text-2xl font-bold text-gray-900">{s.total_instructors || 0}</div>
                <div className="text-xs text-gray-500 mt-1">instructors</div>
              </div>
            ))}
          />

          <ComparisonRow
            label="Training Type"
            icon={CheckCircle2}
            values={schools.map((s) => (
              <div className="space-y-1">
                {s.is_part_61 && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Part 61</span>
                  </div>
                )}
                {s.is_part_141 && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Part 141</span>
                  </div>
                )}
                {!s.is_part_61 && !s.is_part_141 && (
                  <span className="text-gray-400">Not specified</span>
                )}
              </div>
            ))}
          />

          <ComparisonRow
            label="VA Approved"
            icon={Award}
            values={schools.map((s) =>
              s.is_veteran_approved ? (
                <div className="flex items-center space-x-2 text-green-600 font-medium">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Yes</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-400">
                  <XCircle className="h-5 w-5" />
                  <span>No</span>
                </div>
              )
            )}
          />

          <ComparisonRow
            label="Programs Offered"
            icon={Award}
            values={schools.map((s) => (
              <div className="flex flex-wrap gap-2">
                {s.programs_offered && s.programs_offered.length > 0 ? (
                  s.programs_offered.map((program) => (
                    <span
                      key={program}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium uppercase"
                    >
                      {program}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">None listed</span>
                )}
              </div>
            ))}
          />

          {/* FSP Metrics (if available) */}
          {schools.some(s => s.fsp_avg_hours_to_ppl) && (
            <ComparisonRow
              label="Avg Hours to PPL"
              icon={Clock}
              values={schools.map((s) =>
                s.fsp_avg_hours_to_ppl ? (
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{s.fsp_avg_hours_to_ppl}</div>
                    <div className="text-xs text-gray-500 mt-1">hours (FSP verified)</div>
                  </div>
                ) : (
                  <span className="text-gray-400">Not available</span>
                )
              )}
            />
          )}

          {schools.some(s => s.fsp_student_satisfaction) && (
            <ComparisonRow
              label="Student Satisfaction"
              icon={Star}
              values={schools.map((s) =>
                s.fsp_student_satisfaction ? (
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{s.fsp_student_satisfaction}/5.0</div>
                    <div className="text-xs text-gray-500 mt-1">FSP verified</div>
                  </div>
                ) : (
                  <span className="text-gray-400">Not available</span>
                )
              )}
            />
          )}

          {schools.some(s => s.fsp_schedule_reliability) && (
            <ComparisonRow
              label="Schedule Reliability"
              icon={Clock}
              values={schools.map((s) =>
                s.fsp_schedule_reliability ? (
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{s.fsp_schedule_reliability}%</div>
                    <div className="text-xs text-gray-500 mt-1">FSP verified</div>
                  </div>
                ) : (
                  <span className="text-gray-400">Not available</span>
                )
              )}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-center space-x-4">
          {schools.map((school) => (
            <Link
              key={school.id}
              to={`/schools/${school.slug}`}
              className="flex-1 max-w-xs px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-center"
            >
              View {school.name.split(' ')[0]} Details
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
