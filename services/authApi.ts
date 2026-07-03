




export interface ApiError {
  message: string;
  status: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}



export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResetRequest {
  password: string;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  isStaff: boolean;
  isAdmin: boolean;
  createTime: string;
  updateTime: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
}



export interface Color {
  colorName: string;
  colorCode: string;
}

export interface Size {
  size: string;
}

export interface Image {
  image: string;
  type: 'main' | 'gallery' | 'thumbnail';
}

export interface Product {
  id: number;           
  encodedId: string;    
  name: string;
  count: number;
  miniDesc: string;
  description: string;
  careDetails: string;
  price: number;
  discount: number;
  injectorUser: string;
  category: string;
  collection: string;
  colors: Color[];
  sizes: Size[];
  images: Image[];
  averageRating: number;
  reviewCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateProductRequest {
  name: string;
  count: number;
  miniDesc: string;
  description: string;
  careDetails: string;
  price: number;
  discount: number;
  injectorUser: string;
  category: string;
  collection: string;
  colors: Color[];
  sizes: Size[];
  images: Image[];
}

export interface UpdateProductRequest extends CreateProductRequest {}



const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://lyren-server.onrender.com';
const PRODUCT_BASE_URL = process.env.NEXT_PUBLIC_PRODUCT_API_URL || 'https://lyren-server.onrender.com';



export async function request<T>(
  baseUrl: string,
  path: string,
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

  const url = `${baseUrl}${path}`;

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

    const err: ApiError = { message, status: res.status };
    throw err;
  }

  return body as T;
}



function normalizeProduct(data: any): Product {
  return {
    id: data.id,
    encodedId: data.encodedId || data.EncodedId, 
    name: data.name,
    count: data.count,
    miniDesc: data.miniDesc,
    description: data.description,
    careDetails: data.careDetails,
    price: data.price,
    discount: data.discount,
    injectorUser: data.injectorUser,
    category: data.category,
    collection: data.collection,
    colors: data.colors || [],
    sizes: data.sizes || [],
    images: data.images || [],
    averageRating: data.averageRating || 0,
    reviewCount: data.reviewCount || 0,
    createdAt: data.createTime,
    updatedAt: data.updateTime,
  };
}



