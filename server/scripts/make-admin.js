require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const email = process.argv[2]?.toLowerCase();
if (!email) { console.error('Usage: node scripts/make-admin.js user@example.com'); process.exit(1); }
(async () => {
  await mongoose.connect(process.env.DB_CONNECTION, { dbName: process.env.DB_NAME || 'cprg312_portfolio' });
  const result = await User.updateOne({ email }, { $set: { role: 'admin' } });
  if (!result.matchedCount) throw new Error('Account not found');
  console.log('Admin role assigned to', email);
})().catch(err => { console.error(err); process.exitCode = 1; }).finally(() => mongoose.disconnect());
