// CHESS BOT ENGINE
'use strict';

// ══════════════════════════════════════════
//  CHESS BOT ENGINE
// ══════════════════════════════════════════
var BOT={active:false,diff:'easy',side:'b',thinking:false};

// Piece values for evaluation
var BOT_VAL={K:20000,Q:900,R:500,B:330,N:320,P:100};

// Evaluate board from WHITE's perspective (positive = good for white)
function botEval(b){
  var score=0;
  for(var r=0;r<8;r++){
    for(var f=0;f<8;f++){
      var p=b[r][f];
      if(!p)continue;
      var v=BOT_VAL[TT(p)]||0;
      // Add small positional bonus: center control
      var centerBonus=0;
      if(r>=2&&r<=5&&f>=2&&f<=5)centerBonus=10;
      if(r>=3&&r<=4&&f>=3&&f<=4)centerBonus=20;
      if(CC(p)==='w') score+=v+centerBonus;
      else score-=v+centerBonus;
    }
  }
  return score;
}

// Get all legal moves for a color as flat array of {fr,ff,tr,tf}
function botGetAllMoves(b,color,ep,cas){
  var moves=[];
  for(var r=0;r<8;r++){
    for(var f=0;f<8;f++){
      if(CC(b[r][f])!==color)continue;
      var lm=legal(b,r,f,ep,cas);
      for(var i=0;i<lm.length;i++){
        moves.push({fr:r,ff:f,tr:lm[i].r,tf:lm[i].f,mv:lm[i]});
      }
    }
  }
  return moves;
}

// Apply a move and return new board
function botApply(b,move,cas){
  var promo=(TT(b[move.fr][move.ff])==='P'&&move.tr===0)?'Q':
            (TT(b[move.fr][move.ff])==='P'&&move.tr===7)?'Q':undefined;
  return applyB(b,move.fr,move.ff,move.tr,move.tf,move.mv,cas,promo).nb;
}

// Score a single move (for easy/medium)
function botScoreMove(b,move,color,cas){
  var score=0;
  var target=b[move.tr][move.tf];
  // Capture bonus
  if(target) score+=(BOT_VAL[TT(target)]||0);
  // Check bonus
  var nb=botApply(b,move,cas);
  var opp=OPP(color);
  if(inChk(nb,opp)) score+=50;
  // Promotion bonus
  if(TT(b[move.fr][move.ff])==='P'&&(move.tr===0||move.tr===7)) score+=800;
  // Center control bonus
  if(move.tr>=3&&move.tr<=4&&move.tf>=3&&move.tf<=4) score+=15;
  // Avoid moving to attacked squares (penalty)
  if(inChk(nb,color)) score-=5000; // don't move into check (shouldn't happen with legal())
  return score;
}

// Minimax with alpha-beta (for hard mode)
function botMinimax(b,depth,alpha,beta,maximizing,ep,cas){
  if(depth===0) return botEval(b);
  var color=maximizing?'w':'b';
  var moves=botGetAllMoves(b,color,ep,cas);
  if(moves.length===0){
    if(inChk(b,color)) return maximizing?-99999:99999;
    return 0; // stalemate
  }
  if(maximizing){
    var best=-Infinity;
    for(var i=0;i<moves.length;i++){
      var nb=botApply(b,moves[i],cas);
      var val=botMinimax(nb,depth-1,alpha,beta,false,null,cas);
      if(val>best)best=val;
      if(val>alpha)alpha=val;
      if(beta<=alpha)break;
    }
    return best;
  } else {
    var best=Infinity;
    for(var i=0;i<moves.length;i++){
      var nb=botApply(b,moves[i],cas);
      var val=botMinimax(nb,depth-1,alpha,beta,true,null,cas);
      if(val<best)best=val;
      if(val<beta)beta=val;
      if(beta<=alpha)break;
    }
    return best;
  }
}

