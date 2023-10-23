import { axiosClient, axiosClientMultipart } from "./API";

export const getAllMonth = () => {
  const url = `/get-data-month`;
  return axiosClient.get(url);
}
export const getmonth = (id) => {
  const url = `/month/${id}`;
  return axiosClient.get(url);
}
export const addMonth = (month) => {
    console.log(month,'month')
  const url = `/month-add`;
  return axiosClient.post(url, month);
};

export const removeMonth = (month) => {
  console.log(month, '3ed')
  const url = `/month-remove`;
  return axiosClient.post(url, month);
};

export const uploadMonth = (data) => {
  const url = `/month-upload`;
  return axiosClient.post(url, data);
};

export const getAllImage = () => {
  const url = `/getall-image`;
  return axiosClient.get(url);
}
export const uploadImage = (data) => {
  console.log(data,'data')
  const url = `/upload-image`;
  return axiosClientMultipart.post(url, data);
};
