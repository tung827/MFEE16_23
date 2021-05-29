const axios = require('axios');

// Make a request for a user with a given ID

axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20210529&stockNo=2330')
  .then(function (response) {
    // handle success
    if(response.data.stat ==="OK")
    console.log(response.data.date);
    console.log(response.data.title);
    console.log(response.data.fields);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  