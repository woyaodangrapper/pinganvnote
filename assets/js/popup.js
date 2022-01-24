JQ("#popup_close").click(function () {
 
  
});

// console.log(chrome)
// 新标签打开网页
JQ('#open_url_new_tab_github').click(() => {
	chrome.tabs.create({url: 'https://github.com/light-come/Chrome-Big'});
});

// 打开后台页
JQ('#open_background').click(e => {
	window.open(chrome.extension.getURL('background.html'));
});

// // 向content-script主动发送消息
// function sendMessageToContentScript(message, callback)
// {
//   getCurrentTabId((tabId) =>
//   {
//     chrome.tabs.sendMessage(tabId, message, function(response)
//     {
//       if(callback) callback(response);
//     });
//   });
// }
// // 获取当前选项卡ID
// function getCurrentTabId(callback)
// {
//   console.log(chrome.tabs)
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
//   {
//     if(callback) callback(tabs.length ? tabs[0].id: null);
//   });
// }

// setInterval(() => {
    
//   sendMessageToContentScript('你好，我是popup！', (response) => {
//     if(response) alert('收到来自content-script的回复：'+response);
//   });

//   getCurrentTabId((tabId) => {
// 		var port = chrome.tabs.connect(tabId, {name: 'test-connect'});
// 		port.postMessage({question: '你是谁啊？'});
// 		port.onMessage.addListener(function(msg) {
// 			alert('收到长连接消息：'+msg.answer);
// 			if(msg.answer && msg.answer.startsWith('我是'))
// 			{
// 				port.postMessage({question: '哦，原来是你啊！'});
// 			}
// 		});
// 	});
//   console.log('11111')
// }, 1000);