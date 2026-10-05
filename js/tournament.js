// TOURNAMENT STATE + SCOREBOARD
'use strict';

// ══════════════════════════════════════════
//  TOURNAMENT STATE
// ══════════════════════════════════════════
let TOUR=null;
let tourSelTime=null;

function initTournament(nameW,nameB,totalGames){
  TOUR={nameW,nameB,totalGames,scores:{w:0,b:0,d:0},gameNum:0,active:true};
}
function tourWinThreshold(){return Math.ceil(TOUR.totalGames/2);}
function tourOver(){
  return TOUR.scores.w>=tourWinThreshold()||TOUR.scores.b>=tourWinThreshold()||
    (TOUR.scores.w+TOUR.scores.b+TOUR.scores.d>=TOUR.totalGames);
}
function recordTourResult(result){
  if(!TOUR)return;
  if(result==='w')TOUR.scores.w++;
  else if(result==='b')TOUR.scores.b++;
  else TOUR.scores.d++;
  TOUR.gameNum++;
}

// Tour time grid
document.getElementById('tourTimeGrid').querySelectorAll('.tbtn').forEach(b=>{
  b.addEventListener('click',()=>{
    document.getElementById('tourTimeGrid').querySelectorAll('.tbtn').forEach(x=>x.classList.remove('on'));
    document.getElementById('tUBtn').classList.remove('on');
    b.classList.add('on');tourSelTime=b;
  });
});
btn('tUBtn',()=>{
  document.getElementById('tourTimeGrid').querySelectorAll('.tbtn').forEach(x=>x.classList.remove('on'));
  document.getElementById('tUBtn').classList.add('on');
  tourSelTime=null;
});

let tourTotalGames=3;
document.querySelectorAll('.tg-btn').forEach(b=>{
  b.addEventListener('click',()=>{document.querySelectorAll('.tg-btn').forEach(x=>x.classList.remove('on'));b.classList.add('on');tourTotalGames=+b.dataset.g;});
});

btn('tourBtn',()=>showScreen('sTour'));
btn('tBackBtn',()=>showScreen('sHome'));
btn('tStartBtn',()=>{
  const nW=document.getElementById('tNameW').value.trim()||'Player 1';
  const nB=document.getElementById('tNameB').value.trim()||'Player 2';
  if(tourSelTime){CFG={timed:true,secs:+tourSelTime.dataset.m*60,inc:+tourSelTime.dataset.i||0};}
  else{CFG={timed:false,secs:Infinity,inc:0};}
  initTournament(nW,nB,tourTotalGames);
  PLAYERS={w:nW,b:nB};
  startGameSession();
});

// Opening book — first move of the game = book move
function isBookMove(moveNum){return moveNum===1;}

// ── MOVE CLASSIFIER ──
// Rules exactly as specified:
// BRILLIANT  = move that leads opponent into checkmate (checkmate delivered)
// GREAT      = captures opponent's Queen or Rook for free (no recapture threat)
// BEST       = captures Bishop/Knight/Pawn OR gives check to the king
// GOOD       = normal move with no trade, no check (pawn, bishop, knight move)
// BOOK       = very first move of the match
// MISTAKE    = player ignores a free piece sitting there to be taken, or sacrifices pawn for nothing
// BLUNDER    = player sacrifices Queen/Rook/Bishop/Knight for no reason, or plays into losing position

function isFreeCapture(boardBefore, c, tr, tf){
  // Is the piece at (tr,tf) on boardBefore undefended by opponent?
  const opp=OPP(c);
  // Can opponent recapture on that square?
  return !attacked(boardBefore,tr,tf,opp);
}

function hasFreeCapture(b, c, ep, cas){
  // Does c have any free capture available?
  for(let r=0;r<8;r++)for(let f=0;f<8;f++){
    if(CC(b[r][f])!==c)continue;
    const ms=legal(b,r,f,ep,cas);
    for(const m of ms){
      if(b[m.r][m.f]&&CC(b[m.r][m.f])===OPP(c)){
        // There's a piece to capture — is it undefended?
        if(isFreeCapture(b,c,m.r,m.f))return{r,f,m,piece:b[m.r][m.f]};
      }
    }
  }
  return null;
}

