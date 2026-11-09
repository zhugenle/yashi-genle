
(()=>{
'use strict';
const D=window.SAMPLE_DATA.stats, $=id=>document.getElementById(id);
let palette=getComputedStyle(document.documentElement),G=palette.getPropertyValue('--gen').trim()||'#277C74',S=palette.getPropertyValue('--si').trim()||'#A33A46',COL=[G,S],NM=['Gen','Si'];
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const F=n=>Number(n).toLocaleString('en-US'),P=n=>(n*100).toFixed(1)+'%',sum=a=>a.reduce((x,y)=>x+y,0);
const tt=s=>' data-qt="'+E(s)+'"';
const grad=(p,v)=>{const base=p?S:G,c=base.replace('#','').match(/../g).map(x=>parseInt(x,16)),t=Math.max(.12,Math.min(1,.2+.8*v));return 'rgb('+c.map(x=>Math.round(255+(x-255)*t)).join(',')+')';};
function svg(w,h,body,title){return '<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+E(title)+'"><title>'+E(title)+'</title>'+body+'</svg>';}
function text(x,y,s,extra=''){return '<text x="'+x+'" y="'+y+'" '+extra+'>'+E(s)+'</text>';}
function line(x1,y1,x2,y2,cl='q-gridline',extra=''){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cl+'" '+extra+'/>';}
function symbol(p,x,y,r,extra=''){return p?'<rect x="'+(x-r)+'" y="'+(y-r)+'" width="'+(r*2)+'" height="'+(r*2)+'" fill="'+S+'" '+extra+'/>':'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+G+'" '+extra+'/>';}
function wordMode(){return $('q-word-mode').value==='content';}
function selectedWords(){return D.words.filter(r=>!wordMode()||r[3]);}
function freq(r,p){return r[p+1]/D.tokens[p]*1000;}
function ratio(r){const V=D.words.length;return ((r[1]+.5)/(D.tokens[0]+.5*V))/((r[2]+.5)/(D.tokens[1]+.5*V));}
function showSection(which,scroll=true){const archive=which==='archive';$('q-archive').hidden=!archive;$('q-research').hidden=archive;document.querySelectorAll('[data-q-section]').forEach(b=>{let on=b.dataset.qSection===which;b.classList.toggle('q-active',on);b.setAttribute('aria-pressed',String(on));});if(scroll)window.scrollTo({top:0,behavior:'smooth'});}
document.querySelectorAll('[data-q-section]').forEach(b=>b.onclick=()=>{showSection(b.dataset.qSection);if(b.dataset.qSection==='research'){try{history.replaceState(null,'','#q-top')}catch{location.hash='q-top';}}});
window.addEventListener('hashchange',()=>{if(/^#T\d|^#top$/.test(location.hash))showSection('archive',false);else if(location.hash.startsWith('#q-'))showSection('research',false);});
showSection(/^#T\d|^#top$/.test(location.hash)?'archive':'research',false);
const mediaTotal=sum(D.mediaSeconds),mediaTime=Math.floor(mediaTotal/3600)+' 小时 '+Math.floor(mediaTotal%3600/60)+' 分 '+Math.round(mediaTotal%60)+' 秒';
$('q-kpis').innerHTML=[
[F(sum(D.chars)),'交流总字符','普通文字与当前引用回复 · 非空白字符'],
[F(sum(D.textN)),'交流总句数','以每条文字或当前引用回复计 1 句'],
[F(D.activeDays),'交流总天数','有消息的日期 · 区间共 '+D.calendarDays+' 天'],
[mediaTime,'语音/视频总时长','语音 '+F(Math.round(sum(D.voiceMinutes)*60))+' 秒 · 视频 '+F(sum(D.videoSeconds))+' 秒']
].map(x=>'<div class="q-kpi"><span>'+x[1]+'</span><strong>'+x[0]+'</strong><small>'+x[2]+'</small></div>').join('');
const night=D.hour.map((a,p)=>sum(a.slice(0,6))/D.total[p]);
$('q-abstract').innerHTML='本区间共有 '+F(D.sourceRecords)+' 条导出记录，剔除 '+F(D.excludedEvents)+' 条系统或状态事件后，分析 '+F(sum(D.total))+' 条消息。Gen 占消息总量的 <b>'+P(D.total[0]/sum(D.total))+'</b>，Si 占 <b>'+P(D.total[1]/sum(D.total))+'</b>；双方在 '+D.bothDays+' 个日期均有发言。00:00—05:59 的消息分别占各自总量的 <b>'+P(night[0])+'</b> 与 <b>'+P(night[1])+'</b>。以下以相同尺度或标准化频率比较两方，所有结论限于这一段已导出的会话。';
let tip=$('q-tooltip');
document.addEventListener('pointermove',e=>{let t=e.target.closest('[data-qt]');if(!t){tip.hidden=true;return;}tip.textContent=t.dataset.qt;tip.hidden=false;tip.style.left=Math.min(e.clientX+14,innerWidth-tip.offsetWidth-12)+'px';tip.style.top=Math.max(6,Math.min(e.clientY+16,innerHeight-tip.offsetHeight-12))+'px';});
document.addEventListener('pointerout',e=>{if(!e.relatedTarget)tip.hidden=true;});
function calendar(){
 const off=+$('q-calendar-scope').value,first=new Date(D.start+'T00:00:00Z'),pad=(first.getUTCDay()+6)%7,cell=18,gap=3,l=55,top=50,max=Math.max(...D.daily.flatMap(r=>[r[1+off],r[2+off]])),cols=Math.ceil((pad+D.daily.length)/7),w=cols*(cell+gap)+l+20,h=415;
 let b='';
 for(let p=0;p<2;p++){
  let y0=top+p*180;b+=text(l,y0-27,NM[p], 'style="fill:'+COL[p]+';font:italic 20px Georgia"');
  ['一','二','三','四','五','六','日'].forEach((d,i)=>b+=text(29,y0+i*21+13,d));
  D.daily.forEach((r,i)=>{let week=Math.floor((i+pad)/7),day=(i+pad)%7,x=l+week*21,y=y0+day*21,v=r[1+p+off];
   if(r[0].slice(-2)==='01'||i===0)b+=text(x,y0-8,r[0].slice(0,7));
   b+='<rect x="'+x+'" y="'+y+'" width="'+cell+'" height="'+cell+'" rx="2" fill="'+(v?grad(p,Math.log1p(v)/Math.log1p(max)):'#f0f2ef')+'" style="cursor:pointer" data-q-date="'+r[0]+'" tabindex="0" role="button" aria-label="'+r[0]+' '+NM[p]+' '+v+' 条"'+tt(r[0]+' · '+NM[p]+'\n'+F(v)+' 条\n点击查看当日原文')+'/>';
  });
 }
 b+=text(l,393,'SHARED SCALE · 条 / 人 / 日');
 [0,Math.round(Math.expm1(Math.log1p(max)/3)),Math.round(Math.expm1(2*Math.log1p(max)/3)),max].forEach((v,i)=>{let x=270+i*155;for(let p=0;p<2;p++)b+='<rect x="'+(x+p*17)+'" y="380" width="14" height="14" fill="'+(v?grad(p,Math.log1p(v)/Math.log1p(max)):'#f0f2ef')+'"/>';b+=text(x+40,392,F(v));});
 $('q-calendar-chart').innerHTML=svg(w,h,b,'Gen 与 Si 每日消息日历，统一对数颜色尺度');
}
function trend(){
 const mode=$('q-trend-mode').value,w=1180,h=315,l=55,r=20,t=24,bt=52;let data;
 if(mode==='month')data=D.months.map(a=>[a[0]+(a[6]?'*':''),a[2]/a[1],a[3]/a[1],'观察 '+a[1]+' 日\n总计 Gen '+a[2]+' / Si '+a[3]]);
 else data=D.daily.map((a,i)=>mode==='daily'?[a[0],a[1],a[2],'每日原始值']:[a[0],... [0,1].map(p=>sum(D.daily.slice(Math.max(0,i-6),i+1).map(v=>v[p+1]))/Math.min(7,i+1)),'截至当天的移动平均']);
 const max=Math.max(...data.flatMap(a=>a.slice(1,3)))*1.12,x=i=>l+i/(data.length-1)*(w-l-r),y=v=>h-bt-v/max*(h-bt-t);let b=text(l,12,'条 / '+(mode==='month'?'观察日':'日'));
 for(let j=0;j<=4;j++){let v=max*j/4;b+=line(l,y(v),w-r,y(v))+text(l-8,y(v)+4,Math.round(v),'text-anchor="end"');}
 for(let p=0;p<2;p++){
  b+='<path d="'+data.map((a,i)=>(i?'L':'M')+x(i).toFixed(2)+','+y(a[p+1]).toFixed(2)).join(' ')+'" fill="none" stroke="'+COL[p]+'" stroke-width="'+(mode==='daily'?1.3:2.4)+'"/>';
  data.forEach((a,i)=>{b+=symbol(p,x(i),y(a[p+1]),mode==='month'?3.5:2,tt(a[0]+' · '+NM[p]+'\n'+a[p+1].toFixed(2)+' 条 / 日\n'+a[3]));});
 }
 data.forEach((a,i)=>{if(mode==='month'||i%35===0||i===data.length-1)b+=text(x(i),h-23,a[0], 'text-anchor="middle" style="font-size:10px"');});
 $('q-trend-chart').innerHTML=svg(w,h,b,'Gen 与 Si 消息时间轨迹');
}
function hour(){
 const share=$('q-hour-mode').value==='share',w=1180,h=295,l=52,t=28,bt=42;let max=Math.max(...D.hour.flatMap((a,p)=>a.map(v=>share?v/D.total[p]*100:v)))*1.1;
 let b=text(l,12,share?'% / 该方全部消息':'消息数'),bw=(w-l-20)/24,y=v=>h-bt-v/max*(h-bt-t);
 for(let j=0;j<=4;j++){let v=max*j/4;b+=line(l,y(v),w-20,y(v))+text(l-8,y(v)+4,share?v.toFixed(1):Math.round(v),'text-anchor="end"');}
 for(let p=0;p<2;p++)D.hour[p].forEach((v,i)=>{let val=share?v/D.total[p]*100:v,x=l+i*bw+bw*(p?.52:.13);b+='<rect x="'+x+'" y="'+y(val)+'" width="'+bw*.34+'" height="'+(h-bt-y(val))+'" fill="'+grad(p,.42+.58*i/23)+'"'+tt(NM[p]+' · '+String(i).padStart(2,'0')+':00–'+String(i).padStart(2,'0')+':59\n'+F(v)+' 条 / '+P(v/D.total[p]))+'/>';});
 for(let i=0;i<24;i++)b+=text(l+(i+.5)*bw,h-18,String(i).padStart(2,'0'),'text-anchor="middle"');
 $('q-hour-chart').innerHTML=svg(w,h,b,'双方每日小时消息分布');
 const mmax=Math.max(...D.matrix.flat(2))/56;
 for(let p=0;p<2;p++){
  let b='',cl=22,px=35,py=24,w=580,h=220;
  for(let k=0;k<7;k++){b+=text(22,py+k*22+14,['一','二','三','四','五','六','日'][k],'text-anchor="end"');for(let i=0;i<24;i++){let v=D.matrix[p][k][i]/56;b+='<rect x="'+(px+i*22)+'" y="'+(py+k*22)+'" width="19" height="19" rx="1" fill="'+(v?grad(p,v/mmax):'#f0f2ef')+'"'+tt(NM[p]+' · 周'+['一','二','三','四','五','六','日'][k]+' '+i+':00\n'+F(D.matrix[p][k][i])+' 条 / 56 日\n平均 '+v.toFixed(2)+' 条')+'/>';}}
  for(let i=0;i<24;i+=3)b+=text(px+i*22+8,13,String(i).padStart(2,'0'),'text-anchor="middle"');
  b+=text(px,205,'共同色阶：0 → '+mmax.toFixed(1)+' 条 / 对应星期日');
  for(let i=0;i<15;i++)b+='<rect x="'+(320+i*12)+'" y="193" width="12" height="10" fill="'+grad(p,i/14)+'"/>';
  $(p?'q-matrix-s':'q-matrix-g').innerHTML=svg(w,h,b,NM[p]+' 周与小时活动矩阵');
 }
}
function words(){
 const eligible=selectedWords(),rate=$('q-word-unit').value==='rate',top=[0,1].map(p=>eligible.slice().sort((a,b)=>b[p+1]-a[p+1]||a[0].localeCompare(b[0])).filter(a=>a[p+1]>0).slice(0,50)),max=Math.max(...top.flatMap((a,p)=>a.map(r=>rate?freq(r,p):r[p+1])));
 for(let p=0;p<2;p++){
  $(p?'q-token-s':'q-token-g').textContent=F(D.tokens[p])+' 有效词 · '+F(D.vocabulary[p])+' 词形';
  $(p?'q-bars-s':'q-bars-g').innerHTML=top[p].map((r,i)=>{let v=rate?freq(r,p):r[p+1];return '<div class="q-bar-row" data-q-word="'+E(r[0])+'" tabindex="0" role="button"'+tt(r[0]+' · '+NM[p]+'\n'+F(r[p+1])+' 次 / '+freq(r,p).toFixed(3)+'‰\n出现在 '+r[p+4]+' 个日期')+'><span class="q-rank">'+String(i+1).padStart(2,'0')+'</span><span class="q-word">'+E(r[0])+'</span><div class="q-track"><div class="q-fill" style="width:'+v/max*100+'%"></div></div><span class="q-num">'+(rate?v.toFixed(2)+'‰':F(v))+'</span></div>';}).join('');
 }
 const baseline=D.tokens[0]/sum(D.tokens),global=eligible.slice(0,50);
 $('q-baseline').innerHTML='<span class="q-g">Gen</span><span class="q-s">Si</span><span>虚线：Gen 总体份额 '+P(baseline)+'</span>';
 $('q-contribution').innerHTML=global.map(r=>{let s=r[1]+r[2],g=r[1]/s;return '<div class="q-contribution-row" data-q-word="'+E(r[0])+'" style="cursor:pointer"'+tt(r[0]+'\nGen '+r[1]+' / '+P(g)+'\nSi '+r[2]+' / '+P(1-g))+'><span class="q-word">'+E(r[0])+'</span><div class="q-split"><div class="q-gpart" style="width:'+g*100+'%"></div><div class="q-spart" style="width:'+(1-g)*100+'%"></div><i class="q-reference" style="left:'+baseline*100+'%"></i></div><span class="q-num">'+r[1]+' / '+r[2]+'</span></div>';}).join('');
 let candidates=eligible.filter(r=>r[1]+r[2]>=20),sides=[candidates.filter(r=>ratio(r)>1).sort((a,b)=>ratio(b)-ratio(a)).slice(0,15),candidates.filter(r=>ratio(r)<1).sort((a,b)=>ratio(a)-ratio(b)).slice(0,15)];
 $('q-distinctive').innerHTML='<table class="q-table"><thead><tr><th>偏向</th><th>词</th><th>相对强度</th><th>Gen / Si 次数</th></tr></thead><tbody>'+sides.flatMap((a,p)=>a.map(r=>'<tr data-q-word="'+E(r[0])+'" style="cursor:pointer"><td class="'+(p?'q-s':'q-g')+'">'+NM[p]+'</td><td>'+E(r[0])+'</td><td>'+(p?1/ratio(r):ratio(r)).toFixed(2)+' ×</td><td>'+r[1]+' / '+r[2]+'</td></tr>')).join('')+'</tbody></table>';
 scatter(candidates.slice(0,300));
}
function scatter(data){
 const w=1100,h=590,l=75,bottom=62,top=30,right=80,max=Math.max(...data.flatMap(r=>[freq(r,0),freq(r,1)]))*1.12,k=Math.log1p(max),x=v=>l+Math.log1p(v)/k*(w-l-right),y=v=>h-bottom-Math.log1p(v)/k*(h-bottom-top);let b='';
 const ticks=[0,.1,.25,.5,1,2,5,10,20,50,100].filter(v=>v<=max);
 for(const v of ticks){b+=line(x(v),top,x(v),h-bottom)+line(l,y(v),w-right,y(v))+text(x(v),h-bottom+22,v,'text-anchor="middle"')+text(l-12,y(v)+4,v,'text-anchor="end"');}
 b+=line(x(0),y(0),x(max),y(max),'q-axis','stroke-dasharray="5 5"');
 b+=text(w-right,h-10,'Gen · 每千有效词频率','text-anchor="end" style="fill:'+G+'"')+text(l,15,'Si · 每千有效词频率','style="fill:'+S+'"');
 const maxC=Math.max(...data.map(r=>r[1]+r[2]));
 data.forEach((r,i)=>{let p=ratio(r)<1?1:0,rad=Math.sqrt((r[1]+r[2])/maxC)*13,xx=x(freq(r,0)),yy=y(freq(r,1)),areaRad=p?rad*Math.sqrt(Math.PI)/2:rad;let a='opacity=".68" stroke="var(--paper)" stroke-width=".7" style="cursor:pointer;fill:'+grad(p,.2+.8*Math.min(1,Math.abs(Math.log2(ratio(r)))/3))+'" data-q-word="'+E(r[0])+'"'+tt(r[0]+'\nGen '+r[1]+' 次 / '+freq(r,0).toFixed(3)+'‰\nSi '+r[2]+' 次 / '+freq(r,1).toFixed(3)+'‰\n平滑强度 Gen / Si：'+ratio(r).toFixed(2));b+=symbol(p,xx,yy,areaRad,a);if(i<10)b+=text(xx+rad+3,yy-3,r[0],'style="font-size:10px;fill:var(--muted);pointer-events:none"');});
 $('q-scatter').innerHTML=svg(w,h,b,'词汇频率散点图：Gen 横轴，Si 纵轴，双轴 log(1+x)');
}
function wordIndex(){
 const query=$('q-term-query').value.trim().toLowerCase(),a=D.words.filter(r=>r[0].includes(query)).slice(0,100);
 $('q-word-index').innerHTML=a.length?'<table class="q-table"><thead><tr><th>词</th><th>Gen 次数</th><th>Si 次数</th><th>Gen / 千词</th><th>Si / 千词</th><th>出现日 Gen / Si</th></tr></thead><tbody>'+a.map(r=>'<tr data-q-word="'+E(r[0])+'" style="cursor:pointer"><td>'+E(r[0])+'</td><td class="q-g">'+F(r[1])+'</td><td class="q-s">'+F(r[2])+'</td><td>'+freq(r,0).toFixed(3)+'</td><td>'+freq(r,1).toFixed(3)+'</td><td>'+r[4]+' / '+r[5]+'</td></tr>').join('')+'</tbody></table>':'<div class="q-empty">未找到该分词结果。可以切换到原文检索搜索完整短语。</div>';
}
function format(){
 let sorted=D.types.slice().sort((a,b)=>b[1]+b[2]-a[1]-a[2]),max=Math.max(...sorted.flatMap(r=>[r[1]/D.total[0],r[2]/D.total[1]]));
 $('q-types').innerHTML=sorted.map(r=>'<div style="margin:15px 0;font-size:11px"><div style="margin-bottom:4px">'+E(r[0])+'</div>'+[0,1].map(p=>'<div style="display:grid;grid-template-columns:30px 1fr 95px;gap:8px;align-items:center;margin:5px 0"'+tt(NM[p]+' · '+r[0]+'\n'+F(r[p+1])+' 条 / '+P(r[p+1]/D.total[p]))+'><span class="'+(p?'q-s':'q-g')+'">'+NM[p]+'</span><div class="q-track"><div style="height:100%;width:'+r[p+1]/D.total[p]/max*100+'%;background:'+grad(p,.7)+'"></div></div><span class="q-num">'+P(r[p+1]/D.total[p])+' · '+F(r[p+1])+'</span></div>').join('')+'</div>').join('');
 let w=600,h=410,l=50,top=35,bt=70,vals=D.lengthHist.map((a,p)=>a.map(v=>v/D.textN[p]*100)),maxV=Math.max(...vals.flat())*1.1,b='',bw=(w-l-15)/8,y=v=>h-bt-v/maxV*(h-bt-top);
 for(let j=0;j<=4;j++){let v=maxV*j/4;b+=line(l,y(v),w-15,y(v))+text(l-8,y(v)+3,v.toFixed(0)+'%','text-anchor="end"');}
 D.lengthBins.forEach((a,i)=>{[0,1].forEach(p=>{let x=l+(i+.12+p*.39)*bw,v=vals[p][i];b+='<rect x="'+x+'" y="'+y(v)+'" width="'+bw*.32+'" height="'+(h-bt-y(v))+'" fill="'+grad(p,.35+.65*i/7)+'"'+tt(NM[p]+' · '+a+'–'+(D.lengthBins[i+1]??'∞')+' 字符\n'+F(D.lengthHist[p][i])+' 条 / '+v.toFixed(2)+'%')+'/>';});b+=text(l+(i+.5)*bw,h-bt+22,i===7?'≥320':a+'–'+(D.lengthBins[i+1]-1),'text-anchor="middle" style="font-size:10px"');});
 b+=text(l,16,'各自文字 / 回复消息占比')+text(l,h-17,'中位数 Gen '+D.lengthMedian[0]+' / Si '+D.lengthMedian[1]+' 字符');
 $('q-length').innerHTML=svg(w,h,b,'双方文本长度分布');
 const tableRows=[
 ['非系统消息数',...D.total.map(F)],
 ['文字与当前引用回复',...D.textN.map(F)],
 ['有效词出现总数',...D.tokens.map(F)],
 ['非空白字符总数',...D.chars.map(F)],
 ['每条文本平均字符数',...D.lengthMean.map(v=>v.toFixed(2))],
 ['文本字符数中位数',...D.lengthMedian],
 ['有消息的日数 / 392',...D.personDays],
 ['已记录语音时长（分钟）',...D.voiceMinutes.map(v=>v.toFixed(2))],
 ['会话首条发送者（共 '+D.sessions+' 段）',...D.initiators],
 ['发言轮次数',...D.turns.map(F)],
 ['平均每轮消息数',...D.messagesPerTurn.map(v=>v.toFixed(2))]
 ];
 $('q-summary-table').innerHTML='<table class="q-table"><thead><tr><th>描述指标 / Descriptive measure</th><th class="q-g">Gen</th><th class="q-s">Si</th></tr></thead><tbody>'+tableRows.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</tbody></table>';
}
$('q-stopwords').textContent='停用词（去停用词视图同时排除少于 2 字符的词）：'+D.stopwords.join('、');
$('q-customwords').textContent='自定义词典（固定词频 100000）：'+D.customWords.join('、')+'。其余采用 jieba 默认词典。';
let A=null;function archive(){return A||(A=window.SAMPLE_DATA.messages.map(m=>m.row));}
const dialog=document.createElement('dialog');dialog.id='q-raw-dialog';dialog.style.cssText='width:min(850px,95vw);max-height:86vh;padding:0;border:1px solid var(--line);border-radius:1px;color:var(--ink);background:var(--paper);font:13px/1.8 var(--sans);';document.body.append(dialog);
let rawList=[],rawLimit=100,rawTitle='';
function renderRaw(){dialog.innerHTML='<div style="position:sticky;top:0;background:var(--paper);border-bottom:1px solid var(--line);padding:16px 22px;display:flex;justify-content:space-between;gap:10px"><strong>'+E(rawTitle)+'</strong><button id="q-close-raw" class="q-btn">关闭</button></div><div style="padding:20px">'+rawList.slice(0,rawLimit).map(m=>'<div style="margin:0 0 15px;border-left:2px solid '+(m[1]==='我'?G:m[1]==='阿寺'?S:'var(--line)')+';padding-left:12px"><div style="font-size:11px;color:var(--muted)">'+E(m[0].replace('T',' ').replace('+08:00',''))+' · '+E(m[1])+' · '+E(m[2])+'</div><div style="white-space:pre-wrap;overflow-wrap:anywhere">'+E(/^\s*</.test(m[3])?'['+m[2]+']':m[3]||'['+m[2]+']')+'</div></div>').join('')+'<div style="font-size:12px;color:var(--muted)">显示 '+Math.min(rawLimit,rawList.length)+' / '+rawList.length+' 条'+(rawLimit<rawList.length?'　<button id="q-more-raw" class="q-btn">再显示 100 条</button>':'')+'</div></div>';$('q-close-raw').onclick=()=>dialog.close();if($('q-more-raw'))$('q-more-raw').onclick=()=>{rawLimit+=100;renderRaw();};}
function openRaw(title,list){rawTitle=title;rawList=list;rawLimit=100;renderRaw();dialog.showModal();tip.hidden=true;}
function detailsWord(word){
 const r=D.words.find(r=>r[0]===word);if(!r)return;
 const box=$('q-word-detail');box.hidden=false;
 box.innerHTML='<b style="font-size:20px">'+E(word)+'</b>　<span class="q-g">Gen '+F(r[1])+' 次 / '+freq(r,0).toFixed(3)+'‰ / '+r[4]+' 个日期</span>　<span class="q-s">Si '+F(r[2])+' 次 / '+freq(r,1).toFixed(3)+'‰ / '+r[5]+' 个日期</span><br>出现日期比单纯次数更能区分多日使用与某次集中讨论；这里不据此判断个人偏好。<br><button class="q-btn" id="q-word-samples">查看包含此字符串的原文</button> <span class="q-mini">原文用字符串匹配，可能含更长词；不等同于分词计数。</span>';
 $('q-word-samples').onclick=()=>openRaw('原文字符串匹配：'+word,archive().messages.filter(m=>(m[2]==='text'||m[2]==='reply')&&m[3].toLowerCase().includes(word.toLowerCase())));
 box.scrollIntoView({behavior:'smooth',block:'center'});
}
document.addEventListener('click',e=>{
 let w=e.target.closest('[data-q-word]');if(w){detailsWord(w.dataset.qWord);return;}
 let day=e.target.closest('[data-q-date]');if(day){let d=day.dataset.qDate,r=D.daily.find(a=>a[0]===d),off=+$('q-calendar-scope').value;$('q-date-detail').innerHTML='<b>'+d+'</b><span class="q-g">Gen '+F(r[1+off])+' 条</span><span class="q-s">Si '+F(r[2+off])+' 条</span><button class="q-btn" id="q-day-raw">查看当天原文</button>';$('q-day-raw').onclick=()=>openRaw(d+' · 当天全部原文（含系统记录）',archive().messages.filter(m=>m[0].startsWith(d)));}
});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-q-word],[data-q-date]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
function download(name,body,type){const u=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);}
function csv(name,rows){download(name,'\ufeff'+rows.map(a=>a.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\r\n'),'text/csv;charset=utf-8');}
function wordRows(list){return list.flatMap(r=>[0,1].map(p=>[r[0],NM[p],r[p+1],D.tokens[p],freq(r,p).toFixed(6),r[p+4],r[3]?'retained':'excluded',r[1]+r[2]?r[p+1]/(r[1]+r[2]):0]));}
const wordHeader=['word','person','count','person_token_total','per_1000_tokens','distinct_dates','filtered_list','contribution'];
$('q-export-top').onclick=()=>csv('Gen_Si_top50_'+(wordMode()?'filtered':'all')+'.csv',[['rank',...wordHeader],...[0,1].flatMap(p=>selectedWords().slice().sort((a,b)=>b[p+1]-a[p+1]||a[0].localeCompare(b[0])).filter(r=>r[p+1]).slice(0,50).map((r,i)=>[i+1,...wordRows([r])[p]]))]);
$('q-export-words').onclick=()=>csv('Gen_Si_word_frequency.csv',[wordHeader,...wordRows(D.words)]);
$('q-export-daily').onclick=()=>csv('Gen_Si_daily_activity.csv',[['date','person','non_system_messages','text_reply_messages'],...D.daily.flatMap(r=>[0,1].map(p=>[r[0],NM[p],r[p+1],r[p+3]]))]);
$('q-export-hour').onclick=()=>csv('Gen_Si_weekday_hour.csv',[['weekday_monday_1','hour','person','message_count','observed_weekdays','mean_messages'],...D.matrix.flatMap((a,p)=>a.flatMap((b,w)=>b.map((v,h)=>[w+1,h,NM[p],v,56,v/56])))]);
$('q-export-json').onclick=()=>download('Gen_Si_research_data.json',JSON.stringify(D,null,2),'application/json');
$('q-print').onclick=()=>window.print();
$('q-calendar-scope').onchange=calendar;$('q-trend-mode').onchange=trend;$('q-hour-mode').onchange=hour;
$('q-word-mode').onchange=words;$('q-word-unit').onchange=words;$('q-term-query').oninput=wordIndex;
calendar();trend();hour();words();wordIndex();format();
document.addEventListener('research-theme-change',()=>{palette=getComputedStyle(document.documentElement);G=palette.getPropertyValue('--gen').trim()||'#277C74';S=palette.getPropertyValue('--si').trim()||'#A33A46';COL[0]=G;COL[1]=S;calendar();trend();hour();words();wordIndex();format();});
})();
