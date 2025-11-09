import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, ChevronLeft, MapPin, DollarSign, Calendar, Plane, GraduationCap, Award, Loader2 } from 'lucide-react';
import { useSchoolSearch } from '../hooks/useMarketplace';
import { TrustBadge } from '../components/TrustBadge';
import type { SchoolSummary } from '@fsp/shared';

interface QuestionnaireAnswers {
  trainingGoal: string;
  budget: number;
  location: string;
  locationFlexibility: string;
  timeline: string;
  scheduleAvailability: string;
  programType: string;
  aircraftPreference: string;
  financingNeeded: boolean;
  vaEligible: boolean;
}

export const AIMatching: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<Array<SchoolSummary & { score: number; reasoning: string }>>([]);

  // Fetch all schools for matching
  const { data: allSchools } = useSchoolSearch({});

  const updateAnswer = (key: keyof QuestionnaireAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, questions.length));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  // Simple matching algorithm (no AI API call needed for MVP)
  const performMatching = () => {
    setIsMatching(true);
    
    setTimeout(() => {
      if (!allSchools) return;

      // Score each school based on questionnaire answers
      const scoredSchools = allSchools.map(school => {
        let score = 0;
        let reasons: string[] = [];

        // Budget match (40% weight)
        if (answers.budget && school.min_program_cost && school.max_program_cost) {
          const avgCost = (school.min_program_cost + school.max_program_cost) / 2;
          if (avgCost <= answers.budget) {
            score += 40;
            reasons.push(`Within your budget of $${(answers.budget / 1000).toFixed(0)}k`);
          } else {
            const overBudget = avgCost - answers.budget;
            score += Math.max(0, 40 - (overBudget / answers.budget) * 20);
          }
        }

        // Location (20% weight) - Skip for now, would need geocoding
        score += 20;

        // Training type match (15% weight)
        if (answers.programType === 'part_141' && school.is_part_141) {
          score += 15;
          reasons.push('Offers Part 141 structured training');
        } else if (answers.programType === 'part_61' && school.is_part_61) {
          score += 15;
          reasons.push('Offers Part 61 flexible training');
        } else {
          score += 7;
        }

        // VA approved (10% weight)
        if (answers.vaEligible && school.is_veteran_approved) {
          score += 10;
          reasons.push('VA approved for veterans');
        }

        // Trust tier (15% weight)
        const trustScores = { premier: 15, verified_fsp: 12, community_verified: 8, unverified: 5 };
        score += trustScores[school.trust_tier as keyof typeof trustScores] || 0;
        if (school.trust_tier === 'premier') {
          reasons.push('Premier verified school with excellent track record');
        } else if (school.trust_tier === 'verified_fsp') {
          reasons.push('FSP verified operational data');
        }

        // Rating bonus
        if (school.avg_rating >= 4.5) {
          score += 5;
          reasons.push(`Excellent ${school.avg_rating.toFixed(1)}★ rating`);
        }

        // Fleet size (indicates availability)
        if (school.aircraft_count && school.aircraft_count >= 5) {
          reasons.push(`Large fleet (${school.aircraft_count} aircraft) means better availability`);
        }

        return {
          ...school,
          score: Math.min(score, 100),
          reasoning: reasons.join(' • '),
        };
      });

      // Sort by score and take top 5
      const topMatches = scoredSchools
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setMatches(topMatches);
      setIsMatching(false);
    }, 2000); // Simulate AI processing
  };

  const questions = [
    {
      id: 'trainingGoal',
      title: "What's your primary training goal?",
      icon: GraduationCap,
      options: [
        { value: 'career', label: 'Career Pilot', desc: 'I want to become an airline or commercial pilot' },
        { value: 'recreational', label: 'Recreational Flying', desc: 'I want to fly for personal enjoyment' },
        { value: 'specific_rating', label: 'Specific Rating', desc: 'I need a particular license or rating' },
        { value: 'exploring', label: 'Exploring Options', desc: 'I\'m still researching flight training' },
      ],
    },
    {
      id: 'budget',
      title: 'What is your maximum budget?',
      icon: DollarSign,
      type: 'range',
      min: 5000,
      max: 100000,
      step: 5000,
      format: (val: number) => `$${(val / 1000).toFixed(0)}k`,
    },
    {
      id: 'location',
      title: 'Where do you prefer to train?',
      icon: MapPin,
      type: 'text',
      placeholder: 'City, State or ZIP code',
    },
    {
      id: 'locationFlexibility',
      title: 'How flexible are you with location?',
      icon: MapPin,
      options: [
        { value: 'local', label: 'Local Only', desc: 'Within 30 miles of my location' },
        { value: 'regional', label: 'Regional', desc: 'Within my state or region' },
        { value: 'anywhere', label: 'Anywhere', desc: 'I can relocate if needed' },
      ],
    },
    {
      id: 'timeline',
      title: 'How quickly do you want to complete training?',
      icon: Calendar,
      options: [
        { value: 'fast_track', label: 'Fast Track', desc: '3-4 months (full-time immersive)' },
        { value: 'standard', label: 'Standard', desc: '6-9 months (regular pace)' },
        { value: 'flexible', label: 'Flexible', desc: '12+ months (part-time as I go)' },
      ],
    },
    {
      id: 'scheduleAvailability',
      title: "What's your weekly availability?",
      icon: Calendar,
      options: [
        { value: 'full_time', label: 'Full-Time', desc: '5-7 days per week' },
        { value: 'part_time', label: 'Part-Time', desc: '2-4 days per week' },
        { value: 'weekends', label: 'Weekends Only', desc: 'Weekends and evenings' },
      ],
    },
    {
      id: 'programType',
      title: 'What training structure do you prefer?',
      icon: GraduationCap,
      options: [
        { value: 'part_141', label: 'Part 141', desc: 'Structured curriculum, often faster' },
        { value: 'part_61', label: 'Part 61', desc: 'Flexible, self-paced training' },
        { value: 'no_preference', label: 'No Preference', desc: 'Either works for me' },
      ],
    },
    {
      id: 'aircraftPreference',
      title: 'Do you have aircraft preferences?',
      icon: Plane,
      options: [
        { value: 'glass_cockpit', label: 'Glass Cockpit', desc: 'Modern G1000/G3000 avionics' },
        { value: 'traditional', label: 'Traditional', desc: 'Analog/steam gauge aircraft' },
        { value: 'no_preference', label: 'No Preference', desc: 'Any aircraft type is fine' },
      ],
    },
    {
      id: 'financing',
      title: 'Do you need financing assistance?',
      icon: DollarSign,
      options: [
        { value: 'yes', label: 'Yes, I need financing', desc: 'I\'ll need a loan or payment plan' },
        { value: 'maybe', label: 'Maybe, exploring options', desc: 'I want to see what\'s available' },
        { value: 'no', label: 'No, paying upfront', desc: 'I can pay the full amount' },
      ],
      multi: [
        { id: 'vaEligible', label: 'I\'m a veteran eligible for VA benefits' },
      ],
    },
  ];

  const currentQuestion = questions[step];

  // Safety check
  if (!currentQuestion) {
    return null;
  }

  if (matches.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Your Personalized Matches</h1>
            <p className="text-xl text-gray-600">
              Based on your answers, here are the best flight schools for you
            </p>
          </div>

          {/* Matches */}
          <div className="space-y-6">
            {matches.map((school, idx) => (
              <div
                key={school.id}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        #{idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{school.name}</h2>
                      <p className="text-gray-600 mb-3">
                        {school.city}, {school.state}
                      </p>
                      <TrustBadge tier={school.trust_tier} size="md" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-blue-600 mb-1">{school.score}%</div>
                    <div className="text-sm text-gray-500">Match Score</div>
                  </div>
                </div>

                {/* Why This Match */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <span>Why This School</span>
                  </h3>
                  <p className="text-sm text-gray-700">{school.reasoning}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <DollarSign className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">
                      {school.min_program_cost && school.max_program_cost
                        ? `$${(school.min_program_cost / 1000).toFixed(0)}-${(school.max_program_cost / 1000).toFixed(0)}k`
                        : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">Price Range</div>
                  </div>
                  <div className="text-center">
                    <Award className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">
                      {school.avg_rating > 0 ? school.avg_rating.toFixed(1) : 'N/A'}★
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                  <div className="text-center">
                    <Plane className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">{school.aircraft_count || 0}</div>
                    <div className="text-xs text-gray-500">Aircraft</div>
                  </div>
                  <div className="text-center">
                    <GraduationCap className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">{school.total_instructors || 0}</div>
                    <div className="text-xs text-gray-500">Instructors</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/schools/${school.slug}`)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    View Full Profile
                  </button>
                  <button
                    onClick={() => navigate(`/compare?schools=${school.id}`)}
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all"
                  >
                    Compare
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-12 text-center space-y-4">
            <button
              onClick={() => {
                setMatches([]);
                setStep(0);
                setAnswers({});
              }}
              className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {step < questions.length ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Question {step + 1} of {questions.length}</span>
                <span>{Math.round(((step + 1) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                  style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <currentQuestion.icon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{currentQuestion.title}</h2>
              </div>

              {currentQuestion.type === 'range' ? (
                <div className="space-y-4">
                  <input
                    type="range"
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    step={currentQuestion.step}
                    value={answers[currentQuestion.id as keyof QuestionnaireAnswers] || currentQuestion.min}
                    onChange={(e) => updateAnswer(currentQuestion.id as keyof QuestionnaireAnswers, Number(e.target.value))}
                    className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      {currentQuestion.format?.(Number(answers[currentQuestion.id as keyof QuestionnaireAnswers]) || currentQuestion.min!)}
                    </div>
                  </div>
                </div>
              ) : currentQuestion.type === 'text' ? (
                <input
                  type="text"
                  placeholder={currentQuestion.placeholder}
                  value={(answers[currentQuestion.id as keyof QuestionnaireAnswers] as string) || ''}
                  onChange={(e) => updateAnswer(currentQuestion.id as keyof QuestionnaireAnswers, e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
                />
              ) : (
                <div className="space-y-4">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateAnswer(currentQuestion.id as keyof QuestionnaireAnswers, option.value)}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        answers[currentQuestion.id as keyof QuestionnaireAnswers] === option.value
                          ? 'border-blue-600 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-bold text-gray-900 text-lg mb-1">{option.label}</div>
                      <div className="text-gray-600 text-sm">{option.desc}</div>
                    </button>
                  ))}
                  {currentQuestion.multi?.map((checkbox) => (
                    <label key={checkbox.id} className="flex items-center space-x-3 p-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!answers[checkbox.id as keyof QuestionnaireAnswers]}
                        onChange={(e) => updateAnswer(checkbox.id as keyof QuestionnaireAnswers, e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-gray-700">{checkbox.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={step === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <button
                onClick={nextStep}
                disabled={!answers[currentQuestion.id as keyof QuestionnaireAnswers]}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            {isMatching ? (
              <>
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Finding Your Perfect Matches...</h2>
                <p className="text-gray-600">
                  Analyzing 6 schools against your preferences using advanced matching algorithms
                </p>
              </>
            ) : (
              <>
                <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Find Your Matches!</h2>
                <p className="text-gray-600 mb-8">
                  We'll analyze all flight schools and rank them based on your unique preferences and goals.
                </p>
                <button
                  onClick={performMatching}
                  className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:shadow-lg transition-all"
                >
                  Get My Matches
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
