const InvariantError = require('../../exceptions/InvariantError');
const { postPlaylistPayloadSchema, postSongPlaylistPayloadSchema } = require('./schema');

const PlaylistsValidator = {
  validatePlaylistsPayload: (payload) => {
    const validatorResult = postPlaylistPayloadSchema.validate(payload);
    if (validatorResult.error) {
      throw new InvariantError(validatorResult.error.message);
    }
  },
  validateSongPlaylistPayload: (payload) => {
    const validatorResult = postSongPlaylistPayloadSchema.validate(payload);
    if (validatorResult.error) {
      throw new InvariantError(validatorResult.error.message);
    }
  },
};
module.exports = PlaylistsValidator;
