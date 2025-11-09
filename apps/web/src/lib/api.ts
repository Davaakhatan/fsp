import { supabase } from './supabase';
import type { SchoolSummary, School, Program, Aircraft, Review, SearchFilters } from '@fsp/shared';

const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5175';

// =====================================================
// SCHOOL SEARCH & DISCOVERY
// =====================================================

export async function searchSchools(filters: SearchFilters = {}): Promise<SchoolSummary[]> {
  console.log('🔍 Search filters:', filters);
  
  let query = supabase
    .from('school_summary')
    .select('*');

  // Location-based filtering
  if (filters.latitude && filters.longitude && filters.radius_miles) {
    // PostGIS distance query
    const radiusMeters = filters.radius_miles * 1609.34;
    console.log('📍 Using PostGIS radius search');
    query = query.rpc('schools_within_radius', {
      search_lat: filters.latitude,
      search_lon: filters.longitude,
      radius_meters: radiusMeters,
    });
  }

  // City/State search (text-based location search)
  // Note: For now, we rely on geocoding to convert text to lat/lon
  // Text-based filtering without geocoding is disabled due to PostgREST limitations
  // TODO: Create a custom RPC function for text search
  if (filters.location && !filters.latitude) {
    console.log('🔤 Text search without geocoding - showing all schools');
    // Don't filter, just show all schools
    // The geocoding will kick in after the API call completes
  }

  // Program type filtering
  if (filters.program_types && filters.program_types.length > 0) {
    query = query.contains('programs_offered', filters.program_types);
  }

  // Budget filtering
  if (filters.min_budget) {
    query = query.gte('min_program_cost', filters.min_budget);
  }
  if (filters.max_budget) {
    query = query.lte('max_program_cost', filters.max_budget);
  }

  // Trust tier filtering
  if (filters.trust_tiers && filters.trust_tiers.length > 0) {
    query = query.in('trust_tier', filters.trust_tiers);
  }

  // VA approved
  if (filters.is_va_approved) {
    query = query.eq('is_veteran_approved', true);
  }

  // Training type
  if (filters.training_type === 'part_61') {
    query = query.eq('is_part_61', true);
  } else if (filters.training_type === 'part_141') {
    query = query.eq('is_part_141', true);
  }

  // Sorting
  if (filters.sort_by === 'price_low') {
    query = query.order('min_program_cost', { ascending: true, nullsFirst: false });
  } else if (filters.sort_by === 'price_high') {
    query = query.order('max_program_cost', { ascending: false, nullsFirst: false });
  } else if (filters.sort_by === 'rating') {
    query = query.order('avg_rating', { ascending: false });
  } else if (filters.sort_by === 'name') {
    query = query.order('name', { ascending: true });
  } else if (filters.sort_by === 'distance' && filters.latitude) {
    // Distance sorting handled by PostGIS RPC
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error searching schools:', error);
    throw new Error(error.message);
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

