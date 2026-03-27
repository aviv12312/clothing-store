const required = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

export const validateEnv = () => {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`❌ חסרים משתני סביבה: ${missing.join(', ')}`);
    process.exit(1);
  }
  console.log('✅ כל משתני הסביבה תקינים');
};
