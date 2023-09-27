const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const ClientError = require('../../exceptions/ClientError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(albumsService, cacheService) {
    this._pool = new Pool();
    this._albumsService = albumsService;
    this._chacheService = cacheService;
  }

  async addAlbumLike(albumId, userId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal disukai');
    }
    await this._chacheService.delete(`likes:${albumId}`);
    return result.rows[0].id;
  }

  async isUserLiked(albumId, userId) {
    await this._albumsService.getAlbumById(albumId);
    const query = {
      text: 'SELECT * FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new ClientError('Album pernah Anda sukai');
    }
  }

  async getAlbumLike(albumId) {
    try {
      const result = await this._chacheService.get(`likes:${albumId}`);
      return {
        likes: JSON.parse(result),
        cached: true,
      };
    } catch (error) {
      const query = {
        text: 'SELECT user_id FROM album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      if (!result.rowCount) {
        throw new NotFoundError('Album tidak ada');
      }
      await this._chacheService.set(`likes:${albumId}`, JSON.stringify(result.rowCount));
      return {
        likes: result.rowCount,
        cached: false,
      };
    }
  }

  async deleteAlbumLike(albumId, userId) {
    await this._albumsService.getAlbumById(albumId);
    const query = {
      text: 'DELETE FROM album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Unlike gagal dilakukan');
    }
    await this._chacheService.delete(`likes:${albumId}`);
  }
}
module.exports = AlbumLikesService;
