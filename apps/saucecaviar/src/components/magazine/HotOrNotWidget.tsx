'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist_name: string;
  cover_image: string;
  genre: string;
  hot_count: number;
  not_count: number;
  total_votes: number;
  hot_percentage: number;
  spotify_url?: string;
  apple_music_url?: string;
  soundcloud_url?: string;
  youtube_url?: string;
  preview_url?: string;
}

interface HotOrNotWidgetProps {
  issueId?: string;
  tracks?: Track[];
}

function getFingerprint(): string {
  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const screen = typeof window !== 'undefined' ? window.screen : null;
  const raw = [
    nav?.userAgent || '',
    nav?.language || '',
    screen?.width || 0,
    screen?.height || 0,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    new Date().getTimezoneOffset(),
  ].join('|');
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  return `fp_${Math.abs(hash).toString(36)}`;
}

function VoteCard({ track, onVote, voted }: { track: Track; onVote: (vote: 'hot' | 'not') => void; voted: 'hot' | 'not' | null }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const hotOpacity = useTransform(x, [0, 100], [0, 1]);
  const notOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (voted) return;
    if (info.offset.x > 80) {
      onVote('hot');
    } else if (info.offset.x < -80) {
      onVote('not');
    }
  };

  const hotPct = track.total_votes > 0 ? track.hot_percentage : 50;

  return (
    <motion.div
      className="relative w-full max-w-[320px] mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: 30 }}
      transition={{ duration: 0.4 }}
    >
      {/* Swipeable card */}
      <motion.div
        drag={voted ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{ x, rotate }}
        className="relative cursor-grab active:cursor-grabbing touch-manipulation"
        whileTap={{ scale: voted ? 1 : 0.98 }}
      >
        {/* Card container */}
        <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/[0.08] shadow-2xl">
          {/* Cover art */}
          <div className="relative aspect-square overflow-hidden">
            {track.cover_image ? (
              <img
                src={track.cover_image}
                alt={`${track.title} by ${track.artist_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#C9A84C]/30 to-[#1a1a1a] flex items-center justify-center">
                <span className="text-6xl">🎵</span>
              </div>
            )}

            {/* Hot/Not swipe indicators */}
            {!voted && (
              <>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent to-emerald-500/40 flex items-center justify-end pr-8"
                  style={{ opacity: hotOpacity }}
                >
                  <span className="text-5xl">🔥</span>
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-l from-transparent to-red-500/40 flex items-center justify-start pl-8"
                  style={{ opacity: notOpacity }}
                >
                  <span className="text-5xl">❄️</span>
                </motion.div>
              </>
            )}

            {/* Voted overlay */}
            {voted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute inset-0 flex items-center justify-center ${
                  voted === 'hot' ? 'bg-emerald-500/30' : 'bg-red-500/30'
                }`}
              >
                <span className="text-7xl">{voted === 'hot' ? '🔥' : '❄️'}</span>
              </motion.div>
            )}

            {/* Genre badge */}
            {track.genre && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] uppercase tracking-wider text-[#C9A84C] font-semibold">
                {track.genre}
              </div>
            )}
          </div>

          {/* Info section */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-white truncate">{track.title}</h3>
            <p className="text-sm text-white/50 truncate">{track.artist_name}</p>

            {/* Vote results bar (shows after voting or if track has votes) */}
            {(voted || track.total_votes > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: voted ? 0.3 : 0 }}
                className="mt-3"
              >
                {/* Results bar */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-emerald-400 font-semibold">🔥 {hotPct}%</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${hotPct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-xs text-red-400 font-semibold">{100 - hotPct}% ❄️</span>
                </div>
                <p className="text-[10px] text-white/30 text-center">
                  {track.total_votes} vote{track.total_votes !== 1 ? 's' : ''}
                </p>
              </motion.div>
            )}

            {/* Streaming links */}
            {(track.spotify_url || track.apple_music_url || track.soundcloud_url) && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                <span className="text-[9px] uppercase tracking-wider text-white/20 mr-auto">Listen</span>
                {track.spotify_url && (
                  <a href={track.spotify_url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                  </a>
                )}
                {track.apple_music_url && (
                  <a href={track.apple_music_url} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0019.7.296C18.89.063 18.06.015 17.23 0H6.77C5.94.015 5.11.063 4.3.296a5.022 5.022 0 00-1.87.595C1.312 1.624.567 2.624.25 3.934a9.23 9.23 0 00-.24 2.19c-.028.86-.01 1.72-.01 2.58v6.6c0 .86-.018 1.72.01 2.58a9.23 9.23 0 00.24 2.19c.317 1.31 1.062 2.31 2.18 3.043a5.022 5.022 0 001.87.596c.81.232 1.64.28 2.47.296h10.46c.83-.015 1.66-.063 2.47-.296a5.022 5.022 0 001.87-.596c1.118-.733 1.863-1.733 2.18-3.043.157-.7.228-1.42.24-2.19.028-.86.01-1.72.01-2.58v-6.6c0-.86.018-1.72-.01-2.58zM16.75 17.74a.638.638 0 01-.675.615.662.662 0 01-.175-.025 4.937 4.937 0 01-.95-.37c-.59-.29-1.03-.41-1.73-.41-.61 0-1.03.24-1.03.71 0 .46.36.68.96.84l.94.28c1.63.44 2.43 1.22 2.43 2.61 0 1.79-1.45 2.76-3.4 2.76a6.27 6.27 0 01-2.41-.5c-.279-.12-.44-.32-.44-.61a.623.623 0 01.59-.65c.07 0 .14.01.21.04a5.128 5.128 0 001.92.44c.73 0 1.19-.28 1.19-.77 0-.44-.32-.66-1.01-.86l-.89-.26c-1.52-.44-2.42-1.19-2.42-2.59 0-1.66 1.34-2.73 3.26-2.73.73 0 1.51.16 2.22.45.27.1.45.33.45.63zM11 12.82l-1.72.43c-.91.23-1.46.83-1.46 1.72 0 .82.55 1.38 1.31 1.38.31 0 .61-.07.93-.2.57-.24.94-.7.94-1.34v-2zm1.25-1.41V17c0 1.23-.44 1.96-1.14 2.4-.62.4-1.44.6-2.26.6-1.19 0-2.28-.54-2.28-1.93 0-1.3.83-2.04 2.34-2.42l1.84-.46v-.39c0-.78-.47-1.15-1.28-1.15-.62 0-1.07.14-1.65.4a.54.54 0 01-.22.05.5.5 0 01-.5-.5c0-.2.1-.37.31-.47.63-.3 1.37-.5 2.21-.5 1.63 0 2.63.82 2.63 2.38z"/></svg>
                  </a>
                )}
                {track.soundcloud_url && (
                  <a href={track.soundcloud_url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.057-.05-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.31c.013.057.045.09.104.09.057 0 .09-.035.099-.09l.201-1.31-.186-1.332c-.009-.06-.045-.094-.1-.094m1.818-1.154c-.063 0-.1.044-.107.1l-.196 2.48.196 2.404c.007.06.044.1.107.1.059 0 .1-.04.104-.1l.226-2.404-.226-2.48c-.004-.06-.045-.1-.104-.1m.89-.414c-.063 0-.112.05-.118.109l-.168 2.894.168 2.563c.006.063.055.109.118.109s.112-.046.117-.109l.189-2.563-.189-2.894c-.005-.063-.054-.109-.117-.109m.937-.374c-.074 0-.12.05-.124.117l-.15 3.268.15 2.633c.004.067.05.117.124.117.07 0 .118-.05.123-.117l.168-2.633-.168-3.268c-.005-.067-.053-.117-.123-.117m.912-.344c-.076 0-.128.059-.132.127l-.13 3.612.13 2.668c.004.072.056.127.132.127s.127-.055.131-.127l.15-2.668-.15-3.612c-.004-.068-.055-.127-.131-.127m.937-.324c-.08 0-.135.059-.138.133l-.112 3.936.112 2.688c.003.074.058.133.138.133.078 0 .133-.059.137-.133l.126-2.688-.126-3.936c-.004-.074-.059-.133-.137-.133m.932-.25c-.086 0-.139.062-.143.14l-.093 4.186.093 2.7c.004.08.057.14.143.14.084 0 .14-.06.143-.14l.104-2.7-.104-4.186c-.003-.078-.059-.14-.143-.14m.929-.158c-.088 0-.147.068-.15.148l-.074 4.344.074 2.7c.003.084.062.148.15.148.084 0 .146-.064.148-.148l.086-2.7-.086-4.344c-.002-.08-.064-.148-.148-.148m2.812-.084c-.1 0-.162.074-.166.164l-.054 4.264.054 2.668c.004.09.066.164.166.164.098 0 .16-.074.162-.164l.062-2.668-.062-4.264c-.002-.09-.064-.164-.162-.164m-.928.036c-.094 0-.158.07-.162.156l-.063 4.228.063 2.68c.004.088.068.156.162.156.092 0 .156-.068.16-.156l.07-2.68-.07-4.228c-.004-.086-.068-.156-.16-.156m1.856-.072c-.104 0-.17.078-.172.172l-.038 4.3.038 2.65c.002.094.068.172.172.172.1 0 .168-.078.17-.172l.042-2.65-.042-4.3c-.002-.094-.07-.172-.17-.172m.924.014c-.106 0-.174.08-.178.18l-.024 4.286.024 2.63c.004.1.072.18.178.18.104 0 .174-.08.176-.18l.028-2.63-.028-4.286c-.002-.1-.072-.18-.176-.18m.93.064c-.108 0-.18.086-.182.186l-.01 4.222.01 2.61c.002.102.074.186.182.186.106 0 .18-.084.182-.186l.01-2.61-.01-4.222c-.002-.1-.076-.186-.182-.186m4.932 2.56c-.404 0-.794.074-1.154.21-.232-2.62-2.444-4.674-5.152-4.674-.684 0-1.35.133-1.968.38-.264.1-.334.21-.338.416v9.396c.004.208.164.388.372.404h8.24c1.612 0 2.922-1.31 2.922-2.922 0-1.612-1.31-2.922-2.922-2.922"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Vote buttons (below card, for non-swipe users) */}
      {!voted && (
        <motion.div
          className="flex items-center justify-center gap-6 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onVote('not')}
            className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-2xl hover:bg-red-500/30 transition-colors touch-manipulation"
          >
            ❄️
          </motion.button>
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">or swipe</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onVote('hot')}
            className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl hover:bg-emerald-500/30 transition-colors touch-manipulation"
          >
            🔥
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

export function HotOrNotWidget({ issueId, tracks: initialTracks }: HotOrNotWidgetProps) {
  const [tracks, setTracks] = useState<Track[]>(initialTracks || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, 'hot' | 'not'>>({});
  const [loading, setLoading] = useState(!initialTracks);
  const [fingerprint] = useState(() => typeof window !== 'undefined' ? getFingerprint() : '');

  // Load tracks from Supabase if not provided
  useEffect(() => {
    if (initialTracks) return;
    if (!issueId) return;
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    async function loadTracks() {
      try {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/magazine_tracks?issue_id=eq.${issueId}&status=eq.active&order=created_at.asc`,
          { headers: { apikey: supabaseKey!, Authorization: `Bearer ${supabaseKey}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setTracks(data);
        }
      } catch (err) {
        console.error('Failed to load tracks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTracks();
  }, [issueId, initialTracks]);

  const handleVote = useCallback(async (vote: 'hot' | 'not') => {
    const track = tracks[currentIndex];
    if (!track || votes[track.id]) return;

    // Optimistic update
    setVotes(prev => ({ ...prev, [track.id]: vote }));
    setTracks(prev => prev.map(t => {
      if (t.id !== track.id) return t;
      const hot = vote === 'hot' ? t.hot_count + 1 : t.hot_count;
      const total = t.total_votes + 1;
      return { ...t, hot_count: hot, not_count: vote === 'not' ? t.not_count + 1 : t.not_count, total_votes: total, hot_percentage: Math.round((hot / total) * 100) };
    }));

    // Auto-advance after vote (delay for animation)
    setTimeout(() => {
      if (currentIndex < tracks.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }, 1500);

    // Submit to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({ track_id: track.id, vote, fingerprint }),
      });
      // Fallback: insert directly
      if (!res.ok) {
        await fetch(`${supabaseUrl}/rest/v1/magazine_votes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Prefer: 'return=minimal' },
          body: JSON.stringify({ track_id: track.id, vote, voter_fingerprint: fingerprint }),
        });
      }
    } catch (err) {
      console.error('Vote submit failed:', err);
    }
  }, [currentIndex, tracks, votes, fingerprint]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (tracks.length === 0) return null;

  const allVoted = currentIndex >= tracks.length;
  const currentTrack = tracks[currentIndex];

  return (
    <div className="w-full py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white">
          🔥 Hot or Not
        </h2>
        <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]/60 mt-1">
          Rate the tracks · Swipe or tap
        </p>
        {tracks.length > 1 && (
          <p className="text-[10px] text-white/20 mt-2">
            {Math.min(currentIndex + 1, tracks.length)} / {tracks.length}
          </p>
        )}
      </div>

      {/* Progress dots */}
      {tracks.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {tracks.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-[#C9A84C] w-6' :
                votes[t.id] === 'hot' ? 'bg-emerald-500' :
                votes[t.id] === 'not' ? 'bg-red-500' :
                'bg-white/20'
              }`}
            />
          ))}
        </div>
      )}

      {/* Cards */}
      <AnimatePresence mode="wait">
        {allVoted ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <span className="text-5xl mb-4 block">✨</span>
            <h3 className="text-lg font-display text-white mb-1">All Rated!</h3>
            <p className="text-sm text-white/40">Thanks for voting. Check back next issue.</p>

            {/* Summary */}
            <div className="mt-6 space-y-2 max-w-[300px] mx-auto">
              {tracks.map(t => (
                <div key={t.id} className="flex items-center gap-2 text-xs">
                  <span className={votes[t.id] === 'hot' ? 'text-emerald-400' : 'text-red-400'}>
                    {votes[t.id] === 'hot' ? '🔥' : '❄️'}
                  </span>
                  <span className="text-white/70 truncate flex-1 text-left">{t.title}</span>
                  <span className="text-white/30">{t.hot_percentage}% hot</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : currentTrack ? (
          <VoteCard
            key={currentTrack.id}
            track={currentTrack}
            onVote={handleVote}
            voted={votes[currentTrack.id] || null}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
