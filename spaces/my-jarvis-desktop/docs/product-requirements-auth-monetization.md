# 🚀 My Jarvis Desktop - Authentication & Monetization PRD

## 📋 Parallel Development Strategy

This document outlines the authentication, monetization, and user management features for My Jarvis Desktop that can be developed in parallel with the core application improvements. While one team focuses on enhancing the file tree, preview functionality, and frontend experience, another can simultaneously build the backend infrastructure for user authentication, payment processing, and data persistence. This parallel approach allows us to maintain development velocity while transforming My Jarvis from a standalone desktop tool into a complete SaaS product.

The strategy involves creating a modular architecture where authentication and backend services can be integrated into the existing Electron app without disrupting ongoing frontend development. Each phase is designed to be independently deployable, allowing for incremental rollout and testing.

---

## 🎯 Core Requirements

### 🔐 **Authentication System**
Single-line requirement: Users must log in to access the application

### 💳 **Payment Integration** 
Single-line requirement: Subscribe to unlock premium features and usage

### 💾 **File History & Persistence**
Single-line requirement: Automatically save and version user's workspace files

### 🔑 **API Key Management**
Single-line requirement: Centralized OpenAI API key handling with usage tracking

### 📊 **User Database**
Single-line requirement: Track users, sessions, usage, and billing

### 🌐 **Cloud Synchronization**
Single-line requirement: Access files and settings from any device

---

## 📅 Implementation Phases

### **Phase 1: Foundation** 🏗️
*Backend infrastructure and database setup*

- [ ] **Database Schema Design**
  - [ ] Users table (email, password hash, created_at, subscription_status)
  - [ ] Sessions table (user_id, token, expires_at)
  - [ ] Usage table (user_id, tokens_used, timestamp)
  - [ ] Files table (user_id, file_path, content, version, timestamp)

- [ ] **Supabase Authentication Setup** 🔐
  - [ ] Create Supabase project and obtain API keys (anon key, service key)
  - [ ] Configure Supabase client in Electron main process
  - [ ] Set up auth listeners for session changes
  - [ ] Configure email templates for verification and password reset
  - [ ] Enable email/password authentication in Supabase dashboard
  - [ ] Set up redirect URLs for Electron deep linking
  - [ ] Implement secure storage for Supabase session tokens using Electron's safeStorage API
  - [ ] Configure Row Level Security (RLS) policies for user data access

- [ ] **Authentication Service Implementation**
  - [ ] Supabase auth methods integration (signUp, signIn, signOut)
  - [ ] Session persistence across app restarts
  - [ ] Auto-refresh token handling with Supabase's built-in refresh
  - [ ] Email verification through Supabase's magic link system
  - [ ] Password reset using Supabase's recovery flow
  - [ ] Social auth providers setup (GitHub, Google) through Supabase
  - [ ] Handle auth state changes in renderer process via IPC
  - [ ] Implement auth guards for protected routes

- [ ] **File Storage Architecture**
  - [ ] Evaluate options: Git repository vs. database vs. cloud storage
  - [ ] Implement versioning system
  - [ ] Set up periodic auto-save (every 5 minutes)
  - [ ] File diff and compression strategy

### **Phase 2: User Management** 👤
*Core authentication and user flows*

- [ ] **Login/Signup UI**
  - [ ] Design authentication screens
  - [ ] Implement login form with validation
  - [ ] Create signup flow with email confirmation
  - [ ] Add "Remember me" functionality

- [ ] **Session Management**
  - [ ] Secure token storage in Electron
  - [ ] Auto-refresh for expired tokens
  - [ ] Logout functionality
  - [ ] Multi-device session handling

- [ ] **User Profile**
  - [ ] Profile settings page
  - [ ] Change password functionality
  - [ ] Email update with verification
  - [ ] Account deletion process

### **Phase 3: API Key Infrastructure** 🔑
*Centralized OpenAI API management*

- [ ] **API Key Service**
  - [ ] Secure storage of master API key
  - [ ] Proxy requests through backend
  - [ ] Rate limiting per user
  - [ ] Usage tracking and logging

- [ ] **Usage Monitoring**
  - [ ] Token counting system
  - [ ] Cost calculation per request
  - [ ] Daily/monthly usage limits
  - [ ] Usage dashboard for users

- [ ] **Billing Integration**
  - [ ] Connect usage to billing system
  - [ ] Overage handling
  - [ ] Usage alerts and notifications
  - [ ] Monthly usage reports

### **Phase 4: Payment System** 💰
*Subscription and billing implementation*

- [ ] **Payment Provider Integration**
  - [ ] Stripe account setup
  - [ ] Payment SDK integration
  - [ ] Webhook handling for events
  - [ ] PCI compliance measures

