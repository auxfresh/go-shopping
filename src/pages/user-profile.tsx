import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, ShoppingBag, Heart, MapPin, Settings } from "lucide-react";
import type { Order } from "@shared/schema";

export default function UserProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Please log in</h1>
            <p className="text-slate-600">You need to be logged in to view your profile.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarFallback className="text-xl">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-slate-800">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-slate-500">{user.email}</p>
                <Badge variant="secondary" className="mt-2">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <nav className="space-y-2">
                <Button 
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("orders")}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Orders
                </Button>
                <Button 
                  variant={activeTab === "wishlist" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Wishlist
                </Button>
                <Button 
                  variant={activeTab === "addresses" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("addresses")}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Addresses
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </nav>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          First Name
                        </label>
                        <div className="p-2 bg-slate-50 rounded border">
                          {user.firstName}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Last Name
                        </label>
                        <div className="p-2 bg-slate-50 rounded border">
                          {user.lastName}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <div className="p-2 bg-slate-50 rounded border">
                        {user.email}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone
                      </label>
                      <div className="p-2 bg-slate-50 rounded border">
                        {user.phone || "Not provided"}
                      </div>
                    </div>
                    <Button>Edit Profile</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <p>Loading orders...</p>
                    ) : orders && orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
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
                                Track Order
                              </Button>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              {order.status === "delivered" && (
                                <Button variant="outline" size="sm">
                                  Reorder
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                          No orders yet
                        </h3>
                        <p className="text-slate-600">
                          Start shopping to see your orders here!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>Wishlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-slate-600">
                        Save items you love to buy them later!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Addresses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MapPin className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        No saved addresses
                      </h3>
                      <p className="text-slate-600">
                        Add addresses for faster checkout!
                      </p>
                      <Button className="mt-4">Add Address</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-800">Email Notifications</h4>
                        <p className="text-sm text-slate-600">
                          Receive updates about your orders and new products
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-800">Privacy Settings</h4>
                        <p className="text-sm text-slate-600">
                          Control who can see your information
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-800">Change Password</h4>
                        <p className="text-sm text-slate-600">
                          Update your password to keep your account secure
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
