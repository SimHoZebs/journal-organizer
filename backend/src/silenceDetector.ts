import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

interface SilenceInterval {
  start: number;
  end: number;
}

export default function detectSilence(
  inputPath: string,
  thresholdDb: number,
  minDuration: number,
) {
  return new Promise((resolve, reject) => {
    if (!ffmpegStatic) {
      return reject(new Error("ffmpeg-static is not available"));
    }

    ffmpeg.setFfmpegPath(ffmpegStatic);
    const intervals: SilenceInterval[] = [];
    let currentStart: number | null = null;

    const command = ffmpeg(inputPath)
      .audioFilters(`silencedetect=n=${thresholdDb}dB:d=${minDuration}`)
      .format("null")
      .output("-");

    command
      .on("stderr", (line: Buffer | string) => { // Add type for line
        const text = line.toString();
        const matchStart = /silence_start: ([\d.]+)/.exec(text);
        if (matchStart) {
          currentStart = Number.parseFloat(matchStart[1]);
        }
        const matchEnd = /silence_end: ([\d.]+) \| silence_duration: [\d.]+/
          .exec(text);
        if (matchEnd) {
          const end = Number.parseFloat(matchEnd[1]);
          if (currentStart !== null) {
            intervals.push({ start: currentStart, end });
            currentStart = null;
          }
        }
      })
      .on("error", (err: Error) => { // Add type for err
        reject(new Error(`FFmpeg error: ${err.message}`));
      })
      .on("end", () => {
        if (currentStart !== null) {
          console.warn(
            `Audio ended during silence starting at ${currentStart}`,
          );
        }
        resolve(intervals);
      })
      .run(); // Start the process
  }); // End of Promise wrapper
}
