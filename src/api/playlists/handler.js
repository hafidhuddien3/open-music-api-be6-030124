class PlaylistsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postPlaylistByIdSongHandler = this.postPlaylistByIdSongHandler.bind(this);
    this.getPlaylistByIdSongsHandler = this.getPlaylistByIdSongsHandler.bind(this);
    this.deletePlaylistByIdSongHandler = this.deletePlaylistByIdSongHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this.validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this.service.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.service.getPlaylists({ credentialId });

    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },

    });
    response.code(200);
    return response;
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.verifyPlaylistOwner(id, credentialId);

    await this.service.deletePlaylistById(id);
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async postPlaylistByIdSongHandler(request, h) {
    this.validator.validateSongInPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    const { id: credentialId } = request.auth.credentials;
    await this.service.verifyPlaylistOwner(playlistId, credentialId);

    await this.service.addSongInPlaylist({ playlistId, songId });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan di Playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistByIdSongsHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.verifyPlaylistOwner(playlistId, credentialId);

    const playlist = await this.service.getSongsInPlaylistById({ playlistId, credentialId });
    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deletePlaylistByIdSongHandler(request, h) {
    this.validator.validateSongInPlaylistPayload(request.payload);
    const { songId } = request.payload;

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.service.verifyPlaylistOwner(playlistId, credentialId);

    await this.service.deleteSongInPlaylistById({ songId });
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari Playlist',
    });
    response.code(200);
    return response;
  }
}
module.exports = PlaylistsHandler;
