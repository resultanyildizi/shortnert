const express = require("express");
const app = express();
const dotenv = require("dotenv");
const fetch = require("node-fetch");

const address = "localhost";
const port = 8001;

dotenv.config();

app.use(express.json());
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


// middleware functions

// send get request to /v1/links
app.post("/__middleWare__sendGetLatestLinksRequest", (req, res) => {
  let baseUrl = process.env.SHORTNERT_API_URL;
  let endpoint = `${baseUrl}/v1/links`;

  fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      response.json().then((data) => {
        res.json(data);
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// send shorten request
app.post("/__middleWare__sendShortenRequest", (req, res) => {
  let baseUrl = process.env.SHORTNERT_API_URL;
  let endpoint = `${baseUrl}/v1/links`;

  let data = {
    url: req.body.url,
    alias: req.body.alias,
  };

  fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      response.json().then((data) => {
        res.json(data);
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.listen(port, address, () => {
  console.log(`Example app listening on port ${port}`);
});
