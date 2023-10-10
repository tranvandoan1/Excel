export const getDataUserLoca = () => {
  //lấy data user từ loca
  const dataLoace = atob(localStorage.getItem('data'));
  const decodedDataLoace = localStorage.getItem('data') == null ? null : JSON.parse(dataLoace).data;
  return decodedDataLoace
}