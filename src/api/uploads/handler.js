const autoBind = require('auto-bind');

class UploadCoverHandler {
  constructor(service, albumService, validator) {
    this._service = service;
    this._albumService = albumService;
    this._validator = validator;
    autoBind(this);
  }

  async postUploadCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    this._validator.validateAlbumCover(cover.hapi.headers);
    const fName = await this._service.writeFile(cover, cover.hapi);
    // const album = await this._albumService.getAlbumById(id);
    // if (album.cover)
    const fUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${fName}`;
    await this._albumService.addCoverAlbumById(id, fUrl);
    const response = h.response({
      status: 'success',
      message: 'Cover berhasil diupload',
      data: {
        fileLocation: fUrl,
      },
    });
    response.code(201);
    return response;
  }
}
module.exports = UploadCoverHandler;
