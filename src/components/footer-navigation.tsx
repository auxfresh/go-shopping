import { Link, useLocation } from "wouter";
import { Home, Package, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";

export default function FooterNavigation() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { cartSummary } = useCart();

  if (!user) return null;

  const isActive = (path: string) => location === path;

  const navItems = [
    {
      path: "/",
      icon: Home,
      label: "Home",
    },
    {
      path: "/products",
      icon: Package,
      label: "Products",
    },
    {
      path: "/cart",
      icon: ShoppingCart,
      label: "Cart",
      badge: cartSummary.itemCount > 0 ? cartSummary.itemCount : undefined,
    },
    {
      path: "/profile",
      icon: User,
      label: "Profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-40 md:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'text-primary bg-blue-50' 
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}>
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}