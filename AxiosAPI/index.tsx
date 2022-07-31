import axios from "axios";

const baseURL = "/api";

function GetWithoutToken<T> (api:string) {
  const resResult = axios.get<T>(baseURL + api);
  return resResult;
}
  
function DeleteWithoutToken<T> (api:string, param:string) {
  return axios.delete<T>(baseURL + api + param);
}

function PostWithoutToken<T> (api:string, data:any) {
  return axios.post<T>(baseURL + api, data);
}

//using get method to fetch data
export function getMembers (api:string) {
  const data = GetWithoutToken<any>(api);
  return data;
}

//using delete method to delete data by id
export function deleteMembers (api:string, param:string) {
  const data = DeleteWithoutToken<any>(api, param);
  return data;
}

//using post method to post data
export function postMembers (api:string, param:string) {
  const data = PostWithoutToken<any>(api, param);
  return data;
}