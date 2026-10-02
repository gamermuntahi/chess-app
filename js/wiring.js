// STORE/QUEST/COIN WIRING + LOGIN SCREEN WIRING
// ══════════════════════════════════════════
//  STORE / QUEST / COIN WIRING
//  (placed here so all HTML elements exist)
// ══════════════════════════════════════════

// sbtn defined earlier in the script

sbtn('storeBtn',()=>{
  _storeBuilt=false;
  renderStore();
  refreshCoinDisplays();
  // Show current skin preview
  const activeSkin=localStorage.getItem('chessSkin')||'skin_classic';
  setTimeout(function(){_showSkinPreview(activeSkin);},50);
  showScreen('sStore');
});
sbtn('storeBack',()=>showScreen('sHome'));
sbtn('questBtn',()=>{checkQuestProgress();renderQuests();showScreen('sQuests');});
sbtn('questBack',()=>showScreen('sHome'));
sbtn('redeemBtn',()=>{
  const inp=document.getElementById('redeemInput');
  const msg=document.getElementById('redeemMsg');
  if(inp)inp.value='';
  if(msg)msg.textContent='';
  document.getElementById('redeemModal').classList.add('show');
});
sbtn('redeemSubmit',handleRedeem);
sbtn('redeemClose',()=>document.getElementById('redeemModal').classList.remove('show'));
const redeemInp=document.getElementById('redeemInput');
if(redeemInp)redeemInp.addEventListener('keydown',e=>{if(e.key==='Enter')handleRedeem();});

sbtn('pzlResetBtn',()=>{
  showConfirm(
    'Reset Puzzles?',
    'All puzzle progress will be reset. Puzzles will be locked again but remain the same.',
    'Reset',
    ()=>{
      localStorage.removeItem('chessP');
      updateDiffCards();
      showStoreMsg('Puzzle progress reset!');
    }
  );
});


// ══════════════════════════════════════════
//  LOGIN SCREEN WIRING
// ══════════════════════════════════════════
var selectedAvatarIdx=0;

function buildAvatarGrid(){
  var grid=document.getElementById('loginAvatarGrid');
  if(!grid)return;
  grid.innerHTML='';
  // Make grid 6 columns for 26 avatars
  grid.style.gridTemplateColumns='repeat(6,1fr)';
  AVATAR_COLORS.forEach(function(av,i){
    var d=document.createElement('div');
    d.className='av-opt'+(i===selectedAvatarIdx?' sel':'');
    d.style.background=av.bg;
    d.style.color=av.fg;
    d.style.flexDirection='column';
    d.style.gap='1px';
    d.style.fontSize='14px';
    // Show emoji on top, letter below
    var em=document.createElement('span');em.textContent=av.emoji||String.fromCharCode(65+i);em.style.fontSize='16px';em.style.lineHeight='1';
    var lt=document.createElement('span');lt.textContent=String.fromCharCode(65+i);lt.style.fontSize='9px';lt.style.fontWeight='700';lt.style.opacity='0.8';
    d.appendChild(em);d.appendChild(lt);
    d.addEventListener('click',function(){
      selectedAvatarIdx=i;
      document.querySelectorAll('.av-opt').forEach(function(x){x.classList.remove('sel');});
      d.classList.add('sel');
    });
    d.addEventListener('touchstart',function(e){
      e.preventDefault();
      selectedAvatarIdx=i;
      document.querySelectorAll('.av-opt').forEach(function(x){x.classList.remove('sel');});
      d.classList.add('sel');
    },{passive:false});
    grid.appendChild(d);
  });
}

