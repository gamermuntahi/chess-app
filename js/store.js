// COINS, STORE ITEMS + QUEST SYSTEM
'use strict';

// ══════════════════════════════════════════
//  COIN & QUEST SYSTEM
// ══════════════════════════════════════════
function loadCoins(){try{return parseInt(localStorage.getItem('chessCoins')||'0');}catch(e){return 0;}}
function saveCoins(n){try{localStorage.setItem('chessCoins',Math.max(0,Math.floor(n)));}catch(e){}}
function addCoins(n){saveCoins(loadCoins()+n);refreshCoinDisplays();}
function spendCoins(n){const c=loadCoins();if(c<n)return false;saveCoins(c-n);refreshCoinDisplays();return true;}
function refreshCoinDisplays(){
  const c=loadCoins();
  const d1=document.getElementById('coinDisplay');
  const d2=document.getElementById('storeCoinDisplay');
  if(d1)d1.textContent=c.toLocaleString();
  if(d2)d2.textContent=c.toLocaleString();
}

// Quest definitions
const QUEST_DEFS=[
  // ── NORMAL QUESTS ──
  {id:'q_first_game',      icon:'♟',  name:'First Move',           desc:'Complete your first game',                    coins:10,  cat:'normal'},
  {id:'q_castle',          icon:'🏰', name:'Castle!',               desc:'Perform a castling move',                     coins:10,  cat:'normal'},
  {id:'q_knight_fork',     icon:'♞',  name:'Knight Fork',           desc:'Earn a Knight Fork badge in a game',          coins:10,  cat:'normal'},
  {id:'q_win_queen',       icon:'🏆', name:'Queen Slayer',          desc:'Capture the opponents queen',                 coins:15,  cat:'normal'},
  {id:'q_resign_foe',      icon:'🏳', name:'Dominant Victory',      desc:'Win by opponents resignation',                coins:20,  cat:'normal'},
  {id:'q_mate_queen',      icon:'👑', name:'Royal Execution',       desc:'Deliver checkmate with a Queen',              coins:20,  cat:'normal'},
  {id:'q_promotion',       icon:'⭐', name:'Queen Promotion',       desc:'Promote a pawn to a Queen',                   coins:30,  cat:'normal'},
  {id:'q_win_3',           icon:'🎯', name:'Hat Trick',             desc:'Win 3 games total',                           coins:30,  cat:'normal'},
  {id:'q_mate_rook',       icon:'🏯', name:'Rook Crusher',          desc:'Deliver checkmate with a Rook',               coins:40,  cat:'normal'},
  {id:'q_tournament',      icon:'🏅', name:'Tournament Player',     desc:'Complete a tournament',                       coins:40,  cat:'normal'},
  {id:'q_100_elo',         icon:'📈', name:'Rising Star',           desc:'Reach 400 ELO rating',                        coins:50,  cat:'normal'},
  {id:'q_stalemate',       icon:'🤝', name:'Stalemate Artist',      desc:'Force a stalemate draw',                      coins:50,  cat:'normal'},
  {id:'q_5_puzzles',       icon:'🧩', name:'Puzzle Starter',        desc:'Solve 5 puzzles',                             coins:25,  cat:'normal'},
  {id:'q_mate_bishop',     icon:'⛪', name:'Diagonal Strike',       desc:'Deliver checkmate with a Bishop',             coins:75,  cat:'normal'},
  {id:'q_mate_knight',     icon:'♞',  name:'Knights Glory',         desc:'Deliver checkmate with a Knight',             coins:80,  cat:'normal'},
  {id:'q_win_10',          icon:'🔥', name:'On Fire',               desc:'Win 10 games total',                          coins:100, cat:'normal'},
  {id:'q_mate_pawn',       icon:'♙',  name:'Pawn Power',            desc:'Deliver checkmate with a Pawn',               coins:100, cat:'normal'},
  {id:'q_20_puzzles',      icon:'🧩', name:'Puzzle Master',         desc:'Solve 20 puzzles',                            coins:100, cat:'normal'},
  {id:'q_all_easy',        icon:'🌟', name:'Easy Champion',         desc:'Complete all 20 Easy puzzles',                coins:50,  cat:'normal'},
  {id:'q_mate_enpassant',  icon:'⚡', name:'En Passant Mate',       desc:'Deliver checkmate via en passant',            coins:150, cat:'normal'},
  // ── EASY BOT QUESTS (~1/3 coins) ──
  {id:'qb_e_first',        icon:'🤖', name:'[Easy Bot] First Win',         desc:'Win your first game vs Easy bot',             coins:4,   cat:'easy'},
  {id:'qb_e_castle',       icon:'🤖', name:'[Easy Bot] Castle!',           desc:'Perform castling vs Easy bot',                coins:4,   cat:'easy'},
  {id:'qb_e_win_queen',    icon:'🤖', name:'[Easy Bot] Queen Slayer',      desc:'Capture the bots queen vs Easy bot',          coins:5,   cat:'easy'},
  {id:'qb_e_resign',       icon:'🤖', name:'[Easy Bot] Resign',            desc:'Win by bots resignation vs Easy bot',         coins:7,   cat:'easy'},
  {id:'qb_e_mate_queen',   icon:'🤖', name:'[Easy Bot] Queen Mate',        desc:'Checkmate with Queen vs Easy bot',            coins:7,   cat:'easy'},
  {id:'qb_e_promotion',    icon:'🤖', name:'[Easy Bot] Promotion',         desc:'Promote a pawn vs Easy bot',                  coins:10,  cat:'easy'},
  {id:'qb_e_mate_rook',    icon:'🤖', name:'[Easy Bot] Rook Mate',         desc:'Checkmate with Rook vs Easy bot',             coins:13,  cat:'easy'},
  {id:'qb_e_mate_bishop',  icon:'🤖', name:'[Easy Bot] Bishop Mate',       desc:'Checkmate with Bishop vs Easy bot',           coins:25,  cat:'easy'},
  {id:'qb_e_mate_knight',  icon:'🤖', name:'[Easy Bot] Knight Mate',       desc:'Checkmate with Knight vs Easy bot',           coins:27,  cat:'easy'},
  {id:'qb_e_mate_pawn',    icon:'🤖', name:'[Easy Bot] Pawn Mate',         desc:'Checkmate with Pawn vs Easy bot',             coins:33,  cat:'easy'},
  {id:'qb_e_enpassant',    icon:'🤖', name:'[Easy Bot] En Passant Mate',   desc:'Checkmate via en passant vs Easy bot',        coins:50,  cat:'easy'},
  // ── MEDIUM BOT QUESTS (~2/3 coins) ──
  {id:'qb_m_first',        icon:'🤖', name:'[Medium Bot] First Win',       desc:'Win your first game vs Medium bot',           coins:7,   cat:'medium'},
  {id:'qb_m_castle',       icon:'🤖', name:'[Medium Bot] Castle!',         desc:'Perform castling vs Medium bot',              coins:7,   cat:'medium'},
  {id:'qb_m_win_queen',    icon:'🤖', name:'[Medium Bot] Queen Slayer',    desc:'Capture the bots queen vs Medium bot',        coins:10,  cat:'medium'},
  {id:'qb_m_resign',       icon:'🤖', name:'[Medium Bot] Resign',          desc:'Win by bots resignation vs Medium bot',       coins:13,  cat:'medium'},
  {id:'qb_m_mate_queen',   icon:'🤖', name:'[Medium Bot] Queen Mate',      desc:'Checkmate with Queen vs Medium bot',          coins:13,  cat:'medium'},
  {id:'qb_m_promotion',    icon:'🤖', name:'[Medium Bot] Promotion',       desc:'Promote a pawn vs Medium bot',                coins:20,  cat:'medium'},
  {id:'qb_m_mate_rook',    icon:'🤖', name:'[Medium Bot] Rook Mate',       desc:'Checkmate with Rook vs Medium bot',           coins:27,  cat:'medium'},
  {id:'qb_m_mate_bishop',  icon:'🤖', name:'[Medium Bot] Bishop Mate',     desc:'Checkmate with Bishop vs Medium bot',         coins:50,  cat:'medium'},
  {id:'qb_m_mate_knight',  icon:'🤖', name:'[Medium Bot] Knight Mate',     desc:'Checkmate with Knight vs Medium bot',         coins:53,  cat:'medium'},
  {id:'qb_m_mate_pawn',    icon:'🤖', name:'[Medium Bot] Pawn Mate',       desc:'Checkmate with Pawn vs Medium bot',           coins:67,  cat:'medium'},
  {id:'qb_m_enpassant',    icon:'🤖', name:'[Medium Bot] En Passant Mate', desc:'Checkmate via en passant vs Medium bot',      coins:100, cat:'medium'},
  // ── HARD BOT QUESTS (same coins as normal) ──
  {id:'qb_h_first',        icon:'🤖', name:'[Hard Bot] First Win',         desc:'Win your first game vs Hard bot',             coins:10,  cat:'hard'},
  {id:'qb_h_castle',       icon:'🤖', name:'[Hard Bot] Castle!',           desc:'Perform castling vs Hard bot',                coins:10,  cat:'hard'},
  {id:'qb_h_win_queen',    icon:'🤖', name:'[Hard Bot] Queen Slayer',      desc:'Capture the bots queen vs Hard bot',          coins:15,  cat:'hard'},
  {id:'qb_h_resign',       icon:'🤖', name:'[Hard Bot] Resign',            desc:'Win by bots resignation vs Hard bot',         coins:20,  cat:'hard'},
  {id:'qb_h_mate_queen',   icon:'🤖', name:'[Hard Bot] Queen Mate',        desc:'Checkmate with Queen vs Hard bot',            coins:20,  cat:'hard'},
  {id:'qb_h_promotion',    icon:'🤖', name:'[Hard Bot] Promotion',         desc:'Promote a pawn vs Hard bot',                  coins:30,  cat:'hard'},
  {id:'qb_h_mate_rook',    icon:'🤖', name:'[Hard Bot] Rook Mate',         desc:'Checkmate with Rook vs Hard bot',             coins:40,  cat:'hard'},
  {id:'qb_h_mate_bishop',  icon:'🤖', name:'[Hard Bot] Bishop Mate',       desc:'Checkmate with Bishop vs Hard bot',           coins:75,  cat:'hard'},
  {id:'qb_h_mate_knight',  icon:'🤖', name:'[Hard Bot] Knight Mate',       desc:'Checkmate with Knight vs Hard bot',           coins:80,  cat:'hard'},
  {id:'qb_h_mate_pawn',    icon:'🤖', name:'[Hard Bot] Pawn Mate',         desc:'Checkmate with Pawn vs Hard bot',             coins:100, cat:'hard'},
  {id:'qb_h_enpassant',    icon:'🤖', name:'[Hard Bot] En Passant Mate',   desc:'Checkmate via en passant vs Hard bot',        coins:150, cat:'hard'},
];

