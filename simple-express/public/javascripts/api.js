// alert("test")


// $.ajax({
//     type: "GET",
//     url: "/api/stocks",
// }).done(function (data) {
//     console.log(data)
// });

axios.get('/api/stocks')
.then(function (response) {
    console.log(response.data);
})
.catch(function (error) {
    console.log(error);
})