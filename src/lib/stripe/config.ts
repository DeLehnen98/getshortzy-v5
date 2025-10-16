import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

/**
 * Credit packages available for purchase
 */
export const CREDIT_PACKAGES = {
  starter: {
    id: 'starter',
    name: 'Starter Pack',
    credits: 10,
    price: 999, // $9.99 in cents
    priceId: process.env.STRIPE_PRICE_STARTER || '',
    popular: false,
    features: [
      '10 video uploads',
      'AI transcription',
      'Viral moment detection',
      'Basic clip generation',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro Pack',
    credits: 50,
    price: 3999, // $39.99 in cents
    priceId: process.env.STRIPE_PRICE_PRO || '',
    popular: true,
    savings: 20, // 20% savings
    features: [
      '50 video uploads',
      'AI transcription',
      'Viral moment detection',
      'Premium clip generation',
      'Priority processing',
    ],
  },
  business: {
    id: 'business',
    name: 'Business Pack',
    credits: 150,
    price: 9999, // $99.99 in cents
    priceId: process.env.STRIPE_PRICE_BUSINESS || '',
    popular: false,
    savings: 33, // 33% savings
    features: [
      '150 video uploads',
      'AI transcription',
      'Viral moment detection',
      'Premium clip generation',
      'Priority processing',
      'Dedicated support',
    ],
  },
} as const;

/**
 * Subscription plans
 */
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: '',
    credits: 3, // Free credits per month
    interval: 'month' as const,
    features: [
      '3 videos per month',
      'Basic transcription',
      'Standard quality clips',
      'Community support',
    ],
  },
  creator: {
    id: 'creator',
    name: 'Creator',
    price: 1999, // $19.99/month
    priceId: process.env.STRIPE_PRICE_CREATOR_MONTHLY || '',
    credits: 25,
    interval: 'month' as const,
    popular: true,
    features: [
      '25 videos per month',
      'AI transcription',
      'Viral moment detection',
      'HD clip generation',
      'Priority support',
      'Analytics dashboard',
    ],
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    price: 9999, // $99.99/month
    priceId: process.env.STRIPE_PRICE_AGENCY_MONTHLY || '',
    credits: 200,
    interval: 'month' as const,
    features: [
      '200 videos per month',
      'AI transcription',
      'Viral moment detection',
      '4K clip generation',
      'Priority processing',
      'Dedicated support',
      'Team collaboration',
      'White-label options',
      'API access',
    ],
  },
} as const;

/**
 * Credit costs for different actions
 */
export const CREDIT_COSTS = {
  VIDEO_UPLOAD: 1,
  TRANSCRIPTION: 0, // Included in upload
  VIRAL_ANALYSIS: 0, // Included in upload
  CLIP_GENERATION: 0, // Included in upload (up to 5 clips)
  ADDITIONAL_CLIP: 0.2, // Per clip beyond first 5
} as const;

/**
 * Stripe webhook events we handle
 */
export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  PAYMENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_FAILED: 'payment_intent.payment_failed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
} as const;

/**
 * Format price in cents to display format
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Calculate savings percentage
 */
export function calculateSavings(regularPrice: number, discountedPrice: number): number {
  return Math.round(((regularPrice - discountedPrice) / regularPrice) * 100);
}

/**
 * Get credit package by ID
 */
export function getCreditPackage(id: string) {
  return CREDIT_PACKAGES[id as keyof typeof CREDIT_PACKAGES];
}

/**
 * Get subscription plan by ID
 */
export function getSubscriptionPlan(id: string) {
  return SUBSCRIPTION_PLANS[id as keyof typeof SUBSCRIPTION_PLANS];
}

