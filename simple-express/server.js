const connection = require("./utils/db")

// http://expressjs.com/en/starter/hello-world.html
// https://expressjs.com/zh-tw/starter/installing.html
// 導入 express 這個 package
const express = require("express");

// 利用 express 建立一個 express application app
let app =  express();

// module 模組 < package < framework 框架
// express is a package，完整到足以被稱為是框架


// 可以指定一個或多個目錄是「靜態資源目錄」
// 自動幫你為 public 裡面的檔案建立路由
app.use(express.static("public"));

// pug 
// 第一個是變數
// 第二個是檔案夾名稱
app.set("views", "views");
// 告訴 express 我們用的 view engine 是 pug
app.set ("view engine", "pug");

// 在 express 裡
// req -> middlewares.... -> router
// 不管經過哪個 router 都會經過中間件
// middleware 中間件 中介函式
app.use(function (req, res, next){
    let current = new Date();
    console.log(`有人來訪問了喔 在${current}`);
    next();
});


let stockRouter = require("./routes/stock");
app.use("/stock", stockRouter);



// 路由 router
app.get("/", function(req, res){
    // res.end("Hello Express");
    res.render("index");
    // 中間件設定好去讀 views /index.pug
});

//express 由上而下，先找到就會停住。
app.get("/about", function(req, res){
    // res.end("About Express AAAA");
    res.render("about");
});

// app.get("/about", function(req, res){
//     res.end("About Express BBBB");
// });

app.get("/test", function(req, res){
    res.end("Test Express");
});

// app.get("/stock", async (req, res) => {
//     let queryResults = await connection.queryAsync("SELECT * FROM stock;");
//     res.render("stock/list", {stocks: queryResults});
// });

// // TODO:
// // - 模組化
// // - 股票標題
// // - 分頁
// // - 檢查這個股票代碼是否有效（有在我們的列表裡面）
// app.get("/stock/:stockCode", async (req, res) => {
//     // res.send(req.params.stockCode);
//     let queryResults = await connection.queryAsync("SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date;", req.params.stockCode);
//     res.render("stock/detail", {stockPrices: queryResults});
// });


app.listen(3000, async () => {
    // 在 web server 開始的時候去連線資料庫
    await connection.connectAsync();
    console.log("我跑起來了喔 在 port 3000");
});