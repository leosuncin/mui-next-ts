module.exports = {
  randomBytes(size) {
    return Buffer.from(Array(size).fill(0));
  },
  pbkdf2Sync(password) {
    return Buffer.from(
      password
        .split('')
        .reverse()
        .join(''),
    );
  },
};
