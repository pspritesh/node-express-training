/**
 * @param {Boolean} errMsg
 * @param {Boolean} successStatus
 * @param {Array or Object} data
 * @param {Boolean} paginated
 * @returns {Object}
 */
exports.responseObj = (errMsg, successStatus, data, paginated) => {
  const responseObj = {
    'success': successStatus || false,
    'error': errMsg || null,
    'data': data || null
  };

  if (errMsg) {
    return responseObj;
  }

  if (paginated) {
    responseObj.data = data.docs;
    responseObj.page = data.page;
    responseObj.totalDocs = data.totalDocs;
    responseObj.limit = data.limit;
    responseObj.totalPages = data.totalPages;
    responseObj.hasPrevPage = data.hasPrevPage;
    responseObj.hasNextPage = data.hasNextPage;
    responseObj.prevPage = data.prevPage;
    responseObj.nextPage = data.nextPage;
    responseObj.pages = data.pages;
    responseObj.total = data.total;
  } else {
    responseObj.data = data.docs || data;
  }

  return responseObj;
};
