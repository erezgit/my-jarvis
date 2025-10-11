# My Jarvis Desktop Architecture

## Repository
- **GitHub URL**: https://github.com/erezgit/my-jarvis-desktop
- **Project Type**: AI-Powered Desktop Application with Claude Code WebUI Integration
- **Framework**: Electron + React 19 + TypeScript + Claude Code SDK
- **Current Version**: 1.10.0
- **Status**: ✅ Production-Ready AI Chat Application with Workspace Management

## Overview
My Jarvis Desktop is a production-ready AI-powered Electron desktop application featuring a sophisticated **three-panel IDE-like interface** with integrated Claude AI capabilities. The application combines a file tree browser, file preview system, and Claude chat interface in a responsive, resizable layout. Built on the claude-code-webui foundation with extensive customizations, it provides comprehensive AI assistance with voice message support, environment isolation, and cross-platform deployment capabilities.

## Current Stage: Production AI Chat Application

### ✅ Architecture Foundation (Ticket #020)
**Complete rewrite based on claude-code-webui integration**
1. **claude-code-webui Integration**
   - Built on proven claude-code-webui frontend architecture
   - Modern React 19 + TypeScript + TailwindCSS stack
   - Comprehensive message type system (chat, tool, plan, todo, thinking)
   - UnifiedMessageProcessor for consistent message handling
   - Professional UI with shadcn/ui components

2. **Electron Desktop Wrapper**
   - Clean Electron app wrapping the claude-code-webui
   - electron-vite build system for optimized bundling
   - Production-ready packaging with electron-builder
   - Cross-platform compatibility (macOS, Windows, Linux)
   - Native menu integration and window management

3. **In-Process Server Architecture**
   - claude-webui-server backend on port 8081 (embedded in main process)
   - Direct runtime.serve() integration with NodeRuntime (jlongster pattern)
   - Hono framework for high-performance HTTP server
   - Environment-based Claude CLI authentication with PATH enhancement
   - Automatic server lifecycle management within Electron main process

