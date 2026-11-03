-- v2 form submissions (docs/v2/06-TECH-SPEC.md §2). Applied with `wrangler d1 migrations apply DB`.
-- file_keys is added to the spec's schema: proposals carry a brief and applications up to three documents, so all
-- R2 keys are listed there (cv_key still holds the CV, as the spec names it). Rows are deleted after 6 months.
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,                 -- uuid
  ref TEXT UNIQUE NOT NULL,            -- e.g. SCS-2611-7F3K (human reference)
  form TEXT NOT NULL,                  -- enquiry | proposal | career | expert
  request_type TEXT,
  service_id TEXT,                     -- from 03-services.v2.json
  audience TEXT,
  fields TEXT NOT NULL,                -- JSON
  consent INTEGER NOT NULL,            -- 1
  consent_at TEXT NOT NULL,            -- ISO 8601
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_term TEXT, utm_content TEXT,
  posthog_id TEXT,                     -- only when analytics consent given
  cv_key TEXT,                         -- R2 object key (careers only)
  file_keys TEXT,                      -- JSON array of every R2 key for this submission
  status TEXT NOT NULL DEFAULT 'new',  -- new | reviewed | replied | closed
  created_at TEXT NOT NULL
);
CREATE INDEX idx_sub_created ON submissions(created_at);
CREATE INDEX idx_sub_form ON submissions(form);
