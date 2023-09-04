const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '2.0.0',
  register: async (server, {
    service, pActivitiesService, validator,
  }) => {
    const playlistHandler = new PlaylistsHandler(
      service,
      pActivitiesService,
      validator,
    );
    server.route(routes(playlistHandler));
  },
};
