// MOVE REVIEWER + REPLAY MODAL + OPENING DETECTOR + SCROLL BUTTONS
// ══ IN-GAME MOVE REVIEWER ══
const _GLYPHS={wK:'♔',wQ:'♕',wR:'♖',wB:'♗',wN:'♘',wP:'♙',bK:'♚',bQ:'♛',bR:'♜',bB:'♝',bN:'♞',bP:'♟'};
let RV={on:false,idx:-1};
const _origRender=render;

function rvEnter(idx){
  if(!G.snapshots||!G.snapshots.length)return;
  RV.on=true;
  RV.idx=Math.max(0,Math.min(idx,G.snapshots.length-1));
  document.getElementById('rvBar').classList.add('on');
  rvRender();
  rvChips();
}
function rvExit(){
  RV.on=false;RV.idx=-1;
  document.getElementById('rvBar').classList.remove('on');
  render();
  rvChips();
}
function rvRender(){
  const snap=G.snapshots[RV.idx];
  if(!snap)return;
  // Temporarily swap state for render
  const sv={b:G.b,turn:G.turn,lt:G.lt,lf:G.lf,sel:G.sel,moves:G.moves,check:G.check,over:G.over,history:G.history};
  G.b=snap.b;G.turn=snap.turn;G.lt=snap.lt;G.lf=snap.lf;G.sel=null;G.moves=[];G.check=snap.check;G.over=false;G.history=snap.history||[];
  _origRender();
  Object.assign(G,sv);
  // Status text
  const mn=RV.idx+1;
  document.getElementById('stxt').textContent=(RV.idx%2===0?'⬜':'⬛')+' Move '+mn+' of '+G.snapshots.length;
  document.getElementById('ssub').textContent=(snap.history&&snap.history.length?snap.history[snap.history.length-1]:'start');
}
function rvChips(){
  const strip=document.getElementById('moveStrip');
  strip.innerHTML='';
  (G.history||[]).forEach((m,i)=>{
    const chip=document.createElement('div');
    const isW=i%2===0;
    // snapshot[0]=start, snapshot[i+1]=after move i
    const snapIdx=i+1;
    chip.className='move-chip'+(isW?' w-chip':'')+(RV.on&&RV.idx===snapIdx?' rv-active':(!RV.on&&i===G.history.length-1?' last':''));
    chip.textContent=(isW?`${Math.floor(i/2)+1}. `:'')+m;
    chip.addEventListener('click',()=>rvEnter(snapIdx));
    strip.appendChild(chip);
  });
  const active=strip.querySelector('.rv-active');
  if(active)active.scrollIntoView({inline:'center',block:'nearest'});
  else strip.scrollLeft=strip.scrollWidth;
}

render=function(){
  if(RV.on){rvRender();rvChips();return;}
  _origRender();
  rvChips();
};

btn('rvFirst',()=>{if(RV.on)rvEnter(0);});
btn('rvPrev', ()=>{if(RV.on&&RV.idx>0)rvEnter(RV.idx-1);});
btn('rvNext', ()=>{if(!RV.on)return;RV.idx<G.snapshots.length-1?rvEnter(RV.idx+1):rvExit();});
btn('rvLast', ()=>{if(RV.on)rvEnter(G.snapshots.length-1);});
btn('rvExit', rvExit);

// Exit review when new game starts
const _origSGS=startGameSession;
startGameSession=function(){if(RV.on)rvExit();_origSGS();};

// ══ REPLAY MODAL ══
let RP={snaps:[],hist:[],idx:0,playing:false,timer:null};

function rpOpen(){
  if(!G.snapshots||G.snapshots.length<2){showStoreMsg('No moves yet!');return;}
  RP.snaps=G.snapshots.map(s=>({b:CL(s.b),lt:s.lt,lf:s.lf,history:s.history}));
  RP.hist=['Start',...(G.history||[])];
  RP.idx=RP.snaps.length-1;
  RP.playing=false;
  document.getElementById('rpTotal').textContent=RP.hist.length-1;
  rpRenderBoard();
  rpRenderList();
  document.getElementById('replayModal').classList.add('show');
}

