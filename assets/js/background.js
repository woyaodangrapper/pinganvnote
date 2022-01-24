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
chrome.dabanaiguan_state = false;

setInterval(function () {
  chrome.storage.sync.get(["overview_webkit"], function (type) {
    if (type.overview_webkit._config === 2) {
      if(!chrome.dabanaiguan_state){
        chrome.contextMenus.remove("dabanaiguan")
        chrome.contextMenus.create({
          id:"dabanaiguan",
          title: "打开大班",
          onclick: function () {
            send({ overview_webkit: { idN: "overview", _config: 0 } })
          },
        });
        chrome.dabanaiguan_state = true;
      }
      
    }else{
      if(chrome.dabanaiguan_state)
      {
        chrome.dabanaiguan_state=false
        chrome.contextMenus.remove("dabanaiguan")
      }
    }
  });

}, 300);

chrome.contextMenus.create({
  title: "随手记：%s", // %s表示选中的文字
  contexts: ["selection"], // 只有当选中文字时才会出现此右键菜单
  onclick: function (params) {
    // 注意不能使用location.href，因为location是属于background的window对象
    chrome.tabs.create({ url: "https://www.baidu.com/s?ie=utf-8&wd=" + encodeURI(params.selectionText) });
  },
});


// 获取当前选项卡ID
function getCurrentTabId(callback)
{
  console.log(chrome.tabs)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
  {
    if(callback) callback(tabs.length ? tabs[0].id: null);
  });
}

var send_state = false

function send(msg) {

  if(send_state){
    getCurrentTabId((tabId) => {
 
      var port = chrome.tabs.connect(tabId, {name: 'test-connect'});
      port.postMessage({question: msg});
      // port.onMessage.addListener(function(msg) {
      //   alert('收到长连接消息：'+msg.answer);
      //   if(msg.answer && msg.answer.startsWith('我是'))
      //   {
      //     port.postMessage({question: '哦，原来是你啊！'});
      //   }
      // });
      
    });


  }

}

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    // console.log('收到来自content-script的消息：');
    // console.log(request, sender, sendResponse);
    // alert(JSON.stringify(request))
    var data = request
    if(data.greeting === "mdinit"){
      send_state = true
    }

    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));

});
let uri = "http://localhost:5000/"

