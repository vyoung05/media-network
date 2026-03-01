# Progress: Add Unsplash Cover Images to Brand Site Mock Data

## Analysis
- **TrapFrequency**: Has ALL `null` images — 10 producers (avatar+cover), 12 tutorials, 10 beats, 8 gear reviews, 5 sample packs = ~55 null values
- **TrapGlow**: Already has real Unsplash URLs for all artists and blog posts ✅ (authors have `avatar_url: null` but these are `User` type, not content images)
- **SauceCaviar**: Already has real Unsplash URLs for all magazine pages, issues, and team members ✅

## Tasks
- [⏳] Update TrapFrequency mock-data.ts (all null images)
- [✅] TrapGlow - already has images, no changes needed
- [✅] SauceCaviar - already has images, no changes needed
- [ ] Build all 3 apps
- [ ] Commit and push
