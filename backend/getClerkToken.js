const fs = require('fs');
const jwt = require('jsonwebtoken');

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzEyMyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NTAyMDA3MiwiZXhwIjoxNzU1MDI3MjcyfQ.yzqCO9BSxU6QFS8O77gQ9Px3hcN7HETwCwjpJXS9zEk";

// Clerk ki public key ka path sahi dena
const publicKey = fs.readFileSync('./clerk_public_key.pem');

try {
  const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
  console.log('Token valid:', decoded);
} catch (err) {
  console.log('Token invalid:', err.message);
}
