import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { User, ShoppingBag, Heart, MapPin, Settings } from "lucide-react";

interface Order {
  id: number;
  status: string;
  total: string;
  createdAt: string;
}

export default function UserProfilePage() {
  const { user } = useAuth();

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-slate-500">{user?.email}</p>
                <Badge variant="outline" className="mt-2">
                  {user?.role}
                </Badge>
              </div>
              <nav className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Orders
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Addresses
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </nav>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Personal Information</h2>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName"
                            defaultValue={user?.firstName}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName"
                            defaultValue={user?.lastName}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          defaultValue={user?.email}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className="mt-1"
                        />
                      </div>
                      <Button>Save Changes</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Order History</h2>
                    <div className="space-y-4">
                      {ordersLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-4 w-48" />
                              </div>
                              <div className="text-right">
                                <Skeleton className="h-5 w-20 mb-2" />
                                <Skeleton className="h-6 w-24" />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : orders && orders.length > 0 ? (
                        orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="font-semibold text-slate-800">
                                  Order #{order.id}
                                </p>
                                <p className="text-slate-500 text-sm">
                                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-slate-800">
                                  ${parseFloat(order.total).toFixed(2)}
                                </p>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                Track Order
                              </Button>
                              {order.status === "delivered" && (
                                <Button variant="outline" size="sm">
                                  Reorder
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-800 mb-2">No orders yet</h3>
                          <p className="text-slate-600">Start shopping to see your orders here!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wishlist">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Wishlist</h2>
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Your wishlist is empty</h3>
                      <p className="text-slate-600">Save products you love to see them here!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-800">Saved Addresses</h2>
                      <Button>Add New Address</Button>
                    </div>
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">No addresses saved</h3>
                      <p className="text-slate-600">Add your addresses for faster checkout!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
