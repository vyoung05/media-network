# Media Network Admin — Feature Progress

## Date: 2025-07-12

### ✅ 1. API Key Auth System
- **Table**: `auth_api_keys` created in Supabase (separate from existing `api_keys` table which stores 3rd-party keys)
- **API Key**: `mn_f8a5e22e4ba142199483469096b7016c8083bc213c34a83f` inserted for "Vector"
- **Key saved to**: `D:\Vector\media-network\API_KEY.txt` (gitignored)
- **Middleware**: `apps/admin/src/lib/api-auth.ts` — validates `X-API-Key` header against `auth_api_keys` table, updates `last_used_at`
- **Auth added to routes**:
  - `POST /api/articles` ✅
  - `POST /api/upload` ✅
  - `PATCH /api/articles/[id]` ✅
  - `POST /api/articles/[id]/publish` ✅
  - `POST /api/upload-url` ✅
- **Auth is optional**: If no X-API-Key header is sent, request passes through (browser users unaffected). If X-API-Key is sent but invalid, returns 401.

### ✅ 2. Article Edit Page with LivePreview
- **File**: `apps/admin/src/app/dashboard/content/[id]/edit/page.tsx`
- **Split-screen layout**: Form on left, `LivePreview` component on right (same as `/dashboard/content/new`)
- **Features**:
  - Fetches article by ID on load
  - Pre-populates all fields including metadata
  - Brand selector, content type selector
  - Brand-specific fields rendered dynamically
  - Toggle to show/hide preview
  - Publish Now button for unpublished articles
  - Saves via `PATCH /api/articles/[id]`
- **Edit button added**: ContentQueuePage.tsx now has a pencil ✏️ icon button for each article that navigates to `/dashboard/content/{id}/edit`

### ✅ 3. Upload URL Endpoint
- **File**: `apps/admin/src/app/api/upload-url/route.ts`
- **Endpoint**: `POST /api/upload-url`
- **Request body**: `{ url: string, folder?: string }`
- **Features**:
  - Downloads image from URL
  - Detects content type via magic bytes + response headers + URL extension
  - Validates file type (JPEG, PNG, GIF, WebP, SVG) and size (max 10MB)
  - Uploads to Supabase storage bucket "media" under specified folder (default: `uploads/`)
  - Returns `{ url, path, size, type, originalUrl }`
  - API key auth enabled

### Git
- Committed: `07c25fc` — "feat: API key auth, article edit page with LivePreview, upload-url endpoint"
- Pushed to `origin/main`
- TypeScript: compiles clean (`tsc --noEmit` passes)
