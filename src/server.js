/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/album');
const songs = require('./api/song');
const SongsService = require('./services/postgres/SongsService');
const AlbumService = require('./services/postgres/AlbumsService');

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
  await server.register({
    plugin: albums,
    option: {
      service: albumService,
    },
  });
  await server.register({
    plugin: songs,
    option: {
      service: songsService,
    },
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();