import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CategoryPage from "@/pages/categories/[slug]";
import ProductPage from "@/pages/product/[slug]";
import CartPage from "@/pages/Cart";

import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminFabrics from "@/pages/admin/AdminFabrics";
import Login from "@/pages/admin/Login";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import UserAuth from "@/pages/auth/UserAuth";
import ProfileOrders from "@/pages/profile/Orders";
import ProfileCoupons from "@/pages/profile/Coupons";
import ProfileInfo from "@/pages/profile/Info";
import ProfileAddresses from "@/pages/profile/Addresses";
import ProfileFavorites from "@/pages/profile/Favorites";

const queryClient = new QueryClient();

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/products" component={AdminProducts} />
        <Route path="/admin/fabrics" component={AdminFabrics} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={Login} />
      <Route path="/admin/*" component={AdminRoutes} />
      <Route path="/admin" component={AdminRoutes} />
      <Route path="/auth" component={UserAuth} />
      <Route path="/profile/orders" component={ProfileOrders} />
      <Route path="/profile/coupons" component={ProfileCoupons} />
      <Route path="/profile/info" component={ProfileInfo} />
      <Route path="/profile/addresses" component={ProfileAddresses} />
      <Route path="/profile/favorites" component={ProfileFavorites} />
      <Route path="/" component={Home} />
      <Route path="/categories/:slug" component={CategoryPage} />
      <Route path="/product/:slug" component={ProductPage} />
      <Route path="/cart" component={CartPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </QueryClientProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;