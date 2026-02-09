import { Outlet } from '@tanstack/react-router';
import TopNav from './TopNav';
import SiteFooter from './SiteFooter';
import WhatsAppFloatingButton from '../whatsapp/WhatsAppFloatingButton';
import ProfileSetupModal from '../auth/ProfileSetupModal';

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppFloatingButton />
      <ProfileSetupModal />
    </div>
  );
}
