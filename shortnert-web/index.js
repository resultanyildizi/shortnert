const express = require("express");
const app = express();
const dotenv = require("dotenv");
const fetch = require("node-fetch");

const address = "localhost";
const port = 8001;

dotenv.config();

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

// any other alias after /
app.get("/:alias", (req, res) => {
  let baseurl = process.env.SHORTNERT_API_URL;
  let endpoint = baseurl + "/v1/links/" + req.params.alias;

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
