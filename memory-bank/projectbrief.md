# Project Brief: Find-a-Flight-School Marketplace

## Project Identity
- **Organization**: Flight Schedule Pro (FSP)
- **Category**: Student-Facing Marketplace & Discovery Platform
- **Estimated Timeline**: 4-6 weeks (MVP)
- **Project Type**: Full-stack marketplace with AI matching and trust verification

## Core Problem Statement
Prospective pilots face an overwhelming and fragmented flight training landscape:
- **Inconsistent Information**: Every school presents data differently (costs, timelines, programs)
- **No Comparison Tools**: Cannot easily compare schools side-by-side
- **Outdated Data**: School websites often have stale pricing and availability
- **No Quality Signals**: Hard to distinguish reliable schools from unreliable ones
- **Decision Paralysis**: Too many choices, no guidance on best fit

Flight schools struggle to differentiate themselves:
- **Price-Only Competition**: Cannot showcase operational excellence
- **No Credibility Signals**: Hard to prove reliability and outcomes
- **Limited Reach**: Rely on word-of-mouth and local marketing
- **Generic Listings**: Lost in directories with no differentiation

## Solution Overview
A comprehensive flight school marketplace that:
1. **Indexes ALL flight schools** in North America (and beyond)
2. **Normalizes data** for direct comparison (costs, timelines, programs, fleet)
3. **Establishes Trust Tiers** powered by FSP operational data
4. **Matches students** to best-fit schools using AI
5. **Guides enrollment** with financing, tours, and discovery flights
6. **Monetizes** through subscriptions and verified listings

## Primary Objectives

### 1. Complete Coverage
**Goal**: Index every flight school in North America (and beyond)

**How**:
- Web crawling of public flight school data
- Google Business integration
- FAA database integration
- School-claimed profiles

### 2. Normalized Data
**Goal**: Standardize opaque information for direct comparison

**What to Normalize**:
- Program costs (PPL, IR, CPL, etc.) with min/max bands
- True timeline estimates (min/max months to completion)
- Financing options (VA, lenders, scholarships)
- Fleet inventory (aircraft types, quantity, simulator availability)
- Training types (Part 61, Part 141)
- Instructor count and ratios

### 3. Build Trust
**Goal**: Establish clear Trust Tiers powered by FSP operational data

**Trust Tier System**:
- 🥇 **Premier Flight School**: Meets/exceeds composite benchmarks (training velocity, schedule reliability, student satisfaction)
- ✅ **Verified FSP School**: Profile facts cross-checked against FSP operational data
- 🤝 **Community-Verified**: School claimed profile, verified business docs
- **Unverified**: Crawled data only, no human verification

### 4. Smart Matching
**Goal**: Implement AI "training concierge" to match students to best schools

**Features**:
- Student questionnaire (goals, budget, location, schedule)
- Embedding models for candidate selection
- LLM-powered plain-English comparisons
- Ranked matches with reasoning

### 5. Drive Conversion
**Goal**: Offer seamless tools for next steps

**Tools**:
- Inquiry routing to schools
- Tour booking integration
- Discovery flight scheduling
- Financing pre-qualification
- Call tracking

## Core Product Pillars & Features

### A. Search & Compare
- **Multivariate Filters**: Program type, budget, location, financing, fleet, training type
- **Comparison Cards**: Side-by-side view with normalized data
- **Map View**: Geographic search and visualization

### B. School Profiles
- **Comprehensive Data**: Programs, pricing, timeline, fleet, instructors, reviews
- **Evidence Panel**: Trust Tier badge, verified facts, timestamps
- **Photo Gallery**: Facilities, aircraft, instructors
- **Student Reviews**: Ratings and testimonials

### C. Guided Journey
- **Matching AI**: Questionnaire → ranked matches
- **AI Debrief**: Plain-English comparison ("School A is 12-18% faster for Instrument...")
- **Next Steps**: Clear path to inquiry, tour, discovery flight

### D. Financing & Funding Hub
- **Lender Marketplace**: Soft-pull pre-qualification
- **VA/Funding Flags**: Eligibility indicators
- **Affordability Calculator**: "What you'll actually pay per month" with sensitivity sliders