function loadQuestProgress(){
  try{return JSON.parse(localStorage.getItem('chessQuests')||'{}');}
  catch(e){return {};}
}
function saveQuestProgress(q){try{localStorage.setItem('chessQuests',JSON.stringify(q));}catch(e){}}

function completeQuest(id){
  const q=loadQuestProgress();
  if(q[id])return; // already done
  q[id]=true;
  saveQuestProgress(q);
  const def=QUEST_DEFS.find(d=>d.id===id);
  if(def){
    addCoins(def.coins);
    showQuestToast(def);
  }
}

function checkQuestProgress(){
  // Win count quests
  const lib=loadLib();
  let totalWins=0;
  Object.values(lib).forEach(p=>{totalWins+=p.wins||0;});
  if(totalWins>=1)completeQuest('q_first_game');
  if(totalWins>=3)completeQuest('q_win_3');
  if(totalWins>=10)completeQuest('q_win_10');
  // Puzzle quests
  const pp=loadPuzzleProgress();
  let totalDone=0;
  Object.values(pp).forEach(d=>{totalDone+=(d.done||[]).length;});
  if(totalDone>=5)completeQuest('q_5_puzzles');
  if(totalDone>=20)completeQuest('q_20_puzzles');
  if((pp.easy.done||[]).length>=20)completeQuest('q_all_easy');
  // ELO quest
  let maxElo=0;
  Object.values(lib).forEach(p=>{if((p.elo||0)>maxElo)maxElo=p.elo;});
  if(maxElo>=400)completeQuest('q_100_elo');
}

