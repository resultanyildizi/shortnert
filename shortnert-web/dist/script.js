let conflictErrorText = "Alias already exists";
let otherErrorText = "There was an error shortening your URL. Please try again.";
let successText = "You can copy your shortened URL and paste it on your browser.";

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

function sendPostRequest() {
  let url = "http://localhost:8000/v1/links";
  let data = {
    url: urlValue,
    key: aliasValue,
  };

  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        aliasValue = generateRandomAlias();
        aliasEl.value = aliasValue;
        urlValue = "";
        urlEl.value = urlValue;
        successEl.style.display = "block";
        errorEl.style.display = "none";
      });
      successEl.innerHTML = successText;
    } else {
      if(response.status == 409) {
        errorEl.innerHTML = conflictErrorText;
      } else {
        errorEl.innerHTML = otherErrorText;
      }
      successEl.style.display = "none";
      errorEl.style.display = "block";
    }
  });
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
