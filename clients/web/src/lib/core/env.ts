const env = {
  client: {
    apiUrl: process.env.API_URL!,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
  },
};

export default env;
