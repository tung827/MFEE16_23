const axios = require('axios');
const fs = require("fs/promises");
const moment = require('moment'); 

// function readFilePromise() {
//   return new Promise((resolve, reject) => {
//     fs.readFile("stock.txt", "utf8",  (err, data) => {
//       if (err) {
//         reject(err)
//       }
//         resolve(data)
//    });
//  });
// }cd

fs.readFile("stock.txt", "utf8")
.then((data) => {
  //axios 串接
  return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
    params: {
      response: "json",
      date: moment().format("YYYYMMDD"),
      stockNo: data,
    },
  });
})
.then((response) => {
  if (response.data.stat === "OK" ){
    console.log(response.data.date);
    console.log(response.data.title);
    console.log(response.data.fields);
  }
})
.catch((err) => {
  console.error(err);
});
    
    
  





 