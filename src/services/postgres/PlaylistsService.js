const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/InvariantError');

class PlaylistsService {
  constructor(pActivitiesService) {
    this._pool = new Pool();
    this._pActivitiesService = pActivitiesService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, owner, createdAt],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal dibuat');
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result;
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus, ID tidak ditemukan');
    }
  }

  async addSongToPlaylist(songId, playlistId, userId) {
    const songQuery = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const isSong = await this._pool.query(songQuery);
    if (!isSong.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    const query = {
      text: 'INSERT INTO songsplaylist VALUES($1, $2)',
      values: [songId, playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dimasukkan');
    }
    await this._pActivitiesService.addPlaylistActivities({
      songId, userId, playlistId, action: 'delete',
    });
  }

  async getSongsInPlaylist(id) {
    const playlistQuery = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer FROM songs s
      LEFT JOIN songsplaylist sp ON s.id = sp.song_id
      WHERE sp.playlist_id = $1`,
      values: [id],
    };
    const result = await this._pool.query({
      ...playlistQuery.rows[0],
      songs: songsQuery.rows,
    });
    return result;
  }

  async deleteSongInPlaylist(songId, playlistId, userId) {
    const query = {
      text: 'DELETE FROM songsplaylist WHERE song_id =$1 AND playlist_id = $2',
      values: [songId, playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('ID lagu tidak ditemukan');
    }
    await this._pActivitiesService.addPlaylistActivities({
      songId, userId, playlistId, action: 'delete',
    });
  }
  // async verifyPlaylistAccess(playlistId, userId) {
  //   try {
  //     await this.verifyPlaylistOwner(playlistId, userId);
  //   } catch (error) {
  //     if (error instanceof NotFoundError) {
  //       throw error;
  //     }
  //     try {
  //       await this._collaborationSe
  //     }
  //   }
  // }
}
module.exports = PlaylistsService;