// Pick best move based on difficulty
function botPickMove(){
  if(!BOT.active||BOT.thinking)return;
  if(G.over||G.turn!==BOT.side)return;
  BOT.thinking=true;
  // Show thinking indicator
  var statusEl=document.getElementById('ssub');
  if(statusEl)statusEl.textContent='🤖 Bot is thinking…';

  // Use setTimeout so UI updates before heavy computation
  setTimeout(function(){
    try{
      var moves=botGetAllMoves(G.b,BOT.side,G.ep,G.cas);
      if(!moves.length){BOT.thinking=false;return;}

      var chosen=null;

      if(BOT.diff==='easy'){
        // Random legal move
        chosen=moves[Math.floor(Math.random()*moves.length)];

      } else if(BOT.diff==='medium'){
        // Pick highest scoring single move, with small randomness
        var scored=moves.map(function(m){
          return {m:m,s:botScoreMove(G.b,m,BOT.side,G.cas)+(Math.random()*30)};
        });
        scored.sort(function(a,b){return b.s-a.s;});
        // Pick randomly from top 3 to be less predictable
        var topN=Math.min(3,scored.length);
        chosen=scored[Math.floor(Math.random()*topN)].m;

      } else {
        // Hard: minimax depth 2
        var bestVal=BOT.side==='b'?Infinity:-Infinity;
        var bestMoves=[];
        var isMin=BOT.side==='b'; // bot is black = minimizing
        for(var i=0;i<moves.length;i++){
          var nb=botApply(G.b,moves[i],G.cas);
          var val=botMinimax(nb,2,-Infinity,Infinity,isMin?true:false,null,G.cas);
          if(isMin){
            if(val<bestVal){bestVal=val;bestMoves=[moves[i]];}
            else if(val===bestVal)bestMoves.push(moves[i]);
          } else {
            if(val>bestVal){bestVal=val;bestMoves=[moves[i]];}
            else if(val===bestVal)bestMoves.push(moves[i]);
          }
        }
        chosen=bestMoves[Math.floor(Math.random()*bestMoves.length)];
      }

      if(chosen){
        // Execute the chosen move using existing execMove
        G.sel=[chosen.fr,chosen.ff];
        G.moves=legal(G.b,chosen.fr,chosen.ff,G.ep,G.cas);
        var promo=(TT(G.b[chosen.fr][chosen.ff])==='P'&&chosen.tr===0)?'Q':
                  (TT(G.b[chosen.fr][chosen.ff])==='P'&&chosen.tr===7)?'Q':undefined;
        execMove(chosen.fr,chosen.ff,chosen.mv,promo);
      }
    }catch(e){console.error('Bot error:',e);}
    BOT.thinking=false;
  },BOT.diff==='hard'?400:200);
}

// ── BOT SCREEN WIRING ──
var botSelectedDiff='easy';
var botSelectedSide='w';

function botSelectDiff(diff){
  botSelectedDiff=diff;
  ['easy','medium','hard'].forEach(function(d){
    var c=document.getElementById('bot'+d.charAt(0).toUpperCase()+d.slice(1)+'Card');
    if(c)c.classList.toggle('selected',d===diff);
  });
}

function botSelectSide(side){
  botSelectedSide=side;
  document.getElementById('botSideW').classList.toggle('sel',side==='w');
  document.getElementById('botSideB').classList.toggle('sel',side==='b');
}

// Wire diff cards
['easy','medium','hard'].forEach(function(d){
  sbtn('bot'+d.charAt(0).toUpperCase()+d.slice(1)+'Card',function(){botSelectDiff(d);});
});
// Default select easy
botSelectDiff('easy');

sbtn('botSideW',function(){botSelectSide('w');});
sbtn('botSideB',function(){botSelectSide('b');});
sbtn('botBack',function(){showScreen('sHome');});
sbtn('botBtn',function(){showScreen('sBot');});

sbtn('botStartBtn',function(){
  var playerName=document.getElementById('botPlayerName').value.trim()||'Player';
  BOT.active=true;
  BOT.diff=botSelectedDiff;
  BOT.side=botSelectedSide==='w'?'b':'w'; // bot plays opposite side
  BOT.thinking=false;
  var playerSide=botSelectedSide;
  // Set player names
  if(playerSide==='w'){
    PLAYERS={w:playerName,b:'🤖 Bot ('+BOT.diff+')'};
  } else {
    PLAYERS={w:'🤖 Bot ('+BOT.diff+')',b:playerName};
  }
  TOUR=null;
  CFG=selT?{timed:true,secs:+selT.dataset.m*60,inc:+selT.dataset.i}:{timed:false,secs:Infinity,inc:0};
  if(window._customTime&&!selT){
    CFG={timed:true,secs:window._customTime.secs,inc:window._customTime.inc};
  }
  startGameSession();
  // If bot plays white, trigger its first move
  if(BOT.side==='w'){
    setTimeout(botPickMove,600);
  }
});


