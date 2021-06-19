const express = require("express");
// 可以把 router 想成一個小的、獨立的應用（跟app應用差不多）
const router = express.Router();
const connection = require("../utils/db")

router.get("/", async (req, res) => {
    let queryResults = await connection.queryAsync("SELECT * FROM stock;");
    res.render("stock/list", {stocks: queryResults});
});

router.get("/:stockCode", async (req, res) => {
    // res.send(req.params.stockCode);
    let queryResults = await connection.queryAsync("SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date;", req.params.stockCode);
    res.render("stock/detail", {stockPrices: queryResults});
});


module.exports = router;

