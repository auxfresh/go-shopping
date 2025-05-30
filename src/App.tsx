import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CartPage from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import UserProfilePage from "@/pages/user-profile-page";
import AdminDashboard from "@/pages/admin-dashboard";
import ProductsPage from "@/pages/products-page";
import { ProtectedRoute } from "./lib/protected-route";
import FooterNavigation from "@/components/footer-navigation";

function Router() {
  return (
    <div className="pb-16 md:pb-0">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/product/:id" component={ProductDetailPage} />
        <ProtectedRoute path="/cart" component={CartPage} />
        <ProtectedRoute path="/checkout" component={CheckoutPage} />
        <ProtectedRoute path="/profile" component={UserProfilePage} />
        <ProtectedRoute path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
      <FooterNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
