import { useEffect, useState } from 'react';
import { useGetSiteSettings, useSendMessage } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import type { Message } from '../backend';

export default function ContactPage() {
  const { data: settings } = useGetSiteSettings();
  const sendMessage = useSendMessage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = 'Contact Us - Onkar Raj Infra';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const messageData: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
        timestamp: BigInt(Date.now()),
      };

      await sendMessage.mutateAsync(messageData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="py-12 md:py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get in touch with us for inquiries, orders, or any questions about our HDPE pipes.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Subject of your message"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={sendMessage.isPending} className="w-full">
                  {sendMessage.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {settings?.contactLocation || 'Location information will be updated soon'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {settings?.contactPhone || 'Phone number will be updated soon'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {settings?.contactEmail || 'Email address will be updated soon'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            {settings?.googleMapEmbed && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="aspect-video w-full overflow-hidden rounded-lg"
                    dangerouslySetInnerHTML={{ __html: settings.googleMapEmbed }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
