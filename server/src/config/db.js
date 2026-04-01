import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // Debug: show connection target (hide password)
  const safeUri = uri?.replace(/:([^@]+)@/, ':****@');
  console.log('🔗 Connecting to:', safeUri);

  // Debug: test DNS resolution
  try {
    const host = uri?.match(/@([^/]+)\//)?.[1];
    if (host) {
      const addresses = await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
      console.log('✅ DNS SRV resolved:', addresses.map(a => a.name).join(', '));
    }
  } catch (dnsErr) {
    console.error('❌ DNS SRV lookup failed:', dnsErr.message);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (error.reason) {
      console.error('❌ Reason:', JSON.stringify(error.reason, null, 2));
    }
    process.exit(1);
  }
};
