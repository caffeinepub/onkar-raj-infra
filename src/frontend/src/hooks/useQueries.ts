import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Enquiry, SiteSettings, Feedback, Message } from '../backend';
import { useAdminSession } from './useAdminSession';
import { waitForActorReady } from './useActorReady';

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
  const { isUnlocked } = useAdminSession();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      if (!isUnlocked) throw new Error('Admin session not unlocked');
      try {
        return await actor.addProduct(product);
      } catch (error: any) {
        // Transform backend errors into user-friendly messages
        if (error.message && error.message.includes('Unauthorized')) {
          throw new Error('You do not have permission to add products. Please log in and verify your passkey.');
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
  const { isUnlocked } = useAdminSession();

  return useQuery<Enquiry[], Error>({
    queryKey: ['enquiries', isUnlocked],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!isUnlocked) throw new Error('Admin session not unlocked');
      try {
        const result = await actor.getAllEnquiries();
        // Sort by timestamp descending (newest first)
        return result.sort((a, b) => Number(b.timestamp - a.timestamp));
      } catch (error: any) {
        // Transform backend errors into user-friendly messages
        if (error.message && error.message.includes('Unauthorized')) {
          throw new Error('You do not have permission to view enquiries. Please log in and verify your passkey.');
        }
        throw new Error('Failed to load enquiries. Please try again.');
      }
    },
    enabled: !!actor && !isFetching && isUnlocked,
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
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const { isUnlocked } = useAdminSession();

  return useMutation({
    mutationFn: async (enquiry: Enquiry) => {
      // Wait for actor to be ready (public mutation, no admin check)
      let readyActor = actor;
      if (!readyActor) {
        try {
          readyActor = await waitForActorReady(() => actor, () => isFetching, 15000);
        } catch (error: any) {
          throw new Error('Unable to connect to the service. Please refresh the page and try again.');
        }
      }

      if (!readyActor) {
        throw new Error('Unable to connect to the service. Please refresh the page and try again.');
      }

      try {
        await readyActor.submitEnquiry(enquiry);
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
        console.error('Submit enquiry error:', error);
        throw new Error('Failed to submit enquiry. Please try again.');
      }
    },
    onSuccess: () => {
      // Invalidate admin enquiries if session is unlocked
      if (isUnlocked) {
        queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      }
    },
  });
}

// Feedback
export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();
  const { isUnlocked } = useAdminSession();

  return useQuery<Feedback[], Error>({
    queryKey: ['feedback', isUnlocked],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!isUnlocked) throw new Error('Admin session not unlocked');
      try {
        const result = await actor.getAllFeedback();
        // Sort by timestamp descending (newest first)
        return result.sort((a, b) => Number(b.timestamp - a.timestamp));
      } catch (error: any) {
        // Transform backend errors into user-friendly messages
        if (error.message && error.message.includes('Unauthorized')) {
          throw new Error('You do not have permission to view feedback. Please log in and verify your passkey.');
        }
        throw new Error('Failed to load feedback. Please try again.');
      }
    },
    enabled: !!actor && !isFetching && isUnlocked,
    retry: false,
  });
}

export function useSubmitFeedback() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const { isUnlocked } = useAdminSession();

  return useMutation({
    mutationFn: async (feedback: Feedback) => {
      // Wait for actor to be ready (public mutation, no admin check)
      let readyActor = actor;
      if (!readyActor) {
        try {
          readyActor = await waitForActorReady(() => actor, () => isFetching, 15000);
        } catch (error: any) {
          throw new Error('Unable to connect to the service. Please refresh the page and try again.');
        }
      }

      if (!readyActor) {
        throw new Error('Unable to connect to the service. Please refresh the page and try again.');
      }

      try {
        await readyActor.submitFeedback(feedback);
      } catch (error: any) {
        console.error('Submit feedback error:', error);
        throw new Error('Failed to submit feedback. Please try again.');
      }
    },
    onSuccess: () => {
      // Invalidate admin feedback if session is unlocked
      if (isUnlocked) {
        queryClient.invalidateQueries({ queryKey: ['feedback'] });
      }
    },
  });
}

// Messages
export function useGetAllMessages() {
  const { actor, isFetching } = useActor();
  const { isUnlocked } = useAdminSession();

  return useQuery<Message[], Error>({
    queryKey: ['messages', isUnlocked],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!isUnlocked) throw new Error('Admin session not unlocked');
      try {
        const result = await actor.getAllMessages();
        // Sort by timestamp descending (newest first)
        return result.sort((a, b) => Number(b.timestamp - a.timestamp));
      } catch (error: any) {
        // Transform backend errors into user-friendly messages
        if (error.message && error.message.includes('Unauthorized')) {
          throw new Error('You do not have permission to view messages. Please log in and verify your passkey.');
        }
        throw new Error('Failed to load messages. Please try again.');
      }
    },
    enabled: !!actor && !isFetching && isUnlocked,
    retry: false,
  });
}

export function useSendMessage() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const { isUnlocked } = useAdminSession();

  return useMutation({
    mutationFn: async (message: Message) => {
      // Wait for actor to be ready (public mutation, no admin check)
      let readyActor = actor;
      if (!readyActor) {
        try {
          readyActor = await waitForActorReady(() => actor, () => isFetching, 15000);
        } catch (error: any) {
          throw new Error('Unable to connect to the service. Please refresh the page and try again.');
        }
      }

      if (!readyActor) {
        throw new Error('Unable to connect to the service. Please refresh the page and try again.');
      }

      try {
        await readyActor.sendMessage(message);
      } catch (error: any) {
        console.error('Send message error:', error);
        throw new Error('Failed to send message. Please try again.');
      }
    },
    onSuccess: () => {
      // Invalidate admin messages if session is unlocked
      if (isUnlocked) {
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
  const { isUnlocked } = useAdminSession();

  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      if (!actor) throw new Error('Actor not available');
      if (!isUnlocked) throw new Error('Admin session not unlocked');
      try {
        return await actor.updateSiteSettings(settings);
      } catch (error: any) {
        // Transform backend errors into user-friendly messages
        if (error.message && error.message.includes('Unauthorized')) {
          throw new Error('You do not have permission to update settings. Please log in and verify your passkey.');
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
      if (!actor || !diameter) return null;
      return actor.getPriceForDiameter(diameter);
    },
    enabled: !!actor && !isFetching && !!diameter,
  });
}
