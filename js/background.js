function progress(no) {
  var msg,rI;
  if (no < 100) {
    msg = "Hashing Scripts";
  } else {
    msg = "Scripts hashed";
  }
  chrome.notifications.update("hash-progress",{progress:no,title:msg},function(wasSaved) {
    if (wasSaved == false) {
      var options = {
        type: "progress",
        title: msg,
        iconUrl: "icon128.png",
        message: ""
      };
      chrome.notifications.create("hash-progress",options);
    }
  })
}
function notify(text) {
  var options = {
    type: "basic",
    message: "",
    title: text,
    iconUrl: "icon128.png",
    requireInteraction: false,
    isClickable: false
  }
  chrome.notifications.create(options);
}
function onMsg(msg,sender,response) {
  console.log(msg);
  if (msg.type == "notify") {
    notify(msg.content);
  }
  if (msg.type == "progress") {
    progress(msg.content);
  }
}
chrome.runtime.onMessage.addListener(onMsg);
