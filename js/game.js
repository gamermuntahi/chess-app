// GAME OVER + SCREEN NAV + GAME SESSION + HOME SETUP + IN-GAME BUTTONS
'use strict';

// ══════════════════════════════════════════
//  GAME OVER
// ══════════════════════════════════════════
function endGame(reason,winner){
  G.over=true;stopClk();
  const N={w:PLAYERS.w,b:PLAYERS.b};
  const t=document.getElementById('goTr'),ti=document.getElementById('goTi'),de=document.getElementById('goDe');
  let result='d';
  if(reason==='checkmate'||reason==='timeout'||reason==='resign')result=winner;
  if(reason==='checkmate'){t.textContent='🏆';ti.textContent='Checkmate!';de.textContent=N[winner]+' wins!';
    // Detect which piece gave checkmate
    const lastMoveNotation=G.history[G.history.length-1]||'';
    if(lastMoveNotation.includes('#')){
      const lt=G.lt;
      const matePiece=lt?TT(G.b[lt[0]][lt[1]]):null;
      if(matePiece==='Q')completeQuest('q_mate_queen');
      else if(matePiece==='R')completeQuest('q_mate_rook');
      else if(matePiece==='B')completeQuest('q_mate_bishop');
      else if(matePiece==='N')completeQuest('q_mate_knight');
      else if(matePiece==='P'){
        completeQuest('q_mate_pawn');
        if(G.lf&&G.lt&&G.lf[1]!==G.lt[1])completeQuest('q_mate_enpassant');
      }
    }
    completeQuest('q_first_game');
    if(BOT&&BOT.active&&winner===OPP(BOT.side)){if(BOT.diff==='easy')completeQuest('qb_e_first');else if(BOT.diff==='medium')completeQuest('qb_m_first');else completeQuest('qb_h_first');}
  }
  else if(reason==='stalemate'){t.textContent='🤝';ti.textContent='Stalemate!';de.textContent='Draw — stalemate.';completeQuest('q_stalemate');}
  else if(reason==='insufficient'){t.textContent='🤝';ti.textContent='Draw!';de.textContent='Insufficient material.';}
  else if(reason==='draw'){t.textContent='🤝';ti.textContent='Draw Agreed!';de.textContent='Both players agreed.';}
  else if(reason==='timeout'){t.textContent='⏰';ti.textContent="Time's Up!";de.textContent=N[winner]+' wins on time!';
    var _isBotT=BOT&&BOT.active;var _bdT=_isBotT?BOT.diff:'';
    if(!_isBotT||(winner===OPP(BOT.side))){
      completeQuest('q_first_game');
      if(_isBotT){if(_bdT==='easy')completeQuest('qb_e_first');else if(_bdT==='medium')completeQuest('qb_m_first');else completeQuest('qb_h_first');}
    }
  }
  else if(reason==='resign'){t.textContent='🏳';ti.textContent='Resigned!';de.textContent=N[winner]+' wins!';
    const _isBotR=BOT&&BOT.active;
    const _bdr=_isBotR?BOT.diff:'';
    const _pWonR=!_isBotR||(winner===OPP(BOT.side));
    if(_pWonR){
      completeQuest('q_first_game');
      completeQuest('q_resign_foe');
      if(_isBotR){if(_bdr==='easy')completeQuest('qb_e_resign');else if(_bdr==='medium')completeQuest('qb_m_resign');else completeQuest('qb_h_resign');}
      if(_isBotR){if(_bdr==='easy')completeQuest('qb_e_first');else if(_bdr==='medium')completeQuest('qb_m_first');else completeQuest('qb_h_first');}
    }
  }

  // 🎊 Confetti + fireworks on any win
  const isWin=reason==='checkmate'||reason==='timeout'||reason==='resign';
  if(isWin){
    vibrate([100,50,100,50,200,50,300]);
    setTimeout(()=>{launchConfetti();playFireworks();},400);
  }
  // Show analysis button if owned
  const aBtnEl=document.getElementById('analysisBtn');
  if(aBtnEl) aBtnEl.style.display='';

  // Save to library and get new ELOs
  const eloResult=recordResult(PLAYERS.w,PLAYERS.b,result);
  setTimeout(checkQuestProgress,300);
  // Show ELO changes in modal description
  if(eloResult){
    const lib=loadLib();
    const kW=PLAYERS.w.trim().toLowerCase(),kB=PLAYERS.b.trim().toLowerCase();
    const eloW=lib[kW]?lib[kW].elo:null,eloB=lib[kB]?lib[kB].elo:null;
    let eloStr='';
    if(eloW)eloStr+=` ${PLAYERS.w}: ${eloW}`;
    if(eloB)eloStr+=` · ${PLAYERS.b}: ${eloB}`;
    if(eloStr)document.getElementById('goDe').textContent+=' · ELO:'+eloStr;
    // Update pills with animation
    if(eloW){const el=document.getElementById('eloW');el.textContent=eloW;el.className='elo-pill'+(eloResult.newEloW>=(eloResult.newEloW||0)?' up':' dn');}
    if(eloB){const el=document.getElementById('eloB');el.textContent=eloB;el.className='elo-pill'+(eloResult.newEloB>=(eloResult.newEloB||0)?' up':' dn');}
  }

  // Tournament handling
  const tourMid=document.getElementById('tourBarMid');
  const rmBtn=document.getElementById('rmBtn');
  if(TOUR&&TOUR.active){
    recordTourResult(result);
    tourMid.style.display='block';
    const threshold=tourWinThreshold();
    document.getElementById('tourScoreMid').textContent=`${PLAYERS.w}  ${TOUR.scores.w} — ${TOUR.scores.b}  ${PLAYERS.b}`;
    if(tourOver()){
      // Tournament finished
      setTimeout(()=>{
        document.getElementById('goM').classList.remove('show');
        const winner2=TOUR.scores.w>TOUR.scores.b?'w':TOUR.scores.b>TOUR.scores.w?'b':'draw';
        document.getElementById('teTitle').textContent='Tournament Over!';
        document.getElementById('teDesc').textContent=winner2==='draw'?'It\'s a tie!':N[winner2]+' wins the tournament!';
        document.getElementById('teFinalScore').textContent=`${TOUR.scores.w} — ${TOUR.scores.d} — ${TOUR.scores.b}`;
        document.getElementById('tourEndM').classList.add('show');
        completeQuest('q_tournament');
      },1200);
      rmBtn.textContent='🏆 See Results';
    } else {
      rmBtn.textContent=`▶ Game ${TOUR.gameNum+1} of ${TOUR.totalGames}`;
    }
  } else {
    tourMid.style.display='none';
    rmBtn.textContent='▶ Play Again';
  }
  setTimeout(()=>document.getElementById('goM').classList.add('show'),600);
}