function doCreateProfile(){
  var inp=document.getElementById('loginUsernameInp');
  var err=document.getElementById('loginErr');
  var username=(inp.value||'').trim();
  err.textContent='';
  inp.classList.remove('login-input-err');
  if(!username){err.textContent='Please enter a username.';inp.classList.add('login-input-err');return;}
  if(username.length<2){err.textContent='Username must be at least 2 characters.';inp.classList.add('login-input-err');return;}
  if(!/^[a-zA-Z0-9_]+$/.test(username)){err.textContent='Only letters, numbers and _ allowed.';inp.classList.add('login-input-err');return;}
  var profiles=getAllProfiles();
  var exists=profiles.some(function(p){return p.username.toLowerCase()===username.toLowerCase();});
  if(exists){err.textContent='That username is already taken on this device.';inp.classList.add('login-input-err');return;}
  var profile={username:username,avatarIdx:selectedAvatarIdx,created:new Date().toLocaleDateString(),wins:0,games:0,coins:0};
  profiles.push(profile);
  saveAllProfiles(profiles);
  loginUser(profile);
}

function showUserSelect(){
  var list=document.getElementById('userList');
  if(!list)return;
  list.innerHTML='';
  var profiles=getAllProfiles();
  if(!profiles.length){
    var empty=document.createElement('div');
    empty.style.cssText='text-align:center;color:var(--mu);font-size:13px;padding:20px;';
    empty.textContent='No profiles yet. Create one!';
    list.appendChild(empty);
    return;
  }
  profiles.forEach(function(p){
    var av=AVATAR_COLORS[p.avatarIdx||0];
    var card=document.createElement('div');
    card.className='user-card';
    var avDiv=document.createElement('div');
    avDiv.className='uc-av';
    avDiv.style.background=av.bg;avDiv.style.color=av.fg;
    avDiv.textContent=p.username[0].toUpperCase();
    var info=document.createElement('div');
    info.className='uc-info';
    var nm=document.createElement('div');nm.className='uc-name';nm.textContent=p.username;
    var st=document.createElement('div');st.className='uc-stats';
    st.textContent='Wins: '+(p.wins||0)+' · Games: '+(p.games||0)+' · 🪙 '+(p.coins||0);
    info.appendChild(nm);info.appendChild(st);
    var del=document.createElement('div');
    del.className='uc-del';del.textContent='🗑';
    del.addEventListener('click',function(e){
      e.stopPropagation();
      showConfirm('Delete Profile?','Delete "'+p.username+'"? All their data will be lost.','Delete',function(){
        deleteProfile(p.username);showUserSelect();
      });
    });
    del.addEventListener('touchstart',function(e){
      e.stopPropagation();e.preventDefault();
      showConfirm('Delete Profile?','Delete "'+p.username+'"? All their data will be lost.','Delete',function(){
        deleteProfile(p.username);showUserSelect();
      });
    },{passive:false});
    card.appendChild(avDiv);card.appendChild(info);card.appendChild(del);
    function doLogin(){saveCurrentProfileData();loginUser(p);}
    card.addEventListener('click',doLogin);
    card.addEventListener('touchstart',function(e){e.preventDefault();doLogin();},{passive:false});
    list.appendChild(card);
  });
}

// Login screen buttons
sbtn('loginCreateBtn',doCreateProfile);
document.getElementById('loginUsernameInp').addEventListener('keydown',function(e){if(e.key==='Enter')doCreateProfile();});
sbtn('loginSwitchBtn',function(){showUserSelect();showScreen('sUserSelect');});
sbtn('userSelectNewBtn',function(){showScreen('sLogin');buildAvatarGrid();});
sbtn('profileEditBtn',function(){showUserSelect();showScreen('sUserSelect');});

// Override resetAllBtn to reset only current profile data
sbtn('resetAllBtn',function(){
  showConfirm(
    'Reset Your Data?',
    'This resets all YOUR coins, quests, purchases, puzzle progress and player history. Your username stays.',
    'Reset My Data',
    function(){
      resetCurrentProfileData();
      updateCustomTimerVisibility();
      updateHintButton();
      showStoreMsg('All your data has been reset to zero!');
    }
  );
});

