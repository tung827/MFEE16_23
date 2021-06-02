const axios = require('axios');
const fs = require("fs");
const moment = require('moment'); 

function readFileawait(){
  return new Promise((resolve, reject) => {
    fs.readFile("stock.txt", "utf8",  (err, data) => {
      if (err) {
        reject(err)
      }
        resolve(data)
   });
 });
}

async function readFile(){
    try {
        let awaitfile= await readFileawait();
        let result = await axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
            params: {
            response: "json",
            date: moment().format("YYYYMMDD"),
            stockNo: awaitfile,
            },
        });
        if (result.data.stat === "OK" ){
            console.log(result.response.data.date);
            console.log(result.response.data.title);
            console.log(result.response.data.fields);
        }   

    } catch (err) {
      console.log("錯誤", err);
    } finally {
      console.log("讀完檔案了");
    }
  }
  
  
  readFile();