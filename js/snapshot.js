// capture the pages scripts and save it
String.prototype.hash = function() {
  var hash = 0,i,chr;
  if (this.length === 0) return hash;
  for (i=0;i<this.length;i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}
String.prototype.format = function() {
  var output = this;
  for (var i=0;i<arguments.length;i++) {
    output = output.replace("{"+i.toString()+"}",arguments[i]);
  }
  return output;
}


function scriptMap() {
  var scriptNodes = document.querySelectorAll("script"),scripts = [],script;
  for (var i=0;i<scriptNodes.length;i++) {
    script = scriptNodes[i];
    if (script.src == "") {
      scripts.push(new Script(script,script.innerText));
    } else {
      scripts.push(new Script(script,"",script.src));
    }
  }
  for (var i=0;i<scripts.length;i++) {
    if (scripts[i].content == 0 && scripts[i].url != undefined) {
      fetchScript(scripts,scripts[i].url).then((ss)=>{
        scripts = ss;
      });
    }
  }
  return scripts;
}
function fetchScript(scripts,url) {
  var request = new Request(url,{mode:"cors",type:"GET"});
  return fetch(request).then((response)=>{
    return response.text().then((script)=>{
      for (var i=0;i<scripts.length;i++) {
        if (scripts[i].url == url) {
          scripts[i].content = script.hash();
          scripts[i].done = true;
          return scripts;
        }
      }
      return scripts;
    })
  },(error)=>{
    for (var i=0;i<scripts.length;i++) {
      if (scripts[i].url == url) {
        scripts[i].done = true;
        return scripts;
      }
    }
    return scripts;
  })
}
function checkDone(scripts,checkTime) {
  var done = true;
  var total = 0;
  for (var i=0;i<scripts.length;i++) {
    if (scripts[i].done == false) {
      done = false;
    } else {
      total+=1;
    }
  }
  if (done == true) {
    progress(100);
    onfinish(scripts);
  } else {
    progress(Math.round(total/scripts.length*100));
    setTimeout(checkDone,checkTime,scripts,checkTime);
  }
}
function onfinish(scripts) {
  console.log("finished hashing scripts > ",scripts);
  var output = {};
  for (var i=0;i<scripts.length;i++) {
    if (scripts[i].content == 0) {
      output[scripts[i].url] = {hash:scripts[i].content,url:scripts[i].url};
    } else {
      output[scripts[i].content] = {hash:scripts[i].content,url:scripts[i].url};
    }
  }
  var loc = window.location.hostname+window.location.pathname;
  chrome.storage.sync.get("sites",(storage)=>{
    if (storage[loc] != undefined) {
      compareDifferances(storage[loc],output);
    }
    storage[loc] = output;
    chrome.storage.sync.set(storage,function() {
      notify("Saved script snapshot");
    })
  })
}
function compareDifferances(original,current) {
  var string;
  for (var a in original) {
    if (Object.keys(current).includes(a) == false) {
      if (original[a].url != undefined) {
        string = "Script {0} ({1}) has been removed".format(original[a].hash,original[a].url);
      } else {
        string = "Script {0} has been removed".format(original[a].hash);
      }
      notify(string);
    }
  }
  for (var a in current) {
    if (Object.keys(original).includes(a) == false) {
      if (current[a].url != undefined) {
        string = "Script {0} ({1}) has been added".format(current[a].hash,current[a].url);
      } else {
        string = "Script {0} has been added".format(current[a].hash);
      }
      notify(string);
    }
  }
}
function notify(text) {
  console.log(text);
  chrome.runtime.sendMessage({type:"notify",content:text});
}
function progress(no) {
  chrome.runtime.sendMessage({type:"progress",content:no});
}


function Script(el,content,url) {
  this.el = el;
  this.content = content.hash();
  this.url = url;
  this.done = true;
  if (this.content == 0 && this.url != undefined) {
    this.done = false;
  }
  return this;
}

var scripts = scriptMap();
checkDone(scripts,5);
