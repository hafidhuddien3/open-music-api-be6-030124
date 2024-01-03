class ExportsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this.validator.validateExportPlaylistPayload(request.payload);

    const { playlistId: id } = request.params;
    const { id: owner } = request.auth.credentials;

    await this.service[1].verifyPlaylistOwner(id, owner);

    const message = {
      targetEmail: request.payload.targetEmail,
      playlistId: id,
    };

    await this.service[0].sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}
module.exports = ExportsHandler;
