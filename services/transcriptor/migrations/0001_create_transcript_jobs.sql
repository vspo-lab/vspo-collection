CREATE TABLE transcript_jobs (
  id          TEXT PRIMARY KEY,
  video_id    TEXT NOT NULL,
  lang        TEXT NOT NULL DEFAULT 'ja',
  status      TEXT NOT NULL DEFAULT 'pending',
  r2_key      TEXT,
  error       TEXT,
  event_id    TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE INDEX idx_jobs_status ON transcript_jobs(status);
CREATE INDEX idx_jobs_video_id ON transcript_jobs(video_id);
