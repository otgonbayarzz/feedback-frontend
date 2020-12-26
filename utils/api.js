import axios from "axios";

const api_url = "http://localhost:3001";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export default class ApiService {
  async login(userName, password) {
    const url = `${api_url}/api/login`;
    const oBody = {
      user_name: userName,
      password: password,
    };

    let res = await axios
      .create({
        timeout: 40000,
      })
      .post(url, oBody)
      .catch(function (error) {
        console.log(error);
      });

    return res.data;
  }

  async logout() {
    const url = `${api_url}/api/logout`;
    const oBody = {
      Authorization: localStorage.getItem("Authorization"),
    };

    let res = await axios
      .create({
        timeout: 40000,
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .post(url, oBody)
      .catch(function (error) {
        console.log(error);
      });

    return res.data;
  }

  async getCompany() {
    const url = `${api_url}/api/company`;
    let res = await axios
      .create({
        timeout: 40000,
        mode: "cors",
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .get(url)
      .catch(function (error) {
        console.log(error);
      });
      

    return res.data;
  }
}
