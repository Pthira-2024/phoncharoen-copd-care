# PHONCHAROEN COPD CARE — Clinical Toolkit

ต้นแบบเว็บไซต์ภาษาไทยสำหรับประเมินและบันทึกผู้ป่วย COPD ในคลินิก OPD/NCD

## วิธีเปิดใช้งาน
1. แตกไฟล์ ZIP
2. เปิด `index.html` ด้วย Chrome, Edge หรือ Firefox
3. ใช้ปุ่ม “ส่งออก / บันทึกเป็น PDF” แล้วเลือก Save as PDF ในหน้าต่างพิมพ์

## เพิ่มในรุ่นนี้
- Thai Predicted PEFR: สมการ Dejsomritrutai et al. (2000), คำนวณ % predicted
- CAT ภาษาไทย: 8 ข้อ, 0–40 คะแนน; งาน validation ภาษาไทยรายงาน Cronbach's alpha 0.853 และ correlation กับ SGRQ r=0.652
- mMRC 0–4
- COPD Clinic record: smoking status, pack-years, inhaler/device, adherence, inhaler technique checklist, follow-up plan
- พิมพ์/บันทึก PDF พร้อมชื่อโรงพยาบาลพรเจริญและ watermark Cr.PHANTHIRA USANSA

## สมการ PEFR ไทย (ผลสมการเป็น L/s)
กำหนด A = อายุ (ปี), H = ส่วนสูง (ซม.)

ชาย:
PEFR = -16.859 + 0.307A + 0.141H - 0.0018A² - 0.001AH

หญิง:
PEFR = -31.355 + 0.162A - 0.00084A² + 0.391H - 0.00099H² - 0.00072AH

แปลง L/s เป็น L/min โดยคูณ 60
% predicted = measured PEFR / predicted PEFR × 100

ช่วงอายุและส่วนสูงในตัวอย่างงานวิจัย: อายุ 10–92 ปี, ส่วนสูง 121–185 ซม. เว็บไซต์จำกัดการคำนวณตามช่วงนี้เพื่อหลีกเลี่ยง extrapolation

## ข้อควรระวังสำคัญ
- สมการ PEFR นี้เป็น reference equation จากกลุ่มอาสาสมัครไทยสุขภาพดี lifetime nonsmokers ไม่ใช่สมการเฉพาะผู้ป่วย COPD และ PEFR ไม่ใช้ยืนยัน COPD หรือแทน post-bronchodilator FEV1/FVC
- CAT ภาษาไทยผ่านการศึกษาความตรงและความเชื่อมั่น แต่ข้อความในหน้าเว็บเป็นข้อความถอดความเพื่อการใช้งานต้นแบบ ควรใช้แบบ CAT ฉบับทางการที่ได้รับอนุญาตในบริการจริง
- GOLD 2026 ABE: กลุ่ม E เมื่อมี moderate หรือ severe exacerbation อย่างน้อย 1 ครั้งใน 12 เดือนที่ผ่านมา; กลุ่ม A/B เมื่อไม่มีเหตุการณ์ดังกล่าว โดยแยกตามอาการ (CAT/CAAT ≥10 หรือ mMRC ≥2)
- การจัดระดับ GOLD 1–4 ต้องใช้ FEV1 % predicted จาก spirometry ที่มีคุณภาพและสมการอ้างอิงที่เหมาะสม
- ข้อมูลทั้งหมดอยู่ใน browser ของเครื่องนี้ ไม่มีฐานข้อมูลหรือระบบล็อกอิน หากใช้งานเครื่องร่วมกันควรหลีกเลี่ยงข้อมูลระบุตัวบุคคล และปิดหน้า/ล้างข้อมูลหลังใช้งาน
- ตรวจสอบความถูกต้องทางคลินิก แนวทางของโรงพยาบาล และการคุ้มครองข้อมูลส่วนบุคคลก่อนใช้งานจริง

## เอกสารอ้างอิง
1. Dejsomritrutai W, et al. Reference Spirometric Values for Healthy Lifetime Nonsmokers in Thailand. J Med Assoc Thai. 2000;83:457–466.
2. Pothirat C, Kiatboonsri S, Chuchottaworn C. Validation of the new COPD assessment test translated into Thai in patients with COPD. BMC Pulm Med. 2014;14:193. doi:10.1186/1471-2466-14-193.
3. GOLD 2026 Report. Global Initiative for Chronic Obstructive Lung Disease.
