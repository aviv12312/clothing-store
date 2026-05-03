const required = [
  'PORT',
  'MONGODB_URI',
  'CLIENT_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

const optionalGroups = [
  {
    name: 'Stripe payments',
    keys: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
  },
  {
    name: 'PayPal payments',
    keys: ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET'],
  },
  {
    name: 'Cloudinary uploads',
    keys: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
  },
  {
    name: 'AI chat',
    keys: ['GROQ_API_KEY'],
  },
  {
    name: 'Email delivery',
    keys: ['BREVO_API_KEY', 'EMAIL_USER'],
  },
];

export const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  optionalGroups.forEach((group) => {
    const missingOptional = group.keys.filter((key) => !process.env[key]);
    if (missingOptional.length > 0) {
      console.warn(`${group.name} is not fully configured. Missing: ${missingOptional.join(', ')}`);
    }
  });

  console.log('Required environment variables are configured');
};
