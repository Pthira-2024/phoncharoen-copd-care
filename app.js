'use strict';
const $ = (id) => document.getElementById(id);
const catPrompts = [
  'ฉันไม่เคยไอเลย — ฉันไอตลอดเวลา',
  'ฉันไม่มีเสมหะในหน้าอกเลย — หน้าอกของฉันมีเสมหะเต็มไปหมด',
  'ฉันไม่รู้สึกแน่นหน้าอกเลย — ฉันรู้สึกแน่นหน้าอกมาก',
  'เมื่อเดินขึ้นเนินหรือขึ้นบันได ฉันไม่รู้สึกเหนื่อย — ฉันรู้สึกเหนื่อยมาก',
  'ฉันไม่มีกิจกรรมใด ๆ ที่ทำอยู่ในบ้านถูกจำกัด — ฉันถูกจำกัดกิจกรรมในบ้านมาก',
  'ฉันมั่นใจที่จะออกจากบ้านแม้จะมีโรคปอด — ฉันไม่มั่นใจที่จะออกจากบ้านเพราะโรคปอด',
  'ฉันนอนหลับสนิท — ฉันนอนไม่หลับเพราะโรคปอด',
  'ฉันมีพลังงานมาก — ฉันไม่มีพลังงานเลย'
];
const mmrcTexts = [
  'ฉันจะรู้สึกเหนื่อยเฉพาะเมื่อออกแรงอย่างหนักเท่านั้น',
  'ฉันเหนื่อยเมื่อเดินเร็วบนพื้นราบ หรือเดินขึ้นเนินเล็กน้อย',
  'ฉันเดินช้ากว่าคนวัยเดียวกันบนพื้นราบเพราะเหนื่อย หรือต้องหยุดพักเมื่อเดินตามปกติ',
  'ฉันต้องหยุดพักเพื่อหายใจหลังจากเดินประมาณ 100 เมตร หรือเดินได้ไม่กี่นาทีบนพื้นราบ',
  'ฉันเหนื่อยมากเกินกว่าจะออกจากบ้าน หรือเหนื่อยขณะใส่หรือถอดเสื้อผ้า'
];
let catAnswers = Array(8).fill(null);
let mmrcAnswer = null;
function buildCAT(){
  $('catQuestions').innerHTML = catPrompts.map((q,i)=>`<div class="cat-item"><div class="cat-question">${i+1}. ${q}</div><div class="cat-scale">${Array.from({length:6},(_,n)=>`<label><input type="radio" name="cat${i}" value="${n}"><span>${n}</span></label>`).join('')}</div><div class="scale-ends"><span>ไม่มีอาการ / ผลกระทบน้อย</span><span>มากที่สุด</span></div></div>`).join('');
  document.querySelectorAll('.cat-scale input').forEach(el=>el.addEventListener('change',e=>{catAnswers[Number(e.target.name.slice(3))]=Number(e.target.value);updateCAT();updateSummary();}));
}
function buildMMRC(){
  $('mmrcOptions').innerHTML=mmrcTexts.map((t,i)=>`<label class="mmrc-option"><input type="radio" name="mmrc" value="${i}"><span class="mmrc-grade">${i}</span><span class="mmrc-text">${t}</span></label>`).join('');
  document.querySelectorAll('input[name="mmrc"]').forEach(el=>el.addEventListener('change',e=>{mmrcAnswer=Number(e.target.value);document.querySelectorAll('.mmrc-option').forEach((n,i)=>n.classList.toggle('selected',i===mmrcAnswer));updateMMRC();updateABE();updateSummary();}));
}
function updateCAT(){
  const total=catAnswers.reduce((a,b)=>a+(b??0),0), complete=catAnswers.every(v=>v!==null);
  $('catTotal').innerHTML=`${complete?total:'—'} <small>/ 40</small>`;
  $('catInterpretation').textContent=!complete?'โปรดตอบแบบประเมินให้ครบทั้ง 8 ข้อ':total<10?'คะแนนต่ำกว่า 10: อาการมีผลกระทบค่อนข้างน้อย':total<20?'คะแนน 10–19: อาการมีผลกระทบระดับปานกลาง':total<30?'คะแนน 20–29: อาการมีผลกระทบมาก':'คะแนน 30–40: อาการมีผลกระทบมากที่สุด';
  $('catMetric').innerHTML=complete?`${total}<small>/40</small>`:'—<small>/40</small>';$('catMetricText').textContent=complete?'ประเมิน CAT ครบแล้ว':'ยังไม่ได้ประเมิน';
}
function updateMMRC(){ $('mmrcTotal').innerHTML=`${mmrcAnswer===null?'—':mmrcAnswer} <small>/ 4</small>`;$('mmrcInterpretation').textContent=mmrcAnswer===null?'ยังไม่ได้เลือกระดับอาการ':`Grade ${mmrcAnswer}: ${mmrcTexts[mmrcAnswer]}`;$('mmrcMetric').innerHTML=mmrcAnswer===null?'—<small>/4</small>':`${mmrcAnswer}<small>/4</small>`;$('mmrcMetricText').textContent=mmrcAnswer===null?'ยังไม่ได้ประเมิน':'ประเมินระดับความเหนื่อยแล้ว';}
function readNum(id){const v=$(id).value.trim();if(v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null;}
function calculateSpirometry(){
  const fev=readNum('postFev1'),fvc=readNum('postFvc'),pred=readNum('predFev1');
  if(fev===null||fvc===null||fev<=0||fvc<=0||fev>fvc){$('spiroResult').innerHTML='<div class="result-placeholder">กรุณากรอก FEV₁ และ FVC ให้ถูกต้อง โดย FEV₁ ต้องไม่มากกว่า FVC</div>';return;}
  const ratio=fev/fvc, pct=pred&&pred>0?fev/pred*100:null;
  const obstructed=ratio<.70;
  let grade='ยังจัดระดับไม่ได้'; if(pct!==null){if(pct>=80)grade='GOLD 1';else if(pct>=50)grade='GOLD 2';else if(pct>=30)grade='GOLD 3';else grade='GOLD 4';}
  $('spiroResult').innerHTML=`<div class="result-card"><span>Post-BD FEV₁/FVC</span><strong>${ratio.toFixed(2)}</strong><p>${obstructed?'ต่ำกว่า 0.70':'ตั้งแต่ 0.70 ขึ้นไป'}</p></div><div class="result-card"><span>FEV₁ % Predicted</span><strong>${pct===null?'—':pct.toFixed(1)+'%'}</strong><p>${pct===null?'ต้องกรอกค่า predicted FEV₁':grade}</p></div><div class="result-card"><span>ผลตามเกณฑ์ Spirometry</span><strong>${obstructed?'พบ airflow obstruction':'ไม่เข้าเกณฑ์ fixed ratio'}</strong><p>${obstructed?'สอดคล้องกับเกณฑ์ spirometric obstruction':'ต้องพิจารณาภาพรวมและข้อบ่งชี้ตรวจเพิ่มเติม'}</p></div>`;
  $('fevMetric').innerHTML=pct===null?'—<small>%</small>':`${pct.toFixed(1)}<small>%</small>`;$('fevMetricText').textContent=pct===null?'รอค่า predicted FEV₁':grade;
  updateSummary();
}
function getSpiro(){const fev=readNum('postFev1'),fvc=readNum('postFvc'),pred=readNum('predFev1');if(fev===null||fvc===null||fev<=0||fvc<=0||fev>fvc)return null;const pct=pred&&pred>0?fev/pred*100:null;return {ratio:fev/fvc,pct,obstructed:fev/fvc<.7,grade:pct===null?'ยังจัดระดับไม่ได้':pct>=80?'GOLD 1':pct>=50?'GOLD 2':pct>=30?'GOLD 3':'GOLD 4'};}
function getABE(){
  const moderate=readNum('moderateEx')??0,severe=readNum('severeEx')??0;
  const highRisk=severe>=1||moderate>=1;
  const highSymptoms=(mmrcAnswer!==null&&mmrcAnswer>=2)||(catAnswers.every(v=>v!==null)&&catAnswers.reduce((a,b)=>a+b,0)>=10);
  if(mmrcAnswer===null&&!catAnswers.every(v=>v!==null))return null;
  return highRisk?'E':highSymptoms?'B':'A';
}
function updateABE(){const g=getABE();$('abeMetric').textContent=g??'—';$('abeMetricText').textContent=g?`กลุ่ม ${g} ตามข้อมูลที่กรอก`:'รอข้อมูลอาการและการกำเริบ';}
function updateEx(){const m=readNum('moderateEx')??0,s=readNum('severeEx')??0;$('exTotal').innerHTML=`${m+s} <small>ครั้ง</small>`;$('exInterpretation').textContent=s>=1?'มีประวัติกำเริบอย่างน้อย 1 ครั้งที่นอนโรงพยาบาล':m>=1?'มี moderate exacerbation อย่างน้อย 1 ครั้ง':'ไม่พบประวัติการกำเริบตามข้อมูลที่ระบุ';updateABE();updateSummary();}
function updateSummary(){
  const catDone=catAnswers.every(v=>v!==null),cat=catDone?catAnswers.reduce((a,b)=>a+b,0):null,sp=getSpiro(),abe=getABE(),m=readNum('moderateEx')??0,s=readNum('severeEx')??0;
  $('finalSummary').innerHTML=`<b>ผลการประเมินที่กรอก</b><ul><li>CAT: ${cat===null?'ยังไม่ครบ':cat+'/40'}</li><li>mMRC: ${mmrcAnswer===null?'ยังไม่ได้ประเมิน':'Grade '+mmrcAnswer}</li><li>Spirometry: ${sp?`Post-BD FEV₁/FVC ${sp.ratio.toFixed(2)}; FEV₁ % predicted ${sp.pct===null?'ไม่ได้ระบุ':sp.pct.toFixed(1)+'%'} (${sp.grade})`: 'ยังไม่มีข้อมูลเพียงพอ'}</li><li>การกำเริบใน 12 เดือน: moderate ${m} ครั้ง; นอนโรงพยาบาล ${s} ครั้ง</li><li>กลุ่ม ABE: ${abe??'ยังประเมินไม่ได้จากข้อมูลที่มี'}</li><li>SpO₂: ${readNum('spo2')===null?'—':readNum('spo2')+'%'} · RR: ${readNum('rr')??'—'} · HR: ${readNum('hr')??'—'} · BP: ${$('bp').value||'—'}</li><li>อาการสำคัญ: ${escapeHTML($('symptoms').value||'—')}</li><li>หมายเหตุ: ${escapeHTML($('notes').value||'—')}</li>${clinicSummary()}</ul><b>ข้อจำกัด:</b> ผลนี้เป็นการสรุปข้อมูลที่กรอก ไม่ใช่การวินิจฉัยหรือคำสั่งการรักษา ต้องตรวจสอบคุณภาพการทำ Spirometry ประวัติ อาการ โรคร่วม และดุลยพินิจของแพทย์`;
  updateABE();
}

function calculateThaiPEFR(){
 const sex=$('pefrSex').value, age=readNum('pefrAge'), h=readNum('pefrHeight'), measured=readNum('pefrMeasured');
 if(age===null||h===null||measured===null||age<10||age>92||h<121||h>185||measured<=0){$('pefrResult').innerHTML='<div class="result-placeholder">กรุณากรอกข้อมูลให้ครบ และอยู่ในช่วงอายุ 10–92 ปี ส่วนสูง 121–185 ซม. ตามช่วงข้อมูลการศึกษา</div>';return;}
 let p=sex==='M' ? -16.859+0.307*age+0.141*h-0.0018*age*age-0.001*age*h : -31.355+0.162*age-0.00084*age*age+0.391*h-0.00099*h*h-0.00072*age*h;
 const predicted=p*60, pct=measured/predicted*100;
 if(predicted<=0){$('pefrResult').innerHTML='<div class="result-placeholder">ค่าคาดการณ์ไม่สมเหตุสมผล กรุณาตรวจสอบข้อมูล</div>';return;}
 $('pefrResult').innerHTML=`<div class="result-card"><span>Predicted PEFR</span><strong>${predicted.toFixed(0)}</strong><p>L/min · ${p.toFixed(2)} L/s</p></div><div class="result-card"><span>Measured PEFR</span><strong>${measured.toFixed(0)}</strong><p>L/min</p></div><div class="result-card"><span>% Predicted PEFR</span><strong>${pct.toFixed(1)}%</strong><p>Measured ÷ Predicted × 100</p></div>`;
 updateSummary();
}
function updatePackYears(){
 const c=readNum('cigPerDay'), y=readNum('smokingYears');
 $('packYears').value=(c!==null&&y!==null&&c>=0&&y>=0)?((c/20)*y).toFixed(1):'';
 updateSummary();
}
function clinicSummary(){
 const tech=[...document.querySelectorAll('.technique:checked')].map(x=>x.value);
 const pairs=[['ชื่อผู้ป่วย',$('patientName').value],['HN',$('patientHN').value],['วันที่ประเมิน',$('visitDate').value],['สถานะสูบบุหรี่',$('smokingStatus').value],['Pack-years',$('packYears').value],['ยาพ่น/อุปกรณ์',$('inhalerName').value],['ความสม่ำเสมอการใช้ยา',$('adherence').value],['เทคนิคยาพ่นที่ประเมิน',tech.join(', ')],['ปัญหาการใช้ยาพ่น',$('inhalerIssue').value],['วันนัด',$('followDate').value],['แผนติดตาม',$('followPlan').value]];
 return pairs.map(([k,v])=>`<li>${k}: ${escapeHTML(v||'—')}</li>`).join('');
}

function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
$('calcSpiro').addEventListener('click',calculateSpirometry);
$('resetSpiro').addEventListener('click',()=>{['postFev1','postFvc','predFev1'].forEach(id=>$(id).value='');$('spiroResult').innerHTML='<div class="result-placeholder">กรอกข้อมูลและกดคำนวณเพื่อแสดงผล</div>';$('fevMetric').innerHTML='—<small>%</small>';$('fevMetricText').textContent='รอผล Spirometry';updateSummary();});
['moderateEx','severeEx'].forEach(id=>$(id).addEventListener('input',()=>{const el=$(id);if(Number(el.value)<0)el.value=0;updateEx();}));
['spo2','rr','hr','bp','symptoms','notes'].forEach(id=>$(id).addEventListener('input',updateSummary));
$('printReport').addEventListener('click',()=>window.print());
$('clearAll').addEventListener('click',()=>{if(!confirm('ต้องการล้างข้อมูลที่กรอกทั้งหมดหรือไม่?'))return;document.querySelectorAll('input').forEach(el=>{if(el.type==='radio')el.checked=false;else if(el.type==='number'||el.type==='text')el.value='';});$('moderateEx').value='0';$('severeEx').value='0';document.querySelectorAll('textarea').forEach(el=>el.value='');catAnswers=Array(8).fill(null);mmrcAnswer=null;document.querySelectorAll('.mmrc-option').forEach(el=>el.classList.remove('selected'));$('catTotal').innerHTML='0 <small>/ 40</small>' ;$('catInterpretation').textContent='โปรดตอบแบบประเมินให้ครบทั้ง 8 ข้อ';$('catMetric').innerHTML='—<small>/40</small>';$('catMetricText').textContent='ยังไม่ได้ประเมิน';updateMMRC();$('exTotal').innerHTML='0 <small>ครั้ง</small>';$('exInterpretation').textContent='ยังไม่มีประวัติการกำเริบที่ระบุ';$('spiroResult').innerHTML='<div class="result-placeholder">กรอกข้อมูลและกดคำนวณเพื่อแสดงผล</div>';$('fevMetric').innerHTML='—<small>%</small>';$('fevMetricText').textContent='รอผล Spirometry';updateABE();updateSummary();});

$('calcPefr').addEventListener('click',calculateThaiPEFR);
$('resetPefr').addEventListener('click',()=>{['pefrAge','pefrHeight','pefrMeasured'].forEach(id=>$(id).value='');$('pefrResult').innerHTML='<div class="result-placeholder">กรอกเพศ อายุ ส่วนสูง และ PEFR ที่วัดได้</div>';updateSummary();});
['cigPerDay','smokingYears'].forEach(id=>$(id).addEventListener('input',updatePackYears));
['patientName','patientHN','visitDate','smokingStatus','inhalerName','adherence','followDate','followPlan','inhalerIssue'].forEach(id=>$(id).addEventListener('input',updateSummary));
document.querySelectorAll('.technique').forEach(el=>el.addEventListener('change',updateSummary));

buildCAT();buildMMRC();updateCAT();updateMMRC();updateEx();updateSummary();
