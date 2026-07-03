// services/paymentService.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5036';

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
            console.error('Payment processing error:', error);
            throw error;
        }
    },

    /**
     * Validate payment credentials without processing payment
     */
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
            console.error('Validation error:', error);
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
            console.error('Failed to fetch payment history:', error);
            return [];
        }
    },

    /**
     * Get error message from error object
     */
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