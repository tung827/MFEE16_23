const axios = require('axios');
const fs = require("fs/promises");
const moment = require('moment'); 
const mysql  = require('mysql');
require("dotenv").config();

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
});

connection.connect();


fs.readFile("stock.txt", "utf8")
.then((data) => {
//    console.log (`股票,${data}`);
  //先檢查資料庫有無這個代碼
  connection.query(
    `SELECT stock_id FROM stock WHERE stock_id = ${data}`, function (err ,result) {
        if (err) {
            throw err;
        }
        if (result.length === 0) {
            return axios.get(`https://www.twse.com.tw/zh/api/codeQuery?query=${data}`); 
        }
    }); 
})
.then((response) => {
//   console.log(response.data);
// [ '2330\t台積電', '2330R\t台積甲', '2330T\t台積丙' ]

  let resdata = response.data.suggestions.shift();
//   console.log(resdata); //   2330 台積電

  let resdatasplit = resdata.split("\t");
//   console.log(resdatasplit); //  ['2330', '台積電']

//檢查股票有無有這個代號，if > 1 ==有這個代號 ，輸入進去資料庫
if (resdatasplit.length > 1) {
    connection.query(
        `INSERT INTO stock (stock_id, stock_name) VALUES ('${resdatasplit[0]}', '${resdatasplit[1]}');`, function (err ,result) {
        if (err){
            throw err;
        }
        console.log(result);
      });
 } else {
   throw "查無此名稱";
 }
})
.catch((err) => {
  console.error(err);
})
.finally(() => {
  connection.end();
});
    





      
      