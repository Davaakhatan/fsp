import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Star, Check, X, MessageSquare, User, Mail, Calendar, Loader2 } from 'lucide-react';
import { formatDateTime } from '../lib/utils';

interface Review {
  id: string;
  school_id: string;
  student_name: string;
  student_email: string | null;
  is_verified: boolean;
  program_completed: string | null;
  rating: number;
  title: string | null;
  review_text: string;
  rating_instructors: number | null;
  rating_aircraft: number | null;
  rating_facilities: number | null;
  rating_value: number | null;
  rating_support: number | null;
  is_approved: boolean;
  created_at: string;
  school?: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
}

const Reviews: React.FC = () => {
  const { schoolId, isSchoolAdmin, isAdmin, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('pending');

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ['admin-reviews', schoolId, filterStatus, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          school:schools(id, name, city, state)
        `);
      
      // Platform admins see ALL reviews from ALL schools
      // School admins see only their school's reviews
      if (!isAdmin && schoolId) {
        query = query.eq('school_id', schoolId);
      }
      
      if (filterStatus === 'pending') {
        query = query.eq('is_approved', false);
      } else if (filterStatus === 'approved') {
        query = query.eq('is_approved', true);
      }
      
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: (isSchoolAdmin || isAdmin) && !authLoading,
  });

  const approveReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: true })
        .eq('id', reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['schools'] }); // Refresh school data (review count/rating)
    },
  });

  const rejectReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
  });

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-sm text-gray-400">Not rated</span>;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (authLoading || !(isSchoolAdmin || isAdmin)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Platform admins don't need a schoolId (they see all schools)
  // School admins need a schoolId
  if (!isAdmin && !schoolId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No School Linked</h2>
          <p className="text-gray-600">
            Your account is not linked to a school yet. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Review Moderation</h1>
          <p className="text-gray-600">
            {isAdmin 
              ? 'Review and approve student feedback for all schools' 
              : 'Review and approve student feedback for your school'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'All Reviews', status: 'all', count: reviews?.length || 0, color: 'blue' },
            { label: 'Pending Approval', status: 'pending', count: reviews?.filter(r => !r.is_approved).length || 0, color: 'yellow' },
            { label: 'Approved', status: 'approved', count: reviews?.filter(r => r.is_approved).length || 0, color: 'green' },
          ].map((stat) => (
            <button
              key={stat.status}
              onClick={() => setFilterStatus(stat.status as any)}
              className={`bg-white rounded-xl p-6 border-2 transition-all hover:shadow-lg ${
                filterStatus === stat.status
                  ? `border-${stat.color}-500 shadow-lg`
                  : 'border-gray-200'
              }`}
            >
              <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
              <div className={`text-3xl font-bold text-${stat.color}-600`}>{stat.count}</div>
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{review.student_name}</h3>
                      {/* Show school name for platform admins */}
                      {isAdmin && review.school && (
                        <p className="text-sm font-medium text-blue-600 mt-1">
                          {review.school.name} - {review.school.city}, {review.school.state}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        {review.student_email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {review.student_email}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDateTime(review.created_at)}
                        </span>
                        {review.is_verified && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Verified Student
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    review.is_approved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {review.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>

                {/* Overall Rating */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Overall Rating</div>
                  {renderStars(review.rating)}
                </div>

                {/* Detailed Ratings */}
                {(review.rating_instructors || review.rating_aircraft || review.rating_facilities || review.rating_value) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    {review.rating_instructors && (
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Instruction</div>
                        {renderStars(review.rating_instructors)}
                      </div>
                    )}
                    {review.rating_aircraft && (
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Aircraft</div>
                        {renderStars(review.rating_aircraft)}
                      </div>
                    )}
                    {review.rating_facilities && (
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Facilities</div>
                        {renderStars(review.rating_facilities)}
                      </div>
                    )}
                    {review.rating_value && (
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Value</div>
                        {renderStars(review.rating_value)}
                      </div>
                    )}
                  </div>
                )}

                {/* Review Text */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  )}
                  <p className="text-gray-800 whitespace-pre-wrap">{review.review_text}</p>
                </div>

                {/* Actions */}
                {!review.is_approved && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => approveReviewMutation.mutate(review.id)}
                      disabled={approveReviewMutation.isPending}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => rejectReviewMutation.mutate(review.id)}
                      disabled={rejectReviewMutation.isPending}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600">
              {filterStatus === 'pending'
                ? 'No reviews pending approval'
                : filterStatus === 'approved'
                ? 'No approved reviews yet'
                : 'When students leave reviews, they will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;