// ── POST-GAME ANALYSIS ──
function showPostGameAnalysis(){
  if(!G.history||!G.history.length)return;
  var content=document.getElementById('analysisContent');
  if(!content)return;

  var total=G.history.length;
  var wStats={brilliant:0,great:0,best:0,good:0,mistake:0,blunder:0};
  var bStats={brilliant:0,great:0,best:0,good:0,mistake:0,blunder:0};

  (G.moveLog||[]).forEach(function(entry){
    var badge=typeof entry==='string'?entry:entry.badge;
    var color=typeof entry==='string'?null:entry.color;
    var s=color==='b'?bStats:wStats;
    if(badge==='brilliant')s.brilliant++;
    else if(badge==='great')s.great++;
    else if(badge==='best')s.best++;
    else if(badge==='good')s.good++;
    else if(badge==='mistake')s.mistake++;
    else if(badge==='blunder')s.blunder++;
  });

  function acc(s,moves){
    if(!moves)return 0;
    return Math.round(((s.brilliant+s.great+s.best+s.good)/moves)*100);
  }
  var movesW=Math.ceil(total/2);
  var movesB=Math.floor(total/2);
  var accW=acc(wStats,movesW);
  var accB=acc(bStats,movesB);
  var nameW=PLAYERS&&PLAYERS.w?PLAYERS.w:'White';
  var nameB=PLAYERS&&PLAYERS.b?PLAYERS.b:'Black';

  function playerBlock(name,color,s,accuracy){
    var bg=color==='w'?'rgba(255,255,255,.05)':'rgba(0,0,0,.2)';
    var icon=color==='w'?'♔':'♚';
    return '<div style="background:'+bg+';border:1px solid var(--bd);border-radius:12px;padding:12px;margin-bottom:10px;">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
      +'<div style="font-weight:700;font-size:13px;">'+icon+' '+name+'</div>'
      +'<div style="font-size:24px;font-weight:800;color:#779556;">'+accuracy+'%</div>'
      +'</div>'
      +_analysisBadge('!! Brilliant',s.brilliant,'#00b4d8')
      +_analysisBadge('! Great',s.great,'#9dc45f')
      +_analysisBadge('★ Best',s.best,'#779556')
      +_analysisBadge('· Good',s.good,'#888')
      +_analysisBadge('? Mistake',s.mistake,'#f0a000')
      +_analysisBadge('?? Blunder',s.blunder,'#e74c3c')
      +'</div>';
  }

  content.innerHTML=
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">'
    +'<div style="background:var(--sur2);border-radius:10px;padding:10px;text-align:center;">'
    +'<div style="font-size:24px;font-weight:800;color:#f0c040;">'+total+'</div>'
    +'<div style="font-size:11px;color:var(--mu);">Total Moves</div></div>'
    +'<div style="background:var(--sur2);border-radius:10px;padding:10px;text-align:center;">'
    +'<div style="font-size:24px;font-weight:800;color:#779556;">'+Math.round((accW+accB)/2)+'%</div>'
    +'<div style="font-size:11px;color:var(--mu);">Avg Accuracy</div></div>'
    +'</div>'
    +playerBlock(nameW,'w',wStats,accW)
    +playerBlock(nameB,'b',bStats,accB);

  document.getElementById('analysisModal').classList.add('show');
}

function _analysisBadge(label,count,color){
  if(count===0)return'';
  return'<div style="display:flex;align-items:center;justify-content:space-between;background:var(--sur2);border-radius:8px;padding:8px 12px;">'
    +'<div style="font-size:13px;font-weight:600;color:'+color+';">'+label+'</div>'
    +'<div style="font-size:18px;font-weight:800;color:'+color+';">'+count+'</div>'
    +'</div>';
}

// Tournament end modal
btn('teRematch',()=>{document.getElementById('tourEndM').classList.remove('show');showScreen('sTour');});
btn('teMenu',()=>{document.getElementById('tourEndM').classList.remove('show');TOUR=null;showScreen('sHome');});
