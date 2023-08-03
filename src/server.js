/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/album');
const songs = require('./api/song');
const ClientError = require('./exceptions/ClientError');
const SongsService = require('./services/postgres/SongsService');
const AlbumValidator = require('./validator/album');
const AlbumService = require('./services/postgres/AlbumsService');
const SongValidator = require('./validator/song');

const init = async () => {
  const songsService = new SongsService();
  const albumService = new AlbumService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
  ]);
  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();