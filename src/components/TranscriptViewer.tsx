'use client';

import { useState } from 'react';
import styles from './TranscriptViewer.module.css';

interface TranscriptSegment {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  onSeek?: (time: number) => void;
  currentTime?: number;
}

export default function TranscriptViewer({ 
  segments, 
  onSeek, 
  currentTime = 0 
}: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);

  // Get unique speakers
  const speakers = Array.from(new Set(segments.map(s => s.speaker).filter(Boolean)));

  // Filter segments
  const filteredSegments = segments.filter(segment => {
    const matchesSearch = segment.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpeaker = !selectedSpeaker || segment.speaker === selectedSpeaker;
    return matchesSearch && matchesSpeaker;
  });

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if segment is active
  const isActive = (segment: TranscriptSegment) => {
    return currentTime >= segment.start && currentTime <= segment.end;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Transcript</h3>
        <div className={styles.controls}>
          {/* Search */}
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          
          {/* Speaker filter */}
          {speakers.length > 0 && (
            <select
              value={selectedSpeaker || ''}
              onChange={(e) => setSelectedSpeaker(e.target.value || null)}
              className={styles.speakerFilter}
            >
              <option value="">All Speakers</option>
              {speakers.map(speaker => (
                <option key={speaker} value={speaker}>
                  {speaker}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Segments */}
      <div className={styles.segments}>
        {filteredSegments.length === 0 ? (
          <div className={styles.empty}>
            <p>No transcript segments found</p>
          </div>
        ) : (
          filteredSegments.map((segment) => (
            <div
              key={segment.id}
              className={`${styles.segment} ${isActive(segment) ? styles.active : ''}`}
              onClick={() => onSeek?.(segment.start)}
            >
              <div className={styles.segmentHeader}>
                <span className={styles.timestamp}>
                  {formatTime(segment.start)}
                </span>
                {segment.speaker && (
                  <span className={styles.speaker}>
                    {segment.speaker}
                  </span>
                )}
              </div>
              <p className={styles.text}>
                {segment.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <span>{filteredSegments.length} segments</span>
        {segments.length > 0 && (
          <span>
            Duration: {formatTime(segments[segments.length - 1].end)}
          </span>
        )}
      </div>
    </div>
  );
}

