// Idempotent seed for itemized service components (per-procedure pricing).
// - Adds MISSING components to services; never touches ones that exist.
// - Never modifies basePrice / minPrice / maxPrice (admin owns those).
// Safe to run repeatedly: only fills gaps.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Service = require('../models/Service');
const connectDB = require('../config/database');
const { SERVICE_PRICE_CATALOG } = require('../utils/serviceCatalog');

// Shared component definitions (voice-memo prices: cannula 50 + solution 150;
// injection 50 + test 70). Key follows the setPrice key rules.
const SHARED = [
  { key: 'inject', nameAr: 'حقنة', name: 'Injection', price: 50 },
  { key: 'test', nameAr: 'اختبار', name: 'Test', price: 70 },
  { key: 'cannula', nameAr: 'تركيب كانيولا', name: 'Cannula insertion', price: 50 },
  { key: 'solution', nameAr: 'تعليق محلول', name: 'IV solution hookup', price: 150 },
  { key: 'drip_place', nameAr: 'وضع قطرة', name: 'Drip placement', price: 50 },
  { key: 'drip_install', nameAr: 'تركيب قطرة', name: 'Drip setup', price: 100 },
  { key: 'fluid', nameAr: 'تعويض سائل', name: 'Fluid replacement', price: 150 },
  { key: 'session', nameAr: 'جلسة علاج', name: 'Therapy session', price: 200 },
  { key: 'dressing', nameAr: 'غيار جرح', name: 'Wound dressing', price: 50 },
  { key: 'cast', nameAr: 'فك جبس أو سلك', name: 'Cast removal', price: 50 },
  { key: 'nebulizer', nameAr: 'حل أنف أو بخار', name: 'Nebulizer', price: 70 }
];
const byKey = (k) => SHARED.find((c) => c.key === k);

// Which components each service offers (subset of SHARED keys).
const SERVICE_COMPONENTS = {
  injection: ['inject', 'test', 'cannula', 'solution'],
  iv: ['cannula', 'solution', 'drip_place', 'drip_install', 'fluid'],
  wound: ['dressing', 'cast'],
  physio: ['session'],
  elderly: ['session', 'inject'],
  other: ['session', 'nebulizer', 'inject']
};

const seedServiceComponents = async () => {
  try {
    await connectDB();

    let touched = 0;
    for (const [frontKey, serviceDef] of Object.entries(SERVICE_PRICE_CATALOG)) {
      const wanted = (SERVICE_COMPONENTS[frontKey] || []).map(byKey).filter(Boolean);
      if (!wanted.length) continue;

      const service = await Service.findOne({
        $or: [{ name: serviceDef.name }, { nameAr: serviceDef.nameAr }, { category: serviceDef.category }]
      });
      if (!service) {
        console.log(`⚠️  No Service document for ${serviceDef.nameAr} (${serviceDef.name}) — run the admin set-price first`);
        continue;
      }

      const have = new Set((service.components || []).map((c) => c.key));
      const missing = wanted.filter((c) => !have.has(c.key));
      if (!missing.length) {
        console.log(`✅ ${serviceDef.nameAr}: components already complete (${have.size})`);
        continue;
      }

      service.components = [...(service.components || []), ...missing.map(({ key, nameAr, name, price }) => ({ key, nameAr, name, price }))];
      await service.save();
      touched += 1;
      console.log(`➕ ${serviceDef.nameAr}: added ${missing.map((c) => `${c.nameAr} ${c.price}`).join(', ')}`);
    }

    console.log(touched ? `✅ Seeded components on ${touched} service(s)` : '✅ Nothing to seed');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding service components:', error.message);
    process.exit(1);
  }
};

seedServiceComponents();
