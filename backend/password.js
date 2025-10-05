import bcrypt from "bcryptjs";
async function hashPassword(plainPassword) {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  return hashedPassword;
}

// Usage
(async () => {
  const password = "master@123";
  const hashed = await hashPassword(password);
  console.log('Hashed password:', hashed);
})();
