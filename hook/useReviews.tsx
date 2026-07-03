

import { useState, useCallback, useEffect } from 'react';
import { type Product } from '@/services/authApi';
import {
  reviewApi,
  ReviewDto,
  CreateReviewRequest,
  getReviewErrorMessage,
  isReviewDuplicate,
  isReviewUnauthorized,
} from "@/services/reviewApi";

export interface UseReviewsState {
  reviews: ReviewDto[];
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

export interface UseReviewsActions {
  fetchReviews: (product: Product | number) => Promise<void>;
  addReview: (product: Product | number, review: CreateReviewRequest, accessToken: string) => Promise<boolean>;
  deleteReview: (product: Product | number, reviewId: number, accessToken: string) => Promise<boolean>;
  reactToReview: (product: Product | number, reviewId: number, value: number) => Promise<void>;
  clearError: () => void;
}


export function useReviews(initialProduct?: Product | number | null | undefined) {
  const [state, setState] = useState<UseReviewsState>({
    reviews: [],
    loading: false,
    error: null,
    isSubmitting: false,
  });

  
  const fetchReviews = useCallback(
    async (product: Product | number) => {
      
      if (!product) {
        setState((prev) => ({
          ...prev,
          error: 'Product is required to fetch reviews',
          loading: false,
        }));
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const reviews = await reviewApi.getProductReviews(product);
        setState((prev) => ({
          ...prev,
          reviews: reviews.sort(
            (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
          ),
          loading: false,
        }));
      } catch (error) {
        const message = getReviewErrorMessage(error);
        setState((prev) => ({
          ...prev,
          error: message,
          loading: false,
        }));
        console.error('Failed to fetch reviews:', error);
      }
    },
    []
  );

  
  const addReview = useCallback(
    async (
      product: Product | number,
      reviewData: CreateReviewRequest,
      accessToken: string
    ): Promise<boolean> => {
      
      if (!product) {
        setState((prev) => ({
          ...prev,
          error: 'Product is required',
          isSubmitting: false,
        }));
        return false;
      }

      if (!accessToken) {
        setState((prev) => ({
          ...prev,
          error: 'Authentication required',
          isSubmitting: false,
        }));
        return false;
      }

      setState((prev) => ({ ...prev, isSubmitting: true, error: null }));
      try {
        const newReview = await reviewApi.addReview(product, reviewData, accessToken);

        setState((prev) => ({
          ...prev,
          reviews: [newReview, ...prev.reviews],
          isSubmitting: false,
        }));
        return true;
      } catch (error) {
        const message = getReviewErrorMessage(error);
        setState((prev) => ({
          ...prev,
          error: message,
          isSubmitting: false,
        }));
        console.error('Failed to add review:', error);
        return false;
      }
    },
    []
  );

  
  const deleteReview = useCallback(
    async (
      product: Product | number,
      reviewId: number,
      accessToken: string
    ): Promise<boolean> => {
      
      if (!product) {
        setState((prev) => ({
          ...prev,
          error: 'Product is required',
          isSubmitting: false,
        }));
        return false;
      }

      if (!reviewId || typeof reviewId !== 'number') {
        setState((prev) => ({
          ...prev,
          error: 'Invalid review ID',
          isSubmitting: false,
        }));
        return false;
      }

      if (!accessToken) {
        setState((prev) => ({
          ...prev,
          error: 'Authentication required',
          isSubmitting: false,
        }));
        return false;
      }

      setState((prev) => ({ ...prev, isSubmitting: true, error: null }));
      try {
        const success = await reviewApi.deleteReview(product, reviewId, accessToken);

        if (success) {
          setState((prev) => ({
            ...prev,
            reviews: prev.reviews.filter((r) => r.id !== reviewId),
            isSubmitting: false,
          }));
        }
        return success;
      } catch (error) {
        const message = getReviewErrorMessage(error);
        setState((prev) => ({
          ...prev,
          error: message,
          isSubmitting: false,
        }));
        console.error('Failed to delete review:', error);
        return false;
      }
    },
    []
  );

  
  const reactToReview = useCallback(
    async (product: Product | number, reviewId: number, value: number = 1): Promise<void> => {
      
      if (!product) {
        setState((prev) => ({
          ...prev,
          error: 'Product is required',
        }));
        return;
      }

      if (!reviewId || typeof reviewId !== 'number') {
        setState((prev) => ({
          ...prev,
          error: 'Invalid review ID',
        }));
        return;
      }

      try {
        const updatedReview = await reviewApi.reactToReview(product, reviewId, value);

        setState((prev) => ({
          ...prev,
          reviews: prev.reviews.map((r) => (r.id === reviewId ? updatedReview : r)),
        }));
      } catch (error) {
        console.error('Failed to react to review:', error);
        const message = getReviewErrorMessage(error);
        setState((prev) => ({ ...prev, error: message }));
      }
    },
    []
  );

  
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  
  useEffect(() => {
    if (initialProduct) {
      fetchReviews(initialProduct);
    }
  }, [
    initialProduct,
    
    typeof initialProduct === 'number' ? initialProduct : (initialProduct as Product)?.id,
  ]);

  return {
    
    reviews: state.reviews,
    loading: state.loading,
    error: state.error,
    isSubmitting: state.isSubmitting,
    
    fetchReviews,
    addReview,
    deleteReview,
    reactToReview,
    clearError,
  };
}