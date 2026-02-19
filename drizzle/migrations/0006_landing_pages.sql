-- Phase 8.1: Landing Pages
CREATE TABLE IF NOT EXISTS landing_pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  title_fr VARCHAR(200),
  slug VARCHAR(200) NOT NULL UNIQUE,
  sections JSON NOT NULL,
  meta_title VARCHAR(200),
  meta_title_fr VARCHAR(200),
  meta_description TEXT,
  meta_description_fr TEXT,
  og_image TEXT,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  created_by INT,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_lp_slug (slug),
  INDEX idx_lp_status (status),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
