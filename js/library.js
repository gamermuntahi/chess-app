// PIECE VALUES + PLAYER LIBRARY / ELO
'use strict';

// ══════════════════════════════════════════
//  PIECE VALUES
// ══════════════════════════════════════════
const PV={Q:9,R:5,B:3,N:3,P:1,K:0};

// ══════════════════════════════════════════
//  LIBRARY
// ══════════════════════════════════════════
function loadLib(){try{return JSON.parse(localStorage.getItem('chessLib')||'{}');}catch(e){return{};}}
function saveLib(lib){try{localStorage.setItem('chessLib',JSON.stringify(lib));}catch(e){}}
function ensurePlayer(lib,name){
  const key=name.trim().toLowerCase();
  if(!lib[key])lib[key]={name:name.trim(),played:0,wins:0,losses:0,draws:0,elo:300,since:new Date().toLocaleDateString(),games:[]};
  if(!lib[key].games)lib[key].games=[];
  if(!lib[key].elo)lib[key].elo=300;
  return key;
}

// ELO calculation (FIDE-style K-factor like Stockfish uses)
function calcElo(ratingA,ratingB,scoreA){
  // K=40 for new players (<30 games), K=20 for established, K=10 for 2400+
  const K=32; // simplified constant K
  const expected=1/(1+Math.pow(10,(ratingB-ratingA)/400));
  return Math.round(ratingA+K*(scoreA-expected));
}