// ══════════════════════════════════════════
//  SCREEN NAV
// ══════════════════════════════════════════
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  if(id==='sHome'){
    var el=document.getElementById('sHome');
    var t=HOME_BG_THEMES&&HOME_BG_THEMES.find(function(x){return x.id===loadHomeBg();});
    if(el&&t) el.style.background=t.gradient;
  }
}

// ══════════════════════════════════════════
//  START GAME SESSION
// ══════════════════════════════════════════
function startGameSession(){
  hintUsedThisGame=0;
  lastMoveClassification=null;lastMoveTo=null;
  document.getElementById('pnW').textContent=PLAYERS.w;
  document.getElementById('pnB').textContent=PLAYERS.b;
  document.getElementById('avW').textContent=PLAYERS.w[0].toUpperCase();
  document.getElementById('avB').textContent=PLAYERS.b[0].toUpperCase();
  // Load ELO from library
  const lib=loadLib();
  const kW=PLAYERS.w.trim().toLowerCase(),kB=PLAYERS.b.trim().toLowerCase();
  const eloW=lib[kW]?lib[kW].elo:300;
  const eloB=lib[kB]?lib[kB].elo:300;
  document.getElementById('eloW').textContent=eloW;document.getElementById('eloW').className='elo-pill';
  document.getElementById('eloB').textContent=eloB;document.getElementById('eloB').className='elo-pill';
  if(TOUR&&TOUR.active){
    document.getElementById('plW').textContent=`White · Game ${TOUR.gameNum+1}/${TOUR.totalGames}`;
    document.getElementById('plB').textContent=`Black · ${TOUR.scores.w}-${TOUR.scores.b}`;
  }else{
    document.getElementById('plW').textContent='White';
    document.getElementById('plB').textContent='Black';
  }
  hintUsedThisGame=0;
  newGame();showScreen('sGame');render();
  updateHintButton();
  if(CFG.timed)startClk('w');
}