function showQuestToast(def){
  const t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#f0c040,#e0a000);color:#111;border-radius:14px;padding:10px 18px;font-size:13px;font-weight:700;z-index:9998;box-shadow:0 4px 20px rgba(0,0,0,.5);white-space:nowrap;opacity:1;transition:opacity .3s;';
  t.textContent=def.icon+' Quest done: '+def.name+' +'+def.coins+'🪙';
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),3500);
}

// ── STORE ──
const BOARD_THEMES=[
  {id:'classic', name:'Classic',    desc:'The timeless green & cream',  icon:'♟', ls:'#f0d9b5', ds:'#779556', price:0},
  {id:'ocean',   name:'Ocean',      desc:'Cool blue tones',              icon:'🌊', ls:'#dee3e6', ds:'#4d7fa8', price:80},
  {id:'walnut',  name:'Walnut',     desc:'Warm wood finish',             icon:'🪵', ls:'#e8c89a', ds:'#7b4a2d', price:80},
  {id:'midnight',name:'Midnight',   desc:'Dark blue elegance',           icon:'🌙', ls:'#3d4a6b', ds:'#1a2340', price:120},
  {id:'rose',    name:'Rose',       desc:'Soft pink romance',            icon:'🌸', ls:'#f2d2d8', ds:'#9e4060', price:120},
  {id:'slate',   name:'Slate',      desc:'Clean grey modern look',       icon:'🔷', ls:'#c8cdd6', ds:'#4a5568', price:80},
  {id:'forest',  name:'Forest',     desc:'Deep green woodland',          icon:'🌲', ls:'#c8d5b9', ds:'#4a7c59', price:150},
  {id:'gold',    name:'Gold',       desc:'Prestigious golden board',     icon:'✨', ls:'#f5e6a0', ds:'#b8860b', price:200},
  {id:'purple',  name:'Purple',     desc:'Royal purple finish',          icon:'💜', ls:'#e0d0f0', ds:'#6a3fa0', price:200},
  {id:'lava',    name:'Lava',       desc:'Fiery red hot board',          icon:'🔥', ls:'#f5c0a0', ds:'#c0402a', price:250},
];

