const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '2.0.0',
  register: async (server, { collaborationsService, playlistsService, validator }) => {
    const collaborationHandler = new
    CollaborationsHandler(collaborationsService, playlistsService, validator);
    server.route(routes(collaborationHandler));
  },
};
