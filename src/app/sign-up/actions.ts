import axios from "axios";

export async function checkUsernameUnique(username: string) {
  const { data: responseData } = await axios.get(
    `/api/check-username-unique?username=${username}`
  );
  return responseData;
}

export async function submitSignUpData(inputData: any) {
  const { data: responseData } = await axios.post("/api/sign-up", inputData);
  return responseData;
}
