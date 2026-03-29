-- Young Empire Unified Store Migration
-- Run this in Supabase SQL Editor

-- Merch products (synced from Printful, managed by admin)
CREATE TABLE IF NOT EXISTS merch_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT DEFAULT 'Young Empire',
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}', -- array of image URLs
  sizes TEXT[] DEFAULT '{S,M,L,XL,2XL}',
  printful_product_id TEXT, -- Printful sync product ID for order fulfillment
  printful_variant_ids JSONB DEFAULT '{}', -- map of size → Printful variant ID
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out')),
  category TEXT DEFAULT 'tee', -- tee, hoodie, hat, etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders (created when checkout completes)
CREATE TABLE IF NOT EXISTS merch_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- nullable for guest checkout
  email TEXT NOT NULL,
  stripe_payment_id TEXT,
  printful_order_id TEXT,
  items JSONB NOT NULL, -- array of {product_id, title, size, quantity, price}
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'fulfilling', 'shipped', 'delivered', 'cancelled')),
  tracking_number TEXT,
  tracking_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_merch_products
    BEFORE UPDATE ON merch_products
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_merch_orders
    BEFORE UPDATE ON merch_orders
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- Row Level Security
ALTER TABLE merch_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_orders ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "Public read active products" ON merch_products 
    FOR SELECT USING (status = 'active');

-- Admins can do everything with products
CREATE POLICY "Admin manage products" ON merch_products 
    FOR ALL 
    TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    ));

-- Users can read their own orders
CREATE POLICY "Users read own orders" ON merch_orders 
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

-- Admins can read all orders
CREATE POLICY "Admin read all orders" ON merch_orders 
    FOR SELECT 
    TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    ));

-- Orders can be created by anyone (guest checkout support)
CREATE POLICY "Anyone can create orders" ON merch_orders 
    FOR INSERT 
    WITH CHECK (true);

-- Insert sample products for Young Empire brands
INSERT INTO merch_products (title, description, brand, price, images, category, printful_product_id) VALUES
('Sauce Caviar Luxury Tee', 'Premium Sauce Caviar lifestyle brand tee', 'Sauce Caviar', 39.99, 
 ARRAY['https://via.placeholder.com/400x400/1a1a2e/ffffff?text=SAUCE+CAVIAR'], 'tee', 'sample_sc1'),
('Sauce Caviar Elite Hoodie', 'Luxury Sauce Caviar hoodie for the discerning individual', 'Sauce Caviar', 69.99, 
 ARRAY['https://via.placeholder.com/400x400/1a1a2e/ffffff?text=SC+HOODIE'], 'hoodie', 'sample_sc2'),

('Trap Glow Wellness Tee', 'Trap Glow beauty and wellness lifestyle tee', 'Trap Glow', 34.99, 
 ARRAY['https://via.placeholder.com/400x400/FF00FF/ffffff?text=TRAP+GLOW'], 'tee', 'sample_tg1'),
('Trap Glow Glow-Up Hoodie', 'Empower your glow-up journey with Trap Glow', 'Trap Glow', 64.99, 
 ARRAY['https://via.placeholder.com/400x400/FF00FF/ffffff?text=GLOW+UP'], 'hoodie', 'sample_tg2'),

('Trap Frequency Audio Tee', 'Trap Frequency music and creative platform tee', 'Trap Frequency', 32.99, 
 ARRAY['https://via.placeholder.com/400x400/4ecdc4/000000?text=FREQUENCY'], 'tee', 'sample_tf1'),
('Trap Frequency Beat Creator Hoodie', 'For the music creators and audio enthusiasts', 'Trap Frequency', 62.99, 
 ARRAY['https://via.placeholder.com/400x400/4ecdc4/000000?text=BEATS'], 'hoodie', 'sample_tf2'),

('SauceWire Digital Tee', 'SauceWire digital media and news platform tee', 'SauceWire', 29.99, 
 ARRAY['https://via.placeholder.com/400x400/00FFFF/000000?text=SAUCEWIRE'], 'tee', 'sample_sw1'),
('SauceWire News Hoodie', 'Stay connected with SauceWire digital media', 'SauceWire', 59.99, 
 ARRAY['https://via.placeholder.com/400x400/00FFFF/000000?text=DIGITAL+NEWS'], 'hoodie', 'sample_sw2'),

('Young Empire Family Tee', 'Official Young Empire family business group tee', 'Young Empire', 37.99, 
 ARRAY['https://via.placeholder.com/400x400/000000/FFD700?text=YOUNG+EMPIRE'], 'tee', 'sample_ye1'),
('Young Empire Dynasty Hoodie', 'Build your empire with the family', 'Young Empire', 67.99, 
 ARRAY['https://via.placeholder.com/400x400/000000/FFD700?text=DYNASTY'], 'hoodie', 'sample_ye2')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_merch_products_status ON merch_products(status);
CREATE INDEX IF NOT EXISTS idx_merch_products_brand ON merch_products(brand);
CREATE INDEX IF NOT EXISTS idx_merch_products_category ON merch_products(category);
CREATE INDEX IF NOT EXISTS idx_merch_orders_user_id ON merch_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_merch_orders_status ON merch_orders(status);
CREATE INDEX IF NOT EXISTS idx_merch_orders_created_at ON merch_orders(created_at);

COMMENT ON TABLE merch_products IS 'Young Empire merchandise products synced from Printful';
COMMENT ON TABLE merch_orders IS 'Customer orders processed through Stripe and fulfilled via Printful';