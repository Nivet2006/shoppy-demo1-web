import { X, Minus, Plus, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartSidebar = () => {
  const { state, closeCart, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();
  
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    closeCart();
    navigate("/payment");
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50 transform transition-transform duration-500 ease-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-luxury/5">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              {getTotalItems() > 0 && (
                <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                  {getTotalItems()} items
                </span>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Add some beautiful gems to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                      <p className="text-sm font-medium text-primary">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center space-x-2 border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t bg-gradient-to-r from-muted/50 to-muted/30 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-luxury shadow-lg hover:shadow-premium transition-all duration-300 text-base py-6"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;