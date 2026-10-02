// PIECE POINTS COUNTER + RENDER + TAP INPUT
'use strict';

// ══════════════════════════════════════════
//  PIECE POINTS COUNTER
// ══════════════════════════════════════════
function calcPoints(){
  let wPts=0,bPts=0;
  G.cW.forEach(p=>{wPts+=PV[TT(p)]||0;});
  G.cB.forEach(p=>{bPts+=PV[TT(p)]||0;});
  return{wPts,bPts};
}
function renderPoints(){
  const{wPts,bPts}=calcPoints();
  const wAdv=wPts-bPts,bAdv=bPts-wPts;
  const ptW=document.getElementById('ptW'),ptB=document.getElementById('ptB');
  if(wAdv>0){ptW.textContent='+'+wAdv;ptW.className='pts-badge ahead';ptB.textContent='';ptB.className='pts-badge';}
  else if(bAdv>0){ptB.textContent='+'+bAdv;ptB.className='pts-badge ahead';ptW.textContent='';ptW.className='pts-badge';}
  else{ptW.textContent='';ptW.className='pts-badge';ptB.textContent='';ptB.className='pts-badge';}
}

// ══════════════════════════════════════════
//  RENDER
// ══════════════════════════════════════════
function render(){
  const bEl=document.getElementById('board');bEl.innerHTML='';
  const F='abcdefgh',R='87654321';
  for(let r=0;r<8;r++){
    for(let f=0;f<8;f++){
      const sq=document.createElement('div');
      sq.className='sq '+((r+f)%2===0?'L':'D');sq.dataset.r=r;sq.dataset.f=f;
      if((G.lf&&G.lf[0]===r&&G.lf[1]===f)||(G.lt&&G.lt[0]===r&&G.lt[1]===f))sq.classList.add('lm');
      if(G.sel&&G.sel[0]===r&&G.sel[1]===f)sq.classList.add('sl');
      if(G.check){const k=kingAt(G.b,G.turn);if(k&&k[0]===r&&k[1]===f)sq.classList.add('ck');}
      const vm=(G.moves||[]).find(m=>m.r===r&&m.f===f);
      if(vm){const i=document.createElement('div');i.className=(G.b[r][f]&&CC(G.b[r][f])!==G.turn)?'cr':'dot';sq.appendChild(i);}
      if(G.b[r][f]){
        const pd=document.createElement('div');
        pd.className='piece';
        pd.innerHTML=pieceSVG(G.b[r][f]);
        if(G.lt&&G.lt[0]===r&&G.lt[1]===f)pd.classList.add('jumping');
        sq.appendChild(pd);
        // Move badge
        if(lastMoveTo&&lastMoveTo[0]===r&&lastMoveTo[1]===f&&lastMoveClassification){
          const ownedCheck=loadOwned();
          if(ownedCheck['move_verify']){
            const bm=BADGE_META[lastMoveClassification];
            if(bm){const badge=document.createElement('div');badge.className='move-badge '+bm.cls;badge.textContent=bm.label;sq.appendChild(badge);}
          }
        }
      }
      if(f===7){const l=document.createElement('div');l.className='lr';l.textContent=R[r];sq.appendChild(l);}
      if(r===7){const l=document.createElement('div');l.className='lf';l.textContent=F[f];sq.appendChild(l);}
      bEl.appendChild(sq);
    }
  }
  document.getElementById('pW').className='panel'+(G.turn==='w'?' mt':'');
  document.getElementById('pB').className='panel'+(G.turn==='b'?' mt':'');
  // Captured pieces display
  const capU={K:'♚',Q:'♛',R:'♜',B:'♝',N:'♞',P:'♟'};
  document.getElementById('cW').textContent=G.cW.map(p=>capU[TT(p)]||'').join('');
  document.getElementById('cB').textContent=G.cB.map(p=>({K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙'}[TT(p)]||'')).join('');
  renderPoints();
  updClk();
  // Status
  if(!G.over){
    const N={w:PLAYERS.w,b:PLAYERS.b};
    document.getElementById('stxt').textContent=G.check?N[G.turn]+' in Check!':N[G.turn]+"'s Turn";
    document.getElementById('ssub').textContent=G.sel?'Tap destination':'Tap a piece';
  }
  // Move strip
  const strip=document.getElementById('moveStrip');strip.innerHTML='';
  G.history.forEach((m,i)=>{
    const chip=document.createElement('div');const isW=i%2===0;
    chip.className='move-chip'+(isW?' w-chip':'')+(i===G.history.length-1?' last':'');
    chip.textContent=(isW?`${Math.floor(i/2)+1}. `:'')+m;
    strip.appendChild(chip);
  });
  strip.scrollLeft=strip.scrollWidth;
}

// ══════════════════════════════════════════
//  TAP
// ══════════════════════════════════════════
function tap(r,f){
  if(G.over)return;const p=G.b[r][f];
  if(!G.sel){if(p&&CC(p)===G.turn){G.sel=[r,f];G.moves=legal(G.b,r,f,G.ep,G.cas);}render();return;}
  const[sr,sf]=G.sel;const mv=(G.moves||[]).find(m=>m.r===r&&m.f===f);
  if(mv){if(TT(G.b[sr][sf])==='P'&&(r===0||r===7))openPromo(CC(G.b[sr][sf]),sr,sf,mv);else execMove(sr,sf,mv);}
  else if(p&&CC(p)===G.turn&&!(r===sr&&f===sf)){G.sel=[r,f];G.moves=legal(G.b,r,f,G.ep,G.cas);render();}
  else{G.sel=null;G.moves=[];render();}
}
document.getElementById('board').addEventListener('touchstart',function(e){
  e.preventDefault();const t=e.changedTouches[0];let el=document.elementFromPoint(t.clientX,t.clientY);if(!el)return;
  let sq=el.classList.contains('sq')?el:el.closest('[data-r]');if(!sq||sq.dataset.r===undefined)return;
  tap(+sq.dataset.r,+sq.dataset.f);
},{passive:false});
document.getElementById('board').addEventListener('click',function(e){
  let sq=e.target.closest('[data-r]');if(!sq||sq.dataset.r===undefined)return;tap(+sq.dataset.r,+sq.dataset.f);
});
