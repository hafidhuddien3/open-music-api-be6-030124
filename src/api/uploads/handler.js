class UploadsHandler {
  constructor(service, validator) {
    // private property class
    this.service = service;
    this.validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this.validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this.service[0].writeFile(cover, cover.hapi);

    // data.hapi = parameter meta

    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this.service[1].addAlbumCoverUrl(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;

/* Di mana bila:

environment variable HOST bernilai localhost;
environment variable PORT bernilai 5000; dan
variabel filename bernilai 1621706265086flower.jpg;
Maka fileLocation akan bernilai:

`http://localhost:5000/upload/images/1621706265086flower.jpg` */
