const UploadCoverHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '3.0.0',
  register: async (server, { service, albumService, validator }) => {
    const uploadsCoverHandler = new UploadCoverHandler(service, albumService, validator);
    server.route(routes(uploadsCoverHandler));
  },
};
