const express = require("express");
const router = express.Router();

router.get("/stocks", async(req, res) => {
    let queryResult = await connection.queryAsync("SELECT * FROM stock");
    res.json(queryResult);
});

module.exports = router;