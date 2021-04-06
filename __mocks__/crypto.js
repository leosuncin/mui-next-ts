module.exports = {
  randomBytes(size) {
    return Buffer.from(Array.from({ length: size }, () => 0));
  },
  pbkdf2Sync(password) {
    return Buffer.from(password.split('').reverse().join(''));
  },
};