function setMD(id) {
  $(function() {
    JQ("#editormd-view").html(` <textarea style="display:none;" name="test-editormd-markdown-doc">###Hello world!</textarea>   `)
    var testEditormdView;
    
    $.get("http://localhost:5000/WeatherForecast/get/blogs/md/text/" + id, function(markdown) {
        
      testEditormdView = editormd.markdownToHTML("editormd-view", {
          markdown        : markdown ,//+ "\r\n" + $("#append-test").text(),
          //htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
          htmlDecode      : "style,script,iframe",  // you can filter tags decode
          //toc             : false,
          tocm            : true,    // Using [TOCM]
          //tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
          //gfm             : false,
          //tocDropdown     : true,
          // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
          emoji           : true,
          taskList        : true,
          tex             : true,  // 默认不解析
          flowChart       : true,  // 默认不解析
          sequenceDiagram : true,  // 默认不解析
      });
        

    });

  });
}
function blog_list_initialization() {

  (function () {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = "/assets/js/humane.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);
  })();

  JQ(".mail-author-address")[0].onclick = function () {
    window.open(JQ(".mail-author-address").html())
  }
   
  let url = uri+"WeatherForecast/get/md"
  var settings = {
    "url": url,
    "method": "GET",
    "timeout": 0,
    async:false
  };
  JQ.ajax(settings).done(function (response) {

    response.fileList.forEach(element => {
     
      // var settings = {
      //   "url": uri+"WeatherForecast/get/md/text?id="+element.id,
      //   "method": "POST",
      //   "timeout": 0,
      // };
      // JQ.ajax(settings).done(function (response) {
      //   console.log(response);
      // });
      moment.locale('zh-cn');
      element.time -= 28800000 
      var time = moment(element.time).format('YYYY-MM-DD HH:mm:ss')
      JQ(".toast-container").append(`
        <div id="container_`+element.id+`" class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">📑<strong style="width: 120px;overflow: hidden;height: 16px;"  title="`+ element.name.split('.')[0] +`" class="me-auto">`+ element.name.split('.')[0] +`</strong><small class="text-muted">`+moment(time, 'YYYY-MM-DD HH:mm:ss').fromNow()+`</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">`+element.txt+` </div>
        </div>
      `)
  
    });

    response.fileList.forEach(element => {
      var but = JQ(JQ(JQ("#container_"+element.id)[0]).children(".toast-header")[0]).children("button")[0]
      but
      .onclick = function () {
        let url = uri+"WeatherForecast/get/md/delete?id="+element.id
        var settings = {
          "url": url,
          "method": "DELETE",
          "timeout": 0,
          async:false
        };
        var ajax = JQ.ajax(settings)
        ajax.done(function (response) {
          if(response.code == "0"){
            humane.baseCls="humane-"+"bigbox"
            humane.log("删除成功")
            JQ("#container_"+element.id).remove()
          }
        })
        ajax.error(function (jqXHR, textStatus, errorThrown) {
          /*错误信息处理*/
          humane.baseCls="humane-"+"bigbox"
          humane.log("删除失败")
        });
      }
     
    });

    JQ("#card-title").html("等待发布 ("+response.fileList.length+")")

  });


  JQ(".btn-danger")[0].onclick = function () {
    var id = this.id
    let url = uri+"WeatherForecast/get/blogs/md/delete?id="+this.id
    var settings = {
      "url": url,
      "method": "DELETE",
      "timeout": 0,
      async:false
    };
    var ajax = JQ.ajax(settings)
    ajax.done(function (response) {
      if(response.code == "0"){
        JQ(("#li_unstyled_" + id)).remove()

        let array = JQ("#list-unstyled").children("li")

        if(array[0]){
          $(array[0]).click()
          $("#unstyled_" + array[0].id.replace("li_unstyled_",""))[0].click()
          
          humane.baseCls="humane-"+"bigbox"
          humane.log("删除成功")
        }else{
          $(".open-email-content").html("")
        }
       
      }
    })
    ajax.error(function (jqXHR, textStatus, errorThrown) {
      /*错误信息处理*/
      humane.baseCls="humane-"+"bigbox"
      humane.log("删除失败")
    });
  }
  
  var settings = {
    "url": uri + "WeatherForecast/get/blogs/md",
    "method": "GET",
    "timeout": 0,
    async:false
  };
  JQ.ajax(settings).done(function (response) {

    response.fileList.forEach(element => {
     
      JQ("#list-unstyled").append(`
        <li  id="li_unstyled_`+element.id+`"><a href="#">
        <div id="unstyled_`+element.id+`" class="email-list-item">
          <div class="email-author">
          <span class="author-name">`+ element.name.split('.')[0] +`</span><span class="email-date">15m ago</span></div>
          <div class="email-info"><span class="email-subject">est dolor fringilla mauris,nec tristique magna </span><span class="email-text">Lorem ipsum dolor sit amet,consectetur adipiscing </span></div>
        </div>
        </a></li>
      `)
  
  
    });
    response.fileList.forEach(element => {
      var but = JQ("#unstyled_"+element.id)[0]
      console.log(but)
      but.onclick = function () {
        var settings = {
          "url": uri+"WeatherForecast/get/blogs/md/text?id="+element.id,
          "method": "POST",
          "timeout": 0,
        };

      
        JQ.ajax(settings).done(function (response) {
          if(response.code == "0"){
            console.log(response)
            JQ('.mail-title').html(response.data.name)
            moment.locale('zh-cn');
            response.time -= 28800000 
            var time = moment(response.time).format('YYYY-MM-DD HH:mm:ss')
            setMD(element.id)

            JQ("#Download").attr("href","http://localhost:5000/WeatherForecast/get/blogs/md/text/" + element.id)
            JQ("#card_title_name").html(response.data.name+".md")
            JQ(".text-secondary").html(response.data.size+"KB")
            
            JQ(".mail-other-info").html("<span>"+time+"</span>")
          }
        });
        JQ(".btn-danger").attr("id",element.id)
        console.log("巴比q")
      }
     
    });
  });



  let array = JQ("#list-unstyled").children("li")
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    
    element.onclick = function () {
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        JQ(element).attr("class","");
      }

      JQ(this).attr("class","active");//class="active"
    }
  }
  if(!array[0]){
    $(".open-email-content").html("")
  }else{
    $(array[0]).click()
    $("#unstyled_" + array[0].id.replace("li_unstyled_",""))[0].click()
  }

}

blog_list_initialization()

