/* eslint-disable import/no-extraneous-dependencies */
const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumid: Joi.string(),
});
module.exports = { SongPayloadSchema };