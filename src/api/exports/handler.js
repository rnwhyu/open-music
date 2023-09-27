const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;
    autoBind(this);
  }

  async postExportSongPlaylistHandler(request, h) {
    this._validator.validateExportSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { targetEmail } = request.payload;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const message = {
      playlistId,
      targetEmail,
    };
    await this._service.sendMessage('export:playlists', JSON.stringify(message));
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}
module.exports = ExportsHandler;
