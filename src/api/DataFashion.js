import { axiosClient, axiosClientMultipart } from "./API";

export const getAllDataFashion = () => {
  const url = `/get-data-fashion`;
  return axiosClient.get(url);
}
export const getmonth = (id) => {
  const url = `/month/${id}`;
  return axiosClient.get(url);
}
export const addDataFashion = (month) => {
  console.log(month, 'month')
  const url = `/data-fashion-add`;
  return axiosClient.post(url, month);
};

export const removeMonth = (month) => {
  console.log(month, '3ed')
  const url = `/month-remove`;
  return axiosClient.post(url, month);
};

export const uploadDataDataFashion = (data) => {
  const url = `/data-fashion-upload`;
  return axiosClient.post(url, data);
};

export const getAllImage = () => {
  const url = `/getall-image`;
  return axiosClient.get(url);
}
export const uploadImage = (data) => {
  console.log(data, 'data')
  const url = `/upload-image`;
  return axiosClientMultipart.post(url, data);
};
