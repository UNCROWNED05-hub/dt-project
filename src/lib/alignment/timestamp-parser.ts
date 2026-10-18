/**
 * src/lib/alignment/timestamp-parser.ts
 *
 * Robust, deterministic parser for YouTube creator chapter markers from descriptions:
 * - Supports formats: m:ss, mm:ss, h:mm:ss, hh:mm:ss
 * - Optional brackets, parenthesis, dashes, bullets: [01:23], (1:23), 01:23 - Title, • 01:23 Title
 * - Strictly ignores times embedded inside narrative sentences
 * - Requires at least 3 markers in strictly increasing order
 */

import { CreatorMarker } from './types';

// Matches time pattern at line start or after bullet/bracket
const TIMESTAMP_REGEX = /(?:^|[•\-\*\[\(]\s*|\n\s*)(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:\s*[\]\)\-:\.]|\s+)/;

export function parseSeconds(timeStr: string): number {
  const parts = timeStr.trim().split(':').map((p) => parseInt(p, 10));
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
  }
  if (parts.length === 2) {
    const [m, s] = parts;
    return m * 60 + s;
  }
  return 0;
}

export function formatSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const ss = s < 10 ? `0${s}` : `${s}`;
  if (h > 0) {
    const mm = m < 10 ? `0${m}` : `${m}`;
    return `${h}:${mm}:${ss}`;
  }
  return `${m}:${ss}`;
}

/**
 * Checks if a line is a conversational sentence with an embedded time rather than a chapter marker.
 * Example of invalid: "We arrived at 12:30 and had lunch."
 * Example of valid: "12:30 Gradient Descent Algorithm"
 */
function isConversationalSentence(line: string, timeIdx: number): boolean {
  const before = line.slice(0, timeIdx).trim();
  // If there are multiple normal words before the timestamp without bullets/brackets, it's likely a sentence
  if (before.length > 0 && !/^[\s•\-\*\#\[\(]+$/.test(before)) {
    const wordsBefore = before.split(/\s+/).filter(Boolean);
    if (wordsBefore.length > 2) {
      return true;
    }
  }

  // If line ends with sentence punctuation and no clear title
  const after = line.slice(timeIdx).trim();
  if (/\b(?:am|pm|hours|minutes|seconds|o'clock)\b/i.test(after)) {
    return true;
  }

  return false;
}

export function parseCreatorTimestamps(description: string): CreatorMarker[] {
  if (!description || typeof description !== 'string') return [];

  const rawLines = description.split(/\r?\n/);
  const candidateMarkers: CreatorMarker[] = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Search for timestamp patterns in this line
    // Regex matches: (h:mm:ss or mm:ss or m:ss)
    const match = trimmed.match(/(?:^|[\[\(•\-\*\s])(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d)(?:[\]\)\-:\.]|\s|$)/);
    if (!match) continue;

    const matchedTime = match[0].trim().replace(/^[\[\(•\-\*\s]+/, '').replace(/[\]\)\-:\.\s]+$/, '');
    const timeIndex = trimmed.indexOf(matchedTime);

    if (isConversationalSentence(trimmed, timeIndex)) {
      continue;
    }

    // Extract title portion
    let titlePortion = trimmed
      .replace(match[0], ' ')
      .replace(/^[\s•\-\*:#\|\/\]\)]+/, '')
      .replace(/[\s•\-\*:#\|\/\[\(]+$/, '')
      .trim();

    // If title was on the left of timestamp (e.g. "Introduction 0:00")
    if (!titlePortion && timeIndex > 0) {
      titlePortion = trimmed.slice(0, timeIndex).replace(/[\s•\-\*:#\|\/\[\(]+$/, '').trim();
    }

    const seconds = parseSeconds(matchedTime);

    if (titlePortion.length > 0) {
      candidateMarkers.push({
        seconds,
        timeStr: matchedTime,
        title: titlePortion,
      });
    }
  }

  if (candidateMarkers.length < 3) {
    return [];
  }

  // Filter for strictly increasing sequence
  const validSequence: CreatorMarker[] = [];
  let lastSeconds = -1;

  for (const marker of candidateMarkers) {
    if (marker.seconds > lastSeconds) {
      validSequence.push(marker);
      lastSeconds = marker.seconds;
    }
  }

  // Enforce rule: require at least 3 markers in strictly increasing order
  if (validSequence.length >= 3) {
    return validSequence;
  }

  return [];
}