function recordResult(nameW,nameB,result){
  if(!nameW.trim()&&!nameB.trim())return;
  const lib=loadLib();
  const date=new Date().toLocaleDateString();
  const time=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  const keyW=nameW.trim()?ensurePlayer(lib,nameW):'';
  const keyB=nameB.trim()?ensurePlayer(lib,nameB):'';
  const eloW=keyW?lib[keyW].elo:300;
  const eloB=keyB?lib[keyB].elo:300;
  // scoreA from white's perspective: 1=white wins, 0=black wins, 0.5=draw
  const scoreW=result==='w'?1:result==='d'?0.5:0;
  const newEloW=keyW?calcElo(eloW,eloB,scoreW):300;
  const newEloB=keyB?calcElo(eloB,eloW,1-scoreW):300;

  [nameW,nameB].forEach((n,i)=>{
    if(!n||!n.trim())return;
    const key=i===0?keyW:keyB;
    const isW=i===0;
    let res='D';
    if(result!=='d')res=((result==='w'&&isW)||(result==='b'&&!isW))?'W':'L';
    const opp=(i===0?nameB:nameW)||'?';
    const oldElo=lib[key].elo;
    lib[key].elo=i===0?Math.max(100,newEloW):Math.max(100,newEloB);
    lib[key].played++;
    if(res==='W')lib[key].wins++;
    else if(res==='L')lib[key].losses++;
    else lib[key].draws++;
    const eloDiff=(lib[key].elo-oldElo);
    lib[key].games.unshift({res,opp:opp.trim()||'?',date,time,id:Date.now()+i,elo:lib[key].elo,eloDiff});
  });
  saveLib(lib);
  // Return new ELOs for display
  return{newEloW:keyW?lib[keyW].elo:null,newEloB:keyB?lib[keyB].elo:null};
}
function deletePlayer(key){const lib=loadLib();delete lib[key];saveLib(lib);}
function resetPlayerStats(key){const lib=loadLib();if(!lib[key])return;lib[key].played=0;lib[key].wins=0;lib[key].losses=0;lib[key].draws=0;lib[key].games=[];saveLib(lib);}
function deleteGameEntry(pk,gid){
  const lib=loadLib();if(!lib[pk])return;
  const g=lib[pk].games.find(x=>x.id===gid);if(!g)return;
  lib[pk].played=Math.max(0,lib[pk].played-1);
  if(g.res==='W')lib[pk].wins=Math.max(0,lib[pk].wins-1);
  else if(g.res==='L')lib[pk].losses=Math.max(0,lib[pk].losses-1);
  else lib[pk].draws=Math.max(0,lib[pk].draws-1);
  lib[pk].games=lib[pk].games.filter(x=>x.id!==gid);
  saveLib(lib);
}
function renderLibrary(search){
  const lib=loadLib();const list=document.getElementById('libList');list.innerHTML='';
  const keys=Object.keys(lib).filter(k=>k.includes(search.toLowerCase()));
  if(!keys.length){const e=document.createElement('div');e.className='empty-lib';e.textContent=search?'No players found.':'No players yet. Play a game first!';list.appendChild(e);return;}
  keys.sort((a,b)=>(lib[b].elo||300)-(lib[a].elo||300));
  keys.forEach(key=>{
    const p=lib[key];
    const winPct=p.played?Math.round(p.wins/p.played*100):0;
    const card=document.createElement('div');card.className='player-card';
    const top=document.createElement('div');top.className='pc-top';
    top.innerHTML=`<div class="pc-av">${p.name[0].toUpperCase()}</div>
      <div style="flex:1;min-width:0"><div style="display:flex;align-items:baseline;gap:8px;"><div class="pc-name">${p.name}</div><div class="pc-elo">${p.elo||300}</div></div>
      <div class="pc-since">ELO · Since ${p.since}</div></div>`;
    card.appendChild(top);
    // 5-stat grid: Played, Wins, Losses, Draws, Win%
    const stats=document.createElement('div');stats.className='pc-stats';
    stats.innerHTML=`
      <div class="stat-box"><div class="stat-val">${p.played}</div><div class="stat-lbl">Played</div></div>
      <div class="stat-box"><div class="stat-val win">${p.wins}</div><div class="stat-lbl">Wins</div></div>
      <div class="stat-box"><div class="stat-val loss">${p.losses}</div><div class="stat-lbl">Loss</div></div>
      <div class="stat-box"><div class="stat-val draw">${p.draws}</div><div class="stat-lbl">Draws</div></div>
      <div class="stat-box"><div class="stat-val win">${winPct}%</div><div class="stat-lbl">Win%</div></div>`;
    card.appendChild(stats);
    // Game log
    const log=document.createElement('div');log.className='game-log';
    const games=p.games||[];
    if(games.length){
      games.forEach(g=>{
        const eloDiffStr=g.eloDiff!=null?(g.eloDiff>=0?`<span style="color:#9c3;font-size:10px">+${g.eloDiff}</span>`:`<span style="color:#e74c3c;font-size:10px">${g.eloDiff}</span>`):'';
        const entry=document.createElement('div');entry.className='game-entry';
        entry.innerHTML=`<span class="ge-res ${g.res}">${g.res==='W'?'Win':g.res==='L'?'Loss':'Draw'}</span><span style="flex:1;padding:0 6px;color:var(--mu);">vs ${g.opp}</span>${eloDiffStr}<span style="color:var(--mu);font-size:10px;margin:0 4px">${g.date}</span><button class="ge-del" data-key="${key}" data-id="${g.id}">🗑</button>`;
        log.appendChild(entry);
      });
    } else {log.innerHTML='<div style="color:var(--mu);font-size:11px;padding:8px 0;border-top:1px solid var(--bd)">No games yet.</div>';}
    card.appendChild(log);
    const actions=document.createElement('div');actions.className='card-actions';
    const togBtn=document.createElement('button');togBtn.className='ca-btn tog';togBtn.textContent='📋 History';
    const fn1=()=>{log.classList.toggle('open');togBtn.textContent=log.classList.contains('open')?'▲ Hide':'📋 History';};
    togBtn.addEventListener('click',fn1);
    togBtn.addEventListener('touchstart',e=>{e.preventDefault();fn1();},{passive:false});

    const resetBtn=document.createElement('button');resetBtn.className='ca-btn';resetBtn.textContent='🔄 Reset';
    const fn2=()=>{
      showConfirm('Reset Stats','Reset all stats for '+p.name+'? This cannot be undone.','Reset',()=>{
        resetPlayerStats(key);
        renderLibrary(document.getElementById('libSearch').value);
      });
    };
    resetBtn.addEventListener('click',fn2);
    resetBtn.addEventListener('touchstart',e=>{e.preventDefault();fn2();},{passive:false});

    const delBtn=document.createElement('button');delBtn.className='ca-btn del';delBtn.textContent='🗑 Delete';
    const fn3=()=>{
      showConfirm('Delete Player','Delete '+p.name+' from the library? All history will be lost.','Delete',()=>{
        deletePlayer(key);
        renderLibrary(document.getElementById('libSearch').value);
      });
    };
    delBtn.addEventListener('click',fn3);
    delBtn.addEventListener('touchstart',e=>{e.preventDefault();fn3();},{passive:false});

    actions.appendChild(togBtn);actions.appendChild(resetBtn);actions.appendChild(delBtn);
    card.appendChild(actions);list.appendChild(card);
  });
  // Single delegated listener for individual game delete buttons
  list.onclick=e=>{
    const db=e.target.closest('.ge-del');
    if(!db)return;
    const k=db.dataset.key, id=+db.dataset.id;
    showConfirm('Delete Game','Remove this game from history?','Delete',()=>{
      deleteGameEntry(k,id);
      renderLibrary(document.getElementById('libSearch').value);
    });
  };
}
document.getElementById('libSearch').addEventListener('input',function(){renderLibrary(this.value);});
function btn(id,fn){const el=document.getElementById(id);if(!el){console.warn('btn: missing element',id);return;}el.addEventListener('click',fn);el.addEventListener('touchstart',e=>{e.preventDefault();fn();},{passive:false});}
function sbtn(id,fn){const el=document.getElementById(id);if(!el){console.warn('sbtn: element not found:',id);return;}el.addEventListener('click',fn);el.addEventListener('touchstart',e=>{e.preventDefault();fn();},{passive:false});}

// ── Custom confirm dialog (replaces browser confirm() blocked on Android Chrome) ──
let _confirmCb=null;
function showConfirm(title, msg, yesLabel, cb){
  document.getElementById('confirmTitle').textContent=title;
  document.getElementById('confirmMsg').textContent=msg;
  document.getElementById('confirmYes').textContent=yesLabel||'Yes';
  _confirmCb=cb;
  document.getElementById('confirmModal').classList.add('show');
}
function closeConfirm(){document.getElementById('confirmModal').classList.remove('show');_confirmCb=null;}
btn('confirmNo',closeConfirm);
btn('confirmYes',()=>{const cb=_confirmCb;closeConfirm();if(cb)cb();});

btn('libBack',()=>showScreen('sHome'));
btn('libBtn',()=>{showScreen('sLib');renderLibrary('');});
