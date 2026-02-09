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
      if (!adminSession.isUnlocked()) throw new Error('Admin session not unlocked');
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      if (error.message && error.message.includes('Unauthorized')) {
        adminSession.clear();
      }
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
      if (!adminSession.isUnlocked()) throw new Error('Admin session not unlocked');
      return actor.getAllEnquiries();
    },
    enabled: !!actor && !isFetching && adminSession.isUnlocked(),
    retry: false,
  });
}

export function useConfirmEnquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enquiryId: string) => {
      // Backend does not yet support confirm/reject operations
      // This is a placeholder that simulates success
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Confirm enquiry:', enquiryId);
      // In a real implementation, this would call a backend method
      throw new Error('Confirm functionality not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    },
  });
}

export function useRejectEnquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enquiryId: string) => {
      // Backend does not yet support confirm/reject operations
      // This is a placeholder that simulates success
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Reject enquiry:', enquiryId);
      // In a real implementation, this would call a backend method
      throw new Error('Reject functionality not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    },
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
      if (!adminSession.isUnlocked()) throw new Error('Admin session not unlocked');
      return actor.getAllFeedback();
    },
    enabled: !!actor && !isFetching && adminSession.isUnlocked(),
    retry: false,
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
      if (!adminSession.isUnlocked()) throw new Error('Admin session not unlocked');
      return actor.getAllMessages();
    },
    enabled: !!actor && !isFetching && adminSession.isUnlocked(),
    retry: false,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: Message) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
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
      if (!adminSession.isUnlocked()) throw new Error('Admin session not unlocked');
      return actor.updateSiteSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
    onError: (error: any) => {
      if (error.message && error.message.includes('Unauthorized')) {
        adminSession.clear();
      }
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