const HOME_BG_THEMES=[
  {id:'hbg_dark',     name:'Midnight Dark',  desc:'Default deep black — timeless',          icon:'🌑', price:0,   gradient:'linear-gradient(170deg,#141414,#0a1a0a)'},
  {id:'hbg_forest',   name:'Deep Forest',    desc:'Rich emerald green tones',               icon:'🌲', price:50,  gradient:'linear-gradient(135deg,#0d3b1e,#1a6b35,#0a2912)'},
  {id:'hbg_ocean',    name:'Deep Ocean',     desc:'Vivid blue ocean depths',                icon:'🌊', price:50,  gradient:'linear-gradient(135deg,#0a2a6e,#1565c0,#042244)'},
  {id:'hbg_ember',    name:'Ember',          desc:'Glowing hot orange and red fire',        icon:'🔥', price:70,  gradient:'linear-gradient(135deg,#7f1d1d,#dc2626,#431407)'},
  {id:'hbg_royal',    name:'Royal Purple',   desc:'Deep regal violet and indigo',           icon:'👑', price:70,  gradient:'linear-gradient(135deg,#3b0764,#7c3aed,#1e0338)'},
  {id:'hbg_aurora',   name:'Aurora',         desc:'Northern lights — teal fading to purple',icon:'🌌', price:90,  gradient:'linear-gradient(135deg,#042f2e,#0d9488,#2e1065,#0f172a)'},
  {id:'hbg_gold',     name:'Gold Rush',      desc:'Rich amber and golden warmth',           icon:'✨', price:90,  gradient:'linear-gradient(135deg,#451a03,#d97706,#78350f)'},
  {id:'hbg_slate',    name:'Steel Blue',     desc:'Bold steel blue and grey',               icon:'🔷', price:60,  gradient:'linear-gradient(135deg,#0f172a,#1e40af,#0f172a)'},
  {id:'hbg_crimson',  name:'Crimson Night',  desc:'Blood red and deep black',               icon:'🩸', price:80,  gradient:'linear-gradient(135deg,#450a0a,#991b1b,#1c0202)'},
  {id:'hbg_sunset',   name:'Cosmic Sunset',  desc:'Purple sky bleeding into fiery orange',  icon:'🌅', price:120, gradient:'linear-gradient(135deg,#2e1065,#9333ea,#ea580c,#431407)'},
  {id:'hbg_matrix',   name:'Matrix',         desc:'Iconic green on black — legendary',      icon:'💚', price:150, gradient:'linear-gradient(135deg,#052e16,#16a34a,#14532d,#000000)'},
  {id:'hbg_galaxy',   name:'Galaxy',         desc:'Deep space blue and purple cosmos',      icon:'🔭', price:150, gradient:'linear-gradient(135deg,#0c0a1e,#1e1b4b,#312e81,#0c0a1e)'},
  {id:'hbg_rose',     name:'Rose Gold',      desc:'Warm pink and rose gold luxury',         icon:'🌸', price:120, gradient:'linear-gradient(135deg,#4c0519,#be185d,#881337,#1c0010)'},
  {id:'hbg_obsidian', name:'Obsidian',       desc:'Polished black with deep blue shimmer',  icon:'⬛', price:180, gradient:'linear-gradient(135deg,#020617,#0f172a,#1e293b,#020617)'},
];

function loadHomeBg(){try{return localStorage.getItem('chessHomeBg')||'hbg_dark';}catch(e){return'hbg_dark';}}
function saveHomeBg(id){try{localStorage.setItem('chessHomeBg',id);}catch(e){}}
function applyHomeBg(id){
  var theme=HOME_BG_THEMES.find(function(t){return t.id===id;})||HOME_BG_THEMES[0];
  var el=document.getElementById('sHome');
  if(el) el.style.background=theme.gradient;
  saveHomeBg(id);
}


