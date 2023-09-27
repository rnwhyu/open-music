const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service) {
    this._service = service;
    autoBind(this);
  }

  async likeAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.isUserLiked(id, credentialId);
    await this._service.addAlbumLike(id, credentialId);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil disukai',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { likes, cached } = await this._service.getAlbumLike(id);
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    if (cached) {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }

  async unlikeAlbumByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.deleteAlbumLike(id, credentialId);
    return {
      status: 'success',
      message: 'Successfully unlike the album',
    };
  }
}
module.exports = AlbumLikesHandler;
