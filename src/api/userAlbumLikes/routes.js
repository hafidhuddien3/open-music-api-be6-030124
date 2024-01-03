const routes = (handler) => [

  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.postAlbumsIdLikesHandler(request, h),
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.deleteAlbumsIdLikesHandler(request, h),
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.getAlbumsIdLikesHandler(request, h),
    /* options: {
      auth: 'songsapp_jwt',
    }, */
  },
];

module.exports = routes;
