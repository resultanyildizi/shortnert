const express = require("express");
const app = express();
const port = 3000;

app.use(express.static(__dirname + "/dist"));

// dist/index.html
// just root
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

// any other key after /
app.get("/:key", (req, res) => {
  // redirect to the original url

  // get the url from the server
  let endpoint =
    "http://shortnert.resultanyildizi.com/api/v1/links/" + req.params.key;

  fetch(endpoint).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        console.log(data);
        res.redirect(data.url);
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
