var flag = {
  begin: 0,
  change: 0,
}; //当前未开始
/*var d = new Date();
console.log(d.toLocaleString());*/
setInterval(function () {
  var pop = chrome.extension.getViews({ type: "popup" })[0];
  if (pop) {
    console.log(pop.b);
  }
}, 1000);
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  setInterval(function () {
    if (flag.change) {
      var cab = chrome.tabs.connect(tabId);
      cab.postMessage({ flag: flag.begin });
      /*chrome.tabs.connect(tabId);
            chrome.tabs.sendMessage(tabId, { greeting: "hello"});*/
      flag.change = 0;
    }
  }, 100);
});
//-------------------- 右键菜单演示 ------------------------//
var dabanaiguan_state = false;

setInterval(function () {
  chrome.storage.sync.get(["overview_webkit"], function (type) {
    if (type.overview_webkit._config === 2) {
      if(!dabanaiguan_state)
        chrome.contextMenus.create({
          id:"dabanaiguan",
          title: "打开大班记录",
          onclick: function () {
            
            // chrome.storage.sync.set({ overview_webkit: { idN: "overview", _config: 1 } }, function () {
            //   console.log("保存成功！");
            // });
    
            chrome.runtime.sendMessage({greeting: '11111111111'}, function(response) {
      
            });
          },
        });
      dabanaiguan_state = true;
    }else{
      if(dabanaiguan_state)
      {
        dabanaiguan_state=false
        chrome.contextMenus.remove("dabanaiguan")
      }
    }
  });


}, 100);

chrome.contextMenus.create({
  title: "使用度娘搜索：%s", // %s表示选中的文字
  contexts: ["selection"], // 只有当选中文字时才会出现此右键菜单
  onclick: function (params) {
    // 注意不能使用location.href，因为location是属于background的window对象
    chrome.tabs.create({ url: "https://www.baidu.com/s?ie=utf-8&wd=" + encodeURI(params.selectionText) });
  },
});
