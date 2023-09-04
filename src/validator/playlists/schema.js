const Joi = require('joi');

const postPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});
const postSongPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});
module.exports = { postPlaylistPayloadSchema, postSongPlaylistPayloadSchema };
