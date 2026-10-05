// EXEC MOVE + UNDO + PROMOTION
'use strict';

// ══════════════════════════════════════════
//  EXEC MOVE
// ══════════════════════════════════════════
function execMove(sr,sf,mv,promo){
  const c=G.turn,p=G.b[sr][sf],preB=CL(G.b);
  const{nb,cap}=applyB(G.b,sr,sf,mv.r,mv.f,mv,G.cas,promo);
  if(TT(p)==='K'){G.cas[c+'K']=false;G.cas[c+'KR']=false;G.cas[c+'QR']=false;}
  if(TT(p)==='R'){if(sf===7)G.cas[c+'KR']=false;if(sf===0)G.cas[c+'QR']=false;}
  G.ep=(TT(p)==='P'&&Math.abs(mv.r-sr)===2)?[sr+(mv.r-sr)/2,sf]:null;
  if(cap){c==='w'?G.cW.push(cap):G.cB.push(cap);}
  G._lastMoveWasEP=!!(mv&&mv.ep);G.b=nb;G.lf=[sr,sf];G.lt=[mv.r,mv.f];G.sel=null;G.moves=[];addInc(c);
  G.turn=OPP(c);G.check=inChk(G.b,G.turn);
  const left=allLegal(G.b,G.turn,G.ep,G.cas);
  const isMate=!left.length&&G.check;
  const isPromo=TT(p)==='P'&&(mv.r===0||mv.r===7);
  const note=notation(preB,sr,sf,mv.r,mv.f,mv,promo,G.check,isMate);
  G.history.push(note);
  // Classify
  const moveNum=Math.ceil(G.history.length/2);
  if(!G.moveLog)G.moveLog=[];
  const _cl=classifyMove(preB,G.b,c,sr,sf,mv.r,mv.f,mv,cap,G.check,isMate,isPromo,note,moveNum);
  lastMoveClassification=_cl;
  if(_cl)G.moveLog.push({badge:_cl,color:c});
  lastMoveTo=[mv.r,mv.f];
  // Push snapshot AFTER move is fully applied (captures checkmate position)
  G.snapshots.push({b:CL(G.b),turn:G.turn,ep:G.ep,cas:{...G.cas},cW:[...G.cW],cB:[...G.cB],lf:G.lf,lt:G.lt,check:G.check,tW:G.t.w,tB:G.t.b,history:[...G.history],lastBadge:lastMoveClassification,lastTo:lastMoveTo});
  // Vibration
  if(isMate)vibrate([80,40,80,40,200]);
  else if(cap)vibrate([40]);
  else if(G.check)vibrate([30,20,30]);
  // ── Quest triggers during move ──
  const _isBot=BOT&&BOT.active;
  const _botDiff=_isBot?BOT.diff:'';
  const _playerColor=_isBot?OPP(BOT.side):c;
  const _isPlayerMove=!_isBot||(c===_playerColor);

  if(_isPlayerMove){
    if(mv&&mv.cas){
      completeQuest('q_castle');
      if(_isBot){if(_botDiff==='easy')completeQuest('qb_e_castle');else if(_botDiff==='medium')completeQuest('qb_m_castle');else completeQuest('qb_h_castle');}
    }
    if(isPromo){
      completeQuest('q_promotion');
      if(_isBot){if(_botDiff==='easy')completeQuest('qb_e_promotion');else if(_botDiff==='medium')completeQuest('qb_m_promotion');else completeQuest('qb_h_promotion');}
    }
    if(cap&&TT(cap)==='Q'){
      completeQuest('q_win_queen');
      if(_isBot){if(_botDiff==='easy')completeQuest('qb_e_win_queen');else if(_botDiff==='medium')completeQuest('qb_m_win_queen');else completeQuest('qb_h_win_queen');}
    }
    if(lastMoveClassification==='brilliant'&&TT(p)==='N') completeQuest('q_knight_fork');
  }
  if(insuffMat(G.b)){stopClk();endGame('insufficient',null);render();return;}
  if(!left.length){stopClk();playSound(G.check?'checkmate':'move');endGame(G.check?'checkmate':'stalemate',G.check?c:null);render();return;}
  if(isPromo)playSound('promote');else if(mv.cas)playSound('castle');else if(cap)playSound('capture');else playSound('move');
  if(G.check)setTimeout(()=>playSound('check'),180);
  startClk(G.turn);render();
  // Trigger bot move if active and it's bot's turn
  if(BOT.active&&!G.over&&G.turn===BOT.side){
    setTimeout(botPickMove,300);
  }
}

// ══════════════════════════════════════════
//  UNDO
// ══════════════════════════════════════════
function undoMove(){
  if(G.snapshots.length<2)return; // need at least 2: current + one to go back to
  const owned=loadOwned();
  const hasUnlimitedUndo=!!owned['undo_plus'];
  if(!hasUnlimitedUndo&&G.undoCount>=2){
    showStoreMsg('Only 2 undos per game. Buy Unlimited Undo in the Store!');return;
  }
  stopClk();
  if(!hasUnlimitedUndo)G.undoCount=(G.undoCount||0)+1;
  // Pop current post-move snapshot, then peek at the previous one
  const undoOnce=()=>{
    if(G.snapshots.length<2)return;
    G.snapshots.pop(); // remove current move's snapshot
    const s=G.snapshots[G.snapshots.length-1]; // peek at previous state
    G.b=CL(s.b);G.turn=s.turn;G.ep=s.ep;G.cas={...s.cas};G.cW=[...s.cW];G.cB=[...s.cB];G.lf=s.lf;G.lt=s.lt;G.check=s.check;G.t.w=s.tW;G.t.b=s.tB;G.history=[...s.history];G.sel=null;G.moves=[];G.over=false;
    lastMoveClassification=s.lastBadge||null;lastMoveTo=s.lastTo||null;
  };
  undoOnce();
  if(BOT.active&&G.snapshots.length>=2&&G.turn===BOT.side) undoOnce();
  if(CFG.timed)startClk(G.turn);playSound('move');render();
}

// ══════════════════════════════════════════
//  PROMOTION
// ══════════════════════════════════════════
let pData=null;
function openPromo(col,sr,sf,mv){
  pData={sr,sf,mv};
  document.getElementById('promoP').textContent=(col==='w'?'White':'Black')+' — choose your piece';
  const row=document.getElementById('promoR');row.innerHTML='';
  (col==='w'?['wQ','wR','wB','wN']:['bQ','bR','bB','bN']).forEach(pc=>{
    const d=document.createElement('div');d.className='pp';d.innerHTML=pieceSVG(pc);
    const fn=()=>{document.getElementById('promoM').classList.remove('show');execMove(pData.sr,pData.sf,pData.mv,TT(pc));pData=null;};
    d.addEventListener('click',fn);
    row.appendChild(d);
  });
  document.getElementById('promoM').classList.add('show');
}
