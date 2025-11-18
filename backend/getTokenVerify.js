require('dotenv').config();
const jwt = require('jsonwebtoken');


const token = process.env.TOKEN;
const secret = process.env.CLERK_SECRET_KEY;

if (!token || !secret) {
  console.error("Missing token or secret in .env file");
  process.exit(1);
}

try {
  const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
  console.log('✅ Token is valid!');
  console.log(decoded);
} catch (err) {
  console.error('❌ Token invalid:', err.message);
}
