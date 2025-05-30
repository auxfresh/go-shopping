import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";

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
  stock: number;
  categoryId: number;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { 
      search: searchQuery,
      categoryId: selectedCategory ? parseInt(selectedCategory) : undefined 
    }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory) params.append("categoryId", selectedCategory);
      
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const sortedProducts = products ? [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.salePrice || a.price) - parseFloat(b.salePrice || b.price);
      case "price-high":
        return parseFloat(b.salePrice || b.price) - parseFloat(a.salePrice || a.price);
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "newest":
      default:
        return b.id - a.id;
    }
  }) : [];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Search Products</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Categories</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === "" ? "default" : "ghost"}
                    onClick={() => setSelectedCategory("")}
                    className="w-full justify-start"
                  >
                    All Categories
                  </Button>
                  {categories?.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id.toString() ? "default" : "ghost"}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className="w-full justify-start"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-slate-800">
                {selectedCategory && categories ? 
                  categories.find(c => c.id.toString() === selectedCategory)?.name || "Products" : 
                  "All Products"
                }
              </h1>
              <div className="flex items-center space-x-2 text-slate-600">
                <Filter className="w-4 h-4" />
                <span>{sortedProducts.length} products</span>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
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
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">No products found</h2>
                  <p className="text-slate-600 mb-6">
                    {searchQuery || selectedCategory ? 
                      "Try adjusting your search or filters to find what you're looking for." :
                      "No products are available at the moment."
                    }
                  </p>
                  {(searchQuery || selectedCategory) && (
                    <Button 
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}