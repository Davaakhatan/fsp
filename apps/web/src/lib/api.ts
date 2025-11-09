import { supabase } from './supabase';
import type { SchoolSummary, School, Program, Aircraft, Review, SearchFilters } from '@fsp/shared';

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5175';

// =====================================================
// SCHOOL SEARCH & DISCOVERY
// =====================================================

export async function searchSchools(filters: SearchFilters = {}): Promise<SchoolSummary[]> {
  console.log('🔍 Search filters:', filters);
  
  let query;
  let isUsingRPC = false;

  // Location-based filtering using PostGIS
  if (filters.latitude && filters.longitude && filters.radius_miles) {
    // PostGIS distance query - use RPC directly
    const radiusMeters = filters.radius_miles * 1609.34;
    console.log('📍 Using PostGIS radius search');
    console.log('   Coordinates:', filters.latitude, filters.longitude);
    console.log('   Radius:', filters.radius_miles, 'miles =', radiusMeters, 'meters');
    
    // Test if RPC function exists
    try {
      query = supabase.rpc('schools_within_radius', {
        search_lat: filters.latitude,
        search_lon: filters.longitude,
        radius_meters: radiusMeters,
      });
      isUsingRPC = true;
      console.log('   RPC query created successfully');
    } catch (e) {
      console.error('   ❌ Error creating RPC query:', e);
      // Fall back to regular query
      query = supabase.from('school_summary').select('*');
    }
  } else {
    // Regular query
    query = supabase
      .from('school_summary')
      .select('*');
  }

  // City/State search (text-based location search)
  // Note: For now, we rely on geocoding to convert text to lat/lon
  // Text-based filtering without geocoding is disabled due to PostgREST limitations
  // TODO: Create a custom RPC function for text search
  if (filters.location && !filters.latitude && !isUsingRPC) {
    console.log('🔤 Text search without geocoding - showing all schools');
    // Don't filter, just show all schools
    // The geocoding will kick in after the API call completes
  }

  // Program type filtering (skip if using RPC - it returns filtered results)
  if (filters.program_types && filters.program_types.length > 0 && !isUsingRPC) {
    query = query.contains('programs_offered', filters.program_types);
  }

  // Budget filtering (skip if using RPC)
  if (filters.min_budget && !isUsingRPC) {
    query = query.gte('min_program_cost', filters.min_budget);
  }
  if (filters.max_budget && !isUsingRPC) {
    query = query.lte('max_program_cost', filters.max_budget);
  }

  // Trust tier filtering (skip if using RPC)
  if (filters.trust_tiers && filters.trust_tiers.length > 0 && !isUsingRPC) {
    query = query.in('trust_tier', filters.trust_tiers);
  }

  // VA approved (skip if using RPC)
  if (filters.is_va_approved && !isUsingRPC) {
    query = query.eq('is_veteran_approved', true);
  }

  // Training type (skip if using RPC)
  if (filters.training_type === 'part_61' && !isUsingRPC) {
    query = query.eq('is_part_61', true);
  } else if (filters.training_type === 'part_141' && !isUsingRPC) {
    query = query.eq('is_part_141', true);
  }

  // Sorting (skip if using RPC - it already sorts by distance)
  if (!isUsingRPC) {
    if (filters.sort_by === 'price_low') {
      query = query.order('min_program_cost', { ascending: true, nullsFirst: false });
    } else if (filters.sort_by === 'price_high') {
      query = query.order('max_program_cost', { ascending: false, nullsFirst: false });
    } else if (filters.sort_by === 'rating') {
      query = query.order('avg_rating', { ascending: false });
    } else if (filters.sort_by === 'name') {
      query = query.order('name', { ascending: true });
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('❌ Error searching schools:', error);
    console.error('   Error details:', JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }

  console.log('✅ Search results:', data?.length, 'schools found');
  if (isUsingRPC) {
    console.log('   Used RPC function');
    if (data && data.length > 0) {
      console.log('   First result:', data[0].name);
      console.log('   Has distance_miles?', 'distance_miles' in data[0], data[0].distance_miles);
    }
  } else {
    console.log('   Used regular query (no RPC)');
  }
  return data || [];
}

export async function getSchoolBySlug(slug: string): Promise<School | null> {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching school:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function getSchoolPrograms(schoolId: string): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('school_id', schoolId)
    .eq('is_active', true)
    .order('program_type');

  if (error) {
    console.error('Error fetching programs:', error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function getSchoolAircraft(schoolId: string): Promise<Aircraft[]> {
  const { data, error } = await supabase
    .from('aircraft')
    .select('*')
    .eq('school_id', schoolId)
    .order('make, model');

  if (error) {
    console.error('Error fetching aircraft:', error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function getSchoolReviews(schoolId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('school_id', schoolId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw new Error(error.message);
  }

  return data || [];
}

// =====================================================
// COMPARISON
// =====================================================

export async function compareSchools(schoolIds: string[]): Promise<SchoolSummary[]> {
  const { data, error } = await supabase
    .from('school_summary')
    .select('*')
    .in('id', schoolIds);

  if (error) {
    console.error('Error comparing schools:', error);
    throw new Error(error.message);
  }

  return data || [];
}

// =====================================================
// FINANCING
// =====================================================

export async function getFinancingPartners() {
  const { data, error } = await supabase
    .from('financing_partners')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching financing partners:', error);
    throw new Error(error.message);
  }

  return data || [];
}

// =====================================================
// INQUIRIES
// =====================================================

export async function submitInquiry(inquiry: {
  school_id: string;
  student_name: string;
  student_email: string;
  student_phone?: string;
  message?: string;
  program_interest?: string;
  source?: string;
}) {
  const { data, error } = await supabase
    .from('inquiries')
    .insert([inquiry])
    .select()
    .single();

  if (error) {
    console.error('Error submitting inquiry:', error);
    throw new Error(error.message);
  }

  return data;
}

// =====================================================
// REVIEWS
// =====================================================

export async function submitReview(review: {
  school_id: string;
  student_name: string;
  student_email?: string;
  rating: number;
  title?: string;
  review_text: string;
  rating_instructors?: number;
  rating_aircraft?: number;
  rating_facilities?: number;
  rating_value?: number;
  rating_support?: number;
  is_verified?: boolean;
  program_completed?: string;
}) {
  // Only include optional ratings if they're > 0 (to avoid CHECK constraint violations)
  const reviewData: any = {
    school_id: review.school_id,
    student_name: review.student_name,
    rating: review.rating,
    review_text: review.review_text,
    is_approved: false,
    helpful_count: 0,
  };

  // Add optional fields only if they have values
  if (review.student_email) reviewData.student_email = review.student_email;
  if (review.title) reviewData.title = review.title;
  if (review.is_verified !== undefined) reviewData.is_verified = review.is_verified;
  if (review.program_completed) reviewData.program_completed = review.program_completed;
  
  // Only add rating fields if they're > 0 (to satisfy CHECK constraints)
  if (review.rating_instructors && review.rating_instructors > 0) reviewData.rating_instructors = review.rating_instructors;
  if (review.rating_aircraft && review.rating_aircraft > 0) reviewData.rating_aircraft = review.rating_aircraft;
  if (review.rating_facilities && review.rating_facilities > 0) reviewData.rating_facilities = review.rating_facilities;
  if (review.rating_value && review.rating_value > 0) reviewData.rating_value = review.rating_value;
  if (review.rating_support && review.rating_support > 0) reviewData.rating_support = review.rating_support;

  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()
    .single();

  if (error) {
    console.error('Error submitting review:', error);
    throw new Error(error.message);
  }

  return data;
}

// =====================================================
// AI MATCHING (via API endpoint)
// =====================================================

export async function getAIMatches(request: any) {
  const response = await fetch(`${APP_URL}/api/ai-match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to get AI matches');
  }

  return response.json();
}

// =====================================================
// GEOCODING (for location search)
// =====================================================

export async function geocodeLocation(location: string): Promise<{ lat: number; lon: number } | null> {
  // Simple geocoding using OpenWeatherMap API
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: data[0].lat,
        lon: data[0].lon,
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }

  return null;
}