// ══════════════════════════════════════════
//  HOME SETUP
// ══════════════════════════════════════════
function buildHomePreview(){
  const pv=document.getElementById('prev');
  if(!pv)return;
  pv.innerHTML='';
  const topP=['bR','bN','bB','bQ','bK','bB','bN','bR','bP','bP','bP','bP','bP','bP','bP','bP'];
  const botP=['wR','wN','wB','wQ','wK','wB','wN','wR','wP','wP','wP','wP','wP','wP','wP','wP'];
  for(let r=0;r<8;r++)for(let f=0;f<8;f++){
    const s=document.createElement('div');s.className='ps '+((r+f)%2===0?'pl':'pd');
    const i=r*8+f;if(i<16)s.innerHTML=pieceSVG(topP[i]);else if(i>=48)s.innerHTML=pieceSVG(botP[i-48]);
    pv.appendChild(s);
  }
}
buildHomePreview();

let selT=null;
function pickT(b){
  window._customTime=null;
  document.querySelectorAll('#sHome .tbtn').forEach(x=>x.classList.remove('on'));
  document.getElementById('uBtn').classList.remove('on');
  if(b){b.classList.add('on');selT=b;}else{document.getElementById('uBtn').classList.add('on');selT=null;}
}
document.querySelectorAll('#sHome .tbtn').forEach(b=>{b.addEventListener('click',()=>pickT(b));b.addEventListener('touchstart',e=>{e.preventDefault();pickT(b);},{passive:false});});
btn('uBtn',()=>pickT(null));

btn('sBtn',()=>{
  const nW=document.getElementById('nameW').value.trim()||'Player 1';
  const nB=document.getElementById('nameB').value.trim()||'Player 2';
  PLAYERS={w:nW,b:nB};TOUR=null;
  BOT.active=false;BOT.thinking=false;
  if(window._customTime&&!selT){
    CFG={timed:true,secs:window._customTime.secs,inc:window._customTime.inc};
  } else {
    CFG=selT?{timed:true,secs:+selT.dataset.m*60,inc:+selT.dataset.i}:{timed:false,secs:Infinity,inc:0};
  }
  startGameSession();
});

// ══════════════════════════════════════════
//  IN-GAME BUTTONS
// ══════════════════════════════════════════
btn('undoBtn',()=>{if(!G.over)undoMove();});
btn('drawBtn',()=>{
  if(G.over)return;
  document.getElementById('drawTxt').textContent=PLAYERS[G.turn]+' offers a draw.';
  document.getElementById('drawM').classList.add('show');
});
btn('drawYes',()=>{document.getElementById('drawM').classList.remove('show');endGame('draw',null);render();});
btn('drawNo',()=>document.getElementById('drawM').classList.remove('show'));
btn('mnuBtn',()=>{G.over=true;stopClk();TOUR=null;showScreen('sHome');});
btn('rsgBtn',()=>{if(G.over)return;document.getElementById('rsgP').textContent=PLAYERS[G.turn]+' will forfeit.';document.getElementById('rsgM').classList.add('show');});
btn('rYes',()=>{document.getElementById('rsgM').classList.remove('show');endGame('resign',OPP(G.turn));render();});
btn('rNo',()=>document.getElementById('rsgM').classList.remove('show'));

btn('rmBtn',()=>{
  document.getElementById('goM').classList.remove('show');
  hintUsedThisGame=0;
  if(TOUR&&TOUR.active&&!tourOver()){
    // Swap colors each game in tournament
    const tmp=PLAYERS.w;PLAYERS.w=PLAYERS.b;PLAYERS.b=tmp;
    startGameSession();
  } else if(!TOUR){
    newGame();render();if(CFG.timed)startClk('w');
  }
});
btn('gmBtn',()=>{document.getElementById('goM').classList.remove('show');G.over=true;stopClk();TOUR=null;showScreen('sHome');});
btn('analysisBtn',()=>{showPostGameAnalysis();});
