// services/paymentService.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lyren-server.onrender.com';


interface PaymentRequest {
    email: string;
    password: string;
    amount: number;
    platform: string;
}

interface PaymentResponse {
    success: boolean;
    message?: string;
    transactionId?: string;
    data?: {
        sym: string;
        amount: number;
        from: string;
        to: string;
        senderNewBalance: number;
        businessNewBalance: number;
    };
}

interface ChainHookResponse {
    client_id: string;
}

interface ApiError {
    message: string;
    status?: number;
}

export const paymentService = {
    /**
     * Process payment through NexTrade
     */
    async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    message: data.message || 'Payment processing failed',
                    status: response.status
                } as ApiError;
            }

            return data as PaymentResponse;
        } catch (error) {
            throw error;
        }
    },

    
    async initiateChainHookPayment(amount: number): Promise<{ authorizeUrl: string; clientId: string }> {
        try {
         
            const response = await fetch(`${API_BASE_URL}/api/payment/ewallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Amount: amount.toFixed(2) }),
            });


            if (!response.ok) {
                let errorMessage = 'Failed to initiate Chain Hook payment';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    const errorText = await response.text();
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                throw {
                    message: errorMessage,
                    status: response.status
                } as ApiError;
            }

            const data = await response.json();

            if (!data.client_id) {
                throw {
                    message: 'Invalid response from server: missing client_id',
                    status: 500
                } as ApiError;
            }
            
            const chainHookBaseUrl = 'https://chain-hook-client.vercel.app';
            const authorizeUrl = `${chainHookBaseUrl}/authorize?client_id=${data.client_id}`;
            
            
            return {
                authorizeUrl,
                clientId: data.client_id
            };
        } catch (error) {
            throw error;
        }
    },

   
    async validateCredentials(email: string, password: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            return data.success === true;
        } catch (error) {
            return false;
        }
    },

    /**
     * Get payment history
     */
    async getPaymentHistory(): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/payment/history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch payment history');
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            return [];
        }
    },

 
    getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === 'object' && error !== null && 'message' in error) {
            return String((error as ApiError).message);
        }
        return 'An unexpected error occurred';
    }
};