- [ ] **Subscription Plans**
  - [ ] Define pricing tiers (Free, Pro, Enterprise)
  - [ ] Feature flags per tier
  - [ ] Usage limits per plan
  - [ ] Plan upgrade/downgrade logic

- [ ] **Billing Management**
  - [ ] Payment method management
  - [ ] Invoice generation
  - [ ] Failed payment recovery
  - [ ] Cancellation flow

### **Phase 5: File Persistence** 📂
*Workspace backup and versioning*

- [ ] **Auto-save System**
  - [ ] Background file watcher
  - [ ] Incremental saves (diff-based)
  - [ ] Conflict resolution
  - [ ] Offline queue for syncing

- [ ] **Version Control**
  - [ ] Git-based versioning backend
  - [ ] Commit on significant changes
  - [ ] Branch per workspace
  - [ ] Rollback functionality

- [ ] **File Recovery**
  - [ ] Version history UI
  - [ ] File comparison view
  - [ ] Restore previous versions
  - [ ] Deleted file recovery

### **Phase 6: Cloud Features** ☁️
*Multi-device and collaboration*

- [ ] **Cross-Device Sync**
  - [ ] Real-time file synchronization
  - [ ] Settings sync
  - [ ] Recent projects list
  - [ ] Device management dashboard

- [ ] **Workspace Sharing**
  - [ ] Generate shareable links
  - [ ] Read-only access mode
  - [ ] Collaboration permissions
  - [ ] Guest access tokens

- [ ] **Cloud Backup**
  - [ ] Automated daily backups
  - [ ] Export workspace as archive
  - [ ] Import from backup
  - [ ] Retention policies

### **Phase 7: Enterprise Features** 🏢
*Team and organization support*

- [ ] **Team Management**
  - [ ] Organization accounts
  - [ ] Team member invitations
  - [ ] Role-based access control
  - [ ] Centralized billing

- [ ] **Admin Dashboard**
  - [ ] User management interface
  - [ ] Usage analytics
  - [ ] Audit logs
  - [ ] Compliance reports

- [ ] **SSO Integration**
  - [ ] SAML 2.0 support
  - [ ] OAuth providers (Google, GitHub)
  - [ ] Active Directory integration
  - [ ] Custom SSO endpoints

---

## 🔧 Technical Decisions

### **Backend Stack**
- Supabase for authentication, database, and real-time features
- Node.js + Express/Fastify for custom API endpoints
- Supabase PostgreSQL for relational data
- Supabase Storage for file persistence
- Redis for additional caching (if needed)

### **Authentication (Supabase)**
- Supabase Auth with JWT tokens
- Built-in session management and refresh
- Magic links for passwordless login
- Social OAuth providers (GitHub, Google)
- Row Level Security (RLS) for data access
- Electron safeStorage API for token persistence
- 2FA support through Supabase (future)

### **File Storage Strategy**
- Git repository per user workspace
- S3 for large file storage
- Database for metadata only
- CDN for static assets

### **Payment Processing**
- Stripe for subscriptions
- Usage-based billing model
- Prepaid credits option
- Enterprise invoicing

---

## 🔌 Supabase Authentication Implementation Guide

### **Quick Start Steps**

1. **Project Setup**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Environment Variables**
   ```
   SUPABASE_URL=https://[project-id].supabase.co
   SUPABASE_ANON_KEY=[anon-key]
   SUPABASE_SERVICE_KEY=[service-key]  # Only for backend
   ```

3. **Main Process (main.js)**
   - Initialize Supabase client with anon key
   - Handle auth state persistence using Electron's safeStorage
   - Set up IPC handlers for auth operations
   - Manage deep linking for email verification callbacks

4. **Renderer Process**
   - Create auth UI components (login, signup, forgot password)
   - Communicate with main process via IPC for auth operations
   - Handle auth state updates and route protection
   - Display user profile and session info

5. **Database Setup**
   - Use Supabase's auto-generated auth.users table
   - Create profiles table linked to auth.users
   - Set up RLS policies for user-specific data access
   - Create triggers for profile creation on signup

6. **Security Considerations**
   - Never expose service key to renderer process
   - Use contextBridge for secure IPC communication
   - Implement proper CORS settings
   - Store sensitive tokens encrypted using safeStorage

---

## 🎯 Success Metrics

- **Authentication**: < 2 second login time
- **File Sync**: < 5 second save latency
- **API Response**: < 200ms average
- **Uptime**: 99.9% availability
- **Storage**: < $0.10 per GB/month

---

## 🚦 Parallel Development Tracks

**Track A: Frontend Team**
- File tree improvements
- Preview enhancements
- UI/UX refinements
- Editor features

**Track B: Backend Team** 
- Authentication system
- Database setup
- API key proxy
- File persistence

**Track C: DevOps**
- CI/CD pipeline
- Monitoring setup
- Security hardening
- Performance optimization

---

*Last updated: January 9, 2025*