function rpRenderBoard(){
  const snap=RP.snaps[RP.idx];
  if(!snap)return;
  // Update move counter — snap[0] is start, snap[1] is after move 1, etc.
  const moveNum=RP.idx; // 0 = start position, 1 = after move 1
  document.getElementById('rpMoveNum').textContent=moveNum;
  document.getElementById('rpMoveLabel').textContent=
    moveNum===0?'Start position':
    (RP.hist[moveNum]?'Move '+moveNum+': '+RP.hist[moveNum]:'Move '+moveNum);
  const board=document.getElementById('rpBoard');
  board.innerHTML='';
  const ls=getComputedStyle(document.documentElement).getPropertyValue('--ls').trim()||'#f0d9b5';
  const ds=getComputedStyle(document.documentElement).getPropertyValue('--ds').trim()||'#779556';
  for(let r=0;r<8;r++){
    for(let f=0;f<8;f++){
      const sq=document.createElement('div');
      sq.className='rp-sq';
      const light=(r+f)%2===0;
      sq.style.background=light?ls:ds;
      const isHL=(snap.lt&&snap.lt[0]===r&&snap.lt[1]===f)||(snap.lf&&snap.lf[0]===r&&snap.lf[1]===f);
      if(isHL)sq.style.background=light?'rgba(255,210,50,.75)':'rgba(200,160,0,.6)';
      const p=snap.b[r][f];
      if(p)sq.textContent=_GLYPHS[p]||'';
      board.appendChild(sq);
    }
  }
  document.getElementById('rpFirst').disabled=RP.idx===0;
  document.getElementById('rpPrev').disabled=RP.idx===0;
  document.getElementById('rpNext').disabled=RP.idx>=RP.snaps.length-1;
  document.getElementById('rpLast').disabled=RP.idx>=RP.snaps.length-1;
  document.getElementById('rpPlay').textContent=RP.playing?'⏸':'▶';
}

function rpRenderList(){
  const list=document.getElementById('rpMoveList');
  list.innerHTML='';
  RP.hist.forEach((m,i)=>{
    const chip=document.createElement('span');
    const isW=i%2===1;
    chip.style.cssText='background:var(--sur3);border-radius:5px;padding:2px 6px;font-size:10px;font-family:monospace;cursor:pointer;color:'+(i===RP.idx?'#fff':(isW?'var(--tx)':'var(--mu)'))+(i===RP.idx?';background:#4d9fff':'');
    chip.textContent=(i===0?'Start':(isW?Math.ceil(i/2)+'. ':'')+m);
    chip.addEventListener('click',()=>{rpGoTo(i);});
    list.appendChild(chip);
  });
  const cur=list.children[RP.idx];
  if(cur)cur.scrollIntoView({block:'nearest',inline:'nearest'});
}

function rpGoTo(i){
  RP.idx=Math.max(0,Math.min(i,RP.snaps.length-1));
  rpRenderBoard();rpRenderList();
}
function rpPlay(){
  if(RP.playing){
    RP.playing=false;clearInterval(RP.timer);RP.timer=null;
    document.getElementById('rpPlay').textContent='▶';
  } else {
    if(RP.idx>=RP.snaps.length-1)RP.idx=0;
    RP.playing=true;
    document.getElementById('rpPlay').textContent='⏸';
    RP.timer=setInterval(()=>{
      if(RP.idx<RP.snaps.length-1){rpGoTo(RP.idx+1);}
      else{RP.playing=false;clearInterval(RP.timer);RP.timer=null;document.getElementById('rpPlay').textContent='▶';}
    },900);
  }
}

btn('replayBtn',rpOpen);
btn('rpFirst',()=>rpGoTo(0));
btn('rpPrev', ()=>rpGoTo(RP.idx-1));
btn('rpNext', ()=>rpGoTo(RP.idx+1));
btn('rpLast', ()=>rpGoTo(RP.snaps.length-1));
btn('rpPlay', rpPlay);
btn('rpClose',()=>{
  if(RP.timer){clearInterval(RP.timer);RP.timer=null;}
  RP.playing=false;
  document.getElementById('replayModal').classList.remove('show');
});
btn('analysisClose',()=>{document.getElementById('analysisModal').classList.remove('show');});

