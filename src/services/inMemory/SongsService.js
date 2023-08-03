const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({
    title, year, genre, performer, duration, albumid,
  }) {
    const id = `song-${nanoid(16)}`;
    const newSong = {
      id, title, year, genre, performer, duration, albumid,
    };
    this._songs.push(newSong);
    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;
    if (!isSuccess) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }
    return id;
  }

  getSongs() {
    this._songs.map(({ id, title, performer }) => ({
      id,
      title,
      performer,
    }));
    return this._songs;
  }

  getSongById(id) {
    const song = this._songs.filter((s) => s.id === id)[0];
    if (!song) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return song;
  }

  editSongById(id, {
    title, year, genre, performer, duration, albumid,
  }) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui catatan, ID tidak ditemukan');
    }
    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      genre,
      performer,
      duration,
      albumid,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new NotFoundError('Catatan gagal dihapus, ID tidak ditemukan');
    }
    this._songs.splice(index, 1);
  }
}
module.exports = SongsService;