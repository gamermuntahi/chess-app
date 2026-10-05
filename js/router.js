// HASH ROUTER + LAST GAME PERSISTENCE
// Deep links (#play, #puzzles, #review...) switch screens in place, no reloads.
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
function markNav(name){
  var items=document.querySelectorAll('#sDash [data-nav]');
  for(var i=0;i<items.length;i++){
    var it=items[i];
    var hit=(it.getAttribute('data-nav')===name);
    it.classList.toggle('on',hit);
    if(hit)it.setAttribute('aria-current','page');
    else it.removeAttribute('aria-current');
  }
}

function goDashboard(){
  showScreen('sDash');
  markNav('home');
  try{if(typeof dashboardRefresh==='function')dashboardRefresh();}catch(e){}
}

function goHome(){showScreen('sHome');markNav('play');}

function goStore(){
  markNav('store');
  try{
    if(typeof _storeBuilt!=='undefined')_storeBuilt=false;
    if(typeof renderStore==='function')renderStore();
    if(typeof refreshCoinDisplays==='function')refreshCoinDisplays();
    showScreen('sStore');
    var skin=localStorage.getItem('chessSkin')||'skin_classic';
    if(typeof _showSkinPreview==='function')setTimeout(function(){_showSkinPreview(skin);},60);
  }catch(e){goDashboard();}
}

function goQuests(){
  markNav('quests');
  try{
    if(typeof checkQuestProgress==='function')checkQuestProgress();
    if(typeof renderQuests==='function')renderQuests();
  }catch(e){}
  showScreen('sQuests');
}

function goLibrary(){
  markNav('library');
  try{if(typeof renderLibrary==='function')renderLibrary('');}
  catch(e){
    var list=document.getElementById('libList');
    if(list)list.innerHTML='<div class="empty-lib">No players yet. Play a game first!</div>';
  }
  showScreen('sLib');
}

function goProfile(){
  markNav('profile');
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
  home:goDashboard,
  dash:goDashboard,
  dashboard:goDashboard,
  play:goHome,
  bot:function(){showScreen('sBot');markNav('bot');},
  tournament:function(){showScreen('sTour');markNav('tournament');},
  puzzles:function(){openPuzzleHome();markNav('puzzles');},
  lesson:function(){goLesson();markNav('puzzles');},
  daily:function(){goDaily();markNav('puzzles');},
  library:goLibrary,
  store:goStore,
  quests:goQuests,
  profile:goProfile,
  review:function(){goReview('analysis');markNav('review');},
  replay:function(){goReview('replay');markNav('review');}
};

// Which sidebar entry lights up for a given route name
var NAV_FOR={play:'play',bot:'bot',tournament:'tournament',puzzles:'puzzles',
             lesson:'puzzles',daily:'puzzles',library:'library',store:'store',
             quests:'quests',profile:'profile',review:'review',replay:'review'};

// ══════════════════════════════════════════
//  DISPATCH
// ══════════════════════════════════════════
function resetScroll(){
  var el=document.querySelector('.screen.on');
  if(el)el.scrollTop=0;
  window.scrollTo(0,0);
}

function applyRoute(){
  var raw=(location.hash||'').replace(/^#/,'').toLowerCase();
  var name=raw.split('&')[0];

  // The dashboard is the front door: no hash, #home and #dashboard all land there.
  if(!raw||name==='home'||name==='dash'||name==='dashboard'){
    pendingRoute=null;
    goDashboard();
    resetScroll();
    return;
  }

  var fn=ROUTES[name];
  if(!fn){goDashboard();resetScroll();return;}

  // The login screen is a destination, not something to resume after login.
  if(name==='login'){pendingRoute=null;fn();return;}

  if(!getCurrentUser()){
    pendingRoute=name;
    ROUTES.login();
    return;
  }
  try{fn();}catch(e){goDashboard();}
  markNav(NAV_FOR[name]||'');
  resetScroll();
}

window.addEventListener('hashchange',applyRoute);

// Re-apply the pending route once the player logs in
var _loginUser=loginUser;
loginUser=function(profile){
  loginThenDashboard=false;
  _loginUser(profile);
  // Resume where the player was headed; the dashboard is the default landing.
  var target=pendingRoute;
  pendingRoute=null;
  if(!target||target==='login'||target==='home')target='home';
  if((location.hash||'').replace(/^#/,'').toLowerCase()!==target)location.hash='#'+target;
  else applyRoute();
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