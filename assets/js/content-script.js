(function () {
  document.addEventListener("DOMContentLoaded", init_md);
  function init_md() {
  

    if (window.name !== "iframeName" && window.parent == window) {
      console.log("\n %c 大班164 v0.1.0 欢迎主人记笔记哦~ 主人么么哒~ %c https://github.com/light-come/Chrome-Big \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;");
      addCustomjsText(`
      // 通过DOM事件发送消息给content-script
      var customEvent = document.createEvent('Event');
      customEvent.initEvent('myCustomEvent', true, true);
      // 通过事件发送消息给content-script
      function sendMessageToContentScriptByEvent(data) {
        data = data || '你好，我是大班-script!';
        var hiddenDiv = document.getElementById('myCustomEventDiv');
        hiddenDiv.innerText = data
        hiddenDiv.dispatchEvent(customEvent);
      }
      window.sendMessageToContentScriptByEvent = sendMessageToContentScriptByEvent;

      `);
      var _narrow = `
      JQ(".chrome-plugin-panel").css('display','block');


      JQ(".overview-logo").css('display','block');
      JQ("#overview-div").css({left:'11px'});
      JQ("#overview-div").css({top:'11px'});
      JQ("#overview-div").css({height:'17px'});
      
      JQ("#overview-div").css({width:'100px'})
      JQ(".overview-narrow").css('display','none');
      JQ(".overview-enlarge").css('display','block');
      JQ("#overview-div").css({ right: "auto"})
      JQ(".iframe_editormd").css('display','none');
      JQ("#overview_title").css("display", "none");
      JQ("#badge_bg_secondary_new").css("display", "none");
      
      `;
      var narrow = `
        JQ(".overview-logo").css('display','block');
        JQ("#overview-div").animate({left:'11px'},100,"linear",function(){});
        JQ("#overview-div").animate({top:'11px'},100,"linear",function(){});
        JQ("#overview-div").animate({height:'17px'},100,"linear",function(){});
        
        JQ("#overview-div").animate({width:'100px'},100,"linear",function(){
          JQ(".overview-narrow").css('display','none');
          JQ(".overview-enlarge").css('display','block');
          JQ("#overview-div").css({ right: "auto"})
          JQ(".iframe_editormd").css('display','none');
          JQ("#overview_title").css("display", "none");
          JQ("#badge_bg_secondary_new").css("display", "none");
        });
        
      `;

      var _enlarge = `
        JQ(".chrome-plugin-panel").css('display','block');

        JQ(".overview-logo").css('display','none');
        JQ("#overview-div").css({right:'0px'});
        JQ("#overview-div").css({ bottom: "auto"})
        JQ("#overview-div").css({ left: "0px"})
        JQ("#overview-div").css({top:'61px'});

        JQ("#overview-div").css({height:'85%'});
        JQ("#overview-div").css({width:'94%'})
        JQ(".overview-narrow").css('display','block');
        JQ(".overview-enlarge").css('display','none');
        JQ(".iframe_editormd").css('display','block');
        JQ("#overview_title").css("display", "block");
        JQ("#badge_bg_secondary_new").css("display", "block");
      `;
      var enlarge = `
        JQ(".overview-logo").css('display','none');
        JQ("#overview-div").animate({right:'0px'},100,"linear",function(){
          JQ("#overview-div").css({ bottom: "auto"})
          JQ("#overview-div").css({ left: "0px"})
        });
      
        JQ("#overview-div").animate({top:'61px'},100,"linear",function(){
        });

        JQ("#overview-div").animate({height:'85%'},100,"linear",function(){
          
        });
        JQ("#overview-div").animate({width:'94%'},100,"linear",function(){
          JQ(".overview-narrow").css('display','block');
          JQ(".overview-enlarge").css('display','none');
          JQ(".iframe_editormd").css('display','block');
          JQ("#overview_title").css("display", "block");
          JQ("#badge_bg_secondary_new").css("display", "block");
        });
      `;
      injectCustomJs("/assets/js/jquery-3.6.0.min.js", function () {
        addCustomjsText(
          `JQ(".overview-close").click(function () {
          JQ("#overview-div").animate({opacity:0},100,"linear",function(){
            sendMessageToContentScriptByEvent(JSON.stringify({idN : "overview","_config":2}))
            JQ("#overview-div").remove();
          });
        })
        JQ(".overview-narrow").click(function () {
          sendMessageToContentScriptByEvent(JSON.stringify({idN : "overview","_config":1}))
          ` +
            narrow +
            `
        })
        JQ(".overview-enlarge").click(function () {
          sendMessageToContentScriptByEvent(JSON.stringify({idN : "overview","_config":0}))
          ` +
            enlarge +
            `
        })`
        );
        //文本编辑
        addCustomjsText(`
          JQ(function () {
            //获取class为caname的元素
            JQ("#overview_title").click(function () {
              var td = JQ(this);
              var txt = td.text();
              var input = JQ("<input style='text-align:center;font-size: 1.2em; width: 100%;padding: 7px;border-radius: 25px;color: #171717;line-height: 0;' class='title'  type='text'value='" + txt + "'/>");
              td.html(input);
              input.click(function () {
                return false;
              });
              //获取焦点
              input.trigger("focus");
              //文本框失去焦点后提交内容，重新变为文本
              input.blur(function () {
                var newtxt = JQ(this).val();
                //判断文本有没有修改
                if (newtxt != txt) {
                  td.html(newtxt);
                } else {
                  td.html(newtxt);
                }
                sendMessageToContentScriptByEvent(JSON.stringify({idN : "overview_txt","_config":999,_txt:newtxt}))
              });
            });
          });
        `);
        var overview_webkit_state = undefined;
        if (chrome.overview_webkit_setInterval) {
          clearInterval(chrome.overview_webkit_setInterval);
        }
        chrome.overview_webkit_setInterval = setInterval(() => {
          try {
            chrome.storage.sync.get(["overview_webkit"], function (data) {
              if (overview_webkit_state != data.overview_webkit._config) {
                overview_webkit_state = data.overview_webkit._config;
                console.log(overview_webkit_state, data.overview_webkit._config);
                if (JQ("#overview-div").length === 0 && data.overview_webkit._config !== 2) {
                  init_md();
                }
                addCustomjsText(data.overview_webkit._config == 1 ? _narrow : _enlarge);

                if (data.overview_webkit._config === 2) {
                  addCustomjsText('JQ("#overview-div").remove();');
                }
              }
            });
          } catch (error) {}
        }, 500);
      });

      
      // 注入自定义JS
      initCustomPanel();
     
      initCustomEventListen();
   
      // <script src='humane.js'></script>
      // injectCustomCss("/assets/css/themes/bigbox.css")
      // injectCustomCss("/assets/css/themes/boldlight.css")
      // injectCustomCss("/assets/css/themes/jackedup.css")
      // injectCustomCss("/assets/css/themes/libnotify.css")
      // injectCustomCss("/assets/css/themes/original.css")
      // injectCustomCss("/assets/css/themes/flatty.css")

      // addCustomjsText(`

      //   (function () {
      //     var script = document.createElement("script");
      //     script.type = "text/javascript";
      //     script.src  = "https://cdn.bootcdn.net/ajax/libs/humane-js/2.6.0/humane.min.js";
      //     document.getElementsByTagName("head")[0].appendChild(script);
      //   })();
        
      // `)
      // injectCustomJs("/assets/js/humane.min.js",function () {
      //   addCustomjsText(`
      //     humane.baseCls="humane-"+"bigbox"
      //     humane.log("Welcome Test")
      //   `)
      // },true);

    }
  }

  // function Document_processing_Key(){
  //   if(event.ctrlKey && window.event.keyCode==83 ){
  //     alert("ctrl +s 组合键");
  //   }
  // }
  
  function initCustomPanel() {
    ///editor.md/examples/full.html
    var panel = document.createElement("div");
    panel.id = "overview-div";
    panel.className = "chrome-plugin-panel";

    panel.innerHTML =
      `
      <style>
        .title_overview {
          color: #ffffff;
          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
          line-height: 2.8;
          display: block;
          font-size: 1.5em;
          margin-block-start: 0.83em;
          margin-block-end: 0.83em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
          font-weight: bold;
          text-align: center;
          font-weight: normal;
          margin-bottom: .7em;
        }
       
      </style>
      <div> <p class="title_overview" id="overview_title">大班随手笔记-每天一篇文章，TS-艾略特为你折腰!</p> <span id="badge_bg_secondary_new" class="badge bg-secondary text-dark">New</span></div>
      <style>.iframe_editormd {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        z-index: -2;
        border: medium none;
      }
      .overview-narrow {
        background-repeat: no-repeat;
        background-position: center;
        background-image:url('data:image/svg+xml;base64,PHN2ZyB0PSIxNjI3Mjk3MDk4MjIzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2MDAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTg2Ni45IDQxOC42YzAtMTYuNi0xMy40LTMwLTMwLTMwaC0xNjZjLTE2LjYgMC0zMC0xMy40LTMwLTMwVjE5MS45YzAtMTYuNi0xMy40LTMwLTMwLTMwaC0zYy0xNi42IDAtMzAgMTMuNC0zMCAzMHYyMjYuN2MwIDE2LjYgMTMuNCAzMCAzMCAzMGgyMjljMTYuNiAwIDMwLTEzLjQgMzAtMzB6TTI0MC4zIDE1OGgyNDIuM2MxNi42IDAgMzAtMTMuNCAzMC0zMHMtMTMuNC0zMC0zMC0zMEgxOTQuM2MtNTIuOSAwLTk1LjcgNDIuOS05NS43IDk1Ljd2Mjg4LjhjMCAxNi42IDEzLjQgMzAgMzAgMzBzMzAtMTMuNCAzMC0zMFYyMzkuN2MtMC4xLTQ1LjEgMzYuNS04MS43IDgxLjctODEuN3pNNzc4LjggODY1SDU0MC42Yy0xNi42IDAtMzAgMTMuNC0zMCAzMHYzYzAgMTYuNiAxMy40IDMwIDMwIDMwaDI5MS4yYzUyLjkgMCA5NS43LTQyLjkgOTUuNy05NS43VjU0MS43YzAtMTYuNi0xMy40LTMwLTMwLTMwaC0zYy0xNi42IDAtMzAgMTMuNC0zMCAzMHYyMzcuNWMwIDQ3LjQtMzguNCA4NS44LTg1LjcgODUuOHpNNDE3LjUgODY0LjFjMTYuNiAwIDMwLTEzLjQgMzAtMzBWNjA1LjZjMC0xNi42LTEzLjQtMzAtMzAtMzBoLTIyNmMtMTYuNiAwLTMwIDEzLjQtMzAgMzB2M2MwIDE2LjYgMTMuNCAzMCAzMCAzMGgxNjZjMTYuNiAwIDMwIDEzLjQgMzAgMzB2MTY1LjVjMCAxNi41IDEzLjUgMzAgMzAgMzB6IiBwLWlkPSIyNjAxIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PHBhdGggZD0iTTg3MiAxMDguNEw2MzcgMzQzLjljLTEyLjcgMTIuNy0xMi43IDMzLjMgMCA0NiAxMi43IDEyLjcgMzMuMyAxMi43IDQ2IDBsMjM1LTIzNS42YzEyLjctMTIuNyAxMi43LTMzLjMgMC00Ni0xMi43LTEyLjYtMzMuMy0xMi42LTQ2IDAuMXpNMTA3LjkgOTE4LjVjMTIuNyAxMi43IDMzLjMgMTIuNyA0NiAwbDI0Ni0yNDZjMTIuNy0xMi43IDEyLjctMzMuMyAwLTQ2LTEyLjctMTIuNy0zMy4zLTEyLjctNDYgMGwtMjQ2IDI0NmMtMTIuNyAxMi43LTEyLjcgMzMuMyAwIDQ2eiIgcC1pZD0iMjYwMiIgZmlsbD0iI2ZmZmZmZiI+PC9wYXRoPjwvc3ZnPg==');
        width: 32px;
        height: 32px;
        color: #fff;
        float: right;
        position: absolute;
        top: 3px;
        right: 35px;
        opacity: 1;
        cursor: pointer;
        z-index: 999;
      }
      .overview-enlarge {
        background-repeat: no-repeat;
        background-position: center;
        background-image:url('data:image/svg+xml;base64,PHN2ZyB0PSIxNjI3Mjk4MTc5OTU1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjkzNzQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTExNC4xMSA5MzUuODhoLTAuNThhMjYuMjUgMjYuMjUgMCAwIDEtMjYuMTgtMjYuMjZWNjQzLjk0YTI2LjMgMjYuMyAwIDAgMSAyNi4yNi0yNi4xOGgwLjU4QTI2LjM3IDI2LjM3IDAgMCAxIDE0MC40NSA2NDR2MjY1LjdhMjYuMzggMjYuMzggMCAwIDEtMjYuMzUgMjYuMTh6IG0wIDAiIHAtaWQ9IjkzNzUiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48cGF0aCBkPSJNNDA1LjQ3IDkwOS4xMnYwLjU4YTI2LjM4IDI2LjM4IDAgMCAxLTI2LjI2IDI2LjNoLTI2NS42YTI2LjM5IDI2LjM5IDAgMCAxLTI2LjI2LTI2LjM0VjkwOWEyNi4zIDI2LjMgMCAwIDEgMjYuMjYtMjYuMThoMjY1LjY4YTI2LjMgMjYuMyAwIDAgMSAyNi4xOCAyNi4yNnogbTAgMCIgcC1pZD0iOTM3NiIgZmlsbD0iI2ZmZmZmZiI+PC9wYXRoPjxwYXRoIGQ9Ik05NS4zOSA5MjguMjZsLTAuNDEtMC40MmEyNi4zNSAyNi4zNSAwIDAgMSAwLTM3LjExTDMzOSA2NDYuNjdhMjYuMzUgMjYuMzUgMCAwIDEgMzcuMTEgMGwwLjQxIDAuNDFhMjYuMzUgMjYuMzUgMCAwIDEgMCAzNy4xMUwxMzIuNSA5MjguMjZhMjYuMzUgMjYuMzUgMCAwIDEtMzcuMTEgMHogbTAgME0xMTQuMTEgODcuNTZoLTAuNThhMjYuMjUgMjYuMjUgMCAwIDAtMjYuMTggMjYuMjZWMzc5LjVhMjYuMjUgMjYuMjUgMCAwIDAgMjYuMjYgMjYuMThoMC41OGEyNi4zOCAyNi4zOCAwIDAgMCAyNi4yNi0yNi4yNnYtMjY1LjZhMjYuMzkgMjYuMzkgMCAwIDAtMjYuMzUtMjYuMjZ6IG0wIDAiIHAtaWQ9IjkzNzciIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48cGF0aCBkPSJNNDA1LjQ3IDExNC4zMnYtMC41OGEyNi4yNSAyNi4yNSAwIDAgMC0yNi4yNi0yNi4xOGgtMjY1LjZhMjYuMjcgMjYuMjcgMCAwIDAtMjYuMjYgMjYuMjZ2MC41OGEyNi4yNSAyNi4yNSAwIDAgMCAyNi4yNiAyNi4xOGgyNjUuNjhhMjYuMjUgMjYuMjUgMCAwIDAgMjYuMTgtMjYuMjZ6IG0wIDAiIHAtaWQ9IjkzNzgiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48cGF0aCBkPSJNOTUuMzkgOTUuMThsLTAuNDEgMC40MWEyNi4zNSAyNi4zNSAwIDAgMCAwIDM3LjExTDMzOSAzNzYuNzdhMjYuMzUgMjYuMzUgMCAwIDAgMzcuMTEgMGwwLjQxLTAuNDFhMjYuMzUgMjYuMzUgMCAwIDAgMC0zNy4xMUwxMzIuNSA5NS4xOGEyNi4zNSAyNi4zNSAwIDAgMC0zNy4xMSAweiBtMCAwIiBwLWlkPSI5Mzc5IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PHBhdGggZD0iTTkwOC45MSA5MzUuODhoMC41OGEyNi4zOCAyNi4zOCAwIDAgMCAyNi4yNi0yNi4yNlY2NDRhMjYuMzcgMjYuMzcgMCAwIDAtMjYuMjYtMjYuMjZoLTAuNThBMjYuMzcgMjYuMzcgMCAwIDAgODgyLjY1IDY0NHYyNjUuN2EyNi4zIDI2LjMgMCAwIDAgMjYuMjYgMjYuMTh6IG0wIDAiIHAtaWQ9IjkzODAiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48cGF0aCBkPSJNNjE3LjU1IDkwOS4xMnYwLjU4YTI2LjM3IDI2LjM3IDAgMCAwIDI2LjI2IDI2LjNIOTA5LjVhMjYuMzcgMjYuMzcgMCAwIDAgMjYuMjYtMjYuMjZ2LTAuNThhMjYuMzcgMjYuMzcgMCAwIDAtMjYuMjYtMjYuMjZINjQzLjgxYTI2LjM3IDI2LjM3IDAgMCAwLTI2LjI2IDI2LjI2eiBtMCAwIiBwLWlkPSI5MzgxIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PHBhdGggZD0iTTkyNy42NCA5MjguMjZsMC40Mi0wLjQyYTI2LjM1IDI2LjM1IDAgMCAwIDAtMzcuMTFMNjgzLjkxIDY0Ni42N2EyNi4zNSAyNi4zNSAwIDAgMC0zNy4xMSAwbC0wLjQyIDAuNDFhMjYuMzYgMjYuMzYgMCAwIDAgMCAzNy4xMWwyNDQuMDYgMjQ0LjA3YTI2LjQ1IDI2LjQ1IDAgMCAwIDM3LjIgMHogbTAgMCIgcC1pZD0iOTM4MiIgZmlsbD0iI2ZmZmZmZiI+PC9wYXRoPjxwYXRoIGQ9Ik05MDguOTEgODcuNTZoMC41OGEyNi4zMiAyNi4zMiAwIDAgMSAyNi4yNiAyNi4yNlYzNzkuNWEyNi4zNyAyNi4zNyAwIDAgMS0yNi4yNiAyNi4yNmgtMC41OGEyNi4zNyAyNi4zNyAwIDAgMS0yNi4yNi0yNi4yNlYxMTMuODJhMjYuMzIgMjYuMzIgMCAwIDEgMjYuMjYtMjYuMjZ6IG0wIDAiIHAtaWQ9IjkzODMiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48cGF0aCBkPSJNNjE3LjU1IDExNC4zMnYtMC41OGEyNi4zIDI2LjMgMCAwIDEgMjYuMjYtMjYuMThIOTA5LjVhMjYuMzIgMjYuMzIgMCAwIDEgMjYuMjYgMjYuMjZ2MC41OGEyNi4zNyAyNi4zNyAwIDAgMS0yNi4yNiAyNi4yNkg2NDMuODFhMjYuNDUgMjYuNDUgMCAwIDEtMjYuMjYtMjYuMzV6IG0wIDAiIHAtaWQ9IjkzODQiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48cGF0aCBkPSJNOTI3LjY0IDk1LjE4bDAuNDIgMC40MWEyNi4zNSAyNi4zNSAwIDAgMSAwIDM3LjExTDY4My45MSAzNzYuNzdhMjYuMzUgMjYuMzUgMCAwIDEtMzcuMTEgMGwtMC40Mi0wLjQxYTI2LjM2IDI2LjM2IDAgMCAxIDAtMzcuMTFMODkwLjUyIDk1LjE4YTI2LjM1IDI2LjM1IDAgMCAxIDM3LjExIDB6IG0wIDAiIHAtaWQ9IjkzODUiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L3N2Zz4=');
        width: 32px;
        height: 32px;
        color: #fff;
        float: right;
        position: absolute;
        top: 3px;
        right: 35px;
        opacity: 1;
        cursor: pointer;
        display: none;
        z-index: 999;
      }

      .overview-logo {
        width: 40px;
        height: 45px;
        color: #fff;
        float: right;
        position: absolute;
        top: -7px;
        right: 75px;
        opacity: 1;
        cursor: pointer;
        display: none;
        z-index: 999;
      }

      .overview-close {
        background-repeat: no-repeat;
        background-position: center;
        background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOC4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzAgMzAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMwIDMwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxsaW5lIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIxLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgeDE9IjEwLjQiIHkxPSIxMC40IiB4Mj0iMTkuNCIgeTI9IjE5LjQiLz4NCjxsaW5lIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIxLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgeDE9IjE5LjQiIHkxPSIxMC40IiB4Mj0iMTAuNCIgeTI9IjE5LjQiLz4NCjwvc3ZnPg0K');
        width: 32px;
        height: 32px;
        color: #fff;
        float: right;
        position: absolute;
        top: 3px;
        right: 3px;
        opacity: 1;
        cursor: pointer;
        z-index: 999;
      }


      .badge.bg-secondary {
        background-color: #f3f6f9!important;
        color: #7e8299!important;
      }
      .badge:not(.badge-pill) {
          border-radius: 7px;
      }
      .badge {
          font-weight: 500;
          padding: 7px 12px;
      }
      .badge {
        display: inline-block;
        padding: 0.35em 0.65em;
        font-size: .55em;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 0.25rem;
        position: absolute;
        top: 27px;
      }
      .humane,
      .humane-bigbox {
        position: fixed;
        -moz-transition: all 0.3s ease-out;
        -webkit-transition: all 0.3s ease-out;
        -ms-transition: all 0.3s ease-out;
        -o-transition: all 0.3s ease-out;
        transition: all 0.3s ease-out;
        z-index: 100000;
        filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
      }
      .humane,
      .humane-bigbox {
        font-family: Ubuntu, Verdana, sans-serif;
        line-height: 40px;
        font-size: 35px;
        top: 25%;
        left: 25%;
        opacity: 0;
        width: 50%;
        min-height: 40px;
        padding: 30px;
        text-align: center;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADICAYAAAAp8ov1AAAABmJLR0QA/wD/AP+gvaeTAAAAc0lEQVQokb2RQQ6EMAwDx/7/n80BtIEC3RYhLlXrVLGTAYiBWBIGtkPSP01SfreTVoV5re9Rcee1scwDk9NurbR62sZJcpzy9O+2X5KsXabyPaQFYNuvkqkRviDTp9Vs8opC0TpkHvJtVjeReW/5kEyX1gKeLEKE9peeWAAAAABJRU5ErkJggg==');
        background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #000), color-stop(1, rgba(0,0,0,0.9))) no-repeat;
        background: -moz-linear-gradient(top, #000 0%, rgba(0,0,0,0.9) 100%) no-repeat;
        background: -webkit-linear-gradient(top, #000 0%, rgba(0,0,0,0.9) 100%) no-repeat;
        background: -ms-linear-gradient(top, #000 0%, rgba(0,0,0,0.9) 100%) no-repeat;
        background: -o-linear-gradient(top, #000 0%, rgba(0,0,0,0.9) 100%) no-repeat;
        background: linear-gradient(top, #000 0%, rgba(0,0,0,0.9) 100%) no-repeat;
        *background-color: #000;
        color: #fff;
        -webkit-border-radius: 15px;
        border-radius: 15px;
        text-shadow: 0 -1px 1px #ddd;
        -webkit-box-shadow: 0 15px 15px -15px #000;
        box-shadow: 0 15px 15px -15px #000;
        -moz-transform: scale(0.1);
        -webkit-transform: scale(0.1);
        -ms-transform: scale(0.1);
        -o-transform: scale(0.1);
        transform: scale(0.1);
      }
      .humane p,
      .humane-bigbox p,
      .humane ul,
      .humane-bigbox ul {
        margin: 0;
        padding: 0;
      }
      .humane ul,
      .humane-bigbox ul {
        list-style: none;
      }
      .humane.humane-bigbox-info,
      .humane-bigbox.humane-bigbox-info {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADICAYAAAAp8ov1AAAABmJLR0QA/wD/AP+gvaeTAAAAQElEQVQokWNgYEj5z8TAwPCfiYGBgQGVIEKMTG2DTYwRVez/IHIaNcUGyBnYgpORel6gpvFEJhBqpxIaG8/AAADsKDq/HhYQ2AAAAABJRU5ErkJggg==');
        background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #000064), color-stop(1, rgba(0,0,100,0.9))) no-repeat;
        background: -moz-linear-gradient(top, #000064 0%, rgba(0,0,100,0.9) 100%) no-repeat;
        background: -webkit-linear-gradient(top, #000064 0%, rgba(0,0,100,0.9) 100%) no-repeat;
        background: -ms-linear-gradient(top, #000064 0%, rgba(0,0,100,0.9) 100%) no-repeat;
        background: -o-linear-gradient(top, #000064 0%, rgba(0,0,100,0.9) 100%) no-repeat;
        background: linear-gradient(top, #000064 0%, rgba(0,0,100,0.9) 100%) no-repeat;
        *background-color: #030;
      }
      .humane.humane-bigbox-success,
      .humane-bigbox.humane-bigbox-success {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADICAYAAAAp8ov1AAAABmJLR0QA/wD/AP+gvaeTAAAAPklEQVQokWNgSGH4z8TAACEYUAkixMjUNsjEGFHF/g8ip1FVbGCcgS04GannBaoaT1wCwWkvmXbQ2HgGBgYA8Yw6v+m4Kh8AAAAASUVORK5CYII=');
        background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #006400), color-stop(1, rgba(0,100,0,0.9))) no-repeat;
        background: -moz-linear-gradient(top, #006400 0%, rgba(0,100,0,0.9) 100%) no-repeat;
        background: -webkit-linear-gradient(top, #006400 0%, rgba(0,100,0,0.9) 100%) no-repeat;
        background: -ms-linear-gradient(top, #006400 0%, rgba(0,100,0,0.9) 100%) no-repeat;
        background: -o-linear-gradient(top, #006400 0%, rgba(0,100,0,0.9) 100%) no-repeat;
        background: linear-gradient(top, #006400 0%, rgba(0,100,0,0.9) 100%) no-repeat;
        *background-color: #030;
      }
      .humane.humane-bigbox-error,
      .humane-bigbox.humane-bigbox-error {
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADICAYAAAAp8ov1AAAABmJLR0QA/wD/AP+gvaeTAAAAPklEQVQokWNIYWD4z8QAJRhQCSLEyNQ2uMQYUcX+DyKnUVdsQJyBLTgZqecF6hpPVALBaS+ZdtDYeAYGBgYA9vA6v4OR3MkAAAAASUVORK5CYII=');
        background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #640000), color-stop(1, rgba(100,0,0,0.9))) no-repeat;
        background: -moz-linear-gradient(top, #640000 0%, rgba(100,0,0,0.9) 100%) no-repeat;
        background: -webkit-linear-gradient(top, #640000 0%, rgba(100,0,0,0.9) 100%) no-repeat;
        background: -ms-linear-gradient(top, #640000 0%, rgba(100,0,0,0.9) 100%) no-repeat;
        background: -o-linear-gradient(top, #640000 0%, rgba(100,0,0,0.9) 100%) no-repeat;
        background: linear-gradient(top, #640000 0%, rgba(100,0,0,0.9) 100%) no-repeat;
        *background-color: #300;
      }
      .humane.humane-animate,
      .humane-bigbox.humane-bigbox-animate {
        opacity: 1;
        -moz-transform: scale(1);
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
        transform: scale(1);
      }
      .humane.humane-animate:hover,
      .humane-bigbox.humane-bigbox-animate:hover {
        opacity: 0.6;
        -moz-transform: scale(0.8);
        -webkit-transform: scale(0.8);
        -ms-transform: scale(0.8);
        -o-transform: scale(0.8);
        transform: scale(0.8);
      }
      .humane.humane-js-animate,
      .humane-bigbox.humane-bigbox-js-animate {
        opacity: 1;
        -moz-transform: scale(1);
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
        transform: scale(1);
      }
      .humane.humane-js-animate:hover,
      .humane-bigbox.humane-bigbox-js-animate:hover {
        opacity: 0.6;
        filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=60);
      }

      </style>
    
      <div class="overview-logo"><img style="height: 100%;" src="data:image/png;base64,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" /></div>
      <div class="overview-close"></div>
      <div class="overview-narrow"></div>
      <div class="overview-enlarge"></div>
      <div style="height: calc(85% - 40px);">
        <iframe  class="iframe_editormd"   
          id="core_content"
          name="iframeName"
          ref="core_content"
          title="core_content"
          src='` + chrome.extension.getURL("/editor.md/examples/full.html") + `'
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
          scrolling="auto"
        ></iframe>
      </div>

      </div>
    
    
      `;

    send();
    document.body.appendChild(panel);
  }
  // 向页面注入JS
  function addCustomjsText(jsText, e) {
    var temp = document.createElement("script");
    temp.setAttribute("type", "text/javascript");
    temp.text = jsText;
    temp.onload = function () {
      // 放在页面不好看，执行完后移除掉
      // this.parentNode.removeChild(this);
      if (e) e();
    };
    document.body.appendChild(temp);
  }
  // 向页面注入JS
  function injectCustomJs(jsPath, e,remove) {
    var temp = document.createElement("script");
    temp.setAttribute("type", "text/javascript");
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
      if (e) e();
      // 放在页面不好看，执行完后移除掉
      if(!remove)
        this.parentNode.removeChild(this);
    };
    document.body.appendChild(temp);
  }
  // 向页面注入css
  function injectCustomCss(cssPath, e) {
    var temp = document.createElement("link");
    temp.setAttribute("rel", "stylesheet");
    temp.href = chrome.extension.getURL(cssPath);
    temp.onload = function () {
      this.parentNode.removeChild(this);
    };
    document.body.appendChild(temp);
  }

  function send(msg) {
    chrome.runtime.sendMessage({ greeting: msg ?? "mdinit" }, function (response) {
      console.log("收到来自后台的回复：" + response);
    });
  }

  // 监听长连接
  chrome.runtime.onConnect.addListener(function (port) {
    console.log(port);
    if (port.name == "test-connect") {
      port.onMessage.addListener(function (msg) {
        console.log("收到长连接消息：" + JSON.stringify(msg));
        runtimeMessageProcessing(msg);
        if (msg.question == "你是谁啊？") port.postMessage({ answer: "我是你爸！" });
      });
    }
  });
  function runtimeMessageProcessing(data) {
    if (data.question.overview_webkit) {
      chrome.storage.sync.set(data.question, function () {
        console.log("保存成功！");
        init_md();
      });
    }
  }

  // window.addEventListener("message", function(e)
  // {
  //   console.log('收到消息：', e.data);
  //   if(e.data && e.data.cmd == 'invoke') {
  //     eval('('+e.data.code+')');
  //   }
  //   else if(e.data && e.data.cmd == 'message') {
  //     console.log(e.data.data);
  //   }
  // }, false);

  function initCustomEventListen() {
    var hiddenDiv = document.getElementById("myCustomEventDiv");
    if (!hiddenDiv) {
      hiddenDiv = document.createElement("div");
      hiddenDiv.style.display = "none";
      hiddenDiv.id = "myCustomEventDiv";
      document.body.appendChild(hiddenDiv);
    }
    hiddenDiv.addEventListener("myCustomEvent", function () {
      var eventData = document.getElementById("myCustomEventDiv").innerText;
      var data = JSON.parse(eventData);
      console.log("收到自定义事件：", data);
      switch (data.idN) {
        case "overview":
          if (data._config != undefined) {
            chrome.storage.sync.set({ overview_webkit: data }, function () {
              console.log("保存成功！");
            });
          }
          break;
        case "overview_txt":
          if (data._config != undefined) {
            chrome.storage.sync.set({ overview_txt: data }, function () {
              console.log("保存成功！");
            });
          }
          break;

        default:
          break;
      }
    });
  }
})();
