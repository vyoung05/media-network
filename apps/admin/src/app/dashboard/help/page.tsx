'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuideSection {
  id: string;
  icon: string;
  title: string;
  description: string;
  steps: { title: string; detail: string }[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'getting-started',
    icon: '🚀',
    title: 'Getting Started',
    description: 'Welcome to the Media Network Admin Dashboard. Here\'s how to get up and running.',
    steps: [
      {
        title: 'Log in with your credentials',
        detail: 'Use the email and password provided by your admin. If you don\'t have an account, ask your team admin to create one for you in the Users section.',
      },
      {
        title: 'Select your brand',
        detail: 'Use the Brand Switcher in the left sidebar to filter content by brand (SauceWire, SauceCaviar, TrapGlow, TrapFrequency). Select "All Brands" to see everything at once.',
      },
      {
        title: 'Explore the dashboard',
        detail: 'The main dashboard shows your stats, recent activity, brand overview, and announcements. Use the sidebar to navigate to different sections.',
      },
    ],
  },
  {
    id: 'creating-content',
    icon: '✏️',
    title: 'Creating & Publishing Articles',
    description: 'Write articles for any of your four brands with brand-specific fields and live preview.',
    steps: [
      {
        title: 'Click "Content Queue" → "New Article"',
        detail: 'Or use the Quick Action on the dashboard. This opens the article editor.',
      },
      {
        title: 'Select your target brand',
        detail: 'Choose which brand this article is for. The form fields change based on the brand — SauceWire has news fields, TrapGlow has artist fields, etc.',
      },
      {
        title: 'Fill in the article details',
        detail: 'Add the title, body content, excerpt, category, tags, and cover image. Brand-specific fields (like BPM for TrapFrequency beats) will appear automatically.',
      },
      {
        title: 'Preview in real-time',
        detail: 'The right panel shows a live preview of exactly how the article will look on the brand\'s website as you type.',
      },
      {
        title: 'Save as draft or publish',
        detail: 'Drafts are saved but not visible on the website. Published articles go live immediately on the brand\'s site and trigger TTS audio generation automatically.',
      },
    ],
  },
  {
    id: 'content-queue',
    icon: '📋',
    title: 'Managing the Content Queue',
    description: 'Review, approve, reject, and manage articles across all brands.',
    steps: [
      {
        title: 'View articles by status',
        detail: 'The Content Queue shows all articles. Filter by Draft, Pending Review, Published, or Rejected using the status tabs.',
      },
      {
        title: 'Approve or reject articles',
        detail: 'Click on an article to review it. Use the approve/reject buttons to change its status. Approved articles can then be published.',
      },
      {
        title: 'Edit existing articles',
        detail: 'Click the edit icon on any article to update its content, change metadata, or fix issues before publishing.',
      },
      {
        title: 'Filter by brand',
        detail: 'Use the sidebar brand switcher to see only articles for a specific brand.',
      },
    ],
  },
  {
    id: 'submissions',
    icon: '📥',
    title: 'Handling Submissions',
    description: 'Review content submitted by external writers and contributors.',
    steps: [
      {
        title: 'Check the Submissions page',
        detail: 'This shows articles submitted by writers who aren\'t part of the core team. Review their content before it enters the publishing pipeline.',
      },
      {
        title: 'Accept or reject',
        detail: 'Accept good submissions to move them into the Content Queue. Reject submissions that don\'t meet quality standards.',
      },
      {
        title: 'Track submission counts',
        detail: 'The page header shows totals for pending, approved, and rejected submissions so you can see what needs attention.',
      },
    ],
  },
  {
    id: 'users',
    icon: '👥',
    title: 'Managing Users',
    description: 'Add team members, assign roles, and control brand access.',
    steps: [
      {
        title: 'Navigate to the Users page',
        detail: 'Find it in the sidebar under "Users". This shows all team members with their roles and brand assignments.',
      },
      {
        title: 'Create a new user',
        detail: 'Click "Add User" and fill in their name, email, password, role (Admin/Editor/Writer/Reader), and which brands they can access.',
      },
      {
        title: 'Understanding roles',
        detail: '• Admin — full access to everything including user management\n• Editor — can review, approve, and publish content\n• Writer — can create and submit articles for review\n• Reader — view-only access to the dashboard',
      },
      {
        title: 'Edit or remove users',
        detail: 'Use the edit icon to change roles, brand access, or reset passwords. Use the delete icon to remove a user entirely.',
      },
    ],
  },
  {
    id: 'writers',
    icon: '🖊️',
    title: 'Writer Management',
    description: 'Track your writing team and their contributions.',
    steps: [
      {
        title: 'View all writers',
        detail: 'The Writers page shows everyone with writer or editor roles, including their brand affiliations and article counts.',
      },
      {
        title: 'Filter by brand',
        detail: 'See who\'s writing for which brand. Writers can be affiliated with one or more brands.',
      },
    ],
  },
  {
    id: 'brands',
    icon: '🎨',
    title: 'Brand Overview',
    description: 'Understanding the four brands in your Media Network.',
    steps: [
      {
        title: 'SauceWire (🔴)',
        detail: 'Culture news wire — breaking news, trending stories, entertainment, sports, tech, fashion. Fast-paced, wire-service style.',
      },
      {
        title: 'SauceCaviar (🟡)',
        detail: 'Luxury lifestyle magazine — issue-based content, high-end photography, fashion, culture. Premium editorial style.',
      },
      {
        title: 'TrapGlow (🟣)',
        detail: 'Music discovery & artist spotlights — emerging artists, streaming links, genre breakdowns. Music-forward content.',
      },
      {
        title: 'TrapFrequency (🟢)',
        detail: 'Production & beats — tutorials, beat showcases, gear reviews, producer spotlights. Technical music production content.',
      },
    ],
  },
  {
    id: 'automation',
    icon: '🤖',
    title: 'Automation Features',
    description: 'Built-in automations that work behind the scenes.',
    steps: [
      {
        title: 'TTS Audio Generation',
        detail: 'When you publish an article, the system automatically generates a text-to-speech audio version using brand-specific voices. Audio appears on the article page with a player.',
      },
      {
        title: 'Brand Routing',
        detail: 'Articles automatically appear on the correct website based on their brand assignment. No manual deployment needed.',
      },
      {
        title: 'Real-time Updates',
        detail: 'Dashboard stats, notifications, and content queues update automatically. No need to refresh.',
      },
    ],
  },
];

export default function HelpPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('getting-started');

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Help Guide</h1>
        <p className="text-sm text-gray-500 mt-1">
          Everything you need to know about using the Media Network Admin Dashboard
        </p>
      </div>

      {/* Quick nav */}
      <div className="glass-panel p-4">
        <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">Jump to</p>
        <div className="flex flex-wrap gap-2">
          {GUIDE_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setExpandedSection(section.id);
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                expandedSection === section.id
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {GUIDE_SECTIONS.map((section) => {
          const isExpanded = expandedSection === section.id;
          return (
            <div key={section.id} id={section.id} className="glass-panel overflow-hidden">
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-2xl">{section.icon}</span>
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-white">{section.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
                </div>
                <motion.svg
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  className="w-5 h-5 text-gray-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-4 border-t border-white/[0.06] pt-4">
                      {section.steps.map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-400">{i + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{step.title}</p>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed whitespace-pre-line">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="glass-panel p-6 text-center">
        <p className="text-sm text-gray-400">
          Need more help? Contact your admin or check the system announcements on the dashboard.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Media Network Admin v1.0 — The Young Empire © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
