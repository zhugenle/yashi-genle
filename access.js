(()=>{'use strict';
const envelope=window.PRIVATE_ENVELOPE,status=document.getElementById('access-status'),form=document.getElementById('access-form'),submit=document.getElementById('access-submit'),storageKey='gensi-private-'+envelope.id;
const settings=window.ResearchPreferences.load();
window.ResearchPreferences.applyBrand(settings);
for(const [key,value] of Object.entries({...settings.palette,gen:settings.colors[0],si:settings.colors[1]}))document.documentElement.style.setProperty('--'+key,value);
const dialog=document.getElementById('access-dialog');
const title=location.pathname.endsWith('analysis.html')?'对话分析':location.hash.startsWith('#topics')||location.hash.startsWith('#topic/')?'话题与观点':location.hash==='#settings'?'数据与设置':'对话检索';
document.getElementById('locked-title').textContent=title;
document.querySelector('.site-header b').textContent=title;
document.getElementById('access-close').onclick=()=>location.replace('index.html');
dialog.addEventListener('cancel',e=>{e.preventDefault();location.replace('index.html');});
const showDialog=()=>{if(!dialog.open)dialog.showModal();};
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const base64=b=>btoa(String.fromCharCode(...new Uint8Array(b)));
async function unlock(raw,remember){
 const key=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);
 const compressed=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(envelope.iv)},key,bytes(envelope.data));
 const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
 const bundle=JSON.parse(await new Response(stream).text()),urls={};
 for(const [name,data]of Object.entries(bundle.assets)){const ext=name.split('.').pop().toLowerCase(),mime={png:'image/png',gif:'image/gif',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp'}[ext]||'application/octet-stream';urls[name]=URL.createObjectURL(new Blob([bytes(data)],{type:mime}));}
 let persisted=true;if(remember){try{localStorage.setItem(storageKey,base64(raw));}catch{persisted=false;}}
 // The decoded document retains its URL, so navigation, anchors and relative assets keep working.
 const setup='<script>window.privateAsset=function(name){return '+JSON.stringify(urls)+'[name]||name;};window.PRIVATE_ACCESS_PERSISTED='+persisted+';<\/script>';
 document.open();document.write(bundle.html.replace('<head>','<head>'+setup));document.close();
 if(!persisted){const note=document.createElement('p');note.textContent='此浏览器禁止保存解锁状态，关闭页面后需重新输入密码。';note.setAttribute('role','status');document.querySelector('main')?.prepend(note);}
}
form.addEventListener('submit',async e=>{e.preventDefault();submit.disabled=true;status.textContent='正在解锁…';try{const password=document.getElementById('access-password').value;const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);const raw=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:bytes(envelope.salt),iterations:envelope.iterations},material,256);await unlock(raw,true);}catch{status.textContent='密码不正确，或加密文件无法读取，请重试。';submit.disabled=false;}});
(async()=>{if(!window.crypto?.subtle||!window.DecompressionStream){showDialog();status.textContent='请使用新版 Chrome、Edge 或 Safari，通过 HTTPS 或本地文件访问。';submit.disabled=true;return;}let saved;try{saved=localStorage.getItem(storageKey);}catch{}if(saved){submit.disabled=true;status.textContent='正在恢复访问…';try{await unlock(bytes(saved),false);}catch{try{localStorage.removeItem(storageKey);}catch{}status.textContent='保存的访问状态已失效，请重新输入密码。';submit.disabled=false;showDialog();}}else{showDialog();}})();
})();
