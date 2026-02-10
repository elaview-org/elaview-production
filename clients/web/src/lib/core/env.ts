const env = {
  client: {
    apiUrl: process.env.API_URL!,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  },
};

export default env;
