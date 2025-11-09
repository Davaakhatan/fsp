import React, { useState } from 'react';
import { X, Loader2, Send, Star, User, MessageSquare } from 'lucide-react';
import { useSubmitReview } from '../hooks/useMarketplace';
import { useToast } from './ToastProvider';

interface ReviewFormProps {
  schoolId: string;
  schoolName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ schoolId, schoolName, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const submitReview = useSubmitReview();

  const [formData, setFormData] = useState({
    reviewer_name: '',
    overall_rating: 0,
    instruction_rating: 0,
    aircraft_rating: 0,
    facilities_rating: 0,
    value_rating: 0,
    review_text: '',
    would_recommend: true,
    is_verified_student: false,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hoverRating, setHoverRating] = useState<{ [key: string]: number }>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.reviewer_name.trim()) errors.reviewer_name = 'Name is required';
    if (formData.overall_rating === 0) errors.overall_rating = 'Please provide an overall rating';
    if (!formData.review_text.trim()) errors.review_text = 'Review text is required';
    if (formData.review_text.trim().length < 50) errors.review_text = 'Review must be at least 50 characters';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await submitReview.mutateAsync({
        school_id: schoolId,
        ...formData,
      });
      showToast('success', 'Review submitted! It will appear after moderation.');
      onSuccess();
      onClose();
    } catch (error) {
      showToast('error', 'Failed to submit review. Please try again.');
    }
  };

  const RatingStars = ({ 
    rating, 
    onChange, 
    name, 
    label 
  }: { 
    rating: number; 
    onChange: (value: number) => void; 
    name: string; 
    label: string;
  }) => {
    const currentRating = hoverRating[name] || rating;
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverRating({ ...hoverRating, [name]: star })}
              onMouseLeave={() => setHoverRating({ ...hoverRating, [name]: 0 })}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= currentRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {currentRating > 0 ? `${currentRating} / 5` : 'Not rated'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Write a Review for {schoolName}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reviewer Name */}
            <div>
              <label htmlFor="reviewer_name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="reviewer_name"
                  name="reviewer_name"
                  value={formData.reviewer_name}
                  onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    validationErrors.reviewer_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name"
                />
              </div>
              {validationErrors.reviewer_name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.reviewer_name}</p>
              )}
            </div>

            {/* Overall Rating */}
            <div>
              <RatingStars
                rating={formData.overall_rating}
                onChange={(value) => setFormData({ ...formData, overall_rating: value })}
                name="overall_rating"
                label="Overall Rating *"
              />
              {validationErrors.overall_rating && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.overall_rating}</p>
              )}
            </div>

            {/* Detailed Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RatingStars
                rating={formData.instruction_rating}
                onChange={(value) => setFormData({ ...formData, instruction_rating: value })}
                name="instruction_rating"
                label="Instruction Quality"
              />
              <RatingStars
                rating={formData.aircraft_rating}
                onChange={(value) => setFormData({ ...formData, aircraft_rating: value })}
                name="aircraft_rating"
                label="Aircraft Quality"
              />
              <RatingStars
                rating={formData.facilities_rating}
                onChange={(value) => setFormData({ ...formData, facilities_rating: value })}
                name="facilities_rating"
                label="Facilities"
              />
              <RatingStars
                rating={formData.value_rating}
                onChange={(value) => setFormData({ ...formData, value_rating: value })}
                name="value_rating"
                label="Value for Money"
              />
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review_text" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="review_text"
                  name="review_text"
                  rows={6}
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
                    validationErrors.review_text ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Share your experience with this flight school (minimum 50 characters)..."
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                {validationErrors.review_text && (
                  <p className="text-red-500 text-sm">{validationErrors.review_text}</p>
                )}
                <p className="text-sm text-gray-500 ml-auto">
                  {formData.review_text.length} / 50 minimum
                </p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.would_recommend}
                  onChange={(e) => setFormData({ ...formData, would_recommend: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">I would recommend this school to others</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_verified_student}
                  onChange={(e) => setFormData({ ...formData, is_verified_student: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">I am/was a student at this school</span>
              </label>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Your review will be moderated before appearing on the school's profile. Please be honest and respectful in your feedback.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={submitReview.isPending}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitReview.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;

