//初始化古诗词获取
var xhr = new XMLHttpRequest();
xhr.open("get", "https://v1.jinrishici.com/all.txt");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    var gushici = document.getElementById("gushici");
    if (gushici) gushici.innerText = xhr.responseText;
  }
};
xhr.send();

$(".col-sm-1").click(function () {
  window.open(chrome.runtime.getURL("html/background.html"));
});
