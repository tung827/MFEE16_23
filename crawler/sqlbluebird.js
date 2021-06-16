const axios = require('axios');
const fs = require("fs/promises");
const moment = require('moment'); 
const mysql  = require('mysql');
const Promise = require("bluebird");
require("dotenv").config();

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// 使用 blurebird 將 mysql promise化
connection = Promise.promisifyAll(connection);


// 立即執行
(async function () {
    try {
      // 連接資料庫
      await connection.connectAsync();
  
      // 讀檔案
      let stockId = await fs.readFile("stock.txt", "utf-8");
      console.log(`股票代碼：${stockId}`);
      // 檢查資料庫，看此代碼是否存在
      let result = await connection.queryAsync(
        `SELECT stock_id FROM stock WHERE stock_id = ${stockId}`
      );
      // 檢查資料長度小於等於 0 代表沒有資料，如果沒有資料就需要抓資料
      if (result.length <= 0) {
        // 到網站查詢名稱
        let response = await axios.get(
          `https://www.twse.com.tw/zh/api/codeQuery?query=${stockId}`
        );
        console.log(response);
        // 處理資料，取得該股票代碼
        let filedata = response.suggestions.shift();
        let filedataSplit = filedata.split("\t");
        // 將股票代碼存進資料庫
        if (filedataSplit.length > 1) {  
        connection.queryAsync(
            `INSERT INTO stock (stock_id, stock_name) VALUES ('${filedataSplit[0]}', '${filedataSplit[1]}');`
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      connection.end();
    }
  })();
  










