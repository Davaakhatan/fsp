# Active Context

## Current Status
🔨 **Development Phase - Local Testing**

Core services are implemented and ready for local testing. Next step is to create API endpoints and complete the dashboard, then test locally before deploying to Vercel.

## What We Just Did

### 1. Memory Bank Initialization ✅
Created all core memory bank files:
- **projectbrief.md**: Complete PRD translation with objectives, scope, and success criteria
- **productContext.md**: User journeys, feature descriptions, and design principles
- **systemPatterns.md**: Architecture patterns, service designs, and data models
- **techContext.md**: Full technology stack, setup instructions, and API designs (updated for Vercel/Supabase)
- **activeContext.md**: This file - tracking current state
- **progress.md**: Detailed task tracking and metrics

### 2. Project Requirements Analysis ✅
Analyzed the PRD and identified:
- **Core Features**: Weather monitoring, AI rescheduling, notifications, dashboard
- **Technical Stack**: React, TypeScript, PostgreSQL, Vercel AI SDK, Vercel + Supabase (FREE)
- **Architecture**: Event-driven serverless pattern
- **Timeline**: 3-5 days estimated

### 3. Cursor Rules Created ✅
- **base.mdc**: Core project rules, safety logic, and patterns
- **typescript.mdc**: TypeScript best practices and type safety rules
- **database.mdc**: Prisma, repository pattern, and database rules

### 4. Stack Updated to FREE Tier ✅
Switched from Azure to completely free stack:
- **Vercel**: Frontend + Serverless API (FREE)
- **Supabase**: PostgreSQL database (FREE: 500MB)
- **Upstash**: Redis + QStash cron (FREE: 10K cmds/day)
- **Resend**: Email notifications (FREE: 3K emails/month)
- **Total Cost**: ~$5-10/month (just OpenAI API usage)

### 5. Documentation Created ✅
- **docs/free-deployment-guide.md**: Complete guide for setting up free accounts and deploying

## Current Focus

### Immediate Next Steps

#### 1. Project Structure Setup
Need to create:
- Monorepo structure (pnpm workspace)
- All application directories (web, api, scheduler)
- Shared packages (database, shared types)
- Configuration files (tsconfig, eslint, prettier)
- Docker setup for local development
- Environment templates

#### 2. Database Foundation
- Create Prisma schema
- Set up initial migrations
- Create seed data for development
- Implement repository patterns

#### 3. Core Services Implementation
Priority order:
1. **Weather Service**: Foundation for everything else
2. **Booking Service**: Core domain logic
3. **AI Service**: Rescheduling intelligence
4. **Notification Service**: User communication

#### 4. Frontend Dashboard
- React app with TypeScript
- Dashboard layout
- Weather alerts display
- Flight status views
- Reschedule approval interface

## Key Decisions Made

### Architecture Decisions
1. **Event-Driven Design**: Chosen for decoupling and scalability
2. **PostgreSQL over MongoDB**: Need ACID compliance for bookings
3. **Vercel AI SDK**: Structured output support is critical
4. **Monorepo Structure**: Share types and utilities across apps
5. **Prisma as ORM**: Type safety and excellent DX

### Technical Decisions
1. **TypeScript Throughout**: Type safety is non-negotiable
2. **pnpm for Package Management**: Faster, more efficient
3. **Vercel + Supabase**: FREE hosting stack (no Azure - no free account available)
4. **Upstash Redis + QStash**: FREE job queue and cron scheduling
5. **OpenWeatherMap API**: Good free tier for development
6. **React Query for State**: Server state management best practice
7. **Resend for Email**: Better DX than Sendgrid, generous free tier

### Data Model Decisions
1. **UUID Primary Keys**: Better for distributed systems
2. **Event Sourcing**: Complete audit trail
3. **Immutable Bookings**: Link reschedules, never delete
4. **Training Level Enum**: Type-safe training levels
5. **JSONB for Weather**: Flexible schema for API responses

## Active Constraints

### Timeline
- **Target**: 3-5 days
- **Strategy**: Focus on core features first, bonus features only if time permits
- **Risk**: AI integration and testing may take longer than expected

### Technical Constraints
- Must handle concurrent booking modifications safely
- Weather API rate limits (1,000 calls/day on free tier)
- AI response time must be < 30 seconds
- Database must support time-based queries efficiently

### Scope Constraints
**Must Have**:
- ✅ Automated weather monitoring
- ✅ Training-level appropriate safety logic
- ✅ AI-powered reschedule suggestions (3+ options)
- ✅ Email notifications
- ✅ Dashboard with live alerts
- ✅ Full booking lifecycle tracking

**Nice to Have** (Bonus):
- SMS notifications
- Google Calendar integration
- Historical analytics
- Predictive ML model
- Mobile app

**Out of Scope**:
- Multi-school management
- Payment processing
- Aircraft maintenance
- Full calendar system

## Next Actions (Detailed)

### Phase 1: Foundation (Day 1)
1. **Initialize Repository**
   - Create GitHub repository
   - Set up pnpm workspace
   - Configure TypeScript for monorepo
   - Add ESLint and Prettier
   - Create .gitignore

2. **Project Structure**
   - Create apps/ directory with web, api, scheduler
   - Create packages/ directory with database, shared
   - Set up basic package.json files
   - Configure tsconfig.json hierarchy

3. **Database Setup**
   - Write complete Prisma schema
   - Create Docker Compose for PostgreSQL
   - Set up first migration
   - Create seed data script
   - Test database connection

4. **Development Environment**
   - Create .env.template
   - Set up docker-compose.yml
   - Configure development scripts
   - Test local environment startup

