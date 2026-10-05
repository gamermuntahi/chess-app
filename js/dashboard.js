'use strict';

// Scoped: this file loads alongside the app scripts, which already declare
// globals such as DIFFS/DIFF_NAMES as top-level const bindings.
(function(){

var POSITIONS={
  play:[
    'rnbqkbnr',
    'pppppppp',
    '........',
    '........',
    '........',
    '........',
    'PPPPPPPP',
    'RNBQKBNR'
  ],
  puzzles:[
    '.......k',
    'r.....pp',
    '........',
    '...Q....',
    '........',
    '........',
    '........',
    'R.....K.'
  ],
  lesson:[
    'rnbqkbnr',
    'pp.ppppp',
    '........',
    '..p.....',
    '....P...',
    '........',
    'PPPP.PPP',
    'RNBQKBNR'
  ],
  review:[
    'r.bqk.nr',
    'pppp.ppp',
    '..n.....',
    '..b.p...',
    '..B.P...',
    '..P..N..',
    'PP.P.PPP',
    'RNBQK..R'
  ]
};

var MARKS={
  play:[],
  puzzles:['d5:from','d8:mark'],
  lesson:['c7:last','c5:last'],
  review:['c2:last','c3:last']
};

var GLYPH={k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
var FILES='abcdefgh';

function buildBoard(key){
  var host=document.querySelector('[data-board="'+key+'"]');
  if(!host)return;
  var rows=POSITIONS[key];
  if(!rows)return;

  var marks={};
  (MARKS[key]||[]).forEach(function(m){
    var parts=m.split(':');
    marks[parts[0]]=parts[1];
  });

  var frag=document.createDocumentFragment();
  rows.forEach(function(row,r){
    row.split('').forEach(function(ch,f){
      var sq=document.createElement('div');
      sq.className='sq '+((r+f)%2===0?'L':'D');
      var mark=marks[FILES[f]+(8-r)];
      if(mark)sq.className+=' '+mark;
      var glyph=GLYPH[ch.toLowerCase()];
      if(glyph){
        var pc=document.createElement('span');
        pc.className='pc '+(ch===ch.toLowerCase()?'b':'w');
        pc.textContent=glyph;
        sq.appendChild(pc);
      }
      frag.appendChild(sq);
    });
  });
  host.innerHTML='';
  host.appendChild(frag);
}

// ══ APP DATA ══
var DIFFS=['easy','medium','hard','extreme','expert'];
var DIFF_NAMES={easy:'Easy',medium:'Medium',hard:'Hard',extreme:'Extreme',expert:'Expert'};
var LAST_GAME_KEY='chessLastGame';

function readJSON(key,fallback){
  try{return JSON.parse(localStorage.getItem(key)||'null')||fallback;}
  catch(e){return fallback;}
}

function appState(){
  var user=readJSON('chessCurrentUser',null);
  var lib=readJSON('chessLib',{});
  var prog=readJSON('chessP',{});
  var quests=readJSON('chessQuests',{});
  var coins=parseInt(localStorage.getItem('chessCoins')||'0')||0;

  var games=0,wins=0,draws=0,bestElo=0;
  Object.keys(lib).forEach(function(k){
    var p=lib[k]||{};
    games+=p.played||0;
    wins+=p.wins||0;
    draws+=p.draws||0;
    if(p.elo>bestElo)bestElo=p.elo;
  });

  var solved=0,next=null;
  DIFFS.forEach(function(d,i){
    var done=(prog[d]&&prog[d].done)||[];
    solved+=done.length;
    if(!next){
      var prev=prog[DIFFS[i-1]];
      var unlocked=(i===0)||(prev&&(prev.done||[]).length>=20);
      if(unlocked&&done.length<20){
        for(var l=0;l<20;l++){
          if(done.indexOf(l)===-1&&(l===0||done.indexOf(l-1)!==-1)){
            next={diff:d,lvl:l,done:done.length};
            break;
          }
        }
      }
    }
  });

  var questKeys=Object.keys(quests||{});
  var questsOpen=questKeys.filter(function(k){
    var q=quests[k];
    return q&&!q.done;
  }).length;

  var last=readJSON(LAST_GAME_KEY,null);
  var accuracy=null;
  if(last&&last.moveLog&&last.history&&last.history.length){
    var total=last.history.length;
    var goodW=0,goodB=0;
    last.moveLog.forEach(function(e){
      var badge=typeof e==='string'?e:e.badge;
      var color=typeof e==='string'?null:e.color;
      var good=(badge==='brilliant'||badge==='great'||badge==='best'||badge==='good');
      if(!good)return;
      if(color==='b')goodB++;else goodW++;
    });
    var movesW=Math.ceil(total/2),movesB=Math.floor(total/2);
    var accW=movesW?Math.round((goodW/movesW)*100):0;
    var accB=movesB?Math.round((goodB/movesB)*100):0;
    accuracy=Math.round((accW+accB)/2);
  }

  return{
    user:user,coins:coins,games:games,wins:wins,draws:draws,bestElo:bestElo,
    solved:solved,totalLevels:DIFFS.length*20,next:next,
    questsOpen:questsOpen,lastGame:last,accuracy:accuracy
  };
}

function levelFor(coins){
  var tiers=[0,100,300,600,1000,1500,2500,4000,6000,9000];
  var lvl=1;
  tiers.forEach(function(t,i){if(coins>=t)lvl=i+1;});
  return lvl;
}

var TITLES=['','Beginner','Novice','Apprentice','Challenger','Warrior','Master','Ace','Grandmaster','Legend'];

function setText(id,value){
  var el=document.getElementById(id);
  if(el)el.textContent=value;
}

function animateNumber(el,to,suffix){
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tail=suffix||'';
  function render(v){el.textContent=Math.round(v).toLocaleString('en-US')+tail;}
  if(reduced||to<=0){render(to);return;}
  var dur=700,start=null;
  function frame(ts){
    if(start===null)start=ts;
    var p=Math.min(1,(ts-start)/dur);
    render(to*(1-Math.pow(1-p,3)));
    if(p<1)requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function bindProfile(s){
  var note=document.getElementById('dashNote');
  var av=document.getElementById('profAv');
  var badge=document.getElementById('profBadge');

  if(!s.user){
    av.textContent='?';
    av.style.background='var(--sur2)';
    setText('profName','No profile');
    setText('profRating','—');
    setText('profLevel','Level 1');
    setText('profCoins','0 🪙');
    if(badge)badge.style.display='none';
    if(note){
      note.hidden=false;
      setText('dashNoteText','Create a profile to unlock stats, puzzles and reviews.');
    }
    return false;
  }

  if(note)note.hidden=true;
  if(badge)badge.style.display='';
  var idx=s.user.avatarIdx||0;
  var palette=AVATAR_COLORS[idx]||AVATAR_COLORS[0];
  av.textContent=s.user.username.charAt(0).toUpperCase();
  av.style.background=palette.bg;
  av.style.color=palette.fg;
  setText('profName',s.user.username);
  setText('profRating',s.bestElo?s.bestElo+' ELO':'Unrated');
  setText('profLevel','Level '+levelFor(s.coins)+' · '+TITLES[levelFor(s.coins)]);
  setText('profCoins',s.coins+' 🪙');
  return true;
}

function plural(n,word){return n+' '+word+(n===1?'':'s');}

function bindCards(s,loggedIn){
  var playStat=document.getElementById('statPlay');
  if(loggedIn){
    animateNumber(playStat,s.games);
    setText('textPlay',s.games
      ? plural(s.wins,'win')+' · '+plural(s.draws,'draw')
      : '2-player, vs bot or tournament');
  }else{
    playStat.textContent='—';
    setText('textPlay','Create a profile to track games');
  }

  var pzStat=document.getElementById('statPuzzles');
  if(loggedIn){
    animateNumber(pzStat,s.solved);
    setText('textPuzzles',s.solved+' of '+s.totalLevels+' levels solved');
  }else{
    pzStat.textContent='—';
    setText('textPuzzles','100 levels across 5 difficulties');
  }

  var daily=document.getElementById('dailyLink');
  if(daily){
    var key='dailyPuzzle_'+new Date().getFullYear()+'_'+new Date().getMonth()+'_'+new Date().getDate();
    daily.textContent=localStorage.getItem(key)==='done'?'Daily puzzle done ✓':'Daily puzzle +10 🪙';
  }

  var lessonStat=document.getElementById('statLesson');
  var lessonMeter=document.getElementById('lessonMeter');
  if(loggedIn&&s.next){
    lessonStat.textContent=(s.next.lvl+1)+'/20';
    setText('textLesson',DIFF_NAMES[s.next.diff]+' · puzzle '+(s.next.lvl+1));
    if(lessonMeter){
      lessonMeter.hidden=false;
      document.getElementById('lessonFill').style.width=(s.next.done/20*100)+'%';
    }
  }else if(loggedIn){
    lessonStat.textContent='Done';
    setText('textLesson','All 100 puzzles solved');
    if(lessonMeter){
      lessonMeter.hidden=false;
      document.getElementById('lessonFill').style.width='100%';
    }
  }else{
    lessonStat.textContent='—';
    setText('textLesson','Practice vs the Easy bot');
    if(lessonMeter)lessonMeter.hidden=true;
  }

  var revStat=document.getElementById('statReview');
  var revMeter=document.getElementById('reviewMeter');
  var revLinks=document.getElementById('reviewLinks');
  if(s.lastGame&&s.lastGame.history&&s.lastGame.history.length){
    if(s.accuracy!==null){
      animateNumber(revStat,s.accuracy,'%');
      setText('textReview',s.lastGame.history.length+' moves · '+
        (s.lastGame.w+' vs '+s.lastGame.b));
      if(revMeter){
        revMeter.hidden=false;
        document.getElementById('reviewFill').style.width=s.accuracy+'%';
      }
    }
    if(revLinks)revLinks.hidden=false;
  }else{
    revStat.textContent='—';
    setText('textReview',loggedIn?'No finished game yet':'Play a game to unlock review');
    if(revMeter)revMeter.hidden=true;
    if(revLinks)revLinks.hidden=true;
  }
}

function bindQuestDot(s){
  var dot=document.getElementById('questDot');
  if(!dot)return;
  dot.style.display=s.questsOpen>0?'block':'none';
}

function init(){
  ['play','puzzles','lesson','review'].forEach(buildBoard);
  var s=appState();
  var loggedIn=bindProfile(s);
  bindCards(s,loggedIn);
  bindQuestDot(s);
}

window.dashboardRefresh=init;

document.addEventListener('DOMContentLoaded',init);

})();