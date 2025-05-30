import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number is required"),
  expiryDate: z.string().min(5, "Expiry date is required"),
  cvv: z.string().min(3, "CVV is required"),
});

type ShippingData = z.infer<typeof shippingSchema>;
type PaymentData = z.infer<typeof paymentSchema>;

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    salePrice?: string;
    imageUrl: string;
  };
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("card");

  const { data: cartItems, isLoading } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const shippingForm = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const paymentForm = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Success!",
        description: "Your order has been placed successfully.",
      });
      setLocation("/profile");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Your cart is empty</h2>
              <p className="text-slate-600 mb-6">Add some products before checking out!</p>
              <Button onClick={() => setLocation("/")}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.product.salePrice || item.product.price);
    return sum + (price * item.quantity);
  }, 0);

  const shipping = 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const onSubmit = async () => {
    const shippingData = shippingForm.getValues();
    const paymentData = paymentForm.getValues();

    // Validate forms
    const shippingValid = await shippingForm.trigger();
    const paymentValid = paymentMethod === "paypal" || await paymentForm.trigger();

    if (!shippingValid || !paymentValid) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shippingAddress: shippingData,
      paymentMethod,
    };

    placeOrderMutation.mutate(orderData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Shipping Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Shipping Information</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName"
                        {...shippingForm.register("firstName")}
                        className="mt-1"
                      />
                      {shippingForm.formState.errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">
                          {shippingForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName"
                        {...shippingForm.register("lastName")}
                        className="mt-1"
                      />
                      {shippingForm.formState.errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">
                          {shippingForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address"
                      {...shippingForm.register("address")}
                      className="mt-1"
                    />
                    {shippingForm.formState.errors.address && (
                      <p className="text-sm text-red-600 mt-1">
                        {shippingForm.formState.errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city"
                        {...shippingForm.register("city")}
                        className="mt-1"
                      />
                      {shippingForm.formState.errors.city && (
                        <p className="text-sm text-red-600 mt-1">
                          {shippingForm.formState.errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select onValueChange={(value) => shippingForm.setValue("state", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                      {shippingForm.formState.errors.state && (
                        <p className="text-sm text-red-600 mt-1">
                          {shippingForm.formState.errors.state.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input 
                        id="zipCode"
                        {...shippingForm.register("zipCode")}
                        className="mt-1"
                      />
                      {shippingForm.formState.errors.zipCode && (
                        <p className="text-sm text-red-600 mt-1">
                          {shippingForm.formState.errors.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Payment Information</h2>
                <div className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input 
                          id="cardNumber"
                          {...paymentForm.register("cardNumber")}
                          placeholder="1234 5678 9012 3456"
                          className="mt-1"
                        />
                        {paymentForm.formState.errors.cardNumber && (
                          <p className="text-sm text-red-600 mt-1">
                            {paymentForm.formState.errors.cardNumber.message}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input 
                            id="expiryDate"
                            {...paymentForm.register("expiryDate")}
                            placeholder="MM/YY"
                            className="mt-1"
                          />
                          {paymentForm.formState.errors.expiryDate && (
                            <p className="text-sm text-red-600 mt-1">
                              {paymentForm.formState.errors.expiryDate.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv"
                            {...paymentForm.register("cvv")}
                            placeholder="123"
                            className="mt-1"
                          />
                          {paymentForm.formState.errors.cvv && (
                            <p className="text-sm text-red-600 mt-1">
                              {paymentForm.formState.errors.cvv.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Your Order</h2>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-slate-800">{item.product.name}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-semibold">
                          ${(parseFloat(item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={onSubmit}
                  disabled={placeOrderMutation.isPending}
                  className="w-full mt-6"
                >
                  {placeOrderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