### Phase 2: Core Services (Day 2-3)
1. **Weather Service**
   - Implement OpenWeatherMap integration
   - Create weather checking logic
   - Implement training level safety rules
   - Add caching layer
   - Write unit tests

2. **Booking Service**
   - Implement CRUD operations
   - Add status state machine
   - Create booking lifecycle logic
   - Write repository layer
   - Write unit tests

3. **Event System**
   - Set up event bus (RabbitMQ local)
   - Define event schemas
   - Implement event publishers
   - Implement event handlers
   - Test event flow

4. **AI Service**
   - Integrate Vercel AI SDK
   - Create rescheduling prompt
   - Implement validation logic
   - Add fallback algorithm
   - Write tests with mocked AI

### Phase 3: User Interface (Day 3-4)
1. **React Dashboard**
   - Set up Vite + React + TypeScript
   - Create basic layout
   - Implement weather alerts component
   - Implement flight list component
   - Add real-time updates (WebSocket)

2. **API Layer**
   - Create Express server
   - Implement REST endpoints
   - Add WebSocket support
   - Implement error handling
   - Add request validation

3. **Notification Service**
   - Integrate Sendgrid for email
   - Create notification templates
   - Implement retry logic
   - Add notification status tracking
   - Write tests

### Phase 4: Integration & Testing (Day 4-5)
1. **Background Scheduler**
   - Implement hourly weather check job
   - Add job monitoring
   - Test scheduler reliability
   - Add error handling

2. **End-to-End Testing**
   - Write E2E tests with Playwright
   - Test complete conflict flow
   - Test reschedule flow
   - Test notification delivery
   - Test dashboard updates

3. **Demo Preparation**
   - Create demo data
   - Record demo video
   - Write README documentation
   - Prepare deployment

### Phase 5: Deployment (Day 5)
1. **Azure Setup** (or alternative)
   - Configure Azure resources
   - Set up CI/CD pipeline
   - Deploy applications
   - Configure secrets

2. **Monitoring**
   - Set up logging
   - Configure alerts
   - Test production environment

## Questions & Unknowns

### Technical Uncertainties
1. **Weather API Ceiling Data**: OpenWeatherMap doesn't provide ceiling directly, need to estimate from cloud cover
2. **AI Consistency**: How to ensure AI always generates valid options?
3. **Race Conditions**: How to handle simultaneous booking and cancellation?
4. **WebSocket Scaling**: How to handle multiple dashboard users?

### Design Decisions Pending
1. **Manual Override UX**: What interface for schedulers to override AI?
2. **Conflict Severity**: How to visualize critical vs marginal conflicts?
3. **Historical Data**: How far back to retain weather checks?
4. **Notification Preferences**: Let users choose notification channels?

## Dependencies & Blockers

### External Dependencies
- **OpenWeatherMap API Key**: Need to sign up (free)
- **Sendgrid API Key**: Need to sign up (free tier)
- **OpenAI API Key**: Need to sign up (requires payment)
- **Azure Account**: For production deployment (or alternatives)

### Blockers
None currently - all prerequisites can be obtained for free/cheap

### Risks
1. **AI Costs**: OpenAI API usage could exceed budget during testing
   - **Mitigation**: Use mock responses for most tests
2. **Weather API Limits**: Free tier may be insufficient
   - **Mitigation**: Implement aggressive caching
3. **Time Constraints**: 3-5 days is ambitious
   - **Mitigation**: Focus on core features, skip bonuses if needed

## Working Notes

### Key Insights from PRD
- Training level logic is CRITICAL - different weather minimums for different pilot levels
- System must generate minimum 3 reschedule options
- Background scheduler must run hourly
- Dashboard must show live alerts (real-time updates)
- Full audit trail required (event sourcing)

### Architecture Insights
- Event-driven design enables scalability and maintainability
- Service-oriented design allows independent development and testing
- Repository pattern abstracts database operations
- State machine prevents invalid booking transitions
- JSONB allows flexible weather data without schema migrations

### Development Strategy
- Start with data layer (database + repositories)
- Build services independently with clear interfaces
- Use mocks for external dependencies during development
- Implement real integrations after core logic works
- E2E tests are critical for event-driven systems

## Resources & References

### Documentation Links
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [OpenWeatherMap API](https://openweathermap.org/api/one-call-3)
- [Prisma Docs](https://www.prisma.io/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Azure Functions Docs](https://learn.microsoft.com/en-us/azure/azure-functions/)

### Example Projects
- Reference event-driven architectures
- Example AI SDK implementations
- Weather data processing examples

## Success Metrics (Revisited)

### Must Pass Before Demo
- [ ] Weather conflict automatically detected for test booking
- [ ] AI generates 3 valid reschedule options
- [ ] Email notification sent successfully
- [ ] Dashboard displays alert in real-time
- [ ] Student can select reschedule option
- [ ] New booking created and confirmed
- [ ] All events logged to database
- [ ] Background scheduler runs successfully

### Quality Metrics
- [ ] All unit tests passing (>80% coverage)
- [ ] E2E tests passing (critical paths)
- [ ] No linter errors
- [ ] TypeScript strict mode enabled
- [ ] All API endpoints documented
- [ ] README with setup instructions

## Next Session Priorities

1. **Create complete project structure** (files and folders)
2. **Set up development environment** (Docker, configs)
3. **Implement database schema** (Prisma)
4. **Create first service** (Weather Service)
5. **Update progress in this file**

---

**Last Updated**: Project initialization (Day 0)
**Next Update**: After project structure creation

