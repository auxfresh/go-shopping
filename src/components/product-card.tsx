import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Star, Heart } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  salePrice?: string;
  imageUrl: string;
  rating: string;
  reviewCount: number;
  vendorId: number;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const currentPrice = product.salePrice || product.price;
  const originalPrice = product.salePrice ? product.price : null;
  const discountPercent = originalPrice ? 
    Math.round(((parseFloat(originalPrice) - parseFloat(currentPrice)) / parseFloat(originalPrice)) * 100) : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      return;
    }

    setIsLoading(true);
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: 1,
      });
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Wishlist functionality would be implemented here
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group cursor-pointer hover:shadow-md transition-shadow overflow-hidden">
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlist}
              className="bg-white p-2 rounded-full shadow-sm hover:shadow-md"
            >
              <Heart className="w-4 h-4 text-slate-400 hover:text-red-500" />
            </Button>
          </div>
          {product.salePrice && (
            <div className="absolute top-3 left-3">
              <Badge variant="destructive" className="text-xs font-medium">
                Sale
              </Badge>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="text-xs font-medium">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-slate-500 text-sm mb-3">Vendor #{product.vendorId}</p>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-800">${currentPrice}</span>
              {originalPrice && (
                <span className="text-sm text-slate-500 line-through">${originalPrice}</span>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-3 h-3" 
                    fill={i < Math.floor(parseFloat(product.rating)) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 ml-1">({product.reviewCount})</span>
            </div>
          </div>
          {user ? (
            <Button 
              onClick={handleAddToCart}
              disabled={isLoading || addToCart.isPending || product.stock === 0}
              className="w-full bg-primary text-white hover:bg-blue-700 transition-colors"
            >
              {isLoading || addToCart.isPending ? "Adding..." : "Add to Cart"}
            </Button>
          ) : (
            <Button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "/auth";
              }}
              className="w-full bg-primary text-white hover:bg-blue-700 transition-colors"
            >
              Sign in to Purchase
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
