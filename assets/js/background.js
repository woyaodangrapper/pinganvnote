var flag = {
  begin: 0,
  change: 0,
}; //当前未开始

var debug = false
var uri = debug ? "http://localhost:5000/" : "https://api.taoistcore.com/"


init_js()

function init_js() {
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
  chrome.storage.sync.set({ overview_webkit: { idN: "overview", _config: 2 } }, function () {
    console.log("初始化右键菜单");
  });
  setInterval(function () {
    chrome.storage.sync.get(["overview_webkit"], function (data) {
      if (data.overview_webkit != null && data.overview_webkit._config === 2) {
        if(!chrome.dabanaiguan_state){
          if(chrome.contextMenus){
            chrome.contextMenus.removeAll(() => {})
          }
          chrome.contextMenus.create({
            id:"dabanaiguan",
            title: "打开大班",
            onclick: function () {
              send({ overview_webkit: { idN: "overview", _config: 0 } })
            },
          });
         
          chrome.contextMenus.create({
            id:"dabanaiguan_update",
            title: "同步文章",
            onclick: function () {
              send({ overview_webkit_update: { idN: "overview", _config: 1 } })
            },
          });

          chrome.contextMenus.create({
            id:"dabanaiguan_get_length",
            title: "等待同步数量",
            onclick: function () {
              send({ overview_webkit_get_length: { idN: "overview", _config: 1 } })
            },
          });

          chrome.dabanaiguan_state = true;
        }
        
      }else{
        if(chrome.dabanaiguan_state)
        {
          chrome.dabanaiguan_state=false
          if(chrome.contextMenus){
            chrome.contextMenus.removeAll(() => {})
          }
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


  function setMD(id) {
    JQX(function() {
      JQX("#editormd-view").html(` <textarea style="display:none;" name="test-editormd-markdown-doc">###Hello world!</textarea>   `)
      var testEditormdView;
      
      JQX.get(uri + "WeatherForecast/get/blogs/md/text/" + id, function(markdown) {
          
        testEditormdView = editormd.markdownToHTML("editormd-view", {
            markdown        : markdown ,//+ "\r\n" + JQX("#append-test").text(),
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
  function get_md_div() {
    let url = uri+"WeatherForecast/get/md"
    var settings = {
      "url": url,
      "method": "GET",
      "timeout": 0,
      async:false
    };
    JQX.ajax(settings).done(function (response) {

      response.fileList.forEach(element => {
      
        // var settings = {
        //   "url": uri+"WeatherForecast/get/md/text?id="+element.id,
        //   "method": "POST",
        //   "timeout": 0,
        // };
        // JQX.ajax(settings).done(function (response) {
        //   console.log(response);
        // });
        moment.locale('zh-cn');
        element.time -= 28800000 
        var time = moment(element.time).format('YYYY-MM-DD HH:mm:ss')
        JQX(".toast-container").append(`
          <div id="container_`+element.id+`" class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">📑<strong style="width: 120px;overflow: hidden;height: 16px;"  title="`+ element.name.split('.')[0] +`" class="me-auto">`+ element.name.split('.')[0] +`</strong><small class="text-muted">`+moment(time, 'YYYY-MM-DD HH:mm:ss').fromNow()+`</small>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">`+element.txt+` </div>
          </div>
        `)
    
      });

      response.fileList.forEach(element => {
        var but = JQX(JQX(JQX("#container_"+element.id)[0]).children(".toast-header")[0]).children("button")[0]
        but
        .onclick = function () {
          let url = uri+"WeatherForecast/get/md/delete?id="+element.id
          var settings = {
            "url": url,
            "method": "DELETE",
            "timeout": 0,
            async:false
          };
          var ajax = JQX.ajax(settings)
          ajax.done(function (response) {
            if(response.code == "0"){
              humane.baseCls="humane-"+"bigbox"
              humane.log("删除成功")
              JQX("#container_"+element.id).remove()
            }
          })
          ajax.fail(function (jqXHR, textStatus, errorThrown) {
            /*错误信息处理*/
            humane.baseCls="humane-"+"bigbox"
            humane.log("删除失败")
          });
        }
      
      });

      JQX("#card-title").html("等待发布 ("+response.fileList.length+")")

    });
  }
  get_md_div()

  function blog_list_initialization() {

    (function () {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src  = "/assets/js/humane.min.js";
      document.getElementsByTagName("head")[0].appendChild(script);
    })();

    JQX(".mail-author-address")[0].onclick = function () {
      window.open(JQX(".mail-author-address").html())
    }
    



    JQX(".btn-danger")[0].onclick = function () {
      var id = this.id
      let url = uri+"WeatherForecast/get/blogs/md/delete?id="+this.id
      var settings = {
        "url": url,
        "method": "DELETE",
        "timeout": 0,
        async:false
      };
      var ajax = JQX.ajax(settings)
      ajax.done(function (response) {
        if(response.code == "0"){
          JQX(("#li_unstyled_" + id)).remove()

          let array = JQX("#list-unstyled").children("li")

          if(array[0]){
            JQX(array[0]).click()
            JQX("#unstyled_" + array[0].id.replace("li_unstyled_",""))[0].click()
            
            humane.baseCls="humane-"+"bigbox"
            humane.log("删除成功")
          }else{
            JQX(".open-email-content").html("")
          }
        
        }
      })
      
      ajax.fail(function (jqXHR, textStatus, errorThrown) {
        /*错误信息处理*/
        humane.baseCls="humane-"+"bigbox"
        humane.log("删除失败")
      });
    }
    JQX("#ticket-wrap")[0].onclick = function () {
      var arr = JQX(".toast-container").children("div")
      
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        var id = element.id.split("_")[1]

        var blogs_state = false
        if(index >= arr.length-1)blogs_state = true

        let url = uri+"WeatherForecast/blog/post?blogs_state="+blogs_state+"&id="+ id
        var settings = {
          "url": url,
          "method": "POST",
          "timeout": 0,
        };
        
        var ajax = JQX.ajax(settings)//,"pointer-events":"none"
        JQX(JQX("#ticket-wrap").children("a")).css({"background-color":"#1f1f1f","cursor":"wait"})
        JQX("#ticket-wrap")[0].onclick = function () {
          alert("同步中..")
        }

        ajax.done(function (response) {
          if(blogs_state){
            humane.baseCls="humane-"+"bigbox"
            humane.log("发布成功")
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
        });
      
        ajax.catch(function (jqXHR, textStatus, errorThrown) {
          /*错误信息处理*/
          if(blogs_state){
            humane.baseCls="humane-"+"bigbox"
            humane.log("同步失败")

            setTimeout(() => {
              location.reload();
            }, 3000);
          }
        });


      }
  
    }
    
    var settings = {
      "url": uri + "WeatherForecast/get/blogs/md",
      "method": "GET",
      "timeout": 0,
      async:false
    };
    JQX.ajax(settings).done(function (response) {

      response.fileList.forEach(element => {
      
        JQX("#list-unstyled").append(`
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
        var but = JQX("#unstyled_"+element.id)[0]
        console.log(but)
        but.onclick = function () {
          var settings = {
            "url": uri+"WeatherForecast/get/blogs/md/text?id="+element.id,
            "method": "POST",
            "timeout": 0,
          };

        
          JQX.ajax(settings).done(function (response) {
            if(response.code == "0"){
              console.log(response)
              JQX('.mail-title').html(response.data.name)
              moment.locale('zh-cn');
              response.time -= 28800000 
              var time = moment(response.time).format('YYYY-MM-DD HH:mm:ss')
              setMD(element.id)

              JQX("#Download").attr("href","http://localhost:5000/WeatherForecast/get/blogs/md/text/" + element.id)
              JQX("#card_title_name").html(response.data.name+".md")
              JQX(".text-secondary").html(response.data.size+"KB")
              JQX(".mail-author-address") .html(response.data.size+"KB")
              var yyyy = moment(response.time).format('YYYY')
              var mm = moment(response.time).format('MM')
              var dd = moment(response.time).format('DD')
              JQX("#server_url").html(`https://blog.taoistcore.com/${yyyy}/${mm}/${dd}/${response.data.name}/`)
            }
          });
          JQX(".btn-danger").attr("id",element.id)
        
        }
      
      });
    });



    let array = JQX("#list-unstyled").children("li")
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      
      element.onclick = function () {
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          JQX(element).attr("class","");
        }

        JQX(this).attr("class","active");//class="active"
      }
    }
    if(!array[0]){
      JQX(".open-email-content").html("")
    }else{
      JQX(array[0]).click()
      JQX("#unstyled_" + array[0].id.replace("li_unstyled_",""))[0].click()
    }

  }

  blog_list_initialization()

  setInterval(() => {
    chrome.storage.sync.get(["bigbox_state"], function (data) {
      if (data.bigbox_state === true) {
        get_md_div()
        runtimeMessageProcessing({bigbox_state : false})
      }
    });
  }, 1000);


  function runtimeMessageProcessing(data) {
    chrome.storage.sync.set(data, function () {
      console.log("保存成功！");
    });
  }
}