4. **Claude Code SDK Integration** (Ticket #017)
   - @anthropic-ai/claude-code ^1.0.108 integration
   - Real-time streaming chat with NDJSON responses
   - Comprehensive tool use support and error handling
   - Session management and conversation history
   - Abort controllers for request cancellation

5. **Voice Message System** (Ticket #018-019, #022, #039, Environment Isolation)
   - **Environment Isolation**: Complete separation of Jarvis environments resolved contamination
   - **Backend-Frontend Architecture**: Backend generates voice files silently, frontend-only playback
   - **TTS Integration**: External my-jarvis environment with isolated jarvis_voice.sh script
   - **Electron File Access**: webSecurity: false configuration enables direct file:// protocol URLs
   - **Audio Playback**: Native HTML5 Audio API with manual play/pause controls and transcript display
   - **No Auto-Play**: User-controlled playback only (Ticket #039)
   - **UnifiedMessageProcessor Integration**: Automatic VoiceMessage creation from Bash tool results

6. **Three-Panel IDE Layout Architecture** (Tickets #055-056, Completed 2025-10-12)
   - **Unified Chat Architecture**: Single ChatPage instance shared between desktop and mobile layouts (eliminates duplication)
   - **Responsive Layout System**: Desktop (3-panel) and Mobile (single-panel) layouts with automatic switching
   - **File Tree Panel**: VirtualizedFileTree with directory browsing (20% default width)
   - **File Preview Panel**: Rich Markdown/MDX preview with syntax highlighting (50% default width)
   - **Chat Panel**: ChatPage with Claude AI integration (30% default width)
   - **Resizable Panels**: react-resizable-panels for user-customizable desktop layout
   - **Mobile Layout Architecture**:
     - **Dynamic Viewport Height**: Uses `h-dvh` (not `h-screen`) for proper mobile browser bar handling
     - **Flex-Based Scrolling**: Flex container hierarchy enables internal message scrolling
     - **iOS Safari Compatibility**: Viewport meta `maximum-scale=1` + 16px input font-size prevents auto-zoom
     - **No Parent Height Constraints**: Removed `html, body, #root { height: 100%; }` to avoid viewport unit conflicts
     - **Panel Container**: `flex-1 relative overflow-hidden` (no `min-h-0` which broke all panels)
     - **Sticky Navigation**: Top bar with `sticky top-0 z-10` stays fixed during scrolling
     - **Panel Wrappers**: Each panel (`h-full flex flex-col`) with proper flex context for children
   - **ChatHeader Component**: Reusable header with view/panel switchers for both desktop and mobile
   - **Mode System**: Jarvis mode (clean, minimal) vs Developer mode (technical details)

7. **Token Usage Tracking** (Ticket #029)
   - **Real-Time Visualization**: TokenContextBar with gradient color system
   - **Context Awareness**: 200K context window tracking with percentage display
   - **Architecture Pattern**: Context → Hook → Component (TokenUsageContext → useTokenUsage → TokenContextBar)
   - **Integration**: UnifiedMessageProcessor extracts tokens from SDK result messages
   - **Cumulative Tracking**: Session-based token accumulation across conversation

8. **Rich Markdown/MDX File Preview** (Ticket #037, #041)
   - **Markdown Rendering**: react-markdown with GitHub Flavored Markdown (remark-gfm)
   - **MDX Support**: next-mdx-remote for interactive React components
   - **Syntax Highlighting**: rehype-highlight for code blocks
   - **Custom Interactive Components**:
     - **AgentStatus**: Agent status display with visual indicators
     - **MetricCard**: Metric visualization cards
     - **TaskProgress**: Task tracking with progress bars
     - **ArchitectureDiagram**: Architecture visualizations
     - **TicketStack**: Visual ticket planning with collapsible cards, progress tracking, and status indicators (Ticket #041)
   - **Theme Integration**: Dark/light mode support for all preview content

9. **UI/UX Design System** (Ticket #040, v1.9.0-1.10.0 Polish)
   - **Neutral Color Palette**: Consistent neutral-50/100/200/600/700 throughout
   - **User Messages**: Green-100 background (HSL 140.6, 84.2%, 92.5%) with no label, timestamp below, sans-serif font
   - **Typography**: Removed font-mono from chat messages, using system sans-serif for better readability
   - **Transparent Messages**: Thinking, file operations, loading use transparent backgrounds
   - **Static Input Field**: No focus ring, no shadow, neutral borders, outline-none
   - **Simplified UI**: Removed "thinking -" prefix, "Initializing Jarvis" messages
   - **Send Button**: Neutral-600/700 (minimal visual emphasis)
   - **Page Background**: neutral-50 for lighter, cleaner appearance

10. **Workspace Management System** (Tickets #042-043, #053-054)
   - **SettingsContext Integration**: workingDirectory as persistent user preference
   - **Multi-Workspace Support**: Switch between My Jarvis and My Jarvis Onboarding environments
   - **Reactive File Tree**: Automatic reload when workspace changes
   - **Persistent Selection**: Workspace choice saved to localStorage
   - **Clean Architecture**: Single source of truth in SettingsContext, no prop drilling
   - **Initialization Voice Fix** (Ticket #054): Removed duplicate voice announcements on startup
   - **Directory Alignment** (Ticket #053): Consistent workspace path handling across desktop/cloud

11. **Deployment Architecture**
   - **Desktop**: Electron app with embedded claude-webui-server
   - **Cloud Option**: claude-code-webui can be deployed as web application
   - **My Jarvis Cloud**: Existing Docker-based cloud deployment
   - **Unified Codebase**: Same frontend works across all platforms

## Tech Stack

### Frontend (Claude Code WebUI Foundation)
- **React 19**: Latest React with concurrent features and improved performance
- **TypeScript**: Complete type safety with strict configuration
- **@anthropic-ai/claude-code ^1.0.108**: Official Claude Code SDK integration
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **react-resizable-panels**: Resizable panel layout system for three-panel IDE interface
- **@heroicons/react**: Modern SVG icon library for UI components
- **Custom UI Components**: Purpose-built components for desktop application interface
- **Streaming Architecture**: Real-time message processing with NDJSON
- **Message Type System**: Comprehensive message types with type-safe processing:
  - ChatMessage: User/assistant conversations (v1.10.0: green-100 background, no user label, sans-serif font)
  - ToolMessage: Tool execution display
  - ToolResultMessage: Tool result with structured data
  - PlanMessage: Plan approval workflows
  - ThinkingMessage: Claude's reasoning process (v1.10.0: no "thinking -" prefix)
  - TodoMessage: Task management integration
  - VoiceMessage: Audio playback with transcripts (v1.10.0: no auto-play, manual controls)
- **UnifiedMessageProcessor**: Central message transformation pipeline
  - Tool caching system for result correlation
  - Message type detection and transformation logic
  - Token extraction from SDK result messages (Ticket #029)
  - Extensible pattern for custom message types
  - Streaming and batch processing consistency
- **Token Usage System**: Real-time context tracking (Ticket #029)
  - TokenUsageContext with cumulative state management
  - TokenContextBar with gradient color visualization (blue → violet → amber → red)
  - 200K context window tracking with percentage display
- **File Preview System**: Rich document rendering (Tickets #037, #041)
  - MarkdownRenderer for static .md files
  - MDXRenderer for interactive .mdx components
  - Syntax highlighting with rehype-highlight
  - Custom MDX components (AgentStatus, MetricCard, TaskProgress, ArchitectureDiagram, TicketStack)

### Backend (Electron + In-Process Server)
- **Electron 37.3.1**: Cross-platform desktop framework with security best practices
- **TypeScript**: Type-safe backend code with strict configuration
- **In-Process Server**: claude-webui-server runs in Electron main process via runtime.serve()
- **claude-webui-server**: Embedded backend server (jlongster pattern)
  - **NodeRuntime**: Cross-platform HTTP server runtime
  - **Hono Framework**: Modern web framework with middleware support
  - **Port 8081**: Server port with CORS support, runs on 127.0.0.1
- **IPC Communication**: Secure preload script for frontend-backend communication
- **Authentication**: Environment-based Claude CLI authentication with PATH enhancement
- **Logging**: Console-based logging with debug mode support

### Build Tools
- **electron-vite**: Fast build system optimized for Electron
- **electron-builder**: Application packaging and distribution
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

## Architecture Decisions

### Key Architectural Insights (Learned from Implementation)

#### **Message Processing as Transformation Pipeline**
The UnifiedMessageProcessor represents a sophisticated message transformation pipeline that serves as the bridge between Claude's SDK output and the UI layer:

1. **Single Source of Truth**: All messages flow through one processor, ensuring consistency
2. **Tool Correlation**: Tool caching enables intelligent result processing based on original tool context
3. **Type Safety**: Strong TypeScript typing throughout the transformation process
4. **Extensibility**: New message types can be added by extending the transformation logic

#### **Tool Result Transformation Pattern**
The voice message implementation revealed a powerful pattern for extending functionality:

```typescript
// Pattern: Detect tool type → Parse results → Create custom message
if (toolName === "Bash" && command?.includes('jarvis_voice.sh')) {
  // Parse tool output using regex patterns
  const audioPath = parseAudioPath(content);
  const transcript = parseTranscript(cachedCommand);

  // Transform into custom message type
  return createVoiceMessage(transcript, audioPath);
}
```

This pattern enables:
- **No Custom Tools Required**: Leverage existing Claude tools (Bash) for new functionality
- **Seamless Integration**: Tool results automatically become rich UI components
- **Maintainable Extensions**: Clear separation between detection, parsing, and creation logic

#### **Streaming vs Batch Processing Unification**
The processor handles both real-time streaming and historical data with identical logic:
- **Streaming Mode**: Messages processed as they arrive from Claude SDK
- **Batch Mode**: Historical messages processed for conversation loading
- **Consistent Output**: Same transformation logic ensures identical UI rendering

### claude-code-webui Foundation
Our application is built on the proven claude-code-webui architecture, providing:
- **Proven Codebase**: Battle-tested chat interface with comprehensive message handling
- **Cross-Platform Deployment**: Same frontend works in Electron, web, and cloud environments
- **Extensible Message System**: Support for multiple message types with consistent processing
- **Professional UI**: Modern React components with shadcn/ui and TailwindCSS

### Workspace Management Architecture (Tickets #042-043)

The application implements a clean workspace management system through SettingsContext, enabling users to switch between different working directories while maintaining UI state consistency.

**Architecture Pattern**:
1. **SettingsContext as Single Source of Truth**
   - `workingDirectory` added to SettingsContext alongside theme and enterBehavior
   - Persisted to localStorage automatically with other settings
   - Accessible via `useSettings()` hook throughout the application
   - No prop drilling or local state duplication

2. **Reactive File Tree Updates**
   - VirtualizedFileTree receives `workingDirectory` as prop from DesktopLayout
   - `useEffect` dependency on `workingDirectory` triggers automatic reload
   - Parent directory structure refreshes when workspace changes
   - Clean separation: DesktopLayout reads from context, FileTree reacts to props

3. **Workspace Registry**
   - Defined workspace list in GeneralSettings component
   - Each workspace: `{ id, displayName, path }`
   - Currently supports: My Jarvis and My Jarvis Onboarding
   - Easily extensible for additional workspaces

4. **Switching Flow**
   ```
   User clicks workspace → GeneralSettings calls setWorkingDirectory()
   → SettingsContext updates and persists → ChatPage reads new workingDirectory
   → DesktopLayout passes to VirtualizedFileTree → File tree reloads
   ```

**Key Benefits**:
- Clean architectural separation (settings vs conversation state)
- Automatic persistence across app restarts
- Reactive updates without manual refresh logic
- Consistent pattern for adding workspace-related features

### Mobile Layout Architecture (Tickets #055-056, October 2025)

The unified mobile layout architecture eliminates code duplication and provides a production-ready mobile experience through careful viewport management and iOS Safari compatibility.

**Unified Chat Pattern**:
1. **Single ChatPage Instance**
   - One ChatPage component shared between DesktopLayout and MobileLayout
   - Created once in ResponsiveLayout with useMemo
   - Passed as `chatInterface` prop to both layouts
   - No conditional rendering or mobile-specific logic in ChatPage
   - Eliminates duplicate code and ensures consistency

2. **Responsive Layout Switching**
   ```tsx
   ResponsiveLayout (React fragment wrapper)
   ├── DesktopLayout (lg+)
   │   └── ChatPage in flex-1 panel
   └── MobileLayout (<lg)
       └── ChatPage in h-full panel wrapper
   ```

**Mobile Viewport Architecture**:
1. **Dynamic Viewport Height (`h-dvh`)**
   - Uses `h-dvh` (dynamic viewport height) NOT `h-screen` (100vh)
   - Automatically recalculates when mobile browser UI shows/hides
   - Prevents ~150px overflow caused by static 100vh calculations
   - Critical for proper mobile browser bar handling

2. **Parent Constraint Removal**
   - Removed `html, body, #root { height: 100%; }` from global.css
   - Parent height constraints conflict with h-dvh/h-screen calculations
   - Clean viewport calculation from actual browser dimensions
   - Matches my-jarvis-frontend reference architecture

3. **Container Hierarchy**
   ```tsx
   MobileLayout (h-dvh flex flex-col)
   ├── Nav Bar (sticky top-0 z-10)
   └── Panel Container (flex-1 relative overflow-hidden)
       └── Transition Wrapper (h-full)
           └── Panel Wrapper (h-full flex flex-col)
               └── ChatPage (h-full)
                   ├── TokenBar (fixed height)
                   ├── ChatMessages (flex-1 overflow-y-scroll)
                   └── ChatInput (fixed height)
   ```

4. **Flex-Based Scrolling**
   - `flex-1` on panel container fills remaining space after nav
   - `overflow-hidden` prevents page-level scrolling
   - `h-full flex flex-col` on panel wrapper establishes flex context
   - `flex-1 overflow-y-scroll` on ChatMessages enables internal scrolling

**iOS Safari Compatibility**:
1. **Auto-Zoom Prevention**
   - Viewport meta: `maximum-scale=1.0, user-scalable=no`
   - Input font-size: `text-base` (16px) not `text-sm` (14px)
   - iOS Safari auto-zooms when input < 16px, breaking layout

2. **Keyboard Handling**
   - h-dvh automatically adjusts for keyboard appearance
   - No manual vh calculations or resize listeners needed
   - ChatInput stays fixed at bottom when keyboard shows

**Anti-Patterns Avoided**:
- ❌ Double height wrappers (ResponsiveLayout + MobileLayout both with h-screen)
- ❌ min-h-0 on panel container (breaks all panels, not just chat)
- ❌ Removing h-full from ChatPage before fixing parent constraints
- ❌ Using h-screen (static) instead of h-dvh (dynamic)
- ❌ Parent height constraints (html/body/root with height:100%)

**Testing Results**:
- ✅ No auto-zoom on input focus (iOS Safari)
- ✅ Messages scroll internally, page doesn't scroll
- ✅ Entry field always visible, even with many messages
- ✅ Proper viewport height with/without browser bars
- ✅ Works across all three panels (files, preview, chat)

### Environment Isolation Architecture (Critical Solution)

The application implements complete environment isolation to resolve Claude Code SDK contamination:

**Problem Solved**: Claude Code SDK uses hierarchical CLAUDE.md discovery, causing environment contamination when multiple Jarvis environments exist in nested directories.

**Solution Architecture**:
1. **Complete Path Separation**
   - Main Jarvis: `/Users/erezfern/Workspace/jarvis/` (development environment)
   - My Jarvis: `/Users/erezfern/Workspace/my-jarvis/` (isolated production environment)
   - No nested directories or shared paths between environments

2. **Independent Voice Systems**
   - Each environment has its own jarvis_voice.sh script with different configurations
   - Main Jarvis: Full voice capabilities for development
   - My Jarvis: Backend-silent mode (AUTO_PLAY="false" permanently set)

3. **Workspace Management Integration**
   - Desktop app uses SettingsContext for workspace selection (Tickets #042-043)
   - All file operations constrained to selected workspace
   - Prevents cross-contamination during development vs production use

4. **Claude Code SDK Isolation**
   - Each environment discovers its own CLAUDE.md configuration
   - No inheritance or hierarchical discovery conflicts
   - Complete independence between development and production contexts

### In-Process Server Architecture (jlongster Pattern)
The Electron integration uses an in-process server pattern (inspired by jlongster/actual-server) with environment isolation:

1. **Main Process** (Electron)
   - Embeds claude-webui-server directly using runtime.serve() - no child process fork
   - NodeRuntime provides cross-platform HTTP server runtime
   - Server lifecycle managed within Electron main process (startup in app.whenReady, cleanup in before-quit)
   - PATH enhancement for CLI tool discovery in GUI environments (macOS apps don't inherit terminal PATH)
   - Provides secure IPC communication via preload script

2. **Backend Server** (claude-webui-server)
   - In-process server running on port 8081 within main Electron process (127.0.0.1)
   - Hono framework for high-performance HTTP server
   - Claude Code SDK integration with streaming support
   - CORS-enabled API endpoints for frontend communication
   - Environment-based authentication inheritance
   - Isolated my-jarvis environment for voice script execution

3. **Frontend** (React Application)
   - claude-code-webui React components and logic
   - UnifiedMessageProcessor for consistent message handling
   - Real-time streaming with NDJSON protocol
   - Comprehensive message type system
   - Local file access enabled (webSecurity: false) for voice message playback

**Key Benefits of In-Process Pattern**:
- No IPC overhead between processes
- Simpler lifecycle management (single process to start/stop)
- Direct memory access between server and Electron
- Easier debugging (single process to attach to)
- No port conflicts or process spawning issues

### Multi-Platform Deployment Strategy
The architecture supports multiple deployment options:

1. **Desktop (Electron)**: Full-featured desktop application with embedded server
2. **Web Application**: Direct deployment of claude-code-webui as standalone web app
3. **Cloud Deployment**: Docker-based deployment (My Jarvis Cloud example)
4. **Hybrid**: Mix of desktop and cloud based on user preferences

### Authentication & Configuration

1. **Environment-Based Authentication**
   - Claude CLI authentication inherited from parent process
   - No additional configuration required for authenticated environments
   - Seamless authentication in packaged Electron builds
   - Fallback error handling for unauthenticated environments

2. **Configuration Management** (SettingsContext Architecture)
   - Settings stored via localStorage in frontend
   - Centralized SettingsContext for all user preferences:
     - Theme (light/dark)
     - Enter behavior (send/newline)
     - Working directory (workspace selection)
     - Message display mode (Jarvis/Developer)
   - Automatic persistence on settings changes
   - Type-safe settings with AppSettings interface

3. **Error Handling**
   - Graceful degradation when Claude CLI unavailable
   - User-friendly error messages for authentication issues
   - Connection status monitoring and recovery
   - Request timeout and abort controller support

### Message Processing Architecture (UnifiedMessageProcessor)
The heart of the messaging system is the UnifiedMessageProcessor, which transforms raw Claude SDK messages into UI-ready message objects:

1. **Message Transformation Pipeline**
   - Processes streaming NDJSON messages from Claude Code SDK
   - Handles both real-time streaming and batch history processing
   - Converts Claude SDK message types into typed UI message objects
   - Maintains consistent output regardless of data source (streaming vs history)

2. **Tool Caching System**
   - Caches tool_use information (tool name, parameters, unique ID) when tools are invoked
   - Enables correlation between tool execution and tool results
   - Critical for determining message transformations based on tool type
   - Used for permission error handling and result processing

3. **Message Type Detection & Transformation**
   - Examines tool results and applies transformation logic
   - Creates appropriate message objects (ChatMessage, ToolMessage, VoiceMessage, etc.)
   - Handles special cases like voice script detection in Bash tool results
   - Extensible pattern for adding new message types

4. **Voice Message Implementation (Tickets #018-019, #022, #039)**
   - **Detection Logic**: Identifies jarvis_voice.sh commands in Bash tool results
   - **Result Parsing**: Extracts audio file paths and transcript text using regex patterns
   - **Message Creation**: Transforms Bash results into VoiceMessage objects with file:// URLs
   - **User-Controlled Playback**: Manual play/pause controls (v1.9.0: no auto-play)

5. **Token Usage Tracking (Ticket #029)**
   - **Result Message Processing**: Extracts usage.input_tokens + usage.output_tokens from SDK result messages
   - **Cumulative Tracking**: Updates global TokenUsageContext with session total
   - **Context Integration**: Calls context.onTokenUpdate() callback with new token data
   - **Non-Intrusive**: Does not replace or hide result messages, adds side-effect callback only

### Voice Message System (Complete Implementation with Environment Isolation)
The voice integration demonstrates the power of the UnifiedMessageProcessor architecture with complete environment separation:

1. **Environment Isolation Architecture**
   - **Isolated my-jarvis Environment**: `/Users/erezfern/Workspace/my-jarvis/` separate from main Jarvis
   - **Claude Code SDK Hierarchical Discovery**: Resolved contamination between environments
   - **Independent Voice Scripts**: Each environment has its own jarvis_voice.sh configuration
   - **Complete Path Separation**: No shared dependencies or cross-contamination

2. **Voice Generation (Backend Silent Mode)**
   - TTS via isolated jarvis_voice.sh script execution through Bash tool
   - Backend script permanently set to AUTO_PLAY="false" (no backend audio)
   - Audio files generated in `/Users/erezfern/Workspace/my-jarvis/tools/voice/` directory
   - Unique filename generation with timestamp and content correlation

3. **Message Processing Flow (UnifiedMessageProcessor)**
   - Claude executes Bash tool with external jarvis_voice.sh command
   - UnifiedMessageProcessor detects voice script in cached tool information
   - Parses Bash output for audio file path using regex patterns
   - Extracts transcript from cached command parameters
   - Creates VoiceMessage with autoPlay: true instead of ToolResultMessage
   - Enables seamless voice integration without custom Claude tools

4. **Electron Integration (Local File Access)**
   - **webSecurity: false** configuration in BrowserWindow for local file access
   - Direct file:// protocol URLs for native Electron compatibility
   - No HTTP server required for audio file serving
   - Native HTML5 Audio API for playback controls
   - Security trade-off: Local file access vs web security restrictions

5. **Frontend Integration (User-Controlled Playback)** (v1.9.0 Update)
   - VoiceMessage type in comprehensive message system
   - Type guards ensure proper component rendering
   - Voice UI components with play/pause controls and transcript display
   - Manual user-controlled playback only (no auto-play)
   - User controls: Play/pause/stop with visual feedback

### Performance Optimization

1. **React Optimization**
   - React 19 concurrent features for improved rendering
   - Efficient state management with minimal re-renders
   - Proper key usage in dynamic lists and components
   - Memory-efficient message handling for long conversations

2. **Streaming Performance**
   - NDJSON streaming for real-time message processing
   - Chunked response handling without blocking UI
   - Efficient message buffer management
   - Request abort controllers for cancelled operations

3. **Electron Optimization**
   - Context isolation for security and performance
   - Minimal main process operations
   - Efficient IPC communication patterns
   - Optimized bundling with electron-vite

### Component Architecture

#### **Core Application Components (Three-Panel IDE)**
- **App.tsx**: Main application wrapper with SettingsProvider and TokenUsageProvider
- **ResponsiveLayout.tsx**: Adaptive layout switcher (React fragment, no height wrapper)
- **DesktopLayout.tsx**: Three-panel desktop interface with resizable panels
- **MobileLayout.tsx**: Single-panel mobile interface (`h-dvh` root, flex-based scrolling)
- **ChatPage.tsx**: Unified AI chat interface shared between desktop and mobile (Ticket #056)
- **ChatHeader.tsx**: Reusable header component for view/panel switching (Ticket #056)
- **VirtualizedFileTree.tsx**: High-performance file browser with virtualization
- **FilePreview.tsx**: Rich Markdown/MDX preview with syntax highlighting
- **ProjectSelector.tsx**: Working directory selection and configuration
- **TokenContextBar.tsx**: Real-time token usage visualization (Ticket #029)

#### **Chat System Components**
- **ChatInput.tsx**: Message input with send controls and state management
- **ChatMessages.tsx**: Real-time message display with streaming support
- **PermissionInputPanel.tsx**: Tool permission and approval interface
- **PlanPermissionInputPanel.tsx**: Plan approval workflow component
- **HistoryButton.tsx**: Conversation history access and navigation

#### **Message Display Components**
- **MessageContainer.tsx**: Universal message wrapper with type routing and custom background colors
- **MessageComponents.tsx**: Specialized renderers (v1.9.0: green user messages, no labels, timestamp below)
- **VoiceMessageComponent.tsx**: Voice message UI with manual play/pause controls (no auto-play)
- **FileOperationComponent.tsx**: File operation display (v1.9.0: transparent background)
- **LoadingComponent.tsx**: Loading indicator (v1.9.0: simplified, no background)
- **CollapsibleDetails.tsx**: Expandable content display for complex messages
- **TimestampComponent.tsx**: Consistent timestamp formatting across messages

#### **File Preview Components** (Tickets #037, #041)
- **MarkdownRenderer.tsx**: Static markdown rendering with react-markdown
- **MDXRenderer.tsx**: Interactive MDX components with next-mdx-remote
- **mdx-components/**: Custom interactive components
  - **AgentStatus.tsx**: Agent status display with visual indicators
  - **MetricCard.tsx**: Metric visualization cards
  - **TaskProgress.tsx**: Task tracking with progress bars
  - **ArchitectureDiagram.tsx**: Architecture visualizations
  - **TicketStack.tsx**: Visual ticket planning component (Ticket #041)
    - Collapsible cards for product requirements, architecture, and implementation
    - Color-coded status indicators (active/planned/completed)
    - Progress tracking with visual bars and confidence scores
    - Next action highlighting for workflow clarity

#### **Settings & Configuration** (Tickets #042-043)
- **SettingsButton.tsx**: Settings panel trigger and status display
- **SettingsModal.tsx**: Configuration interface with tabbed organization
- **GeneralSettings.tsx**: Core application settings and preferences
  - Theme toggle (light/dark)
  - Enter behavior toggle (send/newline)
  - Workspace switcher with visual selection (Tickets #042-043)
  - Message display mode (Jarvis/Developer)

#### **UI Foundation Components**
- **Button, Card, Tabs, Switch, Dialog**: shadcn/ui component library
- **Consistent theming**: TailwindCSS-based styling system
- **Responsive design**: Mobile-friendly responsive layouts
- **Accessibility**: ARIA-compliant interactive components

## Project Structure
```
my-jarvis-desktop/                  # Main application (GitHub repo)
├── app/                            # React frontend (three-panel IDE interface)
│   ├── components/                 # Component library
│   │   ├── Layout/                 # Layout system components
│   │   │   ├── ResponsiveLayout.tsx # Adaptive desktop/mobile switching
│   │   │   ├── DesktopLayout.tsx   # Three-panel resizable desktop layout
│   │   │   └── MobileLayout.tsx    # Single-panel mobile layout
│   │   ├── FileTree/               # File browser components
│   │   │   └── VirtualizedFileTree.tsx # High-performance file tree
│   │   ├── FilePreview/            # File preview components
│   │   │   └── FilePreview.tsx     # File content preview with syntax highlighting
│   │   ├── ChatPage.tsx            # AI chat interface (embedded in chat panel)
│   │   ├── ProjectSelector.tsx     # Working directory selection
│   │   ├── SettingsButton.tsx      # Settings panel trigger
│   │   ├── SettingsModal.tsx       # Configuration interface
│   │   ├── TimestampComponent.tsx  # Timestamp formatting
│   │   ├── chat/                   # Chat system components
│   │   │   ├── ChatInput.tsx       # Message input controls
│   │   │   ├── ChatMessages.tsx    # Message display with streaming
│   │   │   ├── PermissionInputPanel.tsx    # Tool permission interface
│   │   │   ├── PlanPermissionInputPanel.tsx # Plan approval workflow
│   │   │   └── HistoryButton.tsx   # History navigation
│   │   ├── messages/               # Message display components
│   │   │   ├── MessageContainer.tsx # Universal message wrapper
│   │   │   ├── MessageComponents.tsx # Message type renderers
│   │   │   ├── VoiceMessageComponent.tsx # Voice message UI with play/pause controls
│   │   │   └── CollapsibleDetails.tsx # Expandable content
│   │   ├── settings/               # Settings components
│   │   │   └── GeneralSettings.tsx # Core application settings
│   │   └── ui/                     # Custom UI components and utilities
│   ├── contexts/                   # React contexts
│   │   ├── SettingsContext.tsx     # Settings management (theme, workingDirectory, etc.)
│   │   ├── SettingsContextTypes.ts # Settings type definitions
│   │   ├── ChatStateContext.tsx    # Chat state management (messages, session)
│   │   └── TokenUsageContext.tsx   # Token usage state management (Ticket #029)
│   ├── hooks/                      # Custom hooks
│   │   ├── chat/                   # Chat-related hooks
│   │   │   ├── useChatState.ts     # Chat state management
│   │   │   ├── usePermissions.ts   # Permission handling
│   │   │   └── usePermissionMode.ts # Permission mode logic
│   │   ├── streaming/              # Streaming hooks
│   │   │   ├── useMessageProcessor.ts # Message processing (token tracking)
│   │   │   └── useStreamParser.ts  # Stream parsing logic
│   │   ├── useClaudeStreaming.ts   # Claude SDK streaming
│   │   ├── useSettings.ts          # Settings hook
│   │   └── useTokenUsage.ts        # Token usage hook (Ticket #029)
│   ├── utils/                      # Utilities
│   │   ├── UnifiedMessageProcessor.ts  # ⭐ Core message transformation pipeline
│   │   │                           # - Tool caching and result correlation
│   │   │                           # - Message type detection and transformation
│   │   │                           # - Voice message creation logic
│   │   │                           # - Token extraction and tracking (Ticket #029)
│   │   │                           # - Streaming and batch processing unification
│   │   ├── thinkingMessageGenerator.ts # Thinking message generation (v1.9.0: no prefix)
│   │   ├── messageConversion.ts    # Message type conversion utilities
│   │   ├── messageTypes.ts         # Message type guards and utilities
│   │   ├── toolUtils.ts           # Tool processing and permission utilities
│   │   └── pathUtils.ts           # Path manipulation utilities
│   ├── types/                      # TypeScript definitions
│   │   ├── settings.ts             # Settings types
│   │   └── window.d.ts            # Window type extensions
│   ├── config/                     # Configuration
│   │   └── api.ts                 # API configuration
│   ├── styles/                     # CSS and styling
│   │   └── global.css             # Global styles
│   ├── App.tsx                     # Main application component with ResponsiveLayout
│   ├── renderer.tsx                # React entry point (actual entry file)
│   ├── main.tsx                    # Alternative entry point (unused)
│   └── types.ts                    # Core type definitions
├── lib/                            # Electron backend
│   ├── main/                       # Main process
│   │   ├── main.ts                 # Application entry point
│   │   └── app.ts                  # Window management
│   ├── preload/                    # Preload scripts
│   │   └── preload.ts             # Secure IPC bridge
│   ├── claude-webui-server/        # Backend server (TypeScript → compiled to dist/)
│   │   ├── cli/                    # Entry points
│   │   │   ├── node.ts             # Development entry (TypeScript)
│   │   │   └── electron-node.cjs   # Electron wrapper (auto-detects dev/prod)
│   │   ├── dist/                   # Compiled JavaScript (generated by npm run build)
│   │   │   └── cli/
│   │   │       └── node.js         # Production entry (compiled)
│   │   ├── handlers/               # Modular request handlers
│   │   ├── history/                # History processing modules
│   │   ├── utils/                  # Utility modules
│   │   └── package.json            # Server dependencies and build scripts
│   ├── conveyor/                   # IPC system
│   │   └── handlers/               # IPC handlers
│   │       └── claude-fork-handler.ts # Server management
│   └── utils/                      # Backend utilities
│       └── logger.ts               # Logging system
├── shared/                         # Shared types
│   └── types.ts                    # Common type definitions
├── scripts/                        # Build scripts
│   └── after-pack.js              # Post-build processing
└── external-environment/           # External my-jarvis environment
    ├── /Users/erezfern/Workspace/my-jarvis/tools/src/jarvis_voice.sh  # Voice generation script
    └── /Users/erezfern/Workspace/my-jarvis/tools/voice/              # Generated audio files
├── package.json                    # Main dependencies and scripts
├── electron.vite.config.ts         # Build configuration
├── electron-builder.yml            # Packaging configuration
├── tailwind.config.js              # TailwindCSS configuration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite configuration
```

## Deployment Options

### 1. Desktop Application (Current Implementation)
```
my-jarvis-desktop/                  # Electron app with embedded server
├── Electron wrapper               # Cross-platform desktop framework
├── claude-webui-server            # Embedded backend server
└── claude-code-webui frontend     # React-based chat interface
```

### 2. My Jarvis Cloud (Web Deployment)
The claude-code-webui frontend can be deployed as a standalone web application:

```
my-jarvis-cloud/                    # Docker-based cloud deployment
├── docker-compose.yml             # Container orchestration
├── claude-code-webui/             # Same frontend codebase
├── backend-server/                # Separate backend container
└── nginx/                         # Reverse proxy and routing
```

**Key Benefits:**
- **Unified Codebase**: Same React frontend works across platforms
- **Cloud Accessibility**: Access from any device with web browser
- **Scalable Architecture**: Docker containers for easy scaling
- **Consistent Experience**: Identical UI and features across platforms

### 3. Hybrid Deployment
Users can choose their preferred deployment method:
- **Desktop**: Full-featured with local processing and file access
- **Cloud**: Accessible anywhere with internet connection
- **Both**: Sync conversations and settings across platforms

## Key Features

### Production-Ready AI Chat Application

#### **Core Chat Features (claude-code-webui Foundation)**
- ✅ **Professional Chat Interface**: Clean, responsive UI with TailwindCSS styling
- ✅ **Real-time Streaming**: NDJSON streaming with real-time message display
- ✅ **Comprehensive Message Types**: Support for chat, tool, plan, todo, thinking, and voice messages
- ✅ **Session Management**: Conversation history and session persistence
- ✅ **Cross-Platform Deployment**: Same codebase works in Electron, web, and cloud

#### **AI Integration & Tools**
- ✅ **Claude Code SDK Integration**: Official @anthropic-ai/claude-code ^1.0.108
- ✅ **Tool Use Support**: Comprehensive tool execution and result display
- ✅ **Plan Approval Workflow**: Interactive plan review and approval process
- ✅ **Permission Management**: Fine-grained tool permission controls
- ✅ **Request Cancellation**: Abort controllers for stopping operations
- ✅ **UnifiedMessageProcessor**: Consistent message handling for streaming and history

#### **Desktop Integration (Electron)**
- ✅ **In-Process Server Architecture**: Embedded backend server on port 8081 (jlongster pattern)
- ✅ **Environment Authentication**: Seamless Claude CLI authentication inheritance with PATH enhancement
- ✅ **Cross-Platform Builds**: Native packages for macOS, Windows, Linux
- ✅ **Production Packaging**: electron-builder with optimized distribution
- ✅ **Security**: Context isolation and secure IPC communication

#### **Voice & Audio (Tickets #018-019, #022, #039)**
- ✅ **Voice Message System**: TTS integration with jarvis_voice.sh script
- ✅ **Native Audio Playback**: Direct file:// URLs for Electron compatibility
- ✅ **Voice UI Components**: Manual play/pause controls with transcript display (v1.9.0: no auto-play)
- ✅ **Environment Isolation**: Complete separation of Jarvis environments

#### **Token Usage & Context Tracking (Ticket #029)**
- ✅ **Real-Time Visualization**: TokenContextBar with gradient color system
- ✅ **Cumulative Tracking**: Session-based token accumulation across conversation
- ✅ **Context Awareness**: 200K context window tracking with percentage display
- ✅ **Integration**: UnifiedMessageProcessor extracts tokens from SDK result messages

#### **Rich File Preview (Tickets #037, #041)**
- ✅ **Markdown Rendering**: react-markdown with GitHub Flavored Markdown
- ✅ **MDX Support**: Interactive components with next-mdx-remote
- ✅ **Syntax Highlighting**: rehype-highlight for code blocks
- ✅ **Custom Components**: AgentStatus, MetricCard, TaskProgress, ArchitectureDiagram
- ✅ **TicketStack Component**: Visual ticket planning with collapsible cards and progress tracking (Ticket #041)

#### **UI/UX Polish (Ticket #040, v1.9.0-1.10.0)**
- ✅ **User Message Styling**: Green-100 background, no label, timestamp below, sans-serif font
- ✅ **Typography Improvement**: Removed font-mono from chat messages for better readability
- ✅ **Neutral Color System**: Consistent neutral palette throughout
- ✅ **Transparent Messages**: Thinking, file operations, loading components
- ✅ **Static Input Field**: No focus effects, clean minimal design
- ✅ **Simplified UI**: Removed technical prefixes and labels in Jarvis mode

#### **Workspace Management (Tickets #042-043)**
- ✅ **Multi-Workspace Support**: Switch between My Jarvis and My Jarvis Onboarding
- ✅ **SettingsContext Integration**: workingDirectory as persistent user preference
- ✅ **Reactive File Tree**: Automatic reload when workspace changes
- ✅ **Workspace Switcher UI**: Visual selection in Settings panel with active indication
- ✅ **Clean Architecture**: Single source of truth, no prop drilling

#### **Settings & Configuration**
- ✅ **Centralized Settings**: SettingsContext for all user preferences
- ✅ **Persistent Preferences**: Automatic localStorage persistence
- ✅ **Workspace Selection**: Multi-workspace support with visual switcher
- ✅ **Demo Mode**: Testing and demonstration interface
- ✅ **History Management**: Conversation history access and navigation

#### **Development & Build**
- ✅ **Modern Tech Stack**: React 19, TypeScript, TailwindCSS, shadcn/ui
- ✅ **Type Safety**: Complete TypeScript coverage with strict configuration
- ✅ **Build System**: electron-vite for optimized bundling and performance
- ✅ **Hot Reload**: Development server with fast refresh and live updates
- ✅ **Code Quality**: ESLint and Prettier for consistent code formatting

## Development Setup

### Prerequisites
- Node.js 18+
- npm or pnpm
- Git

### Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build:mac   # macOS
npm run build:win   # Windows
npm run build:linux # Linux

# Lint and format
npm run lint
npm run format
```

## Build Pipeline Architecture

### Critical Build Process

**IMPORTANT**: Production builds require TypeScript compilation. The backend cannot run without compiled JavaScript files.

### Development vs Production Execution

#### **Development Mode** (npm run dev)
```bash
# Development uses TypeScript directly
tsx cli/node.ts --port 8081 --host 127.0.0.1
```
- ✅ Uses `tsx` to run TypeScript files directly
- ✅ No compilation required
- ✅ Fast iteration and hot reload
- ✅ Works with source TypeScript files

#### **Production Mode** (npm run build:mac)
```bash
# Production requires compiled JavaScript
node dist/cli/node.js --port 8081 --host 127.0.0.1
```
- ✅ Uses compiled JavaScript files from `dist/`
- ✅ No tsx dependency in packaged app
- ✅ Optimized for distribution
- ❌ **FAILS if dist/ directory missing**

### Complete Build Pipeline

#### **Step 1: prebuild** (Automatic)
```bash
"prebuild": "cd lib/claude-webui-server && npm install && npm run build"
```
1. Install backend dependencies
2. **Compile TypeScript → JavaScript** (creates `dist/` directory)
3. **Critical**: This step MUST complete before Electron packaging

#### **Step 2: Frontend Build**
```bash
"vite:build:app": "electron-vite build"
```
- Compiles React frontend
- Creates optimized bundles

#### **Step 3: Electron Packaging**
```bash
"electron:build:mac": "electron-builder --mac"
```
- Packages both frontend and backend
- Creates installable .dmg file

### Entry Point Detection (electron-node.cjs)

The wrapper automatically detects environment and uses appropriate entry point:

```javascript
// Auto-detection logic
const isProduction = process.env.NODE_ENV === 'production' ||
                    !fs.existsSync(path.join(__dirname, 'node.ts'));

const entryPoint = isProduction
  ? path.join(__dirname, '..', 'dist', 'cli', 'node.js')  // Compiled JS
  : path.join(__dirname, 'node.ts');                      // TypeScript

// Uses appropriate runtime
const server = isProduction
  ? spawn('node', [entryPoint, '--port', port, '--host', '127.0.0.1'])
  : spawn('tsx', [entryPoint, '--port', port, '--host', '127.0.0.1']);
```

### Build Dependencies

#### **Required for Production**
- ✅ `lib/claude-webui-server/dist/cli/node.js` (compiled backend)
- ✅ `out/` directory (compiled frontend)
- ✅ All node_modules installed

#### **Build Failure Symptoms**
- ❌ "ERR_CONNECTION_REFUSED" in production builds
- ✅ Development works normally
- ❌ Missing `dist/` directory
- ❌ Backend server fails to start silently

### Troubleshooting Build Issues

#### **Problem**: Production build fails with connection errors
**Solution**:
1. Verify backend compilation: `cd lib/claude-webui-server && npm run build`
2. Check for `dist/cli/node.js` file existence
3. Rebuild completely: `npm run build:mac`

#### **Problem**: "Development works, production fails"
**Root Cause**: Missing TypeScript compilation step
**Prevention**: Never remove `dist/` files without updating build pipeline

#### **Problem**: Backend server startup timeout
**Diagnosis**: Check electron-node.cjs entry point detection
**Fix**: Ensure production detection logic works correctly

### Historical Context (Lesson Learned)

**Previous Issue**: Production builds failed because:
1. ✅ TK27 backend migration was successful
2. ✅ Compiled `dist/` files were committed to git (production worked)
3. ❌ Repository cleanup removed `dist/` files (commit `df18aea4`)
4. ❌ Build pipeline never regenerated the removed files
5. ❌ Development continued working (tsx), production failed silently

**Solution Implemented**:
- Updated `prebuild` script to include compilation
- Added automatic dev/production entry point detection
- Documented complete build pipeline to prevent regression


## Testing Strategy

### Testing Environment (Environment Isolation)
We maintain a completely isolated **my-jarvis** environment (`/Users/erezfern/Workspace/my-jarvis/`) specifically for testing and production use. This isolated workspace:
- **Complete Environment Separation**: No shared paths or dependencies with development Jarvis
- **Production-Like Testing**: Simulates actual user environment without development complexity
- **Contamination Prevention**: Resolves Claude Code SDK hierarchical discovery conflicts
- **Independent Configuration**: Contains isolated CLAUDE.md and voice script configurations
- **User Experience Validation**: Helps identify issues that real users would encounter

### Testing Approach
- Manual testing of terminal functionality
- Verification with Claude TUI for ANSI compatibility
- Cross-platform testing on macOS primarily
- Component testing for React components (planned)
- User experience testing in the isolated my-jarvis workspace

## Security Considerations
- Contextual isolation enabled in Electron
- Secure IPC communication via preload script
- No direct Node.js access from renderer
- Sandboxed renderer processes
- **Trade-off**: webSecurity: false for local file access (voice messages)
  - Enables file:// protocol URLs for audio playback
  - Required for voice message functionality in Electron
  - Acceptable risk for desktop application with controlled file access

## Performance Optimizations
- WebGL renderer for terminal (falls back to canvas)
- React.PureComponent for terminal to prevent re-renders
- Efficient IPC message passing
- Minimal bundle size with tree-shaking

## License
Proprietary - Privately owned by Erez Fern

## Contributors
- Erez Fern (@erezgit)

## Summary

My Jarvis Desktop has evolved into a sophisticated three-panel IDE-like desktop application featuring comprehensive file management, preview capabilities, and integrated Claude AI assistance. Built on the claude-code-webui foundation with extensive customizations, it represents a significant advancement from simple chat interfaces to a full-featured development environment with AI integration.

**Architecture Achievement:**
- ✅ **Three-Panel IDE Interface**: Sophisticated desktop application with resizable panels
- ✅ **Responsive Design System**: Adaptive desktop/mobile layouts with react-resizable-panels
- ✅ **File Management Integration**: VirtualizedFileTree and FilePreview for complete file operations
- ✅ **In-Process Server Architecture**: Streamlined embedded claude-webui-server with NodeRuntime
- ✅ **Production-Ready**: Complete with packaging, cross-platform builds, and professional UI

**Current Capabilities:**
- ✅ **Three-Panel IDE Interface**: File tree, preview, and chat in resizable desktop layout
- ✅ **Comprehensive File Operations**: Browse, preview, and edit files with syntax highlighting
- ✅ **Professional AI Chat**: Real-time streaming with comprehensive message types
- ✅ **Voice Integration**: TTS system with native audio playback and auto-play controls
- ✅ **Cross-Platform Desktop**: Native Electron app with embedded server architecture
- ✅ **Modern Tech Stack**: React 19, TypeScript, TailwindCSS, react-resizable-panels

**Strategic Value:**
The application demonstrates how claude-code-webui can be extended beyond simple chat interfaces into sophisticated IDE-like environments. The three-panel responsive architecture with file management capabilities creates a comprehensive development environment that integrates AI assistance seamlessly into file-based workflows.

**Next Phase Opportunities:**
- Enhanced file system operations and workspace management
- Advanced AI orchestration and workflow automation
- Cloud deployment scaling and user management
- Additional message types following the established transformation pattern

**Recent Achievements (v1.9.0-1.10.0):**
- ✅ **Token Usage Tracking (Ticket #029)**: Real-time context visualization with gradient colors
- ✅ **Rich File Preview (Ticket #037)**: Markdown/MDX rendering with interactive components
- ✅ **Voice Message Refinements (Ticket #039)**: User-controlled playback, no auto-play
- ✅ **UI/UX Polish (Ticket #040)**: Comprehensive design system with neutral palette and sans-serif fonts
- ✅ **TicketStack Component (Ticket #041)**: Visual ticket planning with collapsible cards
- ✅ **Workspace Management (Tickets #042-043, #053-054)**: Multi-workspace support with SettingsContext architecture
- ✅ **Mobile Layout Architecture (Tickets #055-056)**: Unified ChatPage, h-dvh viewport, iOS Safari compatibility
- ✅ **Jarvis Mode Enhancement**: Clean, minimal interface for non-technical users

**Mobile Layout Implementation (Tickets #055-056, October 2025):**
- ✅ **Unified Chat Architecture**: Single ChatPage instance eliminates desktop/mobile duplication
- ✅ **Dynamic Viewport**: h-dvh viewport units properly handle mobile browser UI (100vh causes overflow)
- ✅ **iOS Safari Compatibility**: Viewport meta `maximum-scale=1` + 16px inputs prevent auto-zoom
- ✅ **Flex-Based Scrolling**: Proper container hierarchy enables internal message scrolling
- ✅ **No Parent Constraints**: Removed global CSS height:100% to avoid viewport unit conflicts
- ✅ **ChatHeader Component**: Reusable header for both desktop and mobile layouts
- ✅ **Comprehensive Testing**: 3-hour iterative troubleshooting with 11 fixes documented
- ✅ **UnifiedMessageProcessor Extensions**: Token extraction and tracking integration

---

*Last Updated: 2025-10-03*
*Current Version: 1.10.0*
*Status: Production Three-Panel IDE Application with Workspace Management, Token Tracking, Rich File Preview, and Polished UI*