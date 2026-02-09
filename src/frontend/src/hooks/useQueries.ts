import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Enquiry, SiteSettings, Feedback, Message } from '../backend';
import { adminSession } from '../utils/adminSession';

// Products
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      const passkey = adminSession.getPasskey();
      if (!passkey) throw new Error('Admin passkey not available');
      return actor.addProduct(product, passkey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Enquiries
export function useGetAllEnquiries() {
  const { actor, isFetching } = useActor();

  return useQuery<Enquiry[]>({
    queryKey: ['enquiries'],
    queryFn: async () => {
      if (!actor) return [];
      const passkey = adminSession.getPasskey();
      if (!passkey) throw new Error('Admin passkey not available');
      return actor.getAllEnquiries(passkey);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitEnquiry() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (enquiry: Enquiry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitEnquiry(enquiry);
    },
  });
}

// Feedback
export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();

  return useQuery<Feedback[]>({
    queryKey: ['feedback'],
    queryFn: async () => {
      if (!actor) return [];
      const passkey = adminSession.getPasskey();
      if (!passkey) throw new Error('Admin passkey not available');
      return actor.getAllFeedback(passkey);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitFeedback() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (feedback: Feedback) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFeedback(feedback);
    },
  });
}

// Messages
export function useGetAllMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) return [];
      const passkey = adminSession.getPasskey();
      if (!passkey) throw new Error('Admin passkey not available');
      return actor.getAllMessages(passkey);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendMessage() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (message: Message) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(message);
    },
  });
}

// Site Settings
export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<SiteSettings>({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      if (!actor) throw new Error('Actor not available');
      const passkey = adminSession.getPasskey();
      if (!passkey) throw new Error('Admin passkey not available');
      return actor.updateSiteSettings(settings, passkey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
  });
}

// Pricing
export function useGetPriceForDiameter(diameter: string) {
  const { actor, isFetching } = useActor();

  return useQuery<number | null>({
    queryKey: ['price', diameter],
    queryFn: async () => {
      if (!actor) return null;
      if (!diameter) return null;
      return actor.getPriceForDiameter(diameter);
    },
    enabled: !!actor && !isFetching && !!diameter,
  });
}
