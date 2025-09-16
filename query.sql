CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  language VARCHAR(50),
  price DECIMAL(10, 2),
  level VARCHAR(20) NOT NULL CHECK (
    level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')
  ),
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  client_id UUID NOT NULL,
  tags TEXT [] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(225) NOT NULL,
  course_id UUID NOT NULL,
  seq_no INT,
  client_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(id)
);
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  seq_no INT,
  duration VARCHAR(255),
  content_type JSON,
  course_id UUID NOT NULL,
  lesson_id UUID NOT NULL,
  client_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(id),
  CONSTRAINT fk_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  course_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (
    rating >= 1
    AND rating <= 5
  ),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
CREATE TABLE course_user_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID [] NOT NULL,
  user_id UUID [] NOT NULL,
  client_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE section_user_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL,
  section_id UUID NOT NULL,
  lesson_id UUID NOT NULL,
  client_id UUID NOT NULL,
  user_id UUID NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE
);