// ══ OPENING DETECTOR ══
// Opening database keyed by move sequence string
// Moves encoded as fromRow+fromCol+toRow+toCol per move
const OPENING_DB={
  // Correct encoding: row0=rank8 (top), row7=rank1 (bottom)
  // e4 = wP e2->e4 = row6,col4->row4,col4 = "6454"
  // e5 = bP e7->e5 = row1,col4->row3,col4 = "1434"
  // Nf3 = wN g1->f3 = row7,col6->row5,col5 = "7665"
  // Nc6 = bN b8->c6 = row0,col1->row2,col2 = "0122"
  // Bb5 = wB f1->b5 = row7,col5->row3,col1 = "7531"
  // c4  = wP c2->c4 = row6,col2->row4,col2 = "6242"
  // d4  = wP d2->d4 = row6,col3->row4,col3 = "6353"
  // d5  = bP d7->d5 = row1,col3->row3,col3 = "1333"
  // Nf6 = bN g8->f6 = row0,col6->row2,col5 = "0625"
  // g6  = bP g7->g6 = row1,col6->row2,col6 = "1626"
  // Bc4 = wB f1->c4 = row7,col5->row4,col2 = "7542"
  // Nc3 = wN b1->c3 = row7,col1->row5,col2 = "7152"

  // ── e4 first move ──
  '6454':{name:'King\'s Pawn Opening',eco:'B00'},

  // ── e4 e5 (symmetric) ──
  '64541434':{name:'King\'s Pawn Game',eco:'C20'},
  '6454143476651303':{name:'Scotch Game',eco:'C44'},
  '645414347665130376541434':{name:'Scotch — Göring Gambit',eco:'C44'},
  '64541434766507220122':{name:'Italian Game',eco:'C50'},
  '6454143476650722012275427542':{name:'Giuoco Piano',eco:'C53'},
  '64541434766507220122754212041324':{name:'Evans Gambit',eco:'C51'},
  '6454143476650122062512041303':{name:'Two Knights Defence',eco:'C55'},
  '6454143476650122062512041303645442':{name:'Fried Liver Attack',eco:'C57'},
  '6454143476657531':{name:'Spanish Game (Ruy Lopez)',eco:'C60'},
  '645414347665753101221333':{name:'Ruy Lopez — Berlin',eco:'C65'},
  '645414347665753101220122':{name:'Ruy Lopez — Morphy',eco:'C78'},
  '6454143471527152':{name:'Vienna Game',eco:'C25'},
  '64541434635263521434':{name:'King\'s Gambit',eco:'C30'},
  '6454143463520625':{name:'Petrov\'s Defence',eco:'C42'},
  '64541434135314131435':{name:'Philidor Defence',eco:'C41'},

  // ── e4 Sicilian ──
  '64540724':{name:'Sicilian Defence',eco:'B20'},
  '6454072476650253':{name:'Sicilian — Open',eco:'B32'},
  '645407247665025301221333':{name:'Sicilian — Classical',eco:'B58'},
  '6454072476650253012213330522':{name:'Sicilian Najdorf',eco:'B90'},
  '6454072476650253012213331626':{name:'Sicilian Dragon',eco:'B70'},
  '6454072476650253012213330625':{name:'Sicilian — Scheveningen',eco:'B80'},
  '64540724766571521303':{name:'Sicilian — Kan',eco:'B40'},
  '6454072476651303':{name:'Sicilian — Alapin',eco:'B22'},

  // ── e4 other ──
  '64540414':{name:'French Defence',eco:'C00'},
  '64540414635363521133':{name:'French — Tarrasch',eco:'C03'},
  '6454041463534242':{name:'French — Advance',eco:'C02'},
  '64540313':{name:'Caro-Kann Defence',eco:'B10'},
  '6454031363531333':{name:'Caro-Kann — Classical',eco:'B18'},
  '64540514':{name:'Pirc Defence',eco:'B07'},
  '64540614':{name:'Scandinavian Defence',eco:'B01'},
  '64540513':{name:'Alekhine\'s Defence',eco:'B02'},

  // ── d4 ──
  '6353':{name:'Queen\'s Pawn Opening',eco:'A40'},
  '63530625':{name:'King\'s Indian Defence',eco:'E60'},
  '63530625624215261526':{name:'King\'s Indian — Classical',eco:'E92'},
  '635306256242152615261335':{name:'King\'s Indian — Sämisch',eco:'E80'},
  '63536252':{name:'Queen\'s Gambit',eco:'D06'},
  '6353625213330414':{name:'Queen\'s Gambit Declined',eco:'D30'},
  '63536252133304146252765565421303':{name:'QGD — Orthodox',eco:'D60'},
  '635362521333':{name:'Queen\'s Gambit Accepted',eco:'D20'},
  '635306256242062516261335':{name:'Grünfeld Defence',eco:'D80'},
  '63531524':{name:'Nimzo-Indian Defence',eco:'E20'},
  '6353152462421526':{name:'Nimzo-Indian — Classical',eco:'E32'},
  '63530625624215261335':{name:'Queen\'s Indian Defence',eco:'E12'},
  '63530504':{name:'Dutch Defence',eco:'A80'},
  '635306251626152615261335':{name:'Dutch — Leningrad',eco:'A87'},
  '63531333625213330625':{name:'Semi-Slav Defence',eco:'D43'},
  '63536252133362421333':{name:'Slav Defence',eco:'D10'},
  '63536242':{name:'English/Reti Hybrid',eco:'A13'},
  '6353625262421333':{name:'Catalan Opening',eco:'E00'},
  '63530625152613331526':{name:'Benoni Defence',eco:'A60'},

  // ── Flank ──
  '6242':{name:'English Opening',eco:'A10'},
  '624214340625':{name:'English — Symmetrical',eco:'A30'},
  '624214346353':{name:'English — Reversed Sicilian',eco:'A20'},
  '7263':{name:'Réti Opening',eco:'A09'},
  '726363530625':{name:'Réti — KID Setup',eco:'A07'},
  '7161':{name:'Bird\'s Opening',eco:'A02'},
  '71616353':{name:'Bird\'s — Dutch',eco:'A03'},
  '72627263':{name:'King\'s Indian Attack',eco:'A07'},
};