// ── DAILY PUZZLE ──
function getDailyPuzzleKey(){var d=new Date();return 'dailyPuzzle_'+d.getFullYear()+'_'+d.getMonth()+'_'+d.getDate();}
function isDailyDone(){return localStorage.getItem(getDailyPuzzleKey())==='done';}
function markDailyDone(){localStorage.setItem(getDailyPuzzleKey(),'done');addCoins(10);showStoreMsg('Daily puzzle done! +10 coins');updateDailyBanner();}
function getDailyPuzzleIndex(){return Math.floor(Date.now()/(1000*60*60*24))%20;}
function updateDailyBanner(){
  var banner=document.getElementById('dailyPuzzleBanner');
  var status=document.getElementById('dailyStatus');
  if(!banner)return;
  banner.style.display='block';
  if(isDailyDone()){if(status)status.textContent='Done today!';banner.style.opacity='0.6';}
  else{if(status)status.textContent='Tap to play +10';banner.style.opacity='1';}
}
(function(){
  var el=document.getElementById('dailyPuzzleBanner');
  if(!el)return;
  function doDaily(e){
    if(e.type==='touchstart')e.preventDefault();
    if(isDailyDone()){showStoreMsg('Come back tomorrow for a new puzzle!');return;}
    var idx=getDailyPuzzleIndex();
    startPuzzle('easy',idx,true); // isDaily=true — won't touch normal progress
  }
  el.addEventListener('click',doDaily);
  el.addEventListener('touchstart',doDaily,{passive:false});
})();

// ── STARTUP: check if logged in ──
(function(){

  buildAvatarGrid();
  var user=getCurrentUser();
  if(user){
    // Already logged in — load their data and go to home
    loadProfileData(user.username);
    applyTheme(loadActiveTheme());
    applyHomeBg(loadHomeBg());
    refreshCoinDisplays();
    checkQuestProgress();
    updateProfileBar();
    updateCustomTimerVisibility();
    showScreen('sHome');
  } else {
    // First time — show login
    showScreen('sLogin');
  }
  updateDailyBanner();
  // Save profile data when user leaves the page
  window.addEventListener('beforeunload',function(){try{saveCurrentProfileData();}catch(e){}});
  // Also save periodically every 30 seconds
  setInterval(saveCurrentProfileData,60000);
})();


// ── Show/hide custom timer row based on ownership ──
function updateHintAndUndoButtons(){
  updateHintButton();
}
function updateCustomTimerVisibility(){
  var row=document.getElementById('customTimerRow');
  if(!row)return;
  var owned=loadOwned();
  row.style.display=owned['custom_timer']?'block':'none';
}
updateCustomTimerVisibility();

// Custom timer Set button
sbtn('customTimerSet',function(){
  var mins=parseInt(document.getElementById('customMin').value)||0;
  var secs=parseInt(document.getElementById('customSec').value)||0;
  var inc=parseInt(document.getElementById('customInc').value)||0;
  var totalSecs=mins*60+secs;
  if(totalSecs<10){showStoreMsg('Minimum time is 10 seconds.');return;}
  // Deselect all existing time buttons
  document.querySelectorAll('#sHome .tbtn').forEach(function(b){b.classList.remove('on');});
  document.getElementById('uBtn').classList.remove('on');
  // Store as custom selection — inc is separate from total time
  window._customTime={secs:totalSecs,inc:inc};
  var label=mins>0?(mins+'m '+(secs>0?secs+'s ':'')):secs+'s';
  var incLabel=inc>0?' +'+inc+'s inc':'';
  // Visually highlight the custom timer row to confirm selection
  var row=document.getElementById('customTimerRow');
  if(row){row.style.borderColor='#779556';setTimeout(function(){row.style.borderColor='#f0c040';},1500);}
  showStoreMsg('Timer set: '+label+incLabel+' — tap Start Game!');
});

// (duplicate resetAllBtn removed)

// Hook store purchase to refresh custom timer visibility
var _origHandleStorePurchase=handleStorePurchase;

handleStorePurchase=function(id,type){
  _origHandleStorePurchase(id,type);
  updateCustomTimerVisibility();
  updateHintButton();
};
