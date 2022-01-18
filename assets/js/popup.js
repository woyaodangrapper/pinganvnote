JQ("#popup_close").click(function () {
 
  
});

// console.log(chrome)
// 新标签打开网页
JQ('#open_url_new_tab_github').click(() => {
	chrome.tabs.create({url: 'https://github.com/light-come/Chrome-Big'});
});