function classifyMove(
  boardBefore, boardAfter,
  c, sr, sf, tr, tf, mv,
  cap, isCheck, isMate,
  isPromo, note, moveNum
){
  // BOOK — very first move
  if(moveNum===1) return 'book';

  // BRILLIANT — player delivered checkmate
  if(isMate) return 'brilliant';

  const capType = cap ? TT(cap) : null;
  const movedType = TT(boardBefore[sr][sf]);

  // Check if the captured piece was free (undefended before move)
  const capWasFree = cap ? isFreeCapture(boardBefore, c, tr, tf) : false;

  // GREAT — captures opponent's Queen or Rook for free
  if(cap && capWasFree && (capType==='Q' || capType==='R')) return 'great';

  // BEST — captures Bishop/Knight/Pawn for free, OR gives check
  if(cap && capWasFree && (capType==='B'||capType==='N'||capType==='P')) return 'best';
  if(isCheck && !isMate) return 'best';

  // Queen/Rook trade (both sides have same value piece) = best
  if(cap && (capType==='Q'||capType==='R') && (movedType===capType)) return 'best';

  // BLUNDER — sacrifices Queen/Rook/Bishop/Knight with no capture gain
  // i.e. moved a major/minor piece to a square where opponent can take it for free
  if(!cap && (movedType==='Q'||movedType==='R'||movedType==='B'||movedType==='N')){
    // Check if the piece is now hanging (can be taken for free)
    if(attacked(boardAfter, tr, tf, OPP(c))){
      // Is our piece defended?
      if(!attacked(boardAfter, tr, tf, c)){
        return 'blunder';
      }
    }
  }

  // MISTAKE — player had a free capture available but didn't take it
  const missedFree = hasFreeCapture(boardBefore, c, G.ep, G.cas);
  if(missedFree && !cap){
    const missed = missedFree.piece;
    // Only mistake if they missed a real free piece (not pawn sacrifices)
    if(TT(missed)!=='K') return 'mistake';
  }

  // MISTAKE — sacrificed own pawn with no compensation (moved pawn to attacked square)
  if(movedType==='P' && !cap){
    if(attacked(boardAfter, tr, tf, OPP(c)) && !attacked(boardAfter, tr, tf, c)){
      return 'mistake';
    }
  }

  // GOOD — normal move
  return 'good';
}

const BADGE_META={
  brilliant:{label:'!!', cls:'mb-brilliant'},
  great:    {label:'!',  cls:'mb-great'},
  best:     {label:'★',  cls:'mb-best'},
  good:     {label:'·',  cls:'mb-good'},
  book:     {label:'📖', cls:'mb-book'},
  mistake:  {label:'?',  cls:'mb-mistake'},
  blunder:  {label:'??', cls:'mb-blunder'},
};

// ── VIBRATION ──
function vibrate(pattern){
  try{if(navigator.vibrate)navigator.vibrate(pattern);}catch(e){}
}

// ── CONFETTI + FIREWORKS ──
function launchConfetti(){
  const canvas=document.createElement('canvas');
  canvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:9999;pointer-events:none;';
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  const pieces=[];
  const colors=['#f0c040','#779556','#e74c3c','#4d7fa8','#f2d2d8','#9c3','#ff6b6b','#ffd700','#00cec9','#fd79a8'];
  for(let i=0;i<160;i++){
    pieces.push({
      x:Math.random()*canvas.width,
      y:-20-Math.random()*80,
      w:6+Math.random()*8,h:4+Math.random()*6,
      color:colors[Math.floor(Math.random()*colors.length)],
      vx:(Math.random()-0.5)*6,vy:2+Math.random()*5,
      rot:Math.random()*360,vr:(Math.random()-0.5)*8,
      opacity:1
    });
  }
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.rot+=p.vr;
      if(p.y>canvas.height*0.7)p.opacity-=0.025;
      ctx.save();ctx.globalAlpha=Math.max(0,p.opacity);
      ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color;
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
    });
    frame++;
    if(frame<180)requestAnimationFrame(draw);
    else{canvas.remove();}
  }
  draw();
}

