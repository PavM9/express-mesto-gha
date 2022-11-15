function validateUrl(url) {
  const regex = /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i;
  if (regex.test(url)) {
    return url;
  }
  throw new Error('Введен некорректный url');
}

module.exports = { validateUrl };
