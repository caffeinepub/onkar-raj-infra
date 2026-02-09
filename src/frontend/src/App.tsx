import { RouterProvider, createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AdvantagesPage from './pages/AdvantagesPage';
import UsesApplicationsPage from './pages/UsesApplicationsPage';
import OrderEnquiryPage from './pages/OrderEnquiryPage';
import ContactPage from './pages/ContactPage';
import AdminLayoutPage from './pages/admin/AdminLayoutPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminRouteGuard from './pages/admin/AdminRouteGuard';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: SiteLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

const advantagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/advantages',
  component: AdvantagesPage,
});

const usesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/uses',
  component: UsesApplicationsPage,
});

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order',
  component: OrderEnquiryPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

// Admin routes with guard
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <AdminLayoutPage />
    </AdminRouteGuard>
  ),
  beforeLoad: () => {
    // Redirect /admin to /admin/products by default
    throw redirect({ to: '/admin/products' });
  },
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: () => (
    <AdminRouteGuard>
      <AdminLayoutPage />
    </AdminRouteGuard>
  ),
});

const adminEnquiriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/enquiries',
  component: () => (
    <AdminRouteGuard>
      <AdminLayoutPage />
    </AdminRouteGuard>
  ),
});

const adminFeedbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/feedback',
  component: () => (
    <AdminRouteGuard>
      <AdminLayoutPage />
    </AdminRouteGuard>
  ),
});

const adminMessagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/messages',
  component: () => (
    <AdminRouteGuard>
      <AdminLayoutPage />
    </AdminRouteGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  advantagesRoute,
  usesRoute,
  orderRoute,
  contactRoute,
  adminRoute,
  adminProductsRoute,
  adminEnquiriesRoute,
  adminFeedbackRoute,
  adminMessagesRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
