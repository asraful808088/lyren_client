import { ApiResponse, getErrorMessage, type Product } from './authApi';

const PRODUCT_BASE_URL = process.env.NEXT_PUBLIC_PRODUCT_API_URL || 'http://localhost:5036';



export interface ReviewDto {
  id: number;
  username: string;
  rating: number;
  comment: string;
  react: number;
  createTime: string;
}

export interface CreateReviewRequest {
  username: string;
  rating: number;
  comment: string;
}

export interface ReviewError {
  message: string;
  status: number;
}



async function makeRequest<T>(
  url: string,
  options: RequestInit = {},
  accessToken?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, { ...options, headers });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = { message: res.statusText };
  }

  if (!res.ok) {

    const bodyObj = body as {
      message?: string;
      title?: string;
      errors?: Record<string, string[]>;
    };

    let message = bodyObj?.message ?? bodyObj?.title ?? `HTTP ${res.status}`;

    if (bodyObj?.errors) {
      const fieldErrors = Object.entries(bodyObj.errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
        .join(' | ');
      message = fieldErrors || message;
    }

    const err: ReviewError = { message, status: res.status };
    throw err;
  }

  return body as T;
}




function getProductNumericId(product: Product | number | string | undefined | null): number {
  
  if (typeof product === 'number' && product > 0) {
    return product;
  }

  
  if (typeof product === 'string') {
    const numId = parseInt(product, 10);
    if (numId > 0) {
      return numId;
    }
  }

  
  if (product && typeof product === 'object') {
    const prod = product as unknown as Record<string, unknown>;

    
    const idProperties = ['id', 'Id', 'productId', 'ProductId', 'product_id'];

    for (const prop of idProperties) {
      const value = prod[prop];
      if (typeof value === 'number' && value > 0) {
        return value;
      }
    }

    
   
  }

  throw new Error(
    'Invalid product: cannot determine numeric ID for reviews. ' +
    'Please pass either a numeric product ID or a product object with an "id" property.'
  );
}



export const reviewApi = {
  
  async getProductReviews(product: Product | number | string | undefined | null): Promise<ReviewDto[]> {
    try {
      
      const productId = getProductNumericId(product);

      if (!productId) {
        throw new Error('Product ID is required');
      }


      const response = await makeRequest<ApiResponse<ReviewDto[]>>(
        `${PRODUCT_BASE_URL}/api/product/${productId}/reviews`,
        { method: 'GET' }
      );
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  
  async addReview(
    product: Product | number | string | undefined | null,
    request: CreateReviewRequest,
    accessToken: string
  ): Promise<ReviewDto> {
    try {
      
      const productId = getProductNumericId(product);

      if (!productId) {
        throw new Error('Product ID is required');
      }

      
      if (!request.username?.trim()) {
        throw new Error('Username is required');
      }
      if (!request.comment?.trim()) {
        throw new Error('Review comment is required');
      }
      if (request.rating < 1 || request.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const response = await makeRequest<ApiResponse<ReviewDto>>(
        `${PRODUCT_BASE_URL}/api/product/${productId}/reviews`,
        {
          method: 'POST',
          body: JSON.stringify(request),
        },
        accessToken
      );

      if (!response.data) {
        throw new Error('No review data returned from server');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
  async deleteReview(
    product: Product | number | string | undefined | null,
    reviewId: number,
    accessToken: string
  ): Promise<boolean> {
    try {
      const productId = getProductNumericId(product);

      if (!productId) {
        throw new Error('Product ID is required');
      }

      if (!reviewId || typeof reviewId !== 'number') {
        throw new Error('Review ID is required');
      }

      const response = await makeRequest<ApiResponse<object>>(
        `${PRODUCT_BASE_URL}/api/product/${productId}/reviews/${reviewId}`,
        { method: 'DELETE' },
        accessToken
      );

      return response.success;
    } catch (error) {
      if (error instanceof Object && 'status' in error) {
        const err = error as ReviewError;
        if (err.status === 403) {
          throw new Error('You do not have permission to delete this review');
        }
        if (err.status === 404) {
          throw new Error('Review not found');
        }
      }
      throw error;
    }
  },

  
  async reactToReview(
    product: Product | number | string | undefined | null,
    reviewId: number,
    value: number = 1
  ): Promise<ReviewDto> {
    try {
      const productId = getProductNumericId(product);

      if (!productId) {
        throw new Error('Product ID is required');
      }

      if (!reviewId || typeof reviewId !== 'number') {
        throw new Error('Review ID is required');
      }

      const response = await makeRequest<ApiResponse<ReviewDto>>(
        `${PRODUCT_BASE_URL}/api/product/${productId}/reviews/${reviewId}/react?value=${value}`,
        { method: 'POST' }
      );

      if (!response.data) {
        throw new Error('No review data returned from server');
      }

      return response.data;
    } catch (error) {
      if (error instanceof Object && 'status' in error) {
        const err = error as ReviewError;
        if (err.status === 404) {
          throw new Error('Review not found');
        }
      }
      throw error;
    }
  },
};




export function isReviewUnauthorized(error: unknown): boolean {
  return (
    error instanceof Object &&
    'status' in error &&
    (error as ReviewError).status === 401
  ) ||
  (error instanceof Error &&
    (error.message.includes('Unauthorized') ||
      error.message.includes('401') ||
      error.message.includes('User identity not found')));
}


export function isReviewForbidden(error: unknown): boolean {
  return (
    error instanceof Object &&
    'status' in error &&
    (error as ReviewError).status === 403
  ) ||
  (error instanceof Error &&
    (error.message.includes('Forbidden') ||
      error.message.includes('403') ||
      error.message.includes('permission')));
}


export function isReviewDuplicate(error: unknown): boolean {
  return (
    error instanceof Object &&
    'status' in error &&
    (error as ReviewError).status === 409
  ) ||
  (error instanceof Error &&
    (error.message.includes('already reviewed') ||
      error.message.includes('409') ||
      error.message.includes('Conflict')));
}


export function isValidationError(error: unknown): boolean {
  return (
    error instanceof Object &&
    'status' in error &&
    (error as ReviewError).status === 400
  ) ||
  (error instanceof Error &&
    (error.message.includes('Rating must be between') ||
      error.message.includes('required') ||
      error.message.includes('400') ||
      error.message.includes('BadRequest')));
}


export function getReviewErrorMessage(error: unknown): string {
  if (isReviewUnauthorized(error)) {
    return 'Please log in to review this product';
  }
  if (isReviewForbidden(error)) {
    return 'You do not have permission to perform this action';
  }
  if (isReviewDuplicate(error)) {
    return 'You have already reviewed this product';
  }
  if (isValidationError(error)) {
    return error instanceof Error ? error.message : 'Invalid review data';
  }
  return getErrorMessage(error);
}console