### E. School Claim & Monetization
- **Free Tier**: Claim profile, list programs, basic inquiries (limited lead volume)
- **Plus (Subscription)**: Rich profile, CRM integration, call tracking, financing widget, analytics
- **Premier Tier**: All Plus + prominent placement + deep analytics + scholarship co-promotion
- **Lead Fees (Optional)**: Pay-per-lead or per-discovery-flight booking

## Success Criteria
The MVP is complete when ALL of the following are achieved:

✅ **Search & Discovery**:
- Search by location, program, budget working
- Filter system functional
- Map view displays schools

✅ **School Profiles**:
- Profile pages display all normalized data
- Trust badges displayed correctly
- Photos and reviews visible

✅ **AI Matching**:
- Student questionnaire captures requirements
- AI generates ranked matches
- Plain-English debrief explains differences

✅ **Comparison Tool**:
- Side-by-side comparison works
- Normalized data displayed correctly

✅ **Financing Hub**:
- Affordability calculator functional
- VA/funding flags displayed

✅ **School Claim Flow**:
- Schools can claim profiles
- Verification process works
- Subscription tiers functional

✅ **Data Quality**:
- 50+ schools with normalized data
- FSP signals integrated for verified schools
- Review system working

✅ **Performance**:
- Search results < 1 second
- Profile pages load < 2 seconds
- AI matching < 30 seconds

## Key Constraints & Requirements

### Technical Constraints
- Must handle 10,000+ schools at scale
- Search must be fast (< 1 sec)
- AI matching must be accurate
- Type-safe implementation (TypeScript throughout)
- Mobile-responsive design

### Data Requirements
- Normalized schema for all school data
- Historical pricing/timeline data
- FSP operational signals (when available)
- Student reviews and ratings
- School verification status

### Performance Requirements
- Search results within 1 second
- Profile pages load within 2 seconds
- AI matching within 30 seconds
- Real-time updates for claimed schools

## Deliverables

### Required
1. **Full-Stack Marketplace**: Search, profiles, comparison, matching
2. **School Claim Portal**: Verification and subscription management
3. **Admin Dashboard**: Content moderation, school approval, analytics
4. **Documentation**: Setup, API, deployment guides
5. **Seed Data**: 50+ schools with normalized data

### Metrics Dashboard
Track and display:
- Total schools indexed
- Verified school percentage
- Student inquiries generated
- Match acceptance rate
- Conversion rate (inquiry → tour → enrollment)
- School subscription revenue

## Scope Boundaries

### In Scope (MVP)
- School directory and search
- Normalized data comparison
- AI matching engine
- School profiles with trust badges
- Financing calculator
- School claim flow
- Basic monetization (subscriptions)

### Out of Scope (Post-MVP)
- Full CRM integration
- Advanced analytics dashboard
- Mobile app
- Discovery flight booking (integration)
- Financial transactions/payments
- Multi-language support
- International schools (initially)

## Success Metrics

### Student Metrics
- **Match Rate**: 80%+ of students find a match
- **Profile CTR**: 30%+ click-through rate
- **Inquiry Rate**: 15%+ convert to inquiry
- **Financing Prequal**: 40%+ complete affordability calculator

### School Metrics
- **Claim Rate**: 30%+ of indexed schools claim profiles
- **Data Freshness**: 80%+ of schools update data quarterly
- **Lead-to-Visit**: 20%+ of inquiries convert to tours
- **Subscription Rate**: 10%+ of claimed schools subscribe

### Marketplace Metrics
- **Coverage**: 90%+ of North American schools indexed
- **Verified**: 20%+ FSP + Community verified
- **Premier**: 5%+ of schools on Premier tier
- **CAC/LTV**: 1:5 ratio (acquisition cost : lifetime value)

## Risk Assessment

### Technical Risks
- **AI Hallucination**: Mitigate with validation and business rules
- **Data Staleness**: Implement drift alerts and school notifications
- **Search Performance**: Use indexed database, caching, and pagination
- **Scraping Reliability**: Fallback to manual entry, school claims

### Business Risks
- **School Adoption**: Clear value prop, free tier, easy claim process
- **Data Privacy**: Handle student data securely, comply with regulations
- **Monetization**: Balance free value with paid features
- **Competition**: Differentiate with FSP data, AI matching, trust tiers
