// Clear any service worker caches so updates always load fresh
if('serviceWorker' in navigator){
  navigator.serviceWorker.getRegistrations().then(function(regs){
    regs.forEach(function(reg){reg.unregister();});
  }).catch(function(){});
}
if('caches' in window){
  caches.keys().then(function(names){
    names.forEach(function(name){caches.delete(name);});
  }).catch(function(){});
}