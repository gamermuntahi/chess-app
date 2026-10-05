// PROFILE / LOGIN SYSTEM
'use strict';

// ══════════════════════════════════════════
//  PROFILE / LOGIN SYSTEM
// ══════════════════════════════════════════
var AVATAR_COLORS=[
  {bg:'#e74c3c',fg:'#fff',emoji:'🔴'},{bg:'#e67e22',fg:'#fff',emoji:'🟠'},
  {bg:'#f0c040',fg:'#111',emoji:'🟡'},{bg:'#2ecc71',fg:'#fff',emoji:'🟢'},
  {bg:'#1abc9c',fg:'#fff',emoji:'🩵'},{bg:'#3498db',fg:'#fff',emoji:'🔵'},
  {bg:'#9b59b6',fg:'#fff',emoji:'🟣'},{bg:'#e91e8c',fg:'#fff',emoji:'🩷'},
  {bg:'#607d8b',fg:'#fff',emoji:'🩶'},{bg:'#795548',fg:'#fff',emoji:'🟤'},
  {bg:'#4caf50',fg:'#fff',emoji:'🌿'},{bg:'#ff5722',fg:'#fff',emoji:'🔥'},
  {bg:'#00bcd4',fg:'#fff',emoji:'🌊'},{bg:'#8bc34a',fg:'#111',emoji:'🌱'},
  {bg:'#ff9800',fg:'#111',emoji:'⭐'},{bg:'#673ab7',fg:'#fff',emoji:'🌙'},
  {bg:'#f06292',fg:'#fff',emoji:'🌸'},{bg:'#4db6ac',fg:'#fff',emoji:'🍃'},
  {bg:'#aed581',fg:'#111',emoji:'🌞'},{bg:'#7986cb',fg:'#fff',emoji:'💫'},
  {bg:'#a1887f',fg:'#fff',emoji:'🏔️'},{bg:'#4fc3f7',fg:'#111',emoji:'❄️'},
  {bg:'#dce775',fg:'#111',emoji:'⚡'},{bg:'#ba68c8',fg:'#fff',emoji:'🔮'},
  {bg:'#ef9a9a',fg:'#111',emoji:'🌺'},{bg:'#80cbc4',fg:'#111',emoji:'🐢'}
];

var PROFILE_KEYS=['chessCoins','chessQuests','chessOwned','chessUsedCodes','chessP','chessLib','chessTheme','chessSkin','chessFrame','chessHomeBg','chessLastGame'];

function getAllProfiles(){
  try{return JSON.parse(localStorage.getItem('chessProfiles')||'[]');}
  catch(e){return [];}
}
function saveAllProfiles(arr){localStorage.setItem('chessProfiles',JSON.stringify(arr));}
function getCurrentUser(){
  try{return JSON.parse(localStorage.getItem('chessCurrentUser')||'null');}
  catch(e){return null;}
}
function setCurrentUser(u){localStorage.setItem('chessCurrentUser',JSON.stringify(u));}

function getProfileKey(username,key){return 'u_'+username.toLowerCase()+'_'+key;}

function saveCurrentProfileData(){
  var user=getCurrentUser();
  if(!user)return;
  PROFILE_KEYS.forEach(function(k){
    var val=localStorage.getItem(k);
    if(val!==null)localStorage.setItem(getProfileKey(user.username,k),val);
    else localStorage.removeItem(getProfileKey(user.username,k));
  });
  // Update stats in profiles list
  var profiles=getAllProfiles();
  var idx=profiles.findIndex(function(p){return p.username.toLowerCase()===user.username.toLowerCase();});
  if(idx>=0){
    var lib={};
    try{lib=JSON.parse(localStorage.getItem('chessLib')||'{}');}catch(e){}
    var totalW=0,totalG=0;
    Object.values(lib).forEach(function(p){totalW+=p.wins||0;totalG+=p.played||0;});
    profiles[idx].wins=totalW;
    profiles[idx].games=totalG;
    profiles[idx].coins=parseInt(localStorage.getItem('chessCoins')||'0');
    saveAllProfiles(profiles);
  }
}

