import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { Star, Heart, Check, Minus, Plus } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  salePrice?: string;
  imageUrl: string;
  images?: string[];
  features?: string[];
  rating: string;
  reviewCount: number;
  stock: number;
  vendorId: number;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...(product.images || [])];
  const currentPrice = product.salePrice || product.price;
  const originalPrice = product.salePrice ? product.price : null;
  const discountPercent = originalPrice ? 
    Math.round(((parseFloat(originalPrice) - parseFloat(currentPrice)) / parseFloat(originalPrice)) * 100) : 0;

  const handleAddToCart = () => {
    addToCart.mutate({
      productId: product.id,
      quantity,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li className="text-slate-400">/</li>
            <li><Link href="/products" className="hover:text-primary">Products</Link></li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-800">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl shadow-sm overflow-hidden">
              <img 
                src={allImages[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{product.name}</h1>
              <p className="text-slate-500">Vendor ID: {product.vendorId}</p>
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4" 
                      fill={i < Math.floor(parseFloat(product.rating)) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-slate-600 ml-2">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="border-t border-b py-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-slate-800">${currentPrice}</span>
                {originalPrice && (
                  <>
                    <span className="text-xl text-slate-500 line-through">${originalPrice}</span>
                    <Badge variant="destructive">{discountPercent}% OFF</Badge>
                  </>
                )}
              </div>
              <p className={`mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Features</h3>
                <ul className="space-y-2 text-slate-600">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addToCart.isPending}
                className="flex-1"
              >
                {addToCart.isPending ? "Adding..." : "Add to Cart"}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
