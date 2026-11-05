# Updates to do — qarrib app

Based on: `WhatsApp Audio 2026-11-01 at 21.23.09.ogg` (transcribed locally with Whisper, medium model) and the 3 handwritten photo notes in this folder.

## Voice memo transcript (Arabic, as transcribed)

> أنا عايزك بس يا صاحبي كده يعني جوه تفنط هالي شوية، بمعنى أنا بعطيلك دلوقت الأسعار. يعني مثلا واحد هيكتب إنه عايز يعلّق محلول وياخد علاج في محلول. طيب هو يدوس على علاج ومحلول مثلا بـ200 جنيه. طيب 200 جنيه بتقسم إزاي؟ 200 جنيه بتقسم: تركيب كانولا 50 وتعليق محلول 150. طيب عمل اختبار درب حقنة مع اختبار. طيب جوه بقى لما يجي يدخل يفنطها إزاي: ضرب حقنة بـ50 واختبار بـ70. فاهمني؟ فأنا الحاجة موجودة بس هو لما يدخل ميعرفش ده سعره كام وده سعره كام. تخيل مثلا هو مركّب كانولا بس، هو يدفع 200 جنيه؟ لا هو يدفع 150، فاهمني؟ تخيل هو مش عايز يعمل اختبار، هو هيدفع 120؟ لا هيدفع 50 بس، فاهمني؟

**Meaning:** right now a bundled service (e.g. "cannula + IV solution") only shows/charges one lump price. It needs to be itemized per procedure so that if a patient only takes part of the bundle, they're only charged for what they actually got.

---

## 1. Itemized pricing in the booking flow (top priority — from the voice memo)

- Break every bundled service into its component line items, each with its own price, shown to the patient before confirming.
- Price must auto-recalculate based on which components the patient actually selects (e.g. skip the test → pay only for the injection).
- Example from the memo: "Cannula + IV solution" (200) → Cannula insertion = 50, IV solution hookup = 150. "Injection + test" → Injection = 50, Test = 70.

> ✅ **Done (2026-11-05):** Component line items are implemented end-to-end — services carry a `components` list (admin can edit them in `set-prices.html`), the patient booking page shows each component with its price and recalculates the total live, and the order stores the patient's selected components as a snapshot. Seeded via `backend/src/seeders/serviceComponents.seeder.js` using the memo prices above. Flat-price fallback remains when a service has no components.

## 2. Service price list (from Photo 1 — `WhatsApp Image 2026-11-01 at 9.19.02 PM.jpeg`)

| Service (AR) | Service (EN) | Price (EGP) |
|---|---|---|
| ضرب حقنة | Injection | 50 |
| ضرب حقنة + اختبار | Injection + test | 100 |
| تركيب كانيولا + سوائل وعلاج | Cannula + IV fluids/meds | 500 |
| غيار جرح | Wound dressing | 50 |
| حقنة + بخار للأطفال | Injection + nebulizer (kids) | 100 |
| تركيب قطرة | IV drip install | 100 |
| وضع قطرة | IV drip placement | 50 |
| فك جبس/سلك | Cast/wire removal | 50 |
| تركيب كانيولا + اختبار | Cannula + test | 70 |
| تعويض سائل | Fluid replacement | 150 |
| عمل جلسة | Session | 200 |
| حل أنف | Nebulizer | 70 |

⚠️ The 500 EGP "cannula + fluids" bundle here doesn't match the 200 EGP example in the voice memo — confirm which numbers are current/correct.

## 3. Provider-set pricing + discount rule (from Photo 2 — `WhatsApp Image 2026-11-01 at 9.19.03 PM.jpeg`, intro paragraph)

- Checkup/visit ("الكشف") price is set per provider; no platform-wide discount by default.
- Provider can apply their own discount, which should auto-adjust the total shown to the patient.
- Photo 2 also has ~7 numbered points below this that were not reliably legible (handwriting too small/cursive even zoomed in) — touched on payments going through the app, account rules, and a rating/points system, but wording is not confirmed. Needs a clearer photo or manual transcription.

## 4. App/response protocol notes (from Photo 3 — `WhatsApp Image 2026-11-01 at 21.19.03.jpeg`, titled "برنامج")

- Add a classification field to the patient record (read as "BDF" — **unconfirmed**, please clarify what this stands for).
- Support 7 distinct alert/notification sounds for different case types.
- Confirm notifications are actually delivered to volunteers/responders (delivery confirmation, not just "sent").
- Build patient confidence that a qualified responder will arrive and handle the case properly.
- A page/flow to match the patient with the nearest available responder.
- Make sure response equipment (e.g. a fire extinguisher was mentioned) is ready so response time stays short.

---

## Confidence notes

- Items #1 and #2: confident (clear audio + clear photo).
- Item #3: intro paragraph confident, numbered sub-points **unconfirmed**.
- Item #4: overall gist confident, "BDF" term **unconfirmed**.
