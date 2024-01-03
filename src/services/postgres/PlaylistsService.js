const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const nano = nanoid(16);
    const id = `playlist-${nano}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists({ credentialId }) {
    const query1 = {
      text: `SELECT *
    FROM playlists
    WHERE playlists.owner = $1`,
      values: [credentialId],
    };
    const query2 = {
      text: `SELECT username
    FROM users
    WHERE users.id = $1`,
      values: [credentialId],
    };

    const resultA = await this.pool.query(query1);
    const resultB = await this.pool.query(query2);
    const result = resultA.rows.map((n) => ({
      id: n.id,
      name: n.name,
      username: resultB,
    }));
    return result;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlists gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongInPlaylist({ playlistId, songId }) {
    const querySong = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const resultSong = await this.pool.query(querySong);

    if (!resultSong.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const nano = nanoid(16);
    const id = `playlist_songs-${nano}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongsInPlaylistById({ playlistId, credentialId }) {
    const query1 = {
      text: `SELECT playlists.* FROM playlists
      WHERE playlists.id = $1
      GROUP by playlists.id`,
      values: [playlistId],
    };

    const query2 = {
      text: `SELECT username
    FROM users
    WHERE users.id = $1`,
      values: [credentialId],
    };

    const query3 = {
      text: `SELECT playlist_songs.*, songs.title, songs.performer
    FROM playlist_songs
    LEFT JOIN songs ON songs.id = playlist_songs.song_id
    WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const resultA = await this.pool.query(query1);
    const resultB = await this.pool.query(query2);
    const resultD = await this.pool.query(query3);
    const resultB1 = resultB.rows.map((n) => ({
      username: n.username,
    }))[0];
    const resultD1 = resultD.rows.map((n) => ({
      id: n.song_id,
      title: n.title,
      performer: n.performer,
    }));
    const resultC = resultA.rows.map((n) => ({
      id: n.id,
      name: n.name,
      username: resultB1.username,
      songs: resultD1,
    }))[0];
    return resultC;
  }

  async deleteSongInPlaylistById({ songId }) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING id',
      values: [songId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE playlists.id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const Playlist = result.rows[0];
    if (Playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses Playlist ini');
    }
  }
}
module.exports = PlaylistsService;
