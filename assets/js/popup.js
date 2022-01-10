
$("#popup_close").click(function(){
    console.log('123123')
})
$(document).ready(function(){
  show_url()
 
})
function show_url() { 
  chrome.tabs.getSelected(null, function(tab) { 
   var currentURL = tab.url; 
   var domain = currentURL.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];
   $("#title_url").html(domain)//alert(domain); 
  }); 
} 