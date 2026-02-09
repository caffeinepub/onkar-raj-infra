import { useLocation, useNavigate } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Package, FileText, MessageSquare, Mail, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { adminSession } from '../../utils/adminSession';
import { useQueryClient } from '@tanstack/react-query';
import AdminProductsPage from './AdminProductsPage';
import AdminEnquiriesPage from './AdminEnquiriesPage';
import AdminFeedbackPage from './AdminFeedbackPage';
import AdminMessagesPage from './AdminMessagesPage';

export default function AdminLayoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const navItems = [
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/enquiries', label: 'Enquiries', icon: FileText },
    { path: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
    { path: '/admin/messages', label: 'Messages', icon: Mail },
  ];

  const handleAdminLogout = () => {
    // Clear admin session
    adminSession.logout();
    // Clear cached admin data
    queryClient.removeQueries({ queryKey: ['enquiries'] });
    queryClient.removeQueries({ queryKey: ['feedback'] });
    queryClient.removeQueries({ queryKey: ['messages'] });
    // Navigate to admin login
    navigate({ to: '/admin/login' });
  };

  // Determine which page to render based on current path
  const renderPage = () => {
    switch (location.pathname) {
      case '/admin/products':
        return <AdminProductsPage />;
      case '/admin/enquiries':
        return <AdminEnquiriesPage />;
      case '/admin/feedback':
        return <AdminFeedbackPage />;
      case '/admin/messages':
        return <AdminMessagesPage />;
      default:
        return <AdminProductsPage />;
    }
  };

  return (
    <div className="py-12">
      <div className="container">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage products, view enquiries, feedback, and messages
            </p>
          </div>
          <Button
            onClick={handleAdminLogout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Admin Logout
          </Button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {renderPage()}
      </div>
    </div>
  );
}