function playFireworks(){
  if(!AC)return;
  if(AC.state==='suspended')AC.resume();
  const t=AC.currentTime;

  // Cracker POP sounds — short white noise bursts at different times
  function cracker(delay,freq,vol){
    const buf=AC.createBuffer(1,AC.sampleRate*0.08,AC.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1);
    const src=AC.createBufferSource(),g=AC.createGain(),f=AC.createBiquadFilter();
    f.type='bandpass';f.frequency.value=freq;f.Q.value=0.8;
    src.buffer=buf;src.connect(f);f.connect(g);g.connect(AC.destination);
    g.gain.setValueAtTime(vol,t+delay);
    g.gain.exponentialRampToValueAtTime(0.001,t+delay+0.08);
    src.start(t+delay);src.stop(t+delay+0.1);
  }

  // Multiple crackers at different times and pitches
  [0,0.15,0.3,0.5,0.7,0.9,1.1,1.3].forEach((d,i)=>{
    cracker(d,[800,1200,600,1500,900,1100,700,1000][i],[0.4,0.35,0.45,0.3,0.4,0.35,0.4,0.3][i]);
  });

  // Victory fanfare — pleasant ascending notes
  const notes=[523,659,784,1047]; // C5 E5 G5 C6
  notes.forEach((freq,i)=>{
    const o=AC.createOscillator(),g=AC.createGain();
    o.connect(g);g.connect(AC.destination);
    o.type='sine';o.frequency.value=freq;
    const start=t+0.05+i*0.12;
    g.gain.setValueAtTime(0,start);
    g.gain.linearRampToValueAtTime(0.18,start+0.04);
    g.gain.exponentialRampToValueAtTime(0.001,start+0.35);
    o.start(start);o.stop(start+0.4);
  });

  // Final triumphant chord
  [523,659,784].forEach(freq=>{
    const o=AC.createOscillator(),g=AC.createGain();
    o.connect(g);g.connect(AC.destination);
    o.type='triangle';o.frequency.value=freq;
    g.gain.setValueAtTime(0,t+0.65);
    g.gain.linearRampToValueAtTime(0.12,t+0.7);
    g.gain.exponentialRampToValueAtTime(0.001,t+1.2);
    o.start(t+0.65);o.stop(t+1.3);
  });
}

const PROFILE_FRAMES=[
  {id:'frame_none',    name:'Default',      desc:'Standard colored circle',                    emoji:'⬜', border:'none',         bg:'', price:0},
  {id:'frame_gold',    name:'Gold Crown',   desc:'Prestigious golden frame for champions',     emoji:'👑', border:'3px solid #ffd700', bg:'radial-gradient(circle,#3a2a00,#1a1200)', price:150},
  {id:'frame_neon',    name:'Neon Glow',    desc:'Electric cyan glowing frame',                emoji:'⚡', border:'3px solid #00ffff', bg:'radial-gradient(circle,#002a2a,#001010)', price:120},
  {id:'frame_fire',    name:'Fire Ring',    desc:'Blazing fire frame',                         emoji:'🔥', border:'3px solid #ff4400', bg:'radial-gradient(circle,#2a0800,#100300)', price:120},
  {id:'frame_royal',   name:'Royal Purple', desc:'Deep purple royal frame',                    emoji:'👸', border:'3px solid #9b59b6', bg:'radial-gradient(circle,#1a0a2a,#0a0015)', price:120},
  {id:'frame_diamond', name:'Diamond',      desc:'Rare sparkling diamond frame',               emoji:'💎', border:'3px solid #88eeff', bg:'radial-gradient(circle,#001a2a,#000d15)', price:200},
  {id:'frame_chess',   name:'Chess Master', desc:'Classic black and white checkered border',   emoji:'♟',  border:'3px solid #f0d9b5', bg:'radial-gradient(circle,#1a1a1a,#0a0a0a)', price:180},
  {id:'frame_rainbow', name:'Rainbow',      desc:'Vibrant rainbow border — rare!',             emoji:'🌈', border:'3px solid transparent', bg:'conic-gradient(#ff0000,#ff7700,#ffff00,#00ff00,#0000ff,#ff00ff,#ff0000)', price:250},
];

