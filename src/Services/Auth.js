import axiosCreate from 'Services/Interceptor';

export function signup(data) {
  return axiosCreate({
    url: '/signup',
    method: 'POST',
    data,
  });
};

export function login(data) {
  return axiosCreate({
    url: '/login',
    method: 'POST',
    data,
  });
};

export function refreshToken(data){
  return axiosCreate({
    url: '/api/token/refresh/',
    method: 'POST',
    data,
  });
}

export function verifyToken(access) {
  return axiosCreate({
    url: '/api/token/verify/',
    method: 'POST',
    data:{
      token: access
    },
  });
};

export function logout() {
  return axiosCreate({
    url: '/logout',
    method: 'GET',
  });
};

export function getUser(access) {
  return axiosCreate({
    url: '/getuser',
    method: 'POST',
    headers: {'Authorization': "Bearer " + access},
  });
};

export function updateUserAxios(data, access) {
  return axiosCreate({
    url: '/api/updateuser',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
      'Authorization': "Bearer " + access
    },
    data
  });
};

export function updateAvatarAxios(data, access) {
  return axiosCreate({
    url: '/api/updateavatar',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
      'Authorization': "Bearer " + access
    },
    data
  });
};
