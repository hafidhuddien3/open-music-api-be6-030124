const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
  }

  async postAlbumsIdLikes({ albumId, credentialId }) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };
    const resultAlbum = await this.pool.query(queryAlbum);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    // mengecek jika sudah like
    const query1 = {
      text: `SELECT * FROM user_album_likes
    WHERE user_id = $1 AND album_id = $2 `,
      values: [credentialId, albumId],
    };

    const resultA = await this.pool.query(query1);

    if (resultA.rows.length > 0) {
      throw new InvariantError('Anda sudah menyukai album ini');
    }

    const nano = nanoid(16);
    const id = `user_album_likes-${nano}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, credentialId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Menyukai album gagal ditambahkan');
    }

    await this.cacheService.delete(`jumlah like ${albumId}`);

    return result.rows[0].id;
  }

  async deleteAlbumsIdLikes({ albumId, credentialId }) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };
    const resultAlbum = await this.pool.query(queryAlbum);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [credentialId, albumId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Menyukai album gagal dihapus. Id tidak ditemukan');
    }

    await this.cacheService.delete(`jumlah like ${albumId}`);
  }

  async checkCache(albumId) {
    try {
      // mendapatkan catatan dari cache
      const result = await this.cacheService.get(`jumlah like ${albumId}`);
      return JSON.parse(result);
    } catch (error) {
      return 'no';
    }
  }

  async getAlbumsIdLikes(albumId) {
    try {
      // mendapatkan dari cache
      const result = await this.cacheService.get(`jumlah like ${albumId}`);
      return JSON.parse(result);
    } catch (error) {
      // bila gagal, diteruskan dengan mendapatkan dari database
      const query1 = {
        text: `SELECT * FROM user_album_likes
  WHERE album_id = $1`,
        values: [albumId],
      };
      let result = await this.pool.query(query1);
      result = result.rows.length;

      // catatan akan disimpan pada cache sebelum fungsi getNotes dikembalikan
      await this.cacheService.set(`jumlah like ${albumId}`, JSON.stringify(result));/// ///////////

      return result;
    }
  }
}
module.exports = UserAlbumLikesService;
