-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Wardrobes table (user's wardrobe collections)
CREATE TABLE IF NOT EXISTS wardrobes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garments table (clothing items)
CREATE TABLE IF NOT EXISTS garments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wardrobe_id UUID REFERENCES wardrobes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'pants', 'shirt', 'dress', 'jacket'
  color TEXT,
  material TEXT,
  size TEXT,
  photo_url TEXT, -- URL in Supabase Storage
  ai_tags TEXT[], -- Array of AI-detected tags
  manual_tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Outfits table (combinations of garments)
CREATE TABLE IF NOT EXISTS outfits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  garment_ids UUID[] NOT NULL, -- Array of garment IDs
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  wore_date DATE
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  garments_limit INT DEFAULT 25, -- Free tier limit
  is_premium BOOLEAN DEFAULT FALSE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wardrobes_user_id ON wardrobes(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobes_created_at ON wardrobes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_garments_user_id ON garments(user_id);
CREATE INDEX IF NOT EXISTS idx_garments_wardrobe_id ON garments(wardrobe_id);
CREATE INDEX IF NOT EXISTS idx_garments_created_at ON garments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_garments_category ON garments(category);
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_created_at ON outfits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Enable Row Level Security
ALTER TABLE wardrobes ENABLE ROW LEVEL SECURITY;
ALTER TABLE garments ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wardrobes
CREATE POLICY "Users can view own wardrobes" ON wardrobes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wardrobes" ON wardrobes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wardrobes" ON wardrobes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wardrobes" ON wardrobes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for garments
CREATE POLICY "Users can view own garments" ON garments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own garments" ON garments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own garments" ON garments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own garments" ON garments
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for outfits
CREATE POLICY "Users can view own outfits" ON outfits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outfits" ON outfits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outfits" ON outfits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own outfits" ON outfits
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" ON user_settings
  FOR DELETE USING (auth.uid() = user_id);
