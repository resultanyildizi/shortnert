const express = require("express");
const app = express();

const address = "localhost";
const port = 8001;

app.use(express.static(__dirname + "/dist"));

// dist/index.html
// just root
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

// just favicon
app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/dist/favicon.png");
});

// any other key after /
app.get("/:key", (req, res) => {
  let baseurl = "http://sh.resultanyildizi.com/";
  let endpoint = baseurl + "api/v1/links/" + req.params.key;

  fetch(endpoint)
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          res.redirect(data.url);
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => {
      res.redirect("/");
    });
});

app.listen(port, address, () => {
  console.log(`Example app listening on port ${port}`);
});
