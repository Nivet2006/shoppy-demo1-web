-- Create products table for managing gems
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  rating INTEGER DEFAULT 4 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (though we'll make it publicly readable for the shop)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view products (public shop)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Only authenticated users can manage products (for admin functionality later)
CREATE POLICY "Only authenticated users can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete products" 
ON public.products 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_products_updated_at();

-- Insert initial product data
INSERT INTO public.products (name, price, image, type, description, rating) VALUES
('Royal Sapphire', 2500.00, '/src/assets/sapphire-gem.jpg', 'Sapphire', 'Stunning royal blue sapphire with exceptional clarity', 5),
('Crimson Ruby', 3200.00, '/src/assets/ruby-gem.jpg', 'Ruby', 'Brilliant red ruby with perfect cut and fire', 5),
('Emerald Elegance', 2800.00, '/src/assets/emerald-gem.jpg', 'Emerald', 'Magnificent green emerald with natural beauty', 4),
('Purple Amethyst', 850.00, '/src/assets/amethyst-gem.jpg', 'Amethyst', 'Deep purple amethyst with royal quality', 4),
('Perfect Diamond', 5500.00, '/src/assets/diamond-gem.jpg', 'Diamond', 'Flawless white diamond with brilliant sparkle', 5),
('Golden Citrine', 450.00, '/src/assets/citrine-gem.jpg', 'Citrine', 'Warm golden citrine with sunny brilliance', 4);