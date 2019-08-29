import axiosCreate from 'Services/Interceptor';
import _forEach from 'lodash/forEach';

export function upsertImageAxios(data, access) {
  return axiosCreate({
    url: '/api/upsert',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
      'Authorization': "Bearer " + access
    },
    data,
  });
};


export function getImageAxios(userId, page, imgPerPage, tags) {
  var reqUrl = `/api/getimage/?`
  var and = ``
  if (userId){ reqUrl += and + `userId=${userId}`; and = `&`}
  if (page){ reqUrl += and + `page=${page}`; and = `&`}
  if (imgPerPage){ reqUrl += and + `imgPerPage=${imgPerPage}`; and = `&`}
  if (tags) {
    var tagsStr = ""
    _forEach(tags, (tag, idx) => {
      tagsStr += and + `tags=${tag}`
    })
    reqUrl += tagsStr
  }
  return axiosCreate({
    url: reqUrl,
    method: 'GET',
  });
};

export function getTagsAxios() {
  var reqUrl = `/api/gettags`

  return axiosCreate({
    url: reqUrl,
    method: 'GET',
  });
};

export function getImageByUserIdAxios(access) {
  var reqUrl = `/api/getuserimage`

  return axiosCreate({
    url: reqUrl,
    method: 'GET',
    headers: {
      'Authorization': "Bearer " + access
    },
  });
};
