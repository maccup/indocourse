CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  terms_consent INTEGER NOT NULL DEFAULT 0,
  marketing_consent INTEGER NOT NULL DEFAULT 0,
  consent_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  email_sent_at TEXT,
  download_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_locale ON subscribers(locale);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at);
