'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ======================== TYPES ========================

interface HelpSection {
  id: string;
  title: string;
  icon: string;
  content: HelpItem[];
}

interface HelpItem {
  question: string;
  answer: React.ReactNode;
}

// ======================== HELP DATA ========================

const HELP_SECTIONS: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    content: [
      {
        question: 'What is the Media Network Admin Dashboard?',
        answer: (
          <div className="space-y-3">
            <p>
              The Media Network Admin Dashboard is the central command center for managing your multi-brand media
              empire. It connects to all four brand sites — <strong className="text-red-400">SauceWire</strong>,{' '}
              <strong className="text-purple-400">TrapGlow</strong>,{' '}
              <strong className="text-yellow-400">SauceCaviar</strong>, and{' '}
              <strong className="text-green-400">TrapFrequency</strong> — from a single interface.
            </p>
            <p>
              From here, you can create and publish articles, manage writers, review submissions from artists and
              creators, configure AI-powered content pipelines, and monitor analytics across all brands.
            </p>
          </div>
        ),
      },
      {
        question: 'Who is this dashboard for?',
        answer: (
          <div className="space-y-3">
            <p>This dashboard is designed for three types of users:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>
                <strong className="text-white">Admins</strong> — Full access to everything. Manage users, settings,
                API keys, and all content across brands.
              </li>
              <li>
                <strong className="text-white">Editors</strong> — Review, edit, and approve/reject content. Help
                maintain quality across publications.
              </li>
              <li>
                <strong className="text-white">Writers</strong> — Create drafts, submit articles for review, and
                manage their own content.
              </li>
            </ul>
          </div>
        ),
      },
      {
        question: 'How do I navigate the dashboard?',
        answer: (
          <div className="space-y-3">
            <p>
              The sidebar on the left contains all main navigation items. Use the <strong className="text-white">Brand Switcher</strong> at
              the top of the sidebar to toggle between brands — content and settings adjust based on the active brand.
            </p>
            <p>Key sections:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li><strong className="text-white">Dashboard</strong> — Stats overview, recent activity, quick actions</li>
              <li><strong className="text-white">Content Queue</strong> — All articles: drafts, pending, published</li>
              <li><strong className="text-white">Submissions</strong> — Artist/creator submissions to review</li>
              <li><strong className="text-white">Writers</strong> — Manage your team of writers and editors</li>
              <li><strong className="text-white">Settings</strong> — Brand settings, AI pipeline, API keys, permissions</li>
              <li><strong className="text-white">Help</strong> — You&apos;re here!</li>
            </ul>
          </div>
        ),
      },
    ],
  },
  {
    id: 'roles-permissions',
    title: 'Roles & Permissions',
    icon: '🔐',
    content: [
      {
        question: 'What are the different roles?',
        answer: (
          <div className="space-y-4">
            <div className="glass-panel p-4 border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400 text-lg">👑</span>
                <h4 className="text-sm font-bold text-white">Admin</h4>
              </div>
              <p className="text-sm text-gray-400">
                Full unrestricted access. Can manage all users, publish/unpublish any content, edit all articles,
                approve/reject submissions, configure settings, manage API keys, and control the AI pipeline. There
                should be very few admins — typically just the owner.
              </p>
            </div>
            <div className="glass-panel p-4 border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-purple-400 text-lg">✏️</span>
                <h4 className="text-sm font-bold text-white">Editor</h4>
              </div>
              <p className="text-sm text-gray-400">
                Can review, edit, and approve/reject articles and submissions. Editors help maintain quality and
                consistency. By default, editors cannot manage users or change settings — but admins can grant
                additional permissions via the Permissions tab in Settings.
              </p>
            </div>
            <div className="glass-panel p-4 border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-emerald-400 text-lg">📝</span>
                <h4 className="text-sm font-bold text-white">Writer</h4>
              </div>
              <p className="text-sm text-gray-400">
                Can create drafts and submit them for review. Writers cannot publish directly — their articles go
                through an approval flow. Admins can grant writers additional permissions like uploading media or
                accessing the submissions portal.
              </p>
            </div>
          </div>
        ),
      },
      {
        question: 'How do I change someone\'s role?',
        answer: (
          <p>
            Go to <strong className="text-white">Writers</strong> in the sidebar, find the user, and click their
            profile. You&apos;ll see a role dropdown where you can promote or demote between Writer, Editor, and Admin.
            Only admins can change roles.
          </p>
        ),
      },
      {
        question: 'Can I customize what each role can do?',
        answer: (
          <p>
            Yes! Go to <strong className="text-white">Settings → Permissions</strong> tab. You&apos;ll find a
            permission matrix where you can toggle specific capabilities for Editors and Writers. By default,
            everything goes through the admin — all non-admin permissions start OFF. Enable only what you need.
          </p>
        ),
      },
    ],
  },
  {
    id: 'content-management',
    title: 'Content Management',
    icon: '📰',
    content: [
      {
        question: 'How do I create a new article?',
        answer: (
          <div className="space-y-3">
            <p>
              Navigate to <strong className="text-white">Content Queue</strong> and click{' '}
              <strong className="text-white">New Article</strong>. You&apos;ll be presented with a rich editor where you
              can:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Write your article with full rich text formatting</li>
              <li>Add images, embedded videos, social media embeds</li>
              <li>Select a category and tags</li>
              <li>Choose which brand this article belongs to</li>
              <li>Set a featured image</li>
              <li>Schedule publication for a future date</li>
              <li>Save as draft or submit for review</li>
            </ul>
          </div>
        ),
      },
      {
        question: 'What is the article workflow?',
        answer: (
          <div className="space-y-3">
            <p>Articles follow this lifecycle:</p>
            <div className="flex flex-wrap gap-2 items-center">
              {['Draft', 'Pending Review', 'Published', 'Archived'].map((step, i) => (
                <React.Fragment key={step}>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-gray-300 border border-white/10">
                    {step}
                  </span>
                  {i < 3 && <span className="text-gray-600">→</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              Writers create drafts → submit for review → Editors/Admins approve → article goes live. Admins can
              publish directly. Articles can be archived at any time.
            </p>
          </div>
        ),
      },
      {
        question: 'How do categories work?',
        answer: (
          <p>
            Each brand has its own set of categories (e.g., SauceWire has Music, Fashion, Entertainment, Sports, Tech).
            Categories help organize content and power the navigation on the public sites. You can manage categories
            in <strong className="text-white">Settings → Brands</strong>.
          </p>
        ),
      },
      {
        question: 'Can I schedule articles?',
        answer: (
          <p>
            Yes. When creating or editing an article, you&apos;ll see a &quot;Schedule&quot; option. Set a future date and time,
            and the article will automatically publish at that time. Scheduled articles appear in the Content Queue
            with a clock icon.
          </p>
        ),
      },
    ],
  },
  {
    id: 'submissions',
    title: 'Submissions Portal',
    icon: '📥',
    content: [
      {
        question: 'What is the submissions portal?',
        answer: (
          <p>
            The submissions portal allows artists, creators, and contributors to submit their work (music, art,
            stories, etc.) for potential feature on your brand sites. Each brand has its own public submission form
            that feeds into this dashboard for review.
          </p>
        ),
      },
      {
        question: 'How does the review flow work?',
        answer: (
          <div className="space-y-3">
            <ol className="list-decimal list-inside space-y-2 text-gray-400">
              <li>A creator fills out the submission form on one of your brand sites</li>
              <li>
                The submission appears in <strong className="text-white">Submissions</strong> with status{' '}
                <span className="text-amber-400">Pending</span>
              </li>
              <li>An admin or editor reviews the submission — listening to music, viewing art, etc.</li>
              <li>
                They can <span className="text-emerald-400">Approve</span> (create a feature article) or{' '}
                <span className="text-red-400">Reject</span> (with optional feedback)
              </li>
              <li>Approved submissions can be converted directly into a draft article</li>
            </ol>
          </div>
        ),
      },
      {
        question: 'Can creators submit anonymously?',
        answer: (
          <p>
            Yes. The submission form has an anonymous option. Anonymous submissions will show as &quot;Anonymous&quot; in the
            dashboard. Contact information is hidden but stored securely in case you need to reach out later.
          </p>
        ),
      },
    ],
  },
  {
    id: 'ai-pipeline',
    title: 'AI Pipeline',
    icon: '🤖',
    content: [
      {
        question: 'How does the AI content pipeline work?',
        answer: (
          <div className="space-y-4">
            <p>
              The AI Pipeline is the backbone of automated content creation. Here&apos;s the full breakdown:
            </p>
            <div className="space-y-3">
              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">1️⃣</span>
                  <h4 className="text-sm font-bold text-white">News API Scanning</h4>
                </div>
                <p className="text-sm text-gray-400">
                  The pipeline connects to multiple news APIs (NewsAPI, Google News, RSS feeds) and scans for
                  trending topics relevant to each brand. SauceWire gets music news, TrapGlow gets hip-hop/R&B
                  discoveries, etc. Each brand has its own keyword filters and source preferences.
                </p>
              </div>
              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">2️⃣</span>
                  <h4 className="text-sm font-bold text-white">AI Rewriting with Brand Voice</h4>
                </div>
                <p className="text-sm text-gray-400">
                  Each trending article is rewritten by AI (GPT-4 / Claude) using the specific brand&apos;s voice and
                  tone. SauceWire sounds like a sharp news wire, TrapGlow is energetic and discovery-focused,
                  SauceCaviar is sophisticated, and TrapFrequency is technical and educational. The AI adds original
                  analysis and context.
                </p>
              </div>
              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">3️⃣</span>
                  <h4 className="text-sm font-bold text-white">Confidence Scoring</h4>
                </div>
                <p className="text-sm text-gray-400">
                  Each AI-generated article receives a confidence score (0-100%) based on factual accuracy, brand
                  voice match, originality, and quality metrics. This score determines what happens next.
                </p>
              </div>
              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">4️⃣</span>
                  <h4 className="text-sm font-bold text-white">Auto-Publish vs Manual Review</h4>
                </div>
                <p className="text-sm text-gray-400">
                  If confidence is <strong className="text-white">above the threshold</strong> (configurable per
                  brand, default 80-90%), the article auto-publishes. If it&apos;s below, it lands in the{' '}
                  <span className="text-amber-400">Pending Review</span> queue for human review.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        question: 'How do I configure the pipeline frequency?',
        answer: (
          <div className="space-y-3">
            <p>
              Go to <strong className="text-white">Settings → AI Pipeline</strong>. Each brand has its own frequency
              setting (in hours). For example:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>SauceWire: Every 2 hours (breaking news needs to be fast)</li>
              <li>TrapGlow: Every 4 hours (new music discovery pace)</li>
              <li>SauceCaviar: Every 6 hours (luxury/culture content is less time-sensitive)</li>
              <li>TrapFrequency: Every 8 hours (tutorials and technical content)</li>
            </ul>
          </div>
        ),
      },
      {
        question: 'How do I enable/disable the pipeline per brand?',
        answer: (
          <p>
            In <strong className="text-white">Settings → AI Pipeline</strong>, each brand has an{' '}
            <strong className="text-white">Enable AI Pipeline</strong> toggle. Turn it off to stop automatic content
            generation for that brand. You can also toggle <strong className="text-white">Auto-Publish</strong>{' '}
            independently — keep the pipeline running but require manual review for every article.
          </p>
        ),
      },
      {
        question: 'What is the confidence threshold?',
        answer: (
          <div className="space-y-3">
            <p>
              The confidence threshold is a slider (50-100%) that controls the quality gate for auto-publishing.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-panel p-3 text-center">
                <p className="text-2xl font-bold text-red-400">50-70%</p>
                <p className="text-xs text-gray-500 mt-1">Low — most articles need review</p>
              </div>
              <div className="glass-panel p-3 text-center">
                <p className="text-2xl font-bold text-amber-400">70-85%</p>
                <p className="text-xs text-gray-500 mt-1">Medium — balanced approach</p>
              </div>
              <div className="glass-panel p-3 text-center">
                <p className="text-2xl font-bold text-emerald-400">85-100%</p>
                <p className="text-xs text-gray-500 mt-1">High — only the best auto-publish</p>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 'audio-articles',
    title: 'Audio Articles',
    icon: '🎧',
    content: [
      {
        question: 'What are audio articles?',
        answer: (
          <p>
            Audio articles are text-to-speech versions of your published articles. When enabled, every published
            article automatically gets a TTS audio version that readers can listen to instead of reading. This is
            powered by <strong className="text-white">ElevenLabs</strong> for natural-sounding voices.
          </p>
        ),
      },
      {
        question: 'How do per-brand voices work?',
        answer: (
          <div className="space-y-3">
            <p>
              Each brand has its own TTS voice that matches its personality:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>
                <strong className="text-red-400">SauceWire</strong> — Authoritative Newscaster, Professional Narrator,
                Casual Reporter
              </li>
              <li>
                <strong className="text-yellow-400">SauceCaviar</strong> — Smooth Sophisticated, Editorial Narrator,
                Luxury Brand Voice
              </li>
              <li>
                <strong className="text-purple-400">TrapGlow</strong> — Young Energetic, Hype Discovery, Chill
                Narrator
              </li>
              <li>
                <strong className="text-green-400">TrapFrequency</strong> — Knowledgeable Technical, Chill Producer,
                Instructor Voice
              </li>
            </ul>
            <p>
              Configure voices in <strong className="text-white">Settings → Brands → Audio Articles</strong>.
            </p>
          </div>
        ),
      },
      {
        question: 'How do I enable/disable audio articles?',
        answer: (
          <p>
            Go to <strong className="text-white">Settings → Brands</strong>, select a brand, and toggle{' '}
            <strong className="text-white">Audio Articles</strong>. You&apos;ll also need a valid ElevenLabs API key in{' '}
            <strong className="text-white">Settings → API Keys</strong>.
          </p>
        ),
      },
    ],
  },
  {
    id: 'brand-management',
    title: 'Brand Management',
    icon: '🏷️',
    content: [
      {
        question: 'How do I switch between brands?',
        answer: (
          <p>
            Use the <strong className="text-white">Brand Switcher</strong> in the top section of the sidebar. Click
            any brand to make it active. The dashboard, content queue, and submissions will filter to show only that
            brand&apos;s data. The active brand is indicated by a glowing dot and a blue indicator.
          </p>
        ),
      },
      {
        question: 'What are per-brand settings?',
        answer: (
          <div className="space-y-3">
            <p>Each brand can be independently configured with:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Enable/disable the entire site</li>
              <li>Default category for new articles</li>
              <li>Push notification settings</li>
              <li>RSS feed toggle</li>
              <li>Audio article settings and voice selection</li>
              <li>AI pipeline settings (on/off, threshold, frequency)</li>
              <li>Auto-publish behavior</li>
            </ul>
            <p>
              All of these are configured in <strong className="text-white">Settings → Brands</strong>.
            </p>
          </div>
        ),
      },
      {
        question: 'What are the four brands?',
        answer: (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-panel p-4 border-l-2 border-red-500">
                <h4 className="text-sm font-bold text-white mb-1">SauceWire</h4>
                <p className="text-xs text-gray-400">Breaking music news, entertainment, sports, and culture. Fast-paced, wire-service style.</p>
              </div>
              <div className="glass-panel p-4 border-l-2 border-yellow-500">
                <h4 className="text-sm font-bold text-white mb-1">SauceCaviar</h4>
                <p className="text-xs text-gray-400">Premium fashion, art, and lifestyle. Sophisticated editorial voice with luxury aesthetic.</p>
              </div>
              <div className="glass-panel p-4 border-l-2 border-purple-500">
                <h4 className="text-sm font-bold text-white mb-1">TrapGlow</h4>
                <p className="text-xs text-gray-400">New music discovery — hip-hop, R&B, pop, electronic. Energetic and community-driven.</p>
              </div>
              <div className="glass-panel p-4 border-l-2 border-green-500">
                <h4 className="text-sm font-bold text-white mb-1">TrapFrequency</h4>
                <p className="text-xs text-gray-400">Producer tutorials, beat-making, gear reviews, DAW tips. Technical and educational.</p>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 'writer-management',
    title: 'Writer Management',
    icon: '👥',
    content: [
      {
        question: 'How do I add a new writer?',
        answer: (
          <div className="space-y-3">
            <p>
              Go to <strong className="text-white">Writers</strong> in the sidebar and click{' '}
              <strong className="text-white">Invite Writer</strong>. Enter their email — they&apos;ll receive an
              invitation to create an account. New writers start with the Writer role by default.
            </p>
            <p className="text-xs text-gray-500">
              If &quot;Require Approval&quot; is enabled in Settings, new writers must be approved before they can access the
              dashboard.
            </p>
          </div>
        ),
      },
      {
        question: 'How do I change a writer\'s role?',
        answer: (
          <p>
            In the <strong className="text-white">Writers</strong> page, click on a user to open their profile. Use
            the role dropdown to change between Writer, Editor, and Admin. Changes take effect immediately.
          </p>
        ),
      },
      {
        question: 'What is writer verification?',
        answer: (
          <p>
            Verified writers have a checkmark badge on their profile and articles. Verification is manually granted
            by admins to trusted, established writers. It signals to readers that the content comes from a vetted
            source.
          </p>
        ),
      },
    ],
  },
  {
    id: 'settings-guide',
    title: 'Settings Guide',
    icon: '⚙️',
    content: [
      {
        question: 'General Settings',
        answer: (
          <div className="space-y-2">
            <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
              <li><strong className="text-white">Network Name</strong> — The name of your media network (shown in admin UI)</li>
              <li><strong className="text-white">Admin Email</strong> — Primary contact email for notifications</li>
              <li><strong className="text-white">Timezone</strong> — Default timezone for scheduling and timestamps</li>
              <li><strong className="text-white">Posts Per Page</strong> — Number of articles per page in lists</li>
              <li><strong className="text-white">Enable Registration</strong> — Allow new writers to sign up</li>
              <li><strong className="text-white">Require Approval</strong> — New accounts need admin approval</li>
              <li><strong className="text-white">Maintenance Mode</strong> — Takes all public sites offline temporarily</li>
            </ul>
          </div>
        ),
      },
      {
        question: 'Brand Settings',
        answer: (
          <p>
            Each brand can be individually enabled/disabled, assigned a default category, configured for push
            notifications, RSS feeds, and audio articles. Select a brand tab to see and modify its settings.
          </p>
        ),
      },
      {
        question: 'AI Pipeline Settings',
        answer: (
          <p>
            Per-brand AI configuration including pipeline on/off, auto-publish toggle, confidence threshold slider
            (50-100%), and pipeline frequency (hours between runs). See the{' '}
            <strong className="text-white">AI Pipeline</strong> section above for full details.
          </p>
        ),
      },
      {
        question: 'API Keys',
        answer: (
          <div className="space-y-3">
            <p>
              The API Keys tab shows connection details for external services. Keys are masked for security.
            </p>
            <div className="glass-panel p-3 border-amber-500/20">
              <p className="text-xs text-amber-400">
                ⚠️ API keys displayed here are for reference only. Actual keys should be set in{' '}
                <code className="bg-white/5 px-1 py-0.5 rounded font-mono">.env.local</code> files for production
                deployments.
              </p>
            </div>
          </div>
        ),
      },
      {
        question: 'Permissions',
        answer: (
          <p>
            The Permissions tab lets you customize what Editors and Writers can do. By default, all permissions are
            OFF (everything goes through admin). Toggle individual permissions to delegate control as needed.
          </p>
        ),
      },
    ],
  },
];

// ======================== ACCORDION ITEM ========================

function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: HelpItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="border-b border-white/[0.04] last:border-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors group"
      >
        <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
          {item.question}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-500 flex-shrink-0 ml-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ======================== MAIN COMPONENT ========================

export function HelpPage() {
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState(HELP_SECTIONS[0].id);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const filteredSections = useMemo(() => {
    if (!search.trim()) return HELP_SECTIONS;
    const q = search.toLowerCase();
    return HELP_SECTIONS.map((section) => ({
      ...section,
      content: section.content.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          section.title.toLowerCase().includes(q)
      ),
    })).filter((section) => section.content.length > 0);
  }, [search]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(`help-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const expandAll = () => {
    const allKeys = new Set<string>();
    filteredSections.forEach((section) => {
      section.content.forEach((_, i) => {
        allKeys.add(`${section.id}-${i}`);
      });
    });
    setOpenItems(allKeys);
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white">Help Center</h1>
        <p className="text-sm text-gray-500 mt-1">
          Everything you need to know about the Media Network Admin Dashboard
        </p>
      </motion.div>

      {/* Search + Controls */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-4"
      >
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search help topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10 text-sm w-full"
          />
        </div>
        <button
          onClick={expandAll}
          className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
        >
          Collapse All
        </button>
      </motion.div>

      {/* Layout: TOC sidebar + Content */}
      <div className="flex gap-6">
        {/* Table of Contents Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden lg:block w-56 flex-shrink-0"
        >
          <div className="glass-panel overflow-hidden sticky top-24">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Contents</p>
            </div>
            <nav className="py-2">
              {HELP_SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                const isFiltered = filteredSections.find((s) => s.id === section.id);
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm transition-all ${
                      !isFiltered
                        ? 'text-gray-600 opacity-50'
                        : isActive
                        ? 'text-white bg-white/[0.06]'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                    disabled={!isFiltered}
                  >
                    <span className="text-xs">{section.icon}</span>
                    <span className="truncate">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {filteredSections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-12 text-center"
            >
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-sm text-gray-400">
                No help topics match &quot;<span className="text-white">{search}</span>&quot;
              </p>
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear search
              </button>
            </motion.div>
          ) : (
            filteredSections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                id={`help-${section.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.06, duration: 0.35 }}
                className="glass-panel overflow-hidden scroll-mt-24"
                onViewportEnter={() => setActiveSection(section.id)}
              >
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                  <span className="text-lg">{section.icon}</span>
                  <h2 className="text-sm font-semibold text-white">{section.title}</h2>
                  <span className="ml-auto text-xs text-gray-600 font-mono">
                    {section.content.length} {section.content.length === 1 ? 'topic' : 'topics'}
                  </span>
                </div>
                <div>
                  {section.content.map((item, i) => (
                    <AccordionItem
                      key={i}
                      item={item}
                      isOpen={openItems.has(`${section.id}-${i}`)}
                      onToggle={() => toggleItem(`${section.id}-${i}`)}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
