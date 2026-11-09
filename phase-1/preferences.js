(()=>{
'use strict';
const KEY='conversation-v2-preview-theme';
const DEFAULTS={names:['Gen','Si'],colors:['#277C74','#A33A46'],palette:{bg:'#FFFFFF',paper:'#FFFFFF',ink:'#202020',muted:'#747474',line:'#DEDCD6'},topicView:'cards',icon:null};
const isColor=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
const isIcon=v=>typeof v==='string'&&v.length<=700000&&/^data:image\/png;base64,[a-z0-9+/=]+$/i.test(v);
function normalize(value){const next=JSON.parse(JSON.stringify(DEFAULTS));if(!value||typeof value!=='object')return next;
if(Array.isArray(value.names)&&value.names.length===2&&value.names.every(n=>typeof n==='string'&&n.trim().length>0&&n.length<=24))next.names=value.names.map(n=>n.trim());
if(Array.isArray(value.colors)&&value.colors.length===2&&value.colors.every(isColor))next.colors=[...value.colors];
for(const key of Object.keys(next.palette))if(isColor(value.palette?.[key]))next.palette[key]=value.palette[key];
if(['cards','list'].includes(value.topicView))next.topicView=value.topicView;
if(isIcon(value.icon))next.icon=value.icon;
return next;}
function load(){try{return normalize(JSON.parse(localStorage.getItem(KEY)));}catch{return normalize(null);}}
function save(value){try{localStorage.setItem(KEY,JSON.stringify(normalize(value)));return true;}catch{return false;}}
function mix(a,b,t){const aa=a.slice(1).match(/../g).map(v=>parseInt(v,16)),bb=b.slice(1).match(/../g).map(v=>parseInt(v,16));return '#'+aa.map((v,i)=>Math.round(v*(1-t)+bb[i]*t).toString(16).padStart(2,'0')).join('');}
window.ResearchPreferences={defaults:DEFAULTS,normalize,load,save,isColor,isIcon,mix};
})();
