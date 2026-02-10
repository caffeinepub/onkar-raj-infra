import { Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import TopNav from './TopNav';
import SiteFooter from './SiteFooter';
import WhatsAppFloatingButton from '../whatsapp/WhatsAppFloatingButton';
import ProfileSetupModal from '../auth/ProfileSetupModal';
import { useActor } from '../../hooks/useActor';
import { toast } from 'sonner';

export default function SiteLayout() {
  const actorState = useActor();
  const actor = actorState.actor;
  const isFetching = actorState.isFetching;

  // Lightweight connectivity preflight on initial load
  useEffect(() => {
    // Check if actor failed to initialize after fetching is complete
    if (!actor && !isFetching) {
      const timer = setTimeout(() => {
        if (!actorState.actor && !actorState.isFetching) {
          toast.error('Connection issue detected. Some features may be unavailable.', {
            duration: 5000,
            id: 'actor-connection-error',
          });
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [actor, isFetching, actorState]);

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
