// Clear any service worker caches so updates always load fresh
if('serviceWorker' in navigator){
  navigator.serviceWorker.getRegistrations().then(function(regs){
    regs.forEach(function(r){r.unregister();});
  });
}
if('caches' in window){
  caches.keys().then(function(names){
    names.forEach(function(name){caches.delete(name);});
  });
}