function detectOpening(){
  if(!G.snapshots||G.snapshots.length<2)return null;
  if(G.history.length===0||G.history.length>14)return null;
  let key='';
  const snaps=G.snapshots;
  for(let i=1;i<Math.min(snaps.length,9);i++){
    const prev=snaps[i-1].b, curr=snaps[i].b;
    let fr=-1,fc=-1,tr=-1,tc=-1;
    for(let r=0;r<8&&(fr<0||tr<0);r++){
      for(let c=0;c<8;c++){
        if(prev[r][c]&&!curr[r][c]&&fr<0){fr=r;fc=c;}
        if(!prev[r][c]&&curr[r][c]&&tr<0){tr=r;tc=c;}
      }
    }
    if(fr>=0&&tr>=0)key+=fr+''+fc+''+tr+''+tc;
  }
  for(let len=key.length;len>=4;len-=4){
    if(OPENING_DB[key.substring(0,len)])return OPENING_DB[key.substring(0,len)];
  }
  return null;
}

function updateOpeningDisplay(){
  const banner=document.getElementById('openingBanner');
  if(!banner)return;
  if(RV.on){banner.style.display='none';return;}
  // Check ownership
  const owned=loadOwned();
  if(!owned['opening_detector']){banner.style.display='none';return;}
  if(G.over||!G.history||G.history.length===0||G.history.length>14){
    banner.style.display='none';return;
  }
  const opening=detectOpening();
  if(opening){
    banner.style.display='block';
    banner.textContent='♟ '+opening.eco+' · '+opening.name;
  } else {
    banner.style.display='none';
  }
}

// Hook into render to update opening display
const _renderBeforeOpening=render;
render=function(){
  _renderBeforeOpening();
  updateOpeningDisplay();
};

// ══ SCROLL BUTTONS ══
document.addEventListener('DOMContentLoaded',function(){
  var downBtn=document.getElementById('scrollDown');
  var upBtn=document.getElementById('scrollUp');
  if(!downBtn||!upBtn)return;

  var amount=Math.round(window.innerHeight*0.6);

  downBtn.addEventListener('click',function(){
    window.scrollBy({top:amount,behavior:'smooth'});
  });
  downBtn.addEventListener('touchstart',function(e){
    e.preventDefault();
    window.scrollBy({top:amount,behavior:'smooth'});
  },{passive:false});

  upBtn.addEventListener('click',function(){
    window.scrollBy({top:-amount,behavior:'smooth'});
  });
  upBtn.addEventListener('touchstart',function(e){
    e.preventDefault();
    window.scrollBy({top:-amount,behavior:'smooth'});
  },{passive:false});
});
