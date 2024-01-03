const { nanoid } = require('nanoid');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this.albumsSimple = [];
    this.songsSimple = [];
    this.songs = [];

    /* let user2={};
let user={
    name:"hhh",
    age:87,
};

user2.name=user.name;
user2.age=user.age;

console.log(user2); */
  }

  addAlbum({ name, year }) {
    /** kode disembunyikan */
    const nano = nanoid(16);
    const id = `album-${nano}`;

    if (!name || !year || typeof name !== 'string' || typeof year !== 'number') {
      throw new Error('Gagal memperbarui album. Mohon isi nama album');
    }

    const albumSimple = {
      id,
      name,
      year,
    };

    this.albumsSimple.push(albumSimple);

    const isSuccess = this.albumsSimple.filter((n) => n.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return id;
  }

  getAlbumById(id) {
    /** kode disembunyikan */

    const album = this.albumsSimple.filter((n) => n.id === id)[0];
    if (!album) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return album;
  }

  editAlbumById(id, { name, year }) {
    /** kode disembunyikan */
    const index = this.albumsSimple.findIndex((n) => n.id === id);

    if (!name || !year || typeof name !== 'string' || typeof year !== 'number') {
      throw new Error('Gagal memperbarui album. Mohon isi nama album');
    }
    if (index !== -1) {
      this.albumsSimple[index] = {
        ...this.albumsSimple[index],
        name,
        year,
      };
    } else {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  deleteAlbumById(id) {
    /** kode disembunyikan */

    const index = this.albumsSimple.findIndex((n) => n.id === id);

    if (index !== -1) {
      this.albumsSimple.splice(index, 1);
    } else { throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan'); }
  }

  addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    /** kode disembunyikan */
    const nano = nanoid(16);
    const id = `song-${nano}`;

    if (typeof title !== 'string' || typeof year !== 'number' || typeof genre !== 'string'
  || typeof performer !== 'string') {
      throw new Error('Gagal menambahkan lagu. Mohon isi nama lagu');
    }

    const songSimple = {
      id,
      title,
      performer,
    };
    this.songsSimple.push(songSimple);

    const song = {
      id,
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    };
    this.songs.push(song);

    const isSuccess = this.songs.filter((n) => n.id === id).length > 0;

    if (isSuccess) {
      return id;
    }
    throw new InvariantError('Lagu gagal ditambahkan');
  }

  getSongs() {
    return this.songsSimple;
  /** kode disembunyikan */
  }

  getSongById(id) {
  /** kode disembunyikan */
    const song = this.songs.filter((n) => n.id === id)[0];

    if (song !== undefined) {
      return song;
    }
    throw new NotFoundError('Lagu tidak ditemukan');
  }

  editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
  /** kode disembunyikan */
    const index = this.songs.findIndex((n) => n.id === id);

    if (typeof title !== 'string'
  || typeof year !== 'number'
  || typeof genre !== 'string'
  || typeof performer !== 'string') {
      throw new Error('Gagal memperbarui lagu. Mohon isi nama lagu');
    }
    if (index !== -1) {
      this.songsSimple[index] = {
        ...this.songsSimple[index],
        title,
        performer,
      };
      this.songs[index] = {
        ...this.songs[index],
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      };
    } else {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  deleteSongById(id) {
  /** kode disembunyikan */
    const index = this.songs.findIndex((n) => n.id === id);

    if (index !== -1) {
      this.songs.splice(index, 1);
    } else {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
