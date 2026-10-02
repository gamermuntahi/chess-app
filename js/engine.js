// CHESS ENGINE (move generation) + CLOCK + SOUNDS
'use strict';

// ══════════════════════════════════════════
//  CHESS ENGINE
// ══════════════════════════════════════════
const START=[['bR','bN','bB','bQ','bK','bB','bN','bR'],['bP','bP','bP','bP','bP','bP','bP','bP'],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],['wP','wP','wP','wP','wP','wP','wP','wP'],['wR','wN','wB','wQ','wK','wB','wN','wR']];
const CC=p=>p?p[0]:null,TT=p=>p?p[1]:null,OPP=c=>c==='w'?'b':'w',IN=(r,f)=>r>=0&&r<8&&f>=0&&f<8,CL=b=>b.map(r=>r.slice());
let G={},CFG={timed:false,secs:0,inc:0},PLAYERS={w:'Player 1',b:'Player 2'};

function newGame(){
  G={b:START.map(r=>r.slice()),turn:'w',sel:null,moves:[],lf:null,lt:null,ep:null,undoCount:0,moveLog:[],
    cas:{wK:true,wKR:true,wQR:true,bK:true,bKR:true,bQR:true},
    cW:[],cB:[],over:false,t:{w:CFG.secs,b:CFG.secs},tick:null,ac:null,check:false,
    history:[],snapshots:[]};
  // Push initial position as snapshot[0] so review can show start position
  G.snapshots.push({b:CL(G.b),turn:'w',ep:null,cas:{...G.cas},cW:[],cB:[],lf:null,lt:null,check:false,tW:G.t.w,tB:G.t.b,history:[],lastBadge:null,lastTo:null});
}
function kingAt(b,c){for(let r=0;r<8;r++)for(let f=0;f<8;f++)if(b[r][f]===c+'K')return[r,f];return null;}
function raw(b,r,f,ep,cas){
  const p=b[r][f];if(!p)return[];const c=CC(p),t=TT(p),ms=[];
  const add=(nr,nf,x={})=>{if(IN(nr,nf))ms.push({r:nr,f:nf,...x});};
  if(t==='P'){const d=c==='w'?-1:1,sr=c==='w'?6:1;if(IN(r+d,f)&&!b[r+d][f]){add(r+d,f);if(r===sr&&!b[r+2*d][f])add(r+2*d,f);}[-1,1].forEach(df=>{if(!IN(r+d,f+df))return;if(b[r+d][f+df]&&CC(b[r+d][f+df])===OPP(c))add(r+d,f+df);if(ep&&ep[0]===r+d&&ep[1]===f+df)add(r+d,f+df,{ep:true});});}
  if(t==='N'){[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,df])=>{const nr=r+dr,nf=f+df;if(IN(nr,nf)&&CC(b[nr][nf])!==c)add(nr,nf);});}
  const slide=dirs=>{dirs.forEach(([dr,df])=>{let nr=r+dr,nf=f+df;while(IN(nr,nf)){if(CC(b[nr][nf])===c)break;add(nr,nf);if(b[nr][nf])break;nr+=dr;nf+=df;}});};
  if(t==='R')slide([[0,1],[0,-1],[1,0],[-1,0]]);if(t==='B')slide([[1,1],[1,-1],[-1,1],[-1,-1]]);if(t==='Q')slide([[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]);
  if(t==='K'){[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,df])=>{const nr=r+dr,nf=f+df;if(IN(nr,nf)&&CC(b[nr][nf])!==c)add(nr,nf);});const row=c==='w'?7:0;if(cas[c+'K']){if(cas[c+'KR']&&!b[row][5]&&!b[row][6])add(row,6,{cas:'K'});if(cas[c+'QR']&&!b[row][3]&&!b[row][2]&&!b[row][1])add(row,2,{cas:'Q'});}}
  return ms;
}
function attacked(b,r,f,by){for(let br=0;br<8;br++)for(let bf=0;bf<8;bf++){if(CC(b[br][bf])!==by)continue;if(raw(b,br,bf,null,{wK:false,bK:false}).some(m=>m.r===r&&m.f===f))return true;}return false;}
function inChk(b,c){const k=kingAt(b,c);return k?attacked(b,k[0],k[1],OPP(c)):false;}
function applyB(b,sr,sf,tr,tf,mv,cas,promo){
  const nb=CL(b),p=nb[sr][sf],c=CC(p),t=TT(p);let cap=nb[tr][tf];nb[tr][tf]=p;nb[sr][sf]=null;
  if(t==='P'&&mv&&mv.ep){const cr=c==='w'?tr+1:tr-1;cap=nb[cr][tf];nb[cr][tf]=null;}
  if(t==='K'){if(tf-sf===2){nb[sr][5]=nb[sr][7];nb[sr][7]=null;}if(sf-tf===2){nb[sr][3]=nb[sr][0];nb[sr][0]=null;}}
  if(t==='P'&&(tr===0||tr===7))nb[tr][tf]=c+(promo||'Q');
  return{nb,cap};
}
function legal(b,r,f,ep,cas){const p=b[r][f];if(!p)return[];const c=CC(p);return raw(b,r,f,ep,cas).filter(m=>{if(m.cas){if(inChk(b,c))return false;const mid=m.cas==='K'?(c==='w'?[7,5]:[0,5]):(c==='w'?[7,3]:[0,3]);if(attacked(b,mid[0],mid[1],OPP(c)))return false;}const{nb}=applyB(b,r,f,m.r,m.f,m,cas);return!inChk(nb,c);});}
function allLegal(b,c,ep,cas){const a=[];for(let r=0;r<8;r++)for(let f=0;f<8;f++){if(CC(b[r][f])!==c)continue;legal(b,r,f,ep,cas).forEach(m=>a.push(m));}return a;}
function insuffMat(b){const ps=[];for(let r=0;r<8;r++)for(let f=0;f<8;f++)if(b[r][f])ps.push(b[r][f]);if(ps.length===2)return true;if(ps.length===3&&ps.some(p=>TT(p)==='N'||TT(p)==='B'))return true;const bishops=ps.filter(p=>TT(p)==='B');if(ps.length===4&&bishops.length===2){const bsq=[];for(let r=0;r<8;r++)for(let f=0;f<8;f++)if(b[r][f]&&TT(b[r][f])==='B')bsq.push((r+f)%2);if(bsq[0]===bsq[1])return true;}return false;}
function notation(b,sr,sf,tr,tf,mv,promo,isChk,isMate){
  const p=b[sr][sf],t=TT(p),F='abcdefgh',R='87654321',cap=b[tr][tf]||(mv&&mv.ep);let n='';
  if(mv&&mv.cas)return mv.cas==='K'?'O-O':'O-O-O';
  if(t==='P'){if(sf!==tf)n=F[sf];if(cap)n+='x';n+=F[tf]+R[tr];}
  else{n=({K:'K',Q:'Q',R:'R',B:'B',N:'N'}[t])+(cap?'x':'')+F[tf]+R[tr];}
  if(promo)n+='='+promo;if(isMate)n+='#';else if(isChk)n+='+';return n;
}

