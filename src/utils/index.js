const mapDBToModel3 = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumid,
}) => ({
  id, title, year, genre, performer, duration, albumId: albumid,
});

const mapDBToModel = ((n) => ({
  id: n.id,
  title: n.title,
  performer: n.performer,
}));

const mapDBToModel2 = ((n) => ({
  id: n.id,
  name: n.name,
  year: n.year,
  coverUrl: n.coverurl,
}));

const mapDBToModelgetPlaylist = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

module.exports = {
  mapDBToModel, mapDBToModel2, mapDBToModel3, mapDBToModelgetPlaylist,
};
