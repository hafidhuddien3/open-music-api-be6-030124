require('dotenv').config();

const Hapi = require('@hapi/hapi');

const song = require('./api/song');
// const SongsServices = require('./services/inMemory/SongsServices');
const SongsServices = require('./services/postgres/SongsServices');

const { SongValidator } = require('./validator/song');

const init = async () => {
  const songsServices = new SongsServices();
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
    plugin: song,
    options: {
      service: songsServices,
      validator: SongValidator,
    },
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
