import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  createdAt: string;
  product: {
    id: number;
    name: string;
    price: string;
    salePrice?: string;
    imageUrl: string;
    vendorId: number;
    stock: number;
  };
}

interface AddToCartData {
  productId: number;
  quantity: number;
}

export function useCart() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Get cart items
  const {
    data: cartItems,
    isLoading,
    error,
  } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    enabled: !!user, // Only fetch cart when user is logged in
  });

  // Add item to cart
  const addToCart = useMutation({
    mutationFn: async (data: AddToCartData) => {
      const res = await apiRequest("POST", "/api/cart", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Success",
        description: "Item added to cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  // Update cart item quantity
  const updateCartItem = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const res = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart item",
        variant: "destructive",
      });
    },
  });

  // Remove item from cart
  const removeFromCart = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  // Clear entire cart
  const clearCart = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Success",
        description: "Cart cleared",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
        variant: "destructive",
      });
    },
  });

  // Calculate cart totals
  const cartSummary = {
    itemCount: cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    subtotal: cartItems?.reduce((sum, item) => {
      const price = parseFloat(item.product.salePrice || item.product.price);
      return sum + (price * item.quantity);
    }, 0) || 0,
    get shipping() {
      return this.subtotal > 0 ? 15.00 : 0;
    },
    get tax() {
      return this.subtotal * 0.08; // 8% tax
    },
    get total() {
      return this.subtotal + this.shipping + this.tax;
    },
  };

  return {
    cartItems: cartItems || [],
    cartSummary,
    isLoading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}
