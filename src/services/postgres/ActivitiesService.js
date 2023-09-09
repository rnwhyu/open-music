const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivities({
    playlistId, songId, userId, action,
  }) {
    const id = `playlistactivity-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlistactivities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, songId, userId, playlistId, time, action],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getActivitiesOnPlaylist(id) {
    const query = {
      text: `SELECT u.username, s.title, pa.action, pa.time FROM playlistactivities pa 
      LEFT JOIN users u ON pa.user_id = u.id LEFT JOIN songs s on pa.song_id = s.id 
      WHERE pa.playlist_id = $1 ORDER BY pa.time ASC`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Activity tidak ditemukan');
    }
    return result.rows;
  }
}
module.exports = PlaylistActivitiesService;
