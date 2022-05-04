window.onload = function () {
  console.log("wind loaded");
  document.querySelector("button").addEventListener("click", function () {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      console.log(token);
    });
  });
};
console.log("test");