const STORE_ITEMS=[
  {id:'post_analysis',name:'Post-Game Analysis',desc:'See accuracy %, best moves, blunders after each game',icon:'📊',price:200,type:'feature'},
  {id:'move_verify',  name:'Move Analysis',    desc:'See move quality badges (!! ! ★ ? ??)',   icon:'🔍', price:100,  type:'feature'},
  {id:'hint_system',  name:'Hint System',      desc:'Get a move hint during the game (3/game)', icon:'💡', price:150,  type:'feature'},
  {id:'undo_plus',    name:'Unlimited Undo',   desc:'Undo as many moves as you want',           icon:'↩️', price:200,  type:'feature'},
  {id:'custom_timer', name:'Custom Timer',     desc:'Set any time control you want for matches', icon:'⏱️', price:100,  type:'feature'},
  {id:'move_export',  name:'Move History Export',desc:'Export game PGN to clipboard',           icon:'📤', price:100,  type:'feature'},
  {id:'opening_detector',name:'Opening Detector',desc:'See the opening name live during your game',icon:'📖',price:120,type:'feature'},
];

function loadOwned(){
  try{return JSON.parse(localStorage.getItem('chessOwned')||'{"classic":true}');}
  catch(e){return {classic:true};}
}
function saveOwned(o){try{localStorage.setItem('chessOwned',JSON.stringify(o));}catch(e){}}
function loadActiveTheme(){try{return localStorage.getItem('chessTheme')||'classic';}catch(e){return'classic';}}
function saveActiveTheme(t){try{localStorage.setItem('chessTheme',t);}catch(e){}}

function applyTheme(id){
  const theme=BOARD_THEMES.find(t=>t.id===id)||BOARD_THEMES[0];
  document.documentElement.style.setProperty('--ls',theme.ls);
  document.documentElement.style.setProperty('--ds',theme.ds);
  saveActiveTheme(id);
  // Update preview board squares on home screen
  document.querySelectorAll('.ps.pl').forEach(function(s){s.style.background=theme.ls;});
  document.querySelectorAll('.ps.pd').forEach(function(s){s.style.background=theme.ds;});
}

// ── Store state (cached to avoid re-reading localStorage repeatedly) ──
var _storeBuilt=false;

function renderStore(){
  const list=document.getElementById('storeList');
  if(!list)return;

  // Only rebuild DOM if store hasn't been built yet
  if(!_storeBuilt){
    _buildStoreDOM(list);
    _storeBuilt=true;
  }
  // Always update button states (cheap operation)
  _updateStoreButtons();
}

function _buildStoreDOM(list){
  list.innerHTML='';

  function sec(title){
    const d=document.createElement('div');
    d.className='store-section-title';
    d.textContent=title;
    list.appendChild(d);
  }

  function row(id,type,iconHTML,name,desc,price){
    const div=document.createElement('div');
    div.className='store-item';
    div.dataset.itemId=id;
    div.dataset.itemType=type;
    const left=document.createElement('div');
    left.style.cssText='display:flex;align-items:center;gap:10px;flex:1;min-width:0;';
    const ico=document.createElement('div');ico.className='si-icon';ico.innerHTML=iconHTML;
    const info=document.createElement('div');info.className='si-info';
    info.innerHTML='<div class="si-name">'+name+'</div><div class="si-desc">'+desc+'</div>';
    left.appendChild(ico);left.appendChild(info);
    const right=document.createElement('div');
    right.style.cssText='display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0;';
    const pr=document.createElement('div');
    pr.className='si-price';
    pr.textContent=price===0?'Free':'🪙 '+price;
    right.appendChild(pr);
    const btn=document.createElement('button');
    btn.className='si-btn';
    btn.dataset.id=id;btn.dataset.type=type;
    right.appendChild(btn);
    div.appendChild(left);div.appendChild(right);
    list.appendChild(div);
  }

  sec('Piece Skins');
  PIECE_SKINS.forEach(function(s){
    const preview='<div style="display:flex;gap:3px;align-items:center;">'
      +'<div style="width:16px;height:16px;border-radius:50%;background:'+s.wFill+';border:2px solid '+s.wOut+'"></div>'
      +'<div style="width:16px;height:16px;border-radius:50%;background:'+s.bFill+';border:2px solid '+s.bOut+'"></div>'
      +'</div>';
    row(s.id,'skin',preview,s.name,s.desc,s.price);
  });

  sec('Board Themes');
  BOARD_THEMES.forEach(function(t){
    const preview='<div style="display:flex;gap:1px;">'
      +'<div style="width:8px;height:16px;background:'+t.ls+'"></div>'
      +'<div style="width:8px;height:16px;background:'+t.ds+'"></div>'
      +'<div style="width:8px;height:16px;background:'+t.ls+'"></div>'
      +'</div>';
    row(t.id,'theme',preview+'<span style="margin-left:4px;font-size:16px;">'+t.icon+'</span>',t.name,t.desc,t.price);
  });

  sec('Home Backgrounds');
  HOME_BG_THEMES.forEach(function(t){
    var preview='<div style="width:32px;height:20px;border-radius:5px;background:'+t.gradient+';border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:13px;">'+t.icon+'</div>';
    row(t.id,'homebg',preview,t.name,t.desc,t.price);
  });

  sec('Profile Frames');
  PROFILE_FRAMES.forEach(function(item){
    var preview='<div style="width:32px;height:32px;border-radius:50%;'+item.border+';background:'+item.bg+';display:flex;align-items:center;justify-content:center;font-size:16px;">'+item.emoji+'</div>';
    row(item.id,'frame',preview,item.name,item.desc,item.price);
  });

  sec('Game Features');
  STORE_ITEMS.forEach(function(it){
    row(it.id,'feature',it.icon,it.name,it.desc,it.price);
  });

  // Single permanent event listener — never re-added
  list.addEventListener('click',_storeHandleTap);
  list.addEventListener('touchstart',_storeHandleTap,{passive:false});
}

