import axios from "axios";
import moment from 'moment'


const api_url = process.env.api_url || "http://localhost:3001";

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

  async getCompany(pageNumber, perPage, stationNo, itemName, startDate, endDate) {
    let eDate = "";
    let sDate = "";
    if (startDate && startDate.length > 0) {
      let tmp = new Date(startDate)
      tmp.setHours(9);
      tmp.setMinutes(0);
      console.log(tmp);
      sDate = moment(tmp).format("YYYY-MM-DD HH:mm");
      console.log(sDate);
    }
    if (endDate && endDate.length > 0) {
      let ttmp = new Date(endDate);
      ttmp.setHours(8);
      ttmp.setMinutes(59);
      console.log(ttmp);
      eDate = moment(ttmp).add(1, 'days').format("YYYY-MM-DD HH:mm");
      console.log(eDate);



    }
    const url = `${api_url}/api/payment/?pageNumber=${pageNumber}&stationNo=${stationNo}&itemName=${itemName}&startDate=${sDate}&endDate=${eDate}`;
    console.log(url);
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
  async getFile(pageNumber, perPage, stationNo, itemName, startDate, endDate) {
    let eDate = "";
    let sDate = "";
    if (startDate && startDate.length > 0) {
      let tmp = new Date(startDate)
      tmp.setHours(9);
      tmp.setMinutes(0);
      console.log(tmp);
      sDate = moment(tmp).format("YYYY-MM-DD HH:mm");
      console.log(sDate);
    }
    if (endDate && endDate.length > 0) {
      let ttmp = new Date(endDate);
      ttmp.setHours(8);
      ttmp.setMinutes(59);
      console.log(ttmp);
      eDate = moment(ttmp).add(1, 'days').format("YYYY-MM-DD HH:mm");
      console.log(eDate);



    }
    const url = `${api_url}/api/paymentDownload/?pageNumber=${pageNumber}&stationNo=${stationNo}&itemName=${itemName}&startDate=${sDate}&endDate=${eDate}`;


    return axios({
      url: url, //your url
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Тайлан.xlsx'); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
    // return axios
    //   .create({
    //     timeout: 40000,
    //     mode: "cors",
    //     headers: {
    //       Authorization: localStorage.getItem("Authorization"),
    //     },
    //   })
    //   .get(url).then(response => {
    //     const blob = new Blob([response.data], {
    //       type: response.data.type
    //     });

    //     //レスポンスヘッダからファイル名を取得します
    //     const contentDisposition = response.headers["content-disposition"];
    //     const fileName = "Тайлан.xls"

    //     //ダウンロードします
    //     saveAs(blob, fileName);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

  }



}

