// module 模組 < package < framework 框架
// express is a package，完整到足以被稱為是框架
const connection = require("./utils/db")
require("dotenv").config();
// 導入 express 這個 package
const express = require("express");
// 利用 express 建立一個 express application app
let app =  express();


// npm i body-parser
// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({extended: false}));
// 但是, express 在某版本後，有把 express.urlencoded 加回來所以可以直接用
// 加上這個中間件，我們就可以解讀 post 過來的資料
app.use(express.urlencoded({extended: false}));

// 前端送 json data, express 才能解析
app.use(express.json());

// 想要拿到 cookie
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//想要可以處理 session 
const expressSession = require("express-session");
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
}));

// 可以指定一個或多個目錄是「靜態資源目錄」
// 自動幫你為 public 裡面的檔案建立路由
app.use(express.static("public"));


// pug 
// 第一個是變數
// 第二個是檔案夾名稱
app.set("views", "views");
// 告訴 express 我們用的 view engine 是 pug
app.set ("view engine", "pug");

// 把 req.session 設定給 res.locals
app.use(function (req, res, next){
    // 把 request 的 session 資料設定給 res 的 locals
    // views 就可以取得資料
    res.locals.member = req.session.member;
    next();
})

app.use(function (req, res, next) {
    // 因為訊息只希望被顯示一次，所以傳到 viws 一次後，就刪掉
    if (req.session.message){
        res.locals.message = req.session.message;
        delete req.session.message;
    }
    next();
});

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
let apiRouter = require("./routes/api");
app.use("/api", apiRouter);
let authRouter = require("./routes/auth");
app.use("/auth", authRouter);
let memberRouter = require("./routes/member");
const { resolve } = require("bluebird");
app.use("/member", memberRouter);



// app.use(function (err, req, res, next){
//     console.log(err.message);
//     res.status(500);
//     res.send("500 - Internal Server Error")
// })

// 路由 router
app.get("/", function(req, res){
    // res.end("Hello Express");
    res.cookie("lang", "zh-TW");
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


// 前面的路由都找不到
// app.use(function (req, res, next){
//     res.status(404);
//     res.render("404");
// })

// 500 error
//一定要有4個參數
// app.use(function (err, req, res, next){
//     console.log(err.message);
//     res.status(500);
//     res.send("500 - Internal Server Error")
// })


app.listen(3000, async () => {
    // 在 web server 開始的時候去連線資料庫
    await connection.connectAsync();
    console.log("我跑起來了喔 在 port 3000");
});