function _updateStoreButtons(){
  const list=document.getElementById('storeList');
  if(!list)return;
  const owned=loadOwned();
  const coins=loadCoins();
  const activeSkinId=localStorage.getItem('chessSkin')||'skin_classic';
  const activeThemeId=loadActiveTheme();

  list.querySelectorAll('.store-item').forEach(function(div){
    const id=div.dataset.itemId;
    const type=div.dataset.itemType;
    const btn=div.querySelector('.si-btn');
    if(!btn||!id)return;

    let isOwned=false,isActive=false,price=0;
    if(type==='frame'){
      const fr=PROFILE_FRAMES.find(function(x){return x.id===id;});
      if(!fr)return;
      price=fr.price;
      isOwned=price===0||!!owned[id];
      isActive=(localStorage.getItem('chessFrame')||'frame_none')===id;
    } else if(type==='skin'){
      const s=PIECE_SKINS.find(function(x){return x.id===id;});
      if(!s)return;
      price=s.price;
      isOwned=price===0||!!owned[id];
      isActive=activeSkinId===id;
    } else if(type==='theme'){
      const t=BOARD_THEMES.find(function(x){return x.id===id;});
      if(!t)return;
      price=t.price;
      isOwned=price===0||!!owned[id];
      isActive=activeThemeId===id;
    } else if(type==='homebg'){
      const t=HOME_BG_THEMES.find(function(x){return x.id===id;});
      if(!t)return;
      price=t.price;
      isOwned=price===0||!!owned[id];
      isActive=loadHomeBg()===id;
    } else {
      const it=STORE_ITEMS.find(function(x){return x.id===id;});
      if(!it)return;
      price=it.price;
      isOwned=!!it.owned||!!owned[id];
    }

    // Update card class
    div.className='store-item'+(isActive?' active':isOwned?' owned':'');

    // Update button
    if(!isOwned && price>0){
      const canAfford=coins>=price;
      btn.textContent=canAfford?'Buy':'🔒 Buy';
      btn.className='si-btn'+(canAfford?'':' locked-btn');
      btn.dataset.action='buy';
    } else if(type==='skin'||type==='theme'||type==='frame'||type==='homebg'){
      if(isActive){
        btn.textContent='✓ Equipped';
        btn.className='si-btn active-btn';
        btn.dataset.action='unequip';
      } else {
        btn.textContent='Equip';
        btn.className='si-btn owned-btn';
        btn.dataset.action='equip';
      }
    } else {
      btn.textContent='✓ Owned';
      btn.className='si-btn owned-btn';
      btn.dataset.action='';
    }
    btn.dataset.id=id;
    btn.dataset.type=type;
  });
}

function _storeHandleTap(e){
  const btn=e.target.closest('[data-action]');
  if(!btn||!btn.dataset.action)return;
  if(e.type==='touchstart')e.preventDefault();
  const id=btn.dataset.id;
  const type=btn.dataset.type;
  const action=btn.dataset.action;
  if(action==='buy'){
    handleStorePurchase(id,type);
  } else if(action==='equip'){
    if(type==='skin'){
      setActiveSkin(id);
      _updateStoreButtons();
      _showSkinPreview(id);
      buildHomePreview();
      if(G.b) render();
    } else if(type==='frame'){
      localStorage.setItem('chessFrame',id);
      _updateStoreButtons();
      updateProfileBar();
    } else if(type==='homebg'){
      applyHomeBg(id);
      _updateStoreButtons();
    } else {
      applyTheme(id);
      _updateStoreButtons();
    }
    showStoreMsg('✓ Equipped!');
  } else if(action==='unequip'){
    if(type==='skin'){
      setActiveSkin('skin_classic');
      _updateStoreButtons();
      _showSkinPreview('skin_classic');
      buildHomePreview();
      if(G.b) render();
    } else if(type==='frame'){
      localStorage.setItem('chessFrame','frame_none');
      _updateStoreButtons();
      updateProfileBar();
    } else if(type==='homebg'){
      applyHomeBg('hbg_dark');
      _updateStoreButtons();
    } else {
      applyTheme('classic');
      _updateStoreButtons();
    }
    showStoreMsg('✓ Unequipped');
  }
}

