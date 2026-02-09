import { MessageCircle } from 'lucide-react';
import { useGetSiteSettings } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';

export default function WhatsAppFloatingButton() {
  const { data: settings } = useGetSiteSettings();

  if (!settings?.whatsappConfig) {
    return null;
  }

  const { phoneNumber, prefilledMessage } = settings.whatsappConfig;
  const message = prefilledMessage || 'Hello, I would like to inquire about HDPE pipes.';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40"
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform"
        style={{ backgroundColor: '#25D366' }}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </a>
  );
}
