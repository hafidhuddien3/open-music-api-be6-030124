const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/jpg', 'image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

/* Untuk daftar mime/type yang digunakan pada gambar, Anda bisa melihat
daftar lengkapnya pada dokumentasi MIME types yang disediakan MDN. */

module.exports = { ImageHeadersSchema };
