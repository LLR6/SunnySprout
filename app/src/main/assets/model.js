(function(root){
function dayKey(d=new Date()){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function parseDay(s){let [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d,12)}
function offset(s,n){let d=parseDay(s);d.setDate(d.getDate()+n);return dayKey(d)}
function fresh(){return {version:1,habits:[],entries:{}}}
function streak(s,id,today=dayKey()){let n=0,d=s.entries[id+'_'+today]?today:offset(today,-1);while(s.entries[id+'_'+d]){n++;d=offset(d,-1)}return n}
function bestCurrent(s){return Math.max(0,...s.habits.map(h=>streak(s,h.id)))}
function validate(s){if(!s||s.version!==1||!Array.isArray(s.habits)||s.habits.length>200||!s.entries||typeof s.entries!=='object'||Array.isArray(s.entries))throw Error('format');let ids=new Set();for(let h of s.habits){if(!h||!/^h[0-9]+$/.test(h.id)||ids.has(h.id)||typeof h.name!=='string'||!h.name.trim()||h.name.length>30||typeof h.goal!=='string'||h.goal.length>60||typeof h.icon!=='string'||h.icon.length>16)throw Error('habit');ids.add(h.id)}for(let [key,e]of Object.entries(s.entries)){if(!e||!ids.has(e.habitId)||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||dayKey(parseDay(e.date))!==e.date||e.date>dayKey()||key!==e.habitId+'_'+e.date||typeof e.note!=='string'||e.note.length>1000||typeof e.mood!=='string'||e.mood.length>16||typeof e.photo!=='string'||e.photo.length>3000000||e.photo&&!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(e.photo))throw Error('entry')}return s}
Object.assign(root,{dayKey,parseDay,offset,fresh,streak,bestCurrent,validate});if(typeof module!=='undefined')module.exports={dayKey,parseDay,offset,fresh,streak,bestCurrent,validate};
})(typeof window!=='undefined'?window:globalThis);
