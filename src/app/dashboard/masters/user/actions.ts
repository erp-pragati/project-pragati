import axios from "axios";

export async function getUserMasters() {
  const { data: responseData } = await axios.get(`/api/masters/user`);
  return responseData;
}
