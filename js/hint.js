// HINT SYSTEM
'use strict';

// Board themes managed by Store system

// ══════════════════════════════════════════
//  HINT SYSTEM
// ══════════════════════════════════════════
function updateHintButton(){
  var owned=loadOwned();
  var btn=document.getElementById('hintBtn');
  if(btn) btn.style.display=owned['hint_system']?'':'none';
}

function getBestMove(){
  // Find all legal moves and pick the one with highest material gain
  var best=null;var bestScore=-Infinity;
  var PV2={Q:9,R:5,B:3,N:3,P:1,K:0};
  for(var r=0;r<8;r++){
    for(var f=0;f<8;f++){
      if(CC(G.b[r][f])!==G.turn)continue;
      var moves=legal(G.b,r,f,G.ep,G.cas);
      moves.forEach(function(m){
        var score=0;
        // Reward captures
        if(G.b[m.r][m.f])score+=(PV2[TT(G.b[m.r][m.f])]||0)*10;
        // Reward checks
        var nb=applyB(G.b,r,f,m.r,m.f,m,G.cas).nb;
        if(inChk(nb,OPP(G.turn)))score+=5;
        // Reward promotion
        if(TT(G.b[r][f])==='P'&&m.r===0)score+=20;
        // Small random tie-breaker
        score+=Math.random()*0.5;
        if(score>bestScore){bestScore=score;best={fr:r,ff:f,tr:m.r,tf:m.f};}
      });
    }
  }
  return best;
}

var hintUsedThisGame=0;
btn('hintBtn',function(){
  if(G.over)return;
  var owned=loadOwned();
  if(!owned['hint_system']){showStoreMsg('Buy Hint System in the Store!');return;}
  if(hintUsedThisGame>=3){showStoreMsg('No more hints this game! (3/3 used)');return;}
  var best=getBestMove();
  if(!best){showStoreMsg('No hint available.');return;}
  hintUsedThisGame++;
  var remaining=3-hintUsedThisGame;
  // Highlight the from and to squares
  G.sel=[best.fr,best.ff];
  G.moves=legal(G.b,best.fr,best.ff,G.ep,G.cas);
  render();
  document.getElementById('ssub').textContent='Hint: move to highlighted square ('+remaining+' left)';
  showStoreMsg('💡 Hint: '+remaining+' remaining this game');
});
