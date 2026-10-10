const assert=require('node:assert/strict');const m=require('../app/src/main/assets/model.js');
assert.equal(m.offset('2024-03-01',-1),'2024-02-29');assert.equal(m.offset('2026-01-01',-1),'2025-12-31');
let s=m.fresh(),h={id:'h1',name:'读书',goal:'10页',icon:'📖',created:'2026-01-01'};s.habits.push(h);
const t=m.dayKey();function add(d){s.entries['h1_'+d]={habitId:'h1',date:d,note:'<script>test</script>',mood:'😊',photo:''}}
add(m.offset(t,-1));add(m.offset(t,-2));assert.equal(m.streak(s,'h1',t),2);add(t);assert.equal(m.streak(s,'h1',t),3);add(t);assert.equal(Object.keys(s.entries).length,3);
assert.deepEqual(m.validate(JSON.parse(JSON.stringify(s))),s);
for(const change of [e=>e.date='2026-02-30',e=>e.photo='javascript:alert(1)',e=>e.date=m.offset(t,1)]){let bad=JSON.parse(JSON.stringify(s));change(Object.values(bad.entries)[0]);assert.throws(()=>m.validate(bad))}
let bad=JSON.parse(JSON.stringify(s));bad.habits.push(h);assert.throws(()=>m.validate(bad));delete s.entries['h1_'+m.offset(t,-1)];assert.equal(m.streak(s,'h1',t),1);
console.log('PASS: leap days, year boundary, streaks, unique daily check-in, backup roundtrip, malformed imports');
