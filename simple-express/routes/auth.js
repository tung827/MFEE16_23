const express = require("express");
const router = express.Router();
const connection = require("../utils/db");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const multer = require("multer");
const path = require("path");

// 設定上傳檔案的儲存方式
const myStorage = multer.diskStorage({
  destination: function(req, file, cb){
    // routes/auth.js -> 現在的位置
    // public/upload -> 希望找到的位置
    // /routes/../public/upload
    cb(null, path.join(__dirname, "../", "public", "upload"));
  },
  // 抓出副檔名，組合出自己想要的檔案名稱
  filename: function(req, file, cb){
    const ext = file.originalname.split('.').pop();
    cb(null, `${file.filename}-${Date.now()}.${ext}`)
  }
});

// 要用 multer 來做一個上傳工具
const uploader = multer({
  storage: myStorage,
  //檢查檔案類似驗證效果
  fileFilter: function(req, file, cb) {
    if (file.mimetype !== "image/jpeg") {
      return cb(new Error("不合法的 file type"), false);
    }
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("是不合格的副檔名"));
    }
    // 檔案ok，接受這個檔案
    cb(null,true);
  },
  // limits: {
  //   // 1M
  //   fileSize: 1024 * 1024,
  // }
});


// 註冊
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// 註冊表單驗證規則
const registerRules = [
  // 檢查 email 格式
  body("email").isEmail().withMessage("請正確輸入 Email 格式"),
  // 長度至少6位數
  body("password").isLength({ min: 6 }),
  // 確認密碼一致
  body("confirmPassword").custom((value, { req }) => {
    return value === req.body.password;
  }),
];

router.post("/register", uploader.single('photo'), registerRules, async(req, res, next) => {
  // 加上中間函式（express.encolded）的設定可以透過req.body來取得 post 資料
  console.log(req.body);
  // validateResult 取得驗證結果
  const validateResult = validationResult(req);
  // 判斷不是空的，就是有問題（暫時這樣做）
  if(!validateResult.isEmpty()) {
      // console.log(validateResult);
      return next(new Error("註冊表單資料有問題"));
  }
  // 先檢查這個 email 是否已經註冊過
  let checkResult = await connection.queryAsync("SELECT * FROM members WHERE email = ?", req.body.email);
  // 大於0，代表有資料就可以存資料
  if(checkResult.length > 0) {
      return next(new Error("已經註冊過了"));
  }
  console.log(req.file);
  let result = await connection.queryAsync("INSERT INTO members (email, password, name, photo) VALUES (?);",
  [[req.body.email, await bcrypt.hash(req.body.password, 10), req.body.name, `/upload/${req.file.filename}`]]
  );
  res.send("註冊成功");
});



// 登入
router.get("/login", (req, res) => {
  res.render("auth/login");
});


// const loginRules = [
//   body("email").isEmail(),
//   body("password").isLength({ min: 6 }),
// ];

// router.post("/login", loginRules, (req, res) => {
//   console.log(req.body)
//   res.send("登入結果？");
// });

// const validateResult = validationResult(req);
// if(!validateResult.isEmmpty()) {
//   return next(new Error("註冊表單資料有問題"));
// }

// // 檢查一下這個 email 是否存在
// let member = await connection.queryAsync(
//   "SELECT * FROM members WHERE email = ?",
//   req.body.email
// );


module.exports = router;
