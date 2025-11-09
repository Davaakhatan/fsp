// =====================================================
// SHARED TYPES FOR MARKETPLACE
// =====================================================

export type TrustTier = 'premier' | 'verified_fsp' | 'community_verified' | 'unverified';
export type SubscriptionTier = 'free' | 'plus' | 'premier';
export type ProgramType = 'ppl' | 'ir' | 'cpl' | 'cfi' | 'cfii' | 'mei' | 'atp' | 'multi' | 'seaplane' | 'tailwheel' | 'aerobatic';
export type TrainingType = 'part_61' | 'part_141' | 'both';
export type AircraftCategory = 'single_engine' | 'multi_engine' | 'helicopter' | 'seaplane' | 'glider';

export interface School {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  
  // Location
  address_line1: string | null;
  address_line2: string | null;
  city: string;
  state: string;
  zip_code: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  
  // Trust & Subscription
  trust_tier: TrustTier;
  is_claimed: boolean;
  subscription_tier: SubscriptionTier;
  
  // Operational Data
  founded_year: number | null;
  total_instructors: number | null;
  total_aircraft: number | null;
  total_students: number | null;
  is_part_61: boolean;
  is_part_141: boolean;
  is_veteran_approved: boolean;
  
  // FSP Signals (for verified schools)
  fsp_avg_hours_to_ppl: number | null;
  fsp_avg_hours_to_ir: number | null;
  fsp_cancellation_rate: number | null;
  fsp_schedule_reliability: number | null;
  fsp_student_satisfaction: number | null;
  
  created_at: string;
  updated_at: string;
}

export interface SchoolSummary extends School {
  avg_rating: number;
  review_count: number;
  min_program_cost: number | null;
  max_program_cost: number | null;
  programs_offered: ProgramType[];
  aircraft_count: number;
  distance_miles?: number; // For location-based searches
}

export interface Program {
  id: string;
  school_id: string;
  program_type: ProgramType;
  program_name: string;
  description: string | null;
  training_type: TrainingType | null;
  
  // Cost
  min_total_cost: number | null;
  max_total_cost: number | null;
  cost_assumptions: string | null;
  
  // Timeline
  min_duration_months: number | null;
  max_duration_months: number | null;
  timeline_assumptions: string | null;
  
  // Requirements
  minimum_hours: number | null;
  typical_hours: number | null;
  prerequisites: string | null;
  
  // Financing
  financing_available: boolean;
  va_approved: boolean;
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Aircraft {
  id: string;
  school_id: string;
  registration: string | null;
  make: string;
  model: string;
  year: number | null;
  category: AircraftCategory | null;
  is_complex: boolean;
  is_high_performance: boolean;
  is_tailwheel: boolean;
  has_glass_cockpit: boolean;
  avionics_type: string | null;
  hourly_rate_solo: number | null;
  hourly_rate_dual: number | null;
  is_available: boolean;
  photo_urls: string[] | null;
}

export interface Review {
  id: string;
  school_id: string;
  student_name: string;
  program_completed: string | null;
  rating: number;
  title: string | null;
  review_text: string;
  rating_instructors: number | null;
  rating_aircraft: number | null;
  rating_facilities: number | null;
  rating_value: number | null;
  rating_support: number | null;
  helpful_count: number;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface SearchFilters {
  location?: string;
  latitude?: number;
  longitude?: number;
  radius_miles?: number;
  program_types?: ProgramType[];
  min_budget?: number;
  max_budget?: number;
  training_type?: TrainingType;
  trust_tiers?: TrustTier[];
  has_financing?: boolean;
  is_va_approved?: boolean;
  sort_by?: 'distance' | 'price_low' | 'price_high' | 'rating' | 'name';
}

export interface FinancingPartner {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  min_loan_amount: number | null;
  max_loan_amount: number | null;
  min_apr: number | null;
  max_apr: number | null;
  loan_term_months: number | null;
  min_credit_score: number | null;
  requires_cosigner: boolean;
}

export interface AIMatchRequest {
  training_goal: 'career' | 'recreational' | 'specific_rating' | 'exploring';
  budget_min?: number;
  budget_max?: number;
  location_flexibility: 'local' | 'regional' | 'anywhere';
  preferred_location_city?: string;
  preferred_location_state?: string;
  timeline_flexibility: 'fast_track' | 'standard' | 'flexible';
  schedule_availability: 'full_time' | 'part_time' | 'weekends';
  aircraft_preference?: string;
  financing_needed: boolean;
}

export interface AIMatchResult {
  school: SchoolSummary;
  match_score: number;
  reasoning: string;
  key_strengths: string[];
  considerations: string[];
}

