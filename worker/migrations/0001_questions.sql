CREATE TABLE questions (
  id INTEGER PRIMARY KEY,
  lang TEXT NOT NULL CHECK (lang IN ('en', 'es')),
  category TEXT NOT NULL CHECK (category IN ('chill', 'spicy', 'unhinged', 'hotseat', 'date')),
  text TEXT NOT NULL,
  UNIQUE (lang, category, text)
);

CREATE INDEX questions_lang_category ON questions (lang, category);
