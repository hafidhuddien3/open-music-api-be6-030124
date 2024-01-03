class AlbumsIdLikesHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postAlbumsIdLikesHandler = this.postAlbumsIdLikesHandler.bind(this);
    this.getAlbumsIdLikesHandler = this.getAlbumsIdLikesHandler.bind(this);
    this.deleteAlbumsIdLikesHandler = this.deleteAlbumsIdLikesHandler.bind(this);
  }

  async postAlbumsIdLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.postAlbumsIdLikes({ albumId, credentialId });

    const response = h.response({
      status: 'success',
      message: 'Anda menyukai album',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumsIdLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.deleteAlbumsIdLikes({ albumId, credentialId });
    const response = h.response({
      status: 'success',
      message: 'Anda berhenti menyukai album',
    });
    response.code(200);
    return response;
  }

  async getAlbumsIdLikesHandler(request, h) {
    const { id: albumId } = request.params;
    let cacheStatus = await this.service.checkCache(albumId);
    if (cacheStatus !== 'no') {
      cacheStatus = 'yes';
    }
    // melihat jumlah yang menyukai album
    const number = await this.service.getAlbumsIdLikes(albumId);
    const response = h.response({
      status: 'success',
      data: {
        likes: number,
      },
    });
    response.code(200);
    if (cacheStatus === 'no') {
      // nothing
    } else {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }
}
module.exports = AlbumsIdLikesHandler;