// ══════════════════════════════════════════
//  CLOCK
// ══════════════════════════════════════════
function fmt(s){if(!CFG.timed)return'—';const m=Math.floor(s/60),sc=s%60;return`${m}:${String(sc).padStart(2,'0')}`;}
function startClk(c){stopClk();if(!CFG.timed)return;G.ac=c;G.tick=setInterval(()=>{G.t[c]--;updClk();if(G.t[c]<=0){stopClk();endGame('timeout',OPP(c));}},1000);}
function stopClk(){if(G.tick){clearInterval(G.tick);G.tick=null;}G.ac=null;}
function addInc(c){if(CFG.timed&&CFG.inc>0)G.t[c]+=CFG.inc;}
function updClk(){['w','b'].forEach(c=>{const el=document.getElementById('ck'+(c==='w'?'W':'B'));el.textContent=fmt(G.t[c]);el.className='clk';if(G.ac===c)el.classList.add(CFG.timed&&G.t[c]<=10?'lw':'tk');});}

// ══════════════════════════════════════════
//  SOUNDS
// ══════════════════════════════════════════
const AC=(()=>{try{return new(window.AudioContext||window.webkitAudioContext)();}catch(e){return null;}})();
function unlockAudio(){if(AC&&AC.state==='suspended')AC.resume();}
document.addEventListener('touchstart',unlockAudio,{once:true});document.addEventListener('click',unlockAudio,{once:true});
function playSound(type){
  if(!AC)return;if(AC.state==='suspended')AC.resume();const t=AC.currentTime;
  if(type==='move'){const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);o.type='sine';o.frequency.setValueAtTime(520,t);o.frequency.exponentialRampToValueAtTime(300,t+0.08);g.gain.setValueAtTime(0.18,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);}
  else if(type==='capture'){[0,0.07].forEach((d,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);o.type='triangle';o.frequency.setValueAtTime(i?260:400,t+d);o.frequency.exponentialRampToValueAtTime(i?130:200,t+d+0.1);g.gain.setValueAtTime(0.22,t+d);g.gain.exponentialRampToValueAtTime(0.001,t+d+0.15);o.start(t+d);o.stop(t+d+0.15);});}
  else if(type==='check'){[0,0.12,0.22].forEach((d,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);o.type='square';o.frequency.setValueAtTime([880,660,880][i],t+d);g.gain.setValueAtTime(0.12,t+d);g.gain.exponentialRampToValueAtTime(0.001,t+d+0.1);o.start(t+d);o.stop(t+d+0.1);});}
  else if(type==='castle'){[0,0.1].forEach(d=>{const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);o.type='sine';o.frequency.setValueAtTime(380,t+d);o.frequency.exponentialRampToValueAtTime(180,t+d+0.14);g.gain.setValueAtTime(0.25,t+d);g.gain.exponentialRampToValueAtTime(0.001,t+d+0.18);o.start(t+d);o.stop(t+d+0.18);});}
  else if(type==='promote'){[0,0.1,0.2,0.32].forEach((d,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);o.type='triangle';o.frequency.setValueAtTime([440,554,660,880][i],t+d);g.gain.setValueAtTime(0.18,t+d);g.gain.exponentialRampToValueAtTime(0.001,t+d+0.18);o.start(t+d);o.stop(t+d+0.18);});}
  else if(type==='checkmate'){[0,0.18,0.38,0.6].forEach((d,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);o.type='sawtooth';o.frequency.setValueAtTime([660,520,390,260][i],t+d);o.frequency.exponentialRampToValueAtTime([330,260,195,130][i],t+d+0.22);g.gain.setValueAtTime(0.2,t+d);g.gain.exponentialRampToValueAtTime(0.001,t+d+0.28);o.start(t+d);o.stop(t+d+0.28);});}
}
