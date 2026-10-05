// HASH ROUTER + LAST GAME PERSISTENCE
// Lets dashboard.html deep-link into any screen: index.html#puzzles, #tournament, ...
(function(){

var LAST_GAME_KEY='chessLastGame';
var pendingRoute=null;
var loginThenDashboard=false;

// ══════════════════════════════════════════
//  LAST GAME
// ══════════════════════════════════════════
function saveLastGame(reason,winner){
  try{
    if(!G||!G.history||!G.history.length)return;
    var snaps=(G.snapshots||[]).slice(-160).map(function(s){
      return {b:s.b,turn:s.turn,ep:s.ep,cas:s.cas,cW:s.cW,cB:s.cB,lf:s.lf,lt:s.lt,
              check:s.check,tW:s.tW,tB:s.tB,lastBadge:s.lastBadge,lastTo:s.lastTo};
    });
    localStorage.setItem(LAST_GAME_KEY,JSON.stringify({
      w:PLAYERS.w,
      b:PLAYERS.b,
      history:G.history.slice(),
      snapshots:snaps,
      moveLog:G.moveLog||[],
      result:reason||'',
      winner:winner||'',
      t:Date.now()
    }));
  }catch(e){}
}

function restoreLastGame(){
  var d=null;
  try{d=JSON.parse(localStorage.getItem(LAST_GAME_KEY)||'null');}catch(e){d=null;}
  if(!d||!d.history||!d.history.length)return false;
  G.history=d.history;
  G.snapshots=d.snapshots||[];
  G.moveLog=d.moveLog||[];
  G.over=true;
  var last=G.snapshots[G.snapshots.length-1];
  var board=(last&&last.b)||last;
  if(board&&board.length)G.b=board.map(function(r){return r.slice();});
  PLAYERS={w:d.w,b:d.b};
  var elW=document.getElementById('pnW'),elB=document.getElementById('pnB');
  if(elW)elW.textContent=PLAYERS.w;
  if(elB)elB.textContent=PLAYERS.b;
  return (G.snapshots.length>1);
}

// ══════════════════════════════════════════
//  ROUTE TARGETS
// ══════════════════════════════════════════
function goHome(){showScreen('sHome');}

function goStore(){
  try{
    if(typeof _storeBuilt!=='undefined')_storeBuilt=false;
    if(typeof renderStore==='function')renderStore();
    if(typeof refreshCoinDisplays==='function')refreshCoinDisplays();
    showScreen('sStore');
    var skin=localStorage.getItem('chessSkin')||'skin_classic';
    if(typeof _showSkinPreview==='function')setTimeout(function(){_showSkinPreview(skin);},60);
  }catch(e){showScreen('sHome');}
}

function goQuests(){
  try{
    if(typeof checkQuestProgress==='function')checkQuestProgress();
    if(typeof renderQuests==='function')renderQuests();
  }catch(e){}
  showScreen('sQuests');
}

function goLibrary(){
  try{if(typeof renderLibrary==='function')renderLibrary('');}
  catch(e){
    var list=document.getElementById('libList');
    if(list)list.innerHTML='<div class="empty-lib">No players yet. Play a game first!</div>';
  }
  showScreen('sLib');
}

function goProfile(){
  if(typeof showUserSelect==='function')showUserSelect();
  showScreen('sUserSelect');
}

function nextPuzzleTarget(){
  var prog=loadPuzzleProgress();
  for(var i=0;i<DIFFS.length;i++){
    var d=DIFFS[i];
    if(!isDiffUnlocked(d))break;
    var done=prog[d].done||[];
    if(done.length>=20)continue;
    for(var l=0;l<20;l++){
      if(done.indexOf(l)===-1&&(l===0||done.indexOf(l-1)!==-1))return {diff:d,lvl:l};
    }
  }
  return null;
}

function goLesson(){
  var t=nextPuzzleTarget();
  if(!t){showStoreMsg('All 100 puzzles solved — impressive!');openPuzzleHome();return;}
  if(hasCooldown(t.diff)){showCooldown(t.diff);return;}
  startPuzzle(t.diff,t.lvl);
}

function goDaily(){
  if(typeof isDailyDone==='function'&&isDailyDone()){
    showStoreMsg('Daily puzzle done — come back tomorrow!');
    openPuzzleHome();
    return;
  }
  startPuzzle('easy',getDailyPuzzleIndex(),true);
}

function goReview(mode){
  if(!restoreLastGame()){
    showStoreMsg('No finished game yet — play one to unlock review!');
    goHome();
    return;
  }
  if(mode==='replay'){rpOpen();return;}
  showPostGameAnalysis();
}

var ROUTES={
  login:function(){
    loginThenDashboard=true;
    if(typeof buildAvatarGrid==='function')buildAvatarGrid();
    showScreen('sLogin');
  },
  home:goHome,
  play:goHome,
  bot:function(){showScreen('sBot');},
  tournament:function(){showScreen('sTour');},
  puzzles:function(){openPuzzleHome();},
  lesson:goLesson,
  daily:goDaily,
  library:goLibrary,
  store:goStore,
  quests:goQuests,
  profile:goProfile,
  review:function(){goReview('analysis');},
  replay:function(){goReview('replay');}
};

// ══════════════════════════════════════════
//  DISPATCH
// ══════════════════════════════════════════
function applyRoute(){
  var raw=(location.hash||'').replace(/^#/,'').toLowerCase();
  if(!raw||raw==='dashboard')return;
  var name=raw.split('&')[0];
  var fn=ROUTES[name];
  if(!fn)return;
  if(name==='profile'&&!getCurrentUser()){
    pendingRoute=null;
    ROUTES.login();
    return;
  }
  if(!getCurrentUser()){pendingRoute=name;return;}
  try{fn();}catch(e){goHome();}
  var el=document.querySelector('.screen.on');
  if(el)el.scrollTop=0;
  window.scrollTo(0,0);
}

window.addEventListener('hashchange',applyRoute);

// Re-apply the pending route once the player logs in
var _loginUser=loginUser;
loginUser=function(profile){
  var backToDash=loginThenDashboard;
  loginThenDashboard=false;
  _loginUser(profile);
  if(backToDash){location.replace('dashboard.html');return;}
  if(pendingRoute){
    var r=pendingRoute;
    pendingRoute=null;
    if((location.hash||'').replace(/^#/,'').toLowerCase()!==r)location.hash='#'+r;
    applyRoute();
  }
};

// Persist every finished game so the dashboard can review it later
var _endGame=endGame;
endGame=function(reason,winner){
  saveLastGame(reason,winner);
  _endGame(reason,winner);
};

// ══════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════
(function(){
  var el=document.getElementById('sLogin');
  function boot(){
    applyRoute();
    if(document.getElementById('sLogin').classList.contains('on')){
      var inp=document.getElementById('loginUsernameInp');
      if(inp)setTimeout(function(){inp.focus();},300);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();

})();