function loadProfileData(username){
  PROFILE_KEYS.forEach(function(k){
    var val=localStorage.getItem(getProfileKey(username.toLowerCase(),k));
    if(val!==null)localStorage.setItem(k,val);
    else localStorage.removeItem(k);
  });
}

function loginUser(profile){
  saveCurrentProfileData();
  setCurrentUser(profile);
  loadProfileData(profile.username);
  applyTheme(loadActiveTheme());
  applyHomeBg(loadHomeBg());
  refreshCoinDisplays();
  updateProfileBar();
  showScreen('sHome');
}

function updateProfileBar(){
  var user=getCurrentUser();
  if(!user)return;
  var av=AVATAR_COLORS[user.avatarIdx||0];
  var avEl=document.getElementById('profileAvHome');
  var nmEl=document.getElementById('profileNameHome');
  var lvlEl=document.getElementById('profileLvlHome');
  var frameId=localStorage.getItem('chessFrame')||'frame_none';
  var frame=PROFILE_FRAMES&&PROFILE_FRAMES.find(function(f){return f.id===frameId;});
  if(avEl){
    avEl.style.background=av.bg;
    avEl.style.color=av.fg;
    avEl.textContent=user.username[0].toUpperCase();
    if(frame&&frame.border!=='none'){
      avEl.style.border=frame.border;
      avEl.style.boxShadow=frameId==='frame_neon'?'0 0 8px #00ffff':frameId==='frame_fire'?'0 0 8px #ff4400':frameId==='frame_rainbow'?'0 0 10px #ff00ff':'none';
    } else {
      avEl.style.border='none';avEl.style.boxShadow='none';
    }
  }
  if(nmEl)nmEl.textContent=user.username;
  if(lvlEl){
    var coins=loadCoins();
    // Level tiers: 1-5=Beginner, 6-10=Novice, etc.
    var level=1;
    if(coins>=100)level=2;
    if(coins>=300)level=3;
    if(coins>=600)level=4;
    if(coins>=1000)level=5;
    if(coins>=1500)level=6;
    if(coins>=2500)level=7;
    if(coins>=4000)level=8;
    if(coins>=6000)level=9;
    if(coins>=9000)level=10;
    lvlEl.textContent='Level '+level+' · '+coins+' 🪙';
  }
}

function deleteProfile(username){
  // Remove all stored data for this user
  PROFILE_KEYS.forEach(function(k){
    localStorage.removeItem(getProfileKey(username.toLowerCase(),k));
  });
  var profiles=getAllProfiles();
  profiles=profiles.filter(function(p){return p.username.toLowerCase()!==username.toLowerCase();});
  saveAllProfiles(profiles);
  var cur=getCurrentUser();
  if(cur&&cur.username.toLowerCase()===username.toLowerCase()){
    localStorage.removeItem('chessCurrentUser');
  }
}

function resetCurrentProfileData(){
  var user=getCurrentUser();
  if(!user)return;
  var ukey=user.username.toLowerCase();
  var allKeys=['chessCoins','chessQuests','chessOwned','chessUsedCodes','chessP','chessLib','chessTheme','chessSkin','chessFrame','chessHomeBg','chessLastGame'];
  allKeys.forEach(function(k){
    localStorage.removeItem(k);
    localStorage.removeItem('u_'+ukey+'_'+k);
  });
  // Reset daily puzzle for today
  localStorage.removeItem(getDailyPuzzleKey());
  // Update profiles list to zero out their stats
  var profiles=getAllProfiles();
  var idx=profiles.findIndex(function(p){return p.username.toLowerCase()===ukey;});
  if(idx>=0){profiles[idx].wins=0;profiles[idx].games=0;profiles[idx].coins=0;saveAllProfiles(profiles);}
  // Apply defaults
  applyTheme('classic');
  applyHomeBg('hbg_dark');
  setActiveSkin('skin_classic');
  localStorage.removeItem('chessFrame');
  updateDailyBanner();
  refreshCoinDisplays();
  updateProfileBar();
  try{if(G.b)render();}catch(e){}
}
