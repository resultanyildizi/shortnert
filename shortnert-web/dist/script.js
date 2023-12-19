let conflictErrorText = "Alias already exists";
let otherErrorText =
  "There was an error shortening your URL. Please try again.";
let successText =
  "You can copy your shortened URL and paste it on your browser.";

let urlEl = document.getElementById("url");
let aliasEl = document.getElementById("alias");
let previewEl = document.getElementById("preview");
let buttonEl = document.getElementById("button");
let successEl = document.getElementById("success");
let errorEl = document.getElementById("error");

let previewBase = document.location.origin + "/";

var aliasValue = "";
var urlValue = "";

// Document loaded

document.addEventListener("DOMContentLoaded", function (event) {
  aliasValue = generateRandomAlias();
  aliasEl.value = aliasValue;
  previewEl.innerHTML = previewBase + aliasValue;

  sendGetLatestLinksRequest();
});

urlEl.addEventListener("input", function (e) {
  urlValue = urlEl.value;
});

aliasEl.addEventListener("input", function (e) {
  aliasValue = aliasEl.value;
  previewEl.innerHTML = previewBase + aliasValue;
});

previewEl.addEventListener("click", function (e) {
  copyToClipboard();
});

buttonEl.addEventListener("click", function (e) {
  e.preventDefault();

  if (isValidAlias(aliasValue) == false) return;
  if (isValidHttpUrl(urlValue) == false) return;

  sendPostRequest();
});

let baseUrl = "http://localhost:8001";

function sendGetLatestLinksRequest() {
  let endpoint = `${baseUrl}/__middleWare__sendGetLatestLinksRequest`;

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4) {
      if (xmlHttp.status == 200) {
        let links = JSON.parse(xmlHttp.responseText);

        let tableBody = document.getElementById("urls");
        
        // Clear table
        tableBody.innerHTML = "";

        for (let i = 0; i < links.length; i++) {
          let link = links[i];

          let row = document.createElement("tr");

          let url = document.createElement("td");
          url.innerHTML = `<a class='link' href="${link.url}">${link.alias}</a>`;

          row.appendChild(url);

          tableBody.appendChild(row);
        }
      } else {
        console.log("Error");
      }
    }
  };
  xmlHttp.open("POST", endpoint, true);
  xmlHttp.setRequestHeader("Content-Type", "application/json");
  xmlHttp.send();
}

function sendPostRequest() {
  let endpoint = `${baseUrl}/__middleWare__sendShortenRequest`;
  let data = {
    url: urlValue,
    alias: aliasValue,
  };

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4) {
      if (xmlHttp.status == 200 || xmlHttp.status == 201) {
        aliasValue = generateRandomAlias();
        aliasEl.value = aliasValue;
        urlValue = "";
        urlEl.value = urlValue;
        successEl.style.display = "block";
        errorEl.style.display = "none";
        successEl.innerHTML = successText;
        sendGetLatestLinksRequest();
      } else if (xmlHttp.status == 409) {
        errorEl.innerHTML = conflictErrorText;
        successEl.style.display = "none";
        errorEl.style.display = "block";
      } else {
        errorEl.innerHTML = otherErrorText;
        successEl.style.display = "none";
        errorEl.style.display = "block";
      }
    }
  };
  xmlHttp.open("POST", endpoint, true);
  xmlHttp.setRequestHeader("Content-Type", "application/json");
  xmlHttp.send(JSON.stringify(data));
}

function isValidAlias(alias) {
  let regex = /^[a-zA-Z0-9]{3,15}$/;
  return regex.test(alias);
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function generateRandomAlias() {
  // It will include numbers, lowercase and uppercase letters

  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

function copyToClipboard() {
  let text = previewEl.innerHTML;
  navigator.clipboard.writeText(text).then(
    function () {
      navigator.vibrate(200);
    },
    function (err) {},
  );
}
