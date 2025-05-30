import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  salePrice?: string;
  imageUrl: string;
  rating: string;
  reviewCount: number;
  vendorId: number;
}

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products?.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Premium Products</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">Shop from thousands of vendors worldwide</p>
            <Button 
              onClick={() => {
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoriesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-lg" />
                  <Skeleton className="h-5 w-24 mx-auto mb-2" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </CardContent>
              </Card>
            ))
          ) : (
            categories?.map((category) => (
              <Card key={category.id} className="group cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <img 
                    src={category.imageUrl || "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"} 
                    alt={category.name}
                    className="w-16 h-16 mx-auto mb-4 rounded-lg object-cover"
                  />
                  <h3 className="font-semibold text-slate-800">{category.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">View products</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-primary hover:text-blue-700 font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-10 w-full mt-3" />
                </CardContent>
              </Card>
            ))
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EliteMarket</h3>
              <p className="text-slate-300 mb-4">Your premium destination for quality products from trusted vendors worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/products" className="hover:text-white">All Products</Link></li>
                <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
                <li><Link href="/deals" className="hover:text-white">Deals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/profile" className="hover:text-white">My Account</Link></li>
                <li><Link href="/orders" className="hover:text-white">Order History</Link></li>
                <li><Link href="/auth" className="hover:text-white">Sign In</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-300">
            <p>&copy; 2023 EliteMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