export const authApi = {
  register(data: RegisterRequest): Promise<AuthResponse> {
    return request<AuthResponse>(AUTH_BASE_URL, '/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login(data: LoginRequest): Promise<AuthResponse> {
    return request<AuthResponse>(AUTH_BASE_URL, '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  adminLogin(data: LoginRequest): Promise<AuthResponse> {
    return request<AuthResponse>(AUTH_BASE_URL, '/api/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  refreshToken(data: RefreshTokenRequest, accessToken: string): Promise<RefreshResponse> {
    return request<RefreshResponse>(
      AUTH_BASE_URL,
      '/api/auth/refresh-token',
      { method: 'POST', body: JSON.stringify(data) },
      accessToken
    );
  },

  getMe(accessToken: string): Promise<ApiUser> {
    return request<ApiUser>(
      AUTH_BASE_URL,
      '/api/auth/me',
      { method: 'GET' },
      accessToken
    );
  },

  getProfile(accessToken: string): Promise<ApiUser> {
    return request<ApiUser>(
      AUTH_BASE_URL,
      '/api/auth/profile',
      { method: 'GET' },
      accessToken
    );
  },

  logout(accessToken?: string | null): Promise<{ message: string }> {
    return request<{ message: string }>(
      AUTH_BASE_URL,
      '/api/auth/logout',
      { method: 'POST' },
      accessToken
    );
  },

  resetAllData(data: ResetRequest): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      AUTH_BASE_URL,
      '/api/auth/reset-all-data',
      { method: 'POST', body: JSON.stringify(data) }
    );
  },
};



export const productApi = {

    getTrending(): Promise<ApiResponse<Product[]>> {
    return request<ApiResponse<any[]>>(
      PRODUCT_BASE_URL,
      '/api/product/trending'
    ).then(res => ({
      ...res,
      data: res.data?.map(normalizeProduct) || [],
    }));
  },



  create(data: CreateProductRequest, accessToken: string): Promise<ApiResponse<Product>> {
    return request<ApiResponse<any>>(
      PRODUCT_BASE_URL,
      '/api/product',
      { method: 'POST', body: JSON.stringify(data) },
      accessToken
    ).then(res => ({
      ...res,
      data: res.data ? normalizeProduct(res.data) : undefined,
    }));
  },

  getAll(page = 1, pageSize = 12): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    return request<ApiResponse<any>>(
      PRODUCT_BASE_URL,
      `/api/product?${params}`
    ).then(res => ({
      ...res,
      data: res.data ? {
        ...res.data,
        data: res.data.data?.map(normalizeProduct) || [],
      } : undefined,
    }));
  },

  getByEncodedId(encodedId: string): Promise<ApiResponse<Product>> {
    if (!encodedId || typeof encodedId !== 'string') {
      throw new Error('Invalid encodedId provided');
    }
    return request<ApiResponse<any>>(PRODUCT_BASE_URL, `/api/product/by-code/${encodedId}`)
      .then(res => ({
        ...res,
        data: res.data ? normalizeProduct(res.data) : undefined,
      }));
  },

  getById(id: number): Promise<ApiResponse<Product>> {
    if (!id || typeof id !== 'number') {
      throw new Error('Invalid id provided');
    }
    return request<ApiResponse<any>>(PRODUCT_BASE_URL, `/api/product/${id}`)
      .then(res => ({
        ...res,
        data: res.data ? normalizeProduct(res.data) : undefined,
      }));
  },

  update(id: number, data: UpdateProductRequest, accessToken: string): Promise<ApiResponse<Product>> {
    if (!id || typeof id !== 'number') {
      throw new Error('Invalid id provided');
    }
    return request<ApiResponse<any>>(
      PRODUCT_BASE_URL,
      `/api/product/${id}`,
      { method: 'PUT', body: JSON.stringify(data) },
      accessToken
    ).then(res => ({
      ...res,
      data: res.data ? normalizeProduct(res.data) : undefined,
    }));
  },

  delete(id: number, accessToken: string): Promise<ApiResponse<object>> {
    if (!id || typeof id !== 'number') {
      throw new Error('Invalid id provided');
    }
    return request<ApiResponse<object>>(
      PRODUCT_BASE_URL,
      `/api/product/${id}`,
      { method: 'DELETE' },
      accessToken
    );
  },

  search(query: string, page = 1, pageSize = 12): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams({ query, page: page.toString(), pageSize: pageSize.toString() });
    return request<ApiResponse<any>>(
      PRODUCT_BASE_URL,
      `/api/product/search?${params}`
    ).then(res => ({
      ...res,
      data: res.data ? {
        ...res.data,
        data: res.data.data?.map(normalizeProduct) || [],
      } : undefined,
    }));
  },

  getByCategory(category: string, page = 1, pageSize = 12): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    return request<ApiResponse<any>>(
      PRODUCT_BASE_URL,
      `/api/product/category/${category}?${params}`
    ).then(res => ({
      ...res,
      data: res.data ? {
        ...res.data,
        data: res.data.data?.map(normalizeProduct) || [],
      } : undefined,
    }));
  },

  getByCollection(collection: string, page = 1, pageSize = 12): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    return request<ApiResponse<any>>(
      PRODUCT_BASE_URL,
      `/api/product/collection/${collection}?${params}`
    ).then(res => ({
      ...res,
      data: res.data ? {
        ...res.data,
        data: res.data.data?.map(normalizeProduct) || [],
      } : undefined,
    }));
  },

  getReviews(id: number): Promise<ApiResponse<unknown[]>> {
    if (!id || typeof id !== 'number') {
      throw new Error('Invalid product id for reviews');
    }
    return request<ApiResponse<unknown[]>>(PRODUCT_BASE_URL, `/api/product/${id}/reviews`);
  },

  addReview(id: number, review: unknown, accessToken: string): Promise<ApiResponse<unknown>> {
    if (!id || typeof id !== 'number') {
      throw new Error('Invalid product id for reviews');
    }
    return request<ApiResponse<unknown>>(
      PRODUCT_BASE_URL,
      `/api/product/${id}/reviews`,
      { method: 'POST', body: JSON.stringify(review) },
      accessToken
    );
  },
};



export function isUnauthorized(error: unknown): boolean {
  return error instanceof Object && 'status' in error && (error as ApiError).status === 401;
}

export function isForbidden(error: unknown): boolean {
  return error instanceof Object && 'status' in error && (error as ApiError).status === 403;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Object && 'message' in error) {
    return String((error as ApiError).message);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

