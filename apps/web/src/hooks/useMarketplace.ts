import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../lib/api';
import type { SearchFilters } from '@fsp/shared';

// =====================================================
// SCHOOL SEARCH & DISCOVERY
// =====================================================

export function useSchoolSearch(filters: SearchFilters = {}) {
  return useQuery({
    queryKey: ['schools', 'search', filters],
    queryFn: () => api.searchSchools(filters),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSchool(slug: string) {
  return useQuery({
    queryKey: ['schools', slug],
    queryFn: () => api.getSchoolBySlug(slug),
    enabled: !!slug,
  });
}

export function useSchoolPrograms(schoolId: string) {
  return useQuery({
    queryKey: ['schools', schoolId, 'programs'],
    queryFn: () => api.getSchoolPrograms(schoolId),
    enabled: !!schoolId,
  });
}

export function useSchoolAircraft(schoolId: string) {
  return useQuery({
    queryKey: ['schools', schoolId, 'aircraft'],
    queryFn: () => api.getSchoolAircraft(schoolId),
    enabled: !!schoolId,
  });
}

export function useSchoolReviews(schoolId: string) {
  return useQuery({
    queryKey: ['schools', schoolId, 'reviews'],
    queryFn: () => api.getSchoolReviews(schoolId),
    enabled: !!schoolId,
  });
}

// =====================================================
// COMPARISON
// =====================================================

export function useCompareSchools(schoolIds: string[]) {
  return useQuery({
    queryKey: ['schools', 'compare', schoolIds],
    queryFn: () => api.compareSchools(schoolIds),
    enabled: schoolIds.length > 0,
  });
}

// =====================================================
// FINANCING
// =====================================================

export function useFinancingPartners() {
  return useQuery({
    queryKey: ['financing', 'partners'],
    queryFn: api.getFinancingPartners,
  });
}

// =====================================================
// INQUIRIES
// =====================================================

export function useSubmitInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.submitInquiry,
    onSuccess: () => {
      // Invalidate school analytics after inquiry
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
}

// =====================================================
// AI MATCHING
// =====================================================

export function useAIMatching() {
  return useMutation({
    mutationFn: api.getAIMatches,
  });
}

// =====================================================
// GEOCODING
// =====================================================

export function useGeocoding(location: string) {
  return useQuery({
    queryKey: ['geocode', location],
    queryFn: () => api.geocodeLocation(location),
    enabled: !!location && location.length > 2,
    staleTime: 60 * 60 * 1000, // 1 hour (locations don't change)
  });
}

// =====================================================
// COMPARISON
// =====================================================

export function useSchoolComparison(schoolIds: string[]) {
  return useQuery({
    queryKey: ['schools', 'comparison', schoolIds.join(',')],
    queryFn: () => api.compareSchools(schoolIds),
    enabled: schoolIds.length > 0,
  });
}

