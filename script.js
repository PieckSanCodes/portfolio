/* ── ACADEMICS TABS ── */
function showTab(id, btn) {
  document.querySelectorAll('.acad-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.acad-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}

/* ── PARTICLES ── */
const bgCv = document.getElementById('bg-canvas');
const bgCtx = bgCv.getContext('2d');
let W, H;
const PARTS = [], N = 72;
const PC = [15, 158, 116];

function resize() { W = bgCv.width = window.innerWidth; H = bgCv.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

class P {
  constructor() { this.init(true); }
  init(r) {
    this.x = Math.random()*W; this.y = r ? Math.random()*H : H+5;
    this.r = Math.random()*1.3+0.4; this.vx = (Math.random()-.5)*.15;
    this.vy = -Math.random()*.18-.05; this.a = Math.random()*.4+.15;
  }
  tick() { this.x+=this.vx; this.y+=this.vy; if(this.y<-8) this.init(false); }
  draw() {
    bgCtx.beginPath(); bgCtx.arc(this.x,this.y,this.r,0,Math.PI*2);
    bgCtx.fillStyle=`rgba(${PC[0]},${PC[1]},${PC[2]},${this.a*3.2})`; bgCtx.fill();
  }
}
for(let i=0;i<N;i++) PARTS.push(new P());

function bgLoop() {
  bgCtx.clearRect(0,0,W,H);
  for(let i=0;i<PARTS.length;i++) for(let j=i+1;j<PARTS.length;j++){
    const dx=PARTS[i].x-PARTS[j].x, dy=PARTS[i].y-PARTS[j].y, d=Math.sqrt(dx*dx+dy*dy);
    if(d<110){ bgCtx.beginPath(); bgCtx.moveTo(PARTS[i].x,PARTS[i].y); bgCtx.lineTo(PARTS[j].x,PARTS[j].y);
      bgCtx.strokeStyle=`rgba(${PC[0]},${PC[1]},${PC[2]},${.26*(1-d/110)})`; bgCtx.lineWidth=.8; bgCtx.stroke(); }
  }
  PARTS.forEach(p=>{p.tick();p.draw();}); requestAnimationFrame(bgLoop);
}
bgLoop();

/* ── BLOCH SPHERE ── */
(function(){
  const cv=document.getElementById('bloch-hero'); if(!cv) return;
  const ctx=cv.getContext('2d'); const S=420,cx=S/2,cy=S/2,R=155; let t=0;
  const ac=[15,158,116], ac2=[106,90,205], m=3.2;

  function proj(x,y,z,rY,rX){
    const x1=x*Math.cos(rY)+z*Math.sin(rY), z1=-x*Math.sin(rY)+z*Math.cos(rY);
    return {x:cx+x1, y:cy-(y*Math.cos(rX)-z1*Math.sin(rX))};
  }

  function loop(){
    ctx.clearRect(0,0,S,S);
    const rY=t*.007, rX=.42;

    [-Math.PI/3,0,Math.PI/3].forEach(lat=>{
      const r2=R*Math.cos(lat),yF=R*Math.sin(lat); ctx.beginPath();
      for(let i=0;i<=120;i++){const a=(i/120)*Math.PI*2,p=proj(r2*Math.cos(a),yF,r2*Math.sin(a),rY,rX);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}
      ctx.strokeStyle=`rgba(${ac[0]},${ac[1]},${ac[2]},${Math.min(1,(lat===0?.2:.09)*m)})`; ctx.lineWidth=lat===0?.8:.5; ctx.stroke();
    });

    for(let li=0;li<6;li++){
      const lon=(li/6)*Math.PI; ctx.beginPath();
      for(let i=0;i<=100;i++){const la=-Math.PI/2+(i/100)*Math.PI,p=proj(R*Math.cos(la)*Math.cos(lon),R*Math.sin(la),R*Math.cos(la)*Math.sin(lon),rY,rX);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}
      ctx.strokeStyle=`rgba(${ac[0]},${ac[1]},${ac[2]},${Math.min(1,.07*m)})`; ctx.lineWidth=.5; ctx.stroke();
    }

    [{v:[R,0,0],l:'|+⟩'},{v:[0,R,0],l:'|0⟩'},{v:[0,0,R],l:'|i⟩'}].forEach(({v,l})=>{
      const p1=proj(-v[0]*.85,-v[1]*.85,-v[2]*.85,rY,rX),p2=proj(v[0]*1.1,v[1]*1.1,v[2]*1.1,rY,rX);
      ctx.setLineDash([3,5]); ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y);
      ctx.strokeStyle=`rgba(${ac[0]},${ac[1]},${ac[2]},${Math.min(1,.16*m)})`; ctx.lineWidth=.6; ctx.stroke(); ctx.setLineDash([]);
      ctx.font='10px DM Mono,monospace'; ctx.fillStyle=`rgba(${ac[0]},${ac[1]},${ac[2]},${Math.min(1,.32*m)})`;
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(l,p2.x,p2.y-9);
    });

    const theta=Math.PI/4+Math.sin(t*.004)*.28, phi=t*.009;
    const sx=R*Math.sin(theta)*Math.cos(phi),sz=R*Math.sin(theta)*Math.sin(phi),sy=R*Math.cos(theta);
    const origin=proj(0,0,0,rY,rX),tip=proj(sx,sy,sz,rY,rX),shadow=proj(sx,0,sz,rY,rX);

    ctx.setLineDash([2,4]);
    ctx.beginPath();ctx.moveTo(tip.x,tip.y);ctx.lineTo(shadow.x,shadow.y);
    ctx.strokeStyle=`rgba(${ac2[0]},${ac2[1]},${ac2[2]},${Math.min(1,.15*m)})`; ctx.lineWidth=.6; ctx.stroke();
    ctx.beginPath();ctx.moveTo(origin.x,origin.y);ctx.lineTo(shadow.x,shadow.y);
    ctx.strokeStyle=`rgba(${ac2[0]},${ac2[1]},${ac2[2]},${Math.min(1,.1*m)})`; ctx.lineWidth=.6; ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();ctx.moveTo(origin.x,origin.y);ctx.lineTo(tip.x,tip.y);
    ctx.strokeStyle=`rgba(${ac2[0]},${ac2[1]},${ac2[2]},.88)`; ctx.lineWidth=1.4; ctx.stroke();
    const ang=Math.atan2(tip.y-origin.y,tip.x-origin.x);
    ctx.beginPath();ctx.moveTo(tip.x,tip.y);
    ctx.lineTo(tip.x-8*Math.cos(ang-.38),tip.y-8*Math.sin(ang-.38));
    ctx.lineTo(tip.x-8*Math.cos(ang+.38),tip.y-8*Math.sin(ang+.38));
    ctx.closePath(); ctx.fillStyle=`rgba(${ac2[0]},${ac2[1]},${ac2[2]},.88)`; ctx.fill();
    ctx.beginPath();ctx.arc(tip.x,tip.y,3,0,Math.PI*2);
    ctx.fillStyle=`rgba(${ac2[0]},${ac2[1]},${ac2[2]},1)`; ctx.fill();
    ctx.beginPath();ctx.arc(origin.x,origin.y,2.2,0,Math.PI*2);
    ctx.fillStyle=`rgba(${ac[0]},${ac[1]},${ac[2]},${Math.min(1,.3*m)})`; ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);
    ctx.strokeStyle=`rgba(${ac[0]},${ac[1]},${ac[2]},${Math.min(1,.06*m)})`; ctx.lineWidth=.5; ctx.stroke();

    t++; requestAnimationFrame(loop);
  }
  loop();
})();

/* ── SCROLL REVEAL ── */
const reveals=document.querySelectorAll('.reveal');
const io=new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*55);io.unobserve(e.target);}});
},{threshold:0.1});
reveals.forEach(el=>io.observe(el));

/* ── SKILL BARS ── */
const skillsIo=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.skill-fill').forEach(b=>{b.style.width=b.dataset.w+'%'});skillsIo.disconnect();}});
},{threshold:0.2});
const sc=document.getElementById('skillsContainer'); if(sc) skillsIo.observe(sc);