// Show a live piece preview at top of store when skin is equipped
function _showSkinPreview(skinId){
  const skin=PIECE_SKINS.find(function(s){return s.id===skinId;})||PIECE_SKINS[0];
  // Find or create the preview bar
  var prev=document.getElementById('skinPreviewBar');
  if(!prev){
    prev=document.createElement('div');
    prev.id='skinPreviewBar';
    prev.style.cssText='display:flex;align-items:center;gap:10px;background:var(--sur2);border:2px solid var(--bd);border-radius:12px;padding:10px 14px;margin-bottom:12px;';
    const list=document.getElementById('storeList');
    if(list) list.parentNode.insertBefore(prev,list);
  }
  // Draw sample pieces using pieceSVG
  prev.innerHTML='<div style="font-size:11px;color:var(--mu);letter-spacing:1px;flex-shrink:0;">PREVIEW</div>'
    +'<div style="display:flex;gap:4px;flex:1;justify-content:center;">';
  const types=['wK','wQ','wR','bK','bQ','bR'];
  // Use colored circles as fast preview (avoids SVG slowness)
  const uni={K:'♚',Q:'♛',R:'♜'};
  var inner='<div style="display:flex;gap:6px;align-items:center;justify-content:center;flex:1;">';
  ['K','Q','R'].forEach(function(t){
    inner+='<div style="font-size:26px;line-height:1;'
      +'color:'+skin.wFill+';'
      +'-webkit-text-stroke:2px '+skin.wOut+';text-stroke:2px '+skin.wOut+';">'+uni[t]+'</div>';
  });
  inner+='<div style="width:1px;height:24px;background:var(--bd);margin:0 4px;"></div>';
  ['K','Q','R'].forEach(function(t){
    inner+='<div style="font-size:26px;line-height:1;'
      +'color:'+skin.bFill+';'
      +'-webkit-text-stroke:2px '+skin.bOut+';text-stroke:2px '+skin.bOut+';">'+uni[t]+'</div>';
  });
  inner+='</div>';
  prev.innerHTML='<div style="font-size:10px;color:var(--mu);letter-spacing:1px;flex-shrink:0;text-transform:uppercase;">Preview</div>'
    +inner
    +'<div style="font-size:11px;font-weight:700;color:#f0c040;flex-shrink:0;">'+skin.name+'</div>';
}


function handleStorePurchase(id,type){
  const owned=loadOwned();
  if(type==='homebg'){
    const bg=HOME_BG_THEMES.find(t=>t.id===id);
    if(!bg)return;
    if(bg.price===0||owned[id]){
      applyHomeBg(id);_updateStoreButtons();
      showStoreMsg('✓ '+bg.name+' applied!');
      return;
    }
    if(!spendCoins(bg.price)){showStoreMsg('Not enough coins!');return;}
    owned[id]=true;saveOwned(owned);
    applyHomeBg(id);_updateStoreButtons();refreshCoinDisplays();
    showStoreMsg('🎉 '+bg.name+' unlocked and applied!');
    return;
  }
  if(type==='skin'){
    const skin=PIECE_SKINS.find(s=>s.id===id);
    if(!skin)return;
    if(owned[id]||skin.price===0){setActiveSkin(id);if(G.b)render();_updateStoreButtons();refreshCoinDisplays();return;}
    if(!spendCoins(skin.price)){showStoreMsg('Not enough coins!');return;}
    owned[id]=true;saveOwned(owned);
    setActiveSkin(id);if(G.b)render();_updateStoreButtons();refreshCoinDisplays();
    _showSkinPreview(id);
    buildHomePreview();
    showStoreMsg('🎉 '+skin.name+' skin unlocked and equipped!');
    return;
  }
  if(type==='frame'){
    const fr=PROFILE_FRAMES.find(f=>f.id===id);
    if(!fr)return;
    if(fr.price===0||owned[id]){
      localStorage.setItem('chessFrame',id);
      updateProfileBar();_updateStoreButtons();
      showStoreMsg('✓ '+fr.name+' frame equipped!');
      return;
    }
    if(!spendCoins(fr.price)){showStoreMsg('Not enough coins!');return;}
    owned[id]=true;saveOwned(owned);
    localStorage.setItem('chessFrame',id);
    updateProfileBar();_updateStoreButtons();refreshCoinDisplays();
    showStoreMsg('🎉 '+fr.name+' frame unlocked and equipped!');
    return;
  }
  if(type==='theme'){
    const theme=BOARD_THEMES.find(t=>t.id===id);
    if(!theme)return;
    if(owned[id]){
      applyTheme(id);
      _updateStoreButtons();
      return;
    }
    if(!spendCoins(theme.price)){
      showStoreMsg('Not enough coins!');return;
    }
    owned[id]=true;saveOwned(owned);
    applyTheme(id);
    _updateStoreButtons();refreshCoinDisplays();
    showStoreMsg('🎉 '+theme.name+' theme unlocked!');
  } else {
    const item=STORE_ITEMS.find(i=>i.id===id);
    if(!item||item.owned||owned[id])return;
    if(!spendCoins(item.price)){
      showStoreMsg('Not enough coins!');return;
    }
    owned[id]=true;saveOwned(owned);
    _updateStoreButtons();refreshCoinDisplays();
    showStoreMsg('🎉 '+item.name+' unlocked!');
  }
}