const PIECE_SKINS=[
  {id:'skin_classic',  name:'Classic',      desc:'Standard black & white pieces',           icon:'♟', wFill:'#ffffff',wOut:'#222222',bFill:'#111111',bOut:'#cccccc', price:0},
  {id:'skin_neon',     name:'Neon',         desc:'Electric glow — cyan vs magenta',          icon:'⚡',wFill:'#00ffff',wOut:'#007777',bFill:'#ff00ff',bOut:'#770077', price:60},
  {id:'skin_gold',     name:'Gold & Silver',desc:'Royal gold pieces vs silver pieces',       icon:'🥇',wFill:'#c0c0c0',wOut:'#808080',bFill:'#ffd700',bOut:'#b8860b', price:80},
  {id:'skin_fire',     name:'Fire & Ice',   desc:'Blazing red vs icy blue',                  icon:'🔥',wFill:'#88ddff',wOut:'#2266aa',bFill:'#ff4400',bOut:'#991100', price:80},
  {id:'skin_forest',   name:'Forest',       desc:'Natural green vs earthy brown',            icon:'🌲',wFill:'#90ee90',wOut:'#228822',bFill:'#8B4513',bOut:'#5c2e0a', price:80},
  {id:'skin_royal',    name:'Royal Purple', desc:'Deep purple & gold royalty theme',         icon:'👑',wFill:'#f0c040',wOut:'#8B6914',bFill:'#6a0dad',bOut:'#3a0070', price:100},
  {id:'skin_ghost',    name:'Ghost',        desc:'Translucent white vs dark shadow pieces',  icon:'👻',wFill:'#f0f0ff',wOut:'#9999bb',bFill:'#1a1a2e',bOut:'#9999bb', price:100},
  {id:'skin_candy',    name:'Candy',        desc:'Sweet pink vs mint green',                 icon:'🍬',wFill:'#ff69b4',wOut:'#cc2277',bFill:'#00cc88',bOut:'#007755', price:70},
];

// Store last move classification for rendering
let lastMoveClassification=null;
let lastMoveTo=null;
function getActiveSkin(){
  if(!PIECE_SKINS||!PIECE_SKINS.length) return {wFill:'#ffffff',wOut:'#222222',bFill:'#111111',bOut:'#cccccc'};
  try{
    var skinId=localStorage.getItem('chessSkin')||'skin_classic';
    var ownedRaw=localStorage.getItem('chessOwned')||'{}';
    var owned={};try{owned=JSON.parse(ownedRaw);}catch(e2){}
    if(!owned[skinId]&&skinId!=='skin_classic') skinId='skin_classic';
    var found=null;
    for(var i=0;i<PIECE_SKINS.length;i++){
      if(PIECE_SKINS[i].id===skinId){found=PIECE_SKINS[i];break;}
    }
    return found||PIECE_SKINS[0];
  }catch(e){return PIECE_SKINS[0]||{wFill:'#ffffff',wOut:'#222222',bFill:'#111111',bOut:'#cccccc'};}
}
function setActiveSkin(id){try{localStorage.setItem('chessSkin',id);}catch(e){}}

function pieceSVG(code){
  const isW=code[0]==='w', type=code[1];
  const uni={K:'\u265a',Q:'\u265b',R:'\u265c',B:'\u265d',N:'\u265e',P:'\u265f'}[type];
  const skin=getActiveSkin();
  const fill   = isW ? skin.wFill : skin.bFill;
  const outline= isW ? skin.wOut  : skin.bOut;
  const shadow = '#00000066';
  const id='p'+Math.random().toString(36).slice(2,8);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">'
    +'<defs><filter id="'+id+'" x="-15%" y="-15%" width="130%" height="145%">'
    +'<feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="'+shadow+'"/>'
    +'</filter></defs>'
    +'<text x="50" y="83" text-anchor="middle" font-size="85" font-family="Arial,sans-serif"'
    +' fill="'+outline+'" stroke="'+outline+'" stroke-width="9"'
    +' stroke-linejoin="round" paint-order="stroke" filter="url(#'+id+')">'
    +uni+'</text>'
    +'<text x="50" y="83" text-anchor="middle" font-size="85" font-family="Arial,sans-serif"'
    +' fill="'+fill+'" stroke="'+outline+'" stroke-width="2"'
    +' stroke-linejoin="round" paint-order="stroke">'
    +uni+'</text></svg>';
}
