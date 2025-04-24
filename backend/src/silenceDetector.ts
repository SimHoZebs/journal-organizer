import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

interface SilenceInterval {
  start: number;
  end: number;
}

/**
 * Detects all silent intervals in an audio file.
 *
 * @param {string} inputPath - Path to the source audio file.
 * @param {number} thresholdDb - Silence threshold in decibels (e.g. -40).
 * @param {number} minDuration - Minimum silence duration in seconds (e.g. 1.5).
 * @returns {Promise<Array<{ start: number, end: number }>>}
 */
export default async function detectSilence(
  inputPath: string,
  thresholdDb: number,
  minDuration: number
): Promise<SilenceInterval[]> {
  if (typeof inputPath !== 'string') throw new Error('inputPath must be a string');
  if (typeof thresholdDb !== 'number' || typeof minDuration !== 'number') {
    throw new Error('thresholdDb and minDuration must be numbers');
  }

  ffmpeg.setFfmpegPath(ffmpegStatic as string); // Cast ffmpegStatic to string
  const intervals: SilenceInterval[] = [];
  let currentStart: number | null = null;

  return new Promise<SilenceInterval[]>((resolve, reject) => {
    const command = ffmpeg(inputPath)
      .audioFilters(`silencedetect=n=${thresholdDb}dB:d=${minDuration}`)
      .format('null')
      .output('-');

    command
      .on('stderr', (line: Buffer | string) => { // Add type for line
        const text = line.toString();
        const matchStart = /silence_start: ([\d.]+)/.exec(text);
        if (matchStart) {
          currentStart = Number.parseFloat(matchStart[1]);
        }
        const matchEnd = /silence_end: ([\d.]+) \| silence_duration: [\d.]+/.exec(text);
        if (matchEnd) {
          const end = Number.parseFloat(matchEnd[1]);
          if (currentStart !== null) {
            intervals.push({ start: currentStart, end });
            currentStart = null;
          }
        }
      })
      .on('error', (err: Error) => reject(new Error(`FFmpeg error: ${err.message}`))) // Add type for err
      .on('end', () => {
        if (currentStart !== null) {
          // Consider logging this differently or handling it based on requirements
          console.warn(`Audio ended during silence starting at ${currentStart}`);
        }
        resolve(intervals);
      })
      .run();
  });
}