function showStoreMsg(msg){
  const t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--sur);border:2px solid #f0c040;color:var(--tx);border-radius:14px;padding:10px 18px;font-size:13px;font-weight:600;z-index:9998;box-shadow:0 4px 20px rgba(0,0,0,.5);white-space:nowrap;';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2500);
}

function renderQuests(){
  var list=document.getElementById('questList');
  if(!list)return;
  list.innerHTML='';
  var done=loadQuestProgress();
  var cats=[
    {key:'normal',label:'Normal Match Quests'},
    {key:'easy',  label:'Easy Bot Quests'},
    {key:'medium',label:'Medium Bot Quests'},
    {key:'hard',  label:'Hard Bot Quests'},
  ];
  cats.forEach(function(cat){
    var quests=QUEST_DEFS.filter(function(q){return q.cat===cat.key;});
    var doneCount=quests.filter(function(q){return !!done[q.id];}).length;
    // Section header
    var hdr=document.createElement('div');
    hdr.style.cssText='font-size:10px;color:var(--mu);letter-spacing:2px;text-transform:uppercase;width:100%;padding:10px 2px 4px;font-weight:700;';
    hdr.textContent=cat.label+' ('+doneCount+'/'+quests.length+')';
    list.appendChild(hdr);
    quests.forEach(function(q){
      var isDone=!!done[q.id];
      var div=document.createElement('div');
      div.className='quest-item'+(isDone?' done':'');
      var ico=document.createElement('div');ico.className='qi-icon';ico.textContent=q.icon;
      var info=document.createElement('div');info.className='qi-info';
      var nm=document.createElement('div');nm.className='qi-name';nm.textContent=q.name;
      var ds=document.createElement('div');ds.className='qi-desc';ds.textContent=q.desc;
      info.appendChild(nm);info.appendChild(ds);
      var right=document.createElement('div');
      if(isDone){right.className='qi-check';right.textContent='✓';}
      else{right.className='qi-reward';right.textContent='+'+q.coins+'🪙';}
      div.appendChild(ico);div.appendChild(info);div.appendChild(right);
      list.appendChild(div);
    });
  });
}

// ── REDEEM CODES ──
// NOTE: veryfreecoin gives 1000 coins for testing — remove before release
const REDEEM_CODES={
  'VERYFREECOIN': {coins:5000, desc:'Testing code — remove before release'},
};

function handleRedeem(){
  const input=document.getElementById('redeemInput');
  const msg=document.getElementById('redeemMsg');
  const code=(input.value||'').trim().toUpperCase();
  if(!code){msg.style.color='var(--re)';msg.textContent='Please enter a code.';return;}
  const used=JSON.parse(localStorage.getItem('chessUsedCodes')||'{}');
  if(used[code]){msg.style.color='var(--re)';msg.textContent='This code has already been used.';return;}
  const reward=REDEEM_CODES[code];
  if(!reward){msg.style.color='var(--re)';msg.textContent='Invalid code. Try again.';return;}
  used[code]=true;
  localStorage.setItem('chessUsedCodes',JSON.stringify(used));
  addCoins(reward.coins);
  msg.style.color='#9c3';
  msg.textContent='🎉 +'+reward.coins+' coins added!';
  input.value='';
  setTimeout(()=>{
    document.getElementById('redeemModal').classList.remove('show');
    msg.textContent='';
    _storeBuilt=false;renderStore();
  },1800);
}
