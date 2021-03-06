import axios from 'axios'

const axiosCreate = axios.create({
  baseURL: process.env.REACT_APP_SERVER_HOST_URL,
  timeout: 30000,
});

axiosCreate.interceptors.request.use(
  req => {
    console.log(">>> Interceptor.req :", req)
    return req;
  }
  // ,
  // error => {
  //   console.log(">>> Interceptor.req.error :", error)
  //   Promise.reject(error);
  // }
);

axiosCreate.interceptors.response.use(
  resp => {
    console.log(">>> Interceptor.resp: " , resp)
    return resp
  }
  // ,
  // error => {
  //   console.log(">>> Interceptor.resp.error: ", error)
  //
  //   return Promise.reject(error)
  // }
);

export default axiosCreate;
