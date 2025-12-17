export const password = {
  hash: (pwd: string) => Bun.password.hash(pwd, { algorithm: "bcrypt", cost: 10 }),

  verify: (pwd: string, hash: string) => Bun.password.verify(pwd, hash),
};

export default password;
