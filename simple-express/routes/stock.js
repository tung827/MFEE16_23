const express = require("express");
// 可以把 router 想成一個小的、獨立的應用（跟app應用差不多）
const router = express.Router();
const connection = require("../utils/db");

router.get("/", async (req, res) => {
  let queryResult = await connection.queryAsync("SELECT * FROM stock");
  res.render("stock/list", { stocks: queryResult });
});

router.get("/:stockCode", async (req, res, next) => {
  // 檢查是否有這個代碼
  let stock = await connection.queryAsync(
    "SELECT * FROM stock WHERE stock_id=?;",
    req.params.stockCode
  );

  if (stock.length === 0) {
    // throw new Error("查無代碼");
    next(); // 落入 404 這個中間件
  }
  stock = stock[0];

  // 分頁
  // 一頁有幾筆？
  // 現在在第幾頁？
  // 總共有多少筆？ --> 總頁數

  // 總共有幾筆？？
  let count = await connection.queryAsync(
    "SELECT COUNT(*) as total FROM stock_price WHERE stock_id=?;",
    req.params.stockCode
  );
  //console.log(count);
  const total = count[0].total;
  // 規定一頁有10筆
  const perPage = 10;
  // 無條件進位
  const lastPage = Math.ceil(total / perPage);
  // 現在在第幾頁（預設第一頁）
  const currentPage = req.query.page || 1;
  // page 1-> 0
  // page 2-> 10
  // page 3-> 20
  const offset = (currentPage - 1) * perPage;

  // res.send(req.params.stockCode);
  let queryResult = await connection.queryAsync(
    "SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date LIMIT ? OFFSET ?;",
    [req.params.stockCode, perPage, offset]
  );

  res.render("stock/detail", {
    stock,
    stockPrices: queryResult,
    pagination: {
      lastPage,
      currentPage,
      total,
    },
  });
});

module.exports = router;
