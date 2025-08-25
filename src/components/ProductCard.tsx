import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  type: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: product.type,
    });
    
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
    
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-premium transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card via-card to-muted/20">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            {product.type}
          </span>
          <h3 className="text-xl font-bold mt-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-luxury bg-clip-text text-transparent">
            ₹{product.price.toLocaleString()}
          </span>
          
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-lg hover:shadow-premium transition-all duration-300 group/btn"
          >
            <Plus className={`w-4 h-4 mr-2 transition-transform duration-300 ₹{isAdding ? 'rotate-90' : 'group-hover/btn:rotate-90'}`} />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;