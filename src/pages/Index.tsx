import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Star, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// Import gem images
import sapphireGem from "@/assets/sapphire-gem.jpg";
import rubyGem from "@/assets/ruby-gem.jpg";
import emeraldGem from "@/assets/emerald-gem.jpg";
import amethystGem from "@/assets/amethyst-gem.jpg";
import diamondGem from "@/assets/diamond-gem.jpg";
import citrineGem from "@/assets/citrine-gem.jpg";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  type: string;
  description: string;
  rating: number;
}

// Map database image paths to actual imported images
const imageMap: Record<string, string> = {
  '/src/assets/sapphire-gem.jpg': sapphireGem,
  '/src/assets/ruby-gem.jpg': rubyGem,
  '/src/assets/emerald-gem.jpg': emeraldGem,
  '/src/assets/amethyst-gem.jpg': amethystGem,
  '/src/assets/diamond-gem.jpg': diamondGem,
  '/src/assets/citrine-gem.jpg': citrineGem,
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');

        if (error) throw error;

        // Map database products to frontend format with correct image paths
        const mappedProducts = data.map(product => ({
          ...product,
          price: Number(product.price),
          image: imageMap[product.image] || product.image,
        }));

        setProducts(mappedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const gemTypes = ["all", ...Array.from(new Set(products.map(p => p.type)))];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "all" || product.type === selectedType;
      
      let matchesPrice = true;
      if (priceRange === "under-1000") matchesPrice = product.price < 1000;
      else if (priceRange === "1000-3000") matchesPrice = product.price >= 1000 && product.price <= 3000;
      else if (priceRange === "over-3000") matchesPrice = product.price > 3000;
      
      return matchesSearch && matchesType && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedType, priceRange, sortBy, products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10">
      <Header />
      <CartSidebar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>This is a Demo Site!</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-luxury to-accent bg-clip-text text-transparent mb-6 leading-tight">
            Discover Rare
            <br />
            <span className="text-4xl md:text-6xl">Gems & Stones</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Curated collection of the most exquisite gems, each piece handpicked for its exceptional beauty and quality.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="px-4 pb-8">
        <div className="container mx-auto">
          <Card className="p-6 shadow-lg bg-card/80 backdrop-blur-sm border-0">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search gems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Gem Type" />
                </SelectTrigger>
                <SelectContent>
                  {gemTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-1000">Under $1,000</SelectItem>
                  <SelectItem value="1000-3000">$1,000 - $3,000</SelectItem>
                  <SelectItem value="over-3000">Over $3,000</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Our Collection</h2>
            {!loading && (
              <Badge variant="secondary" className="text-sm">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
          
          {loading ? (
            <Card className="p-12 text-center">
              <Loader2 className="w-16 h-16 mx-auto text-primary mb-4 animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Loading gems...</h3>
              <p className="text-muted-foreground">Please wait while we fetch our collection.</p>
            </Card>
          ) : error ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <Filter className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Failed to load products</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No gems found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;