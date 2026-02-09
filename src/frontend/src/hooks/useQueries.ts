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
      try {
        return await actor.addProduct(product);
      } catch (error: any) {
        if (error.message && error.message.includes('Unauthorized')) {
          adminSession.clear();
          throw new Error('Unauthorized: Admin access required');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Enquiries
export function useGetAllEnquiries() {
  const { actor, isFetching } = useActor();

  return useQuery<Enquiry[], Error>({
    queryKey: ['enquiries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!adminSession.isUnlocked()) throw new Error('Admin session not unlocked');
      try {
        const result = await actor.getAllEnquiries();
        // Sort by timestamp descending (newest first)
        return result.sort((a, b) => Number(b.timestamp - a.timestamp));
      } catch (error: any) {
        if (error.message && error.message.includes('Unauthorized')) {
          adminSession.clear();
          throw new Error('Unauthorized: Admin access required');
        }
        throw error;
      }
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enquiry: Enquiry) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.submitEnquiry(enquiry);
      } catch (error: any) {
        // Transform backend errors into user-friendly messages
        if (error.message) {
          if (error.message.includes('Phone number is required')) {
            throw new Error('Phone number is required');
          }
          if (error.message.includes('Email address is required')) {
            throw new Error('Email address is required');
          }
          if (error.message.includes('Order quantity must be at least 2000 meters')) {
            throw new Error('Minimum order quantity is 2000 meters');
          }
        }
        throw new Error('Failed to submit enquiry. Please try again.');
      }
    },
    onSuccess: () => {
      // Invalidate admin enquiries if session is unlocked
      if (adminSession.isUnlocked()) {
        queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      }
    },
  });
}

// Feedback
export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();

  return useQuery<Feedback[], Error>({
    queryKey: ['feedback'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!adminSession.isUnlocked()) throw new Error('Admin session not unlocked');
      try {
        const result = await actor.getAllFeedback();
        // Sort by timestamp descending (newest first)
        return result.sort((a, b) => Number(b.timestamp - a.timestamp));
      } catch (error: any) {
        if (error.message && error.message.includes('Unauthorized')) {
          adminSession.clear();
          throw new Error('Unauthorized: Admin access required');
        }
        throw error;
      }
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

  return useQuery<Message[], Error>({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!adminSession.isUnlocked()) throw new Error('Admin session not unlocked');
      try {
        const result = await actor.getAllMessages();
        // Sort by timestamp descending (newest first)
        return result.sort((a, b) => Number(b.timestamp - a.timestamp));
      } catch (error: any) {
        if (error.message && error.message.includes('Unauthorized')) {
          adminSession.clear();
          throw new Error('Unauthorized: Admin access required');
        }
        throw error;
      }
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
      try {
        await actor.sendMessage(message);
      } catch (error: any) {
        // Transform backend errors into user-friendly messages
        throw new Error('Failed to send message. Please try again.');
      }
    },
    onSuccess: () => {
      // Invalidate admin messages if session is unlocked
      if (adminSession.isUnlocked()) {
        queryClient.invalidateQueries({ queryKey: ['messages'] });
      }
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
      try {
        return await actor.updateSiteSettings(settings);
      } catch (error: any) {
        if (error.message && error.message.includes('Unauthorized')) {
          adminSession.clear();
          throw new Error('Unauthorized: Admin access required');
        }
        throw error;
      }
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
