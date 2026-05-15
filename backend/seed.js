const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const products = [
  // Tablets
  { name: 'Paracetamol 500mg', description: 'Pain reliever and fever reducer. Effective for headaches, muscle aches, and cold symptoms.', price: 25, category: 'Tablets', stock: 100, requiresPrescription: false, manufacturer: 'GSK', image: 'https://placehold.co/300x200/e8f5e9/2e7d32?text=Paracetamol' },
  { name: 'Amoxicillin 250mg', description: 'Antibiotic used to treat bacterial infections including chest, dental, and urinary tract infections.', price: 120, category: 'Tablets', stock: 50, requiresPrescription: true, manufacturer: 'Cipla', image: 'https://placehold.co/300x200/e3f2fd/1565c0?text=Amoxicillin' },
  { name: 'Ibuprofen 400mg', description: 'Anti-inflammatory pain reliever for arthritis, dental pain, and menstrual cramps.', price: 45, category: 'Tablets', stock: 90, requiresPrescription: false, manufacturer: 'Abbott', image: 'https://placehold.co/300x200/fff3e0/e65100?text=Ibuprofen' },
  { name: 'Metformin 500mg', description: 'Used to treat type 2 diabetes. Helps control blood sugar levels.', price: 35, category: 'Tablets', stock: 80, requiresPrescription: true, manufacturer: 'Sun Pharma', image: 'https://placehold.co/300x200/e8f5e9/1b5e20?text=Metformin' },
  { name: 'Aspirin 75mg', description: 'Blood thinner used to prevent heart attacks and strokes.', price: 20, category: 'Tablets', stock: 120, requiresPrescription: false, manufacturer: 'Bayer', image: 'https://placehold.co/300x200/fce4ec/880e4f?text=Aspirin' },
  { name: 'Cetirizine 10mg', description: 'Antihistamine for allergy relief. Treats hay fever, hives, and itching.', price: 30, category: 'Tablets', stock: 100, requiresPrescription: false, manufacturer: 'Cipla', image: 'https://placehold.co/300x200/e3f2fd/1565c0?text=Cetirizine' },
  { name: 'Omeprazole 20mg', description: 'Reduces stomach acid. Used for acid reflux and stomach ulcers.', price: 55, category: 'Tablets', stock: 75, requiresPrescription: false, manufacturer: 'AstraZeneca', image: 'https://placehold.co/300x200/fff8e1/f57f17?text=Omeprazole' },
  { name: 'Azithromycin 500mg', description: 'Antibiotic for respiratory infections, skin infections, and ear infections.', price: 150, category: 'Tablets', stock: 60, requiresPrescription: true, manufacturer: 'Pfizer', image: 'https://placehold.co/300x200/f3e5f5/6a1b9a?text=Azithromycin' },
  { name: 'Atorvastatin 10mg', description: 'Lowers cholesterol and reduces risk of heart disease and stroke.', price: 85, category: 'Tablets', stock: 70, requiresPrescription: true, manufacturer: 'Pfizer', image: 'https://placehold.co/300x200/e8eaf6/283593?text=Atorvastatin' },
  { name: 'Pantoprazole 40mg', description: 'Treats gastroesophageal reflux disease and stomach ulcers effectively.', price: 65, category: 'Tablets', stock: 85, requiresPrescription: false, manufacturer: 'Sun Pharma', image: 'https://placehold.co/300x200/e8f5e9/2e7d32?text=Pantoprazole' },

  // Syrups
  { name: 'Cough Syrup 100ml', description: 'Relieves dry and wet cough. Soothes throat irritation and reduces mucus.', price: 85, category: 'Syrups', stock: 75, requiresPrescription: false, manufacturer: 'Benadryl', image: 'https://placehold.co/300x200/fce4ec/880e4f?text=Cough+Syrup' },
  { name: 'Antacid Syrup 170ml', description: 'Fast relief from acidity, heartburn, and indigestion.', price: 65, category: 'Syrups', stock: 80, requiresPrescription: false, manufacturer: 'Digene', image: 'https://placehold.co/300x200/e8f5e9/1b5e20?text=Antacid' },
  { name: 'Paracetamol Syrup 60ml', description: 'Fever and pain relief syrup for children. Strawberry flavored.', price: 45, category: 'Syrups', stock: 90, requiresPrescription: false, manufacturer: 'Calpol', image: 'https://placehold.co/300x200/fce4ec/c62828?text=Paracetamol+Syrup' },
  { name: 'Iron Tonic 200ml', description: 'Iron and vitamin supplement syrup for anemia and weakness.', price: 110, category: 'Syrups', stock: 60, requiresPrescription: false, manufacturer: 'Haemup', image: 'https://placehold.co/300x200/ffebee/b71c1c?text=Iron+Tonic' },
  { name: 'Amoxicillin Syrup 60ml', description: 'Antibiotic suspension for children with bacterial infections.', price: 95, category: 'Syrups', stock: 50, requiresPrescription: true, manufacturer: 'Cipla', image: 'https://placehold.co/300x200/e3f2fd/0d47a1?text=Amoxicillin+Syrup' },
  { name: 'Vitamin B Complex Syrup', description: 'Complete B vitamin supplement for energy and nerve health.', price: 130, category: 'Syrups', stock: 70, requiresPrescription: false, manufacturer: 'HealthVit', image: 'https://placehold.co/300x200/fff8e1/e65100?text=Vitamin+B' },
  { name: 'Lactulose Syrup 100ml', description: 'Treats constipation by softening stools and promoting bowel movement.', price: 75, category: 'Syrups', stock: 55, requiresPrescription: false, manufacturer: 'Duphalac', image: 'https://placehold.co/300x200/f1f8e9/33691e?text=Lactulose' },

  // Injections
  { name: 'Insulin Injection', description: 'Rapid-acting insulin for diabetes management. Requires prescription.', price: 450, category: 'Injections', stock: 30, requiresPrescription: true, manufacturer: 'Novo Nordisk', image: 'https://placehold.co/300x200/f3e5f5/6a1b9a?text=Insulin' },
  { name: 'Vitamin B12 Injection', description: 'Treats vitamin B12 deficiency and pernicious anemia.', price: 180, category: 'Injections', stock: 40, requiresPrescription: true, manufacturer: 'Abbott', image: 'https://placehold.co/300x200/e8eaf6/1a237e?text=B12+Injection' },
  { name: 'Diclofenac Injection 3ml', description: 'Fast-acting pain relief injection for severe muscle and joint pain.', price: 55, category: 'Injections', stock: 60, requiresPrescription: true, manufacturer: 'Voveran', image: 'https://placehold.co/300x200/fbe9e7/bf360c?text=Diclofenac' },
  { name: 'Ondansetron Injection 2ml', description: 'Prevents nausea and vomiting after surgery or chemotherapy.', price: 95, category: 'Injections', stock: 35, requiresPrescription: true, manufacturer: 'Zofran', image: 'https://placehold.co/300x200/e0f2f1/004d40?text=Ondansetron' },
  { name: 'Dexamethasone Injection', description: 'Corticosteroid injection for severe allergic reactions and inflammation.', price: 120, category: 'Injections', stock: 25, requiresPrescription: true, manufacturer: 'Cadila', image: 'https://placehold.co/300x200/fce4ec/880e4f?text=Dexamethasone' },
  { name: 'Tetanus Toxoid Injection', description: 'Vaccine to prevent tetanus infection after injury or wound.', price: 85, category: 'Injections', stock: 50, requiresPrescription: false, manufacturer: 'Serum Institute', image: 'https://placehold.co/300x200/e8f5e9/2e7d32?text=Tetanus' },

  // Skincare
  { name: 'Moisturizing Cream 50g', description: 'Dermatologist-tested moisturizer for dry and sensitive skin.', price: 220, category: 'Skincare', stock: 60, requiresPrescription: false, manufacturer: 'CeraVe', image: 'https://placehold.co/300x200/e0f7fa/006064?text=Moisturizer' },
  { name: 'Sunscreen SPF 50', description: 'Broad spectrum UVA/UVB protection. Water resistant formula.', price: 399, category: 'Skincare', stock: 55, requiresPrescription: false, manufacturer: 'Neutrogena', image: 'https://placehold.co/300x200/fffde7/f9a825?text=Sunscreen' },
  { name: 'Acne Gel 15g', description: 'Clindamycin gel for acne treatment. Reduces pimples and blackheads.', price: 175, category: 'Skincare', stock: 70, requiresPrescription: false, manufacturer: 'Clindac', image: 'https://placehold.co/300x200/fce4ec/ad1457?text=Acne+Gel' },
  { name: 'Antifungal Cream 20g', description: 'Treats ringworm, athletes foot, and other fungal skin infections.', price: 145, category: 'Skincare', stock: 65, requiresPrescription: false, manufacturer: 'Candid', image: 'https://placehold.co/300x200/f3e5f5/4a148c?text=Antifungal' },
  { name: 'Calamine Lotion 100ml', description: 'Soothes itching, rashes, and sunburn. Gentle on sensitive skin.', price: 90, category: 'Skincare', stock: 80, requiresPrescription: false, manufacturer: 'Lacto Calamine', image: 'https://placehold.co/300x200/fce4ec/c62828?text=Calamine' },
  { name: 'Hydrocortisone Cream 15g', description: 'Relieves skin inflammation, eczema, and allergic skin reactions.', price: 130, category: 'Skincare', stock: 50, requiresPrescription: false, manufacturer: 'GSK', image: 'https://placehold.co/300x200/e8f5e9/1b5e20?text=Hydrocortisone' },
  { name: 'Aloe Vera Gel 100g', description: 'Natural soothing gel for burns, sunburn, and skin irritation.', price: 160, category: 'Skincare', stock: 90, requiresPrescription: false, manufacturer: 'Patanjali', image: 'https://placehold.co/300x200/e8f5e9/2e7d32?text=Aloe+Vera' },
  { name: 'Kojic Acid Soap', description: 'Skin brightening soap that reduces dark spots and pigmentation.', price: 199, category: 'Skincare', stock: 75, requiresPrescription: false, manufacturer: 'Kojic', image: 'https://placehold.co/300x200/fff8e1/f57f17?text=Kojic+Soap' },

  // Equipment
  { name: 'Digital Thermometer', description: 'Fast and accurate digital thermometer with fever alert. Suitable for all ages.', price: 350, category: 'Equipment', stock: 40, requiresPrescription: false, manufacturer: 'Omron', image: 'https://placehold.co/300x200/e8eaf6/283593?text=Thermometer' },
  { name: 'Blood Pressure Monitor', description: 'Automatic upper arm blood pressure monitor with memory function.', price: 1299, category: 'Equipment', stock: 20, requiresPrescription: false, manufacturer: 'Omron', image: 'https://placehold.co/300x200/fbe9e7/bf360c?text=BP+Monitor' },
  { name: 'Pulse Oximeter', description: 'Measures blood oxygen level and pulse rate. Compact and portable.', price: 799, category: 'Equipment', stock: 35, requiresPrescription: false, manufacturer: 'Dr. Trust', image: 'https://placehold.co/300x200/e3f2fd/0d47a1?text=Oximeter' },
  { name: 'Glucometer Kit', description: 'Blood glucose monitoring kit with 25 test strips included.', price: 999, category: 'Equipment', stock: 25, requiresPrescription: false, manufacturer: 'Accu-Chek', image: 'https://placehold.co/300x200/fff3e0/e65100?text=Glucometer' },
  { name: 'Nebulizer Machine', description: 'Converts liquid medicine into mist for asthma and respiratory treatment.', price: 1899, category: 'Equipment', stock: 15, requiresPrescription: false, manufacturer: 'Philips', image: 'https://placehold.co/300x200/e0f7fa/006064?text=Nebulizer' },
  { name: 'Heating Pad', description: 'Electric heating pad for muscle pain, back pain, and joint relief.', price: 649, category: 'Equipment', stock: 30, requiresPrescription: false, manufacturer: 'Beurer', image: 'https://placehold.co/300x200/fbe9e7/bf360c?text=Heating+Pad' },
  { name: 'Weighing Scale', description: 'Digital body weight scale with BMI calculation. Accurate to 0.1kg.', price: 899, category: 'Equipment', stock: 22, requiresPrescription: false, manufacturer: 'Omron', image: 'https://placehold.co/300x200/e8eaf6/283593?text=Weighing+Scale' },
  { name: 'Surgical Mask Box (50pcs)', description: 'Disposable 3-ply surgical masks for protection against dust and germs.', price: 249, category: 'Equipment', stock: 100, requiresPrescription: false, manufacturer: '3M', image: 'https://placehold.co/300x200/e3f2fd/1565c0?text=Surgical+Mask' },

  // Other
  { name: 'Hand Sanitizer 500ml', description: 'kills 99.9% of germs and bacteria. Alcohol based formula.', price: 120, category: 'Other', stock: 150, requiresPrescription: false, manufacturer: 'Dettol', image: 'https://placehold.co/300x200/e0f7fa/006064?text=Sanitizer' },
  { name: 'Face Mask N95', description: 'High filtration N95 respirator mask for protection against airborne particles.', price: 299, category: 'Other', stock: 100, requiresPrescription: false, manufacturer: '3M', image: 'https://placehold.co/300x200/e8eaf6/283593?text=N95+Mask' },
  { name: 'Cotton Bandage Roll', description: 'Soft cotton bandage for wound dressing and support.', price: 45, category: 'Other', stock: 200, requiresPrescription: false, manufacturer: 'Elastoplast', image: 'https://placehold.co/300x200/fafafa/424242?text=Bandage' },
  { name: 'Antiseptic Liquid 100ml', description: 'Dettol antiseptic liquid for wound cleaning and disinfection.', price: 85, category: 'Other', stock: 120, requiresPrescription: false, manufacturer: 'Dettol', image: 'https://placehold.co/300x200/e8f5e9/2e7d32?text=Antiseptic' },
  { name: 'First Aid Kit', description: 'Complete first aid kit with bandages, antiseptic, scissors and more.', price: 599, category: 'Other', stock: 40, requiresPrescription: false, manufacturer: 'Johnson', image: 'https://placehold.co/300x200/ffebee/c62828?text=First+Aid' },

  // Vitamins
  { name: 'Vitamin C 1000mg', description: 'Immune system booster. Antioxidant supplement for daily health maintenance.', price: 180, category: 'Vitamins', stock: 200, requiresPrescription: false, manufacturer: 'HealthVit', image: 'https://placehold.co/300x200/fff8e1/f57f17?text=Vitamin+C' },
  { name: 'Multivitamin Tablets', description: 'Complete daily multivitamin with 23 essential vitamins and minerals.', price: 299, category: 'Vitamins', stock: 150, requiresPrescription: false, manufacturer: 'Centrum', image: 'https://placehold.co/300x200/f9fbe7/558b2f?text=Multivitamin' },
  { name: 'Vitamin D3 60000 IU', description: 'Weekly vitamin D supplement for bone health and immunity.', price: 220, category: 'Vitamins', stock: 110, requiresPrescription: false, manufacturer: 'Sun Pharma', image: 'https://placehold.co/300x200/fff8e1/f9a825?text=Vitamin+D3' },
  { name: 'Omega 3 Fish Oil', description: 'Heart health supplement with EPA and DHA fatty acids.', price: 350, category: 'Vitamins', stock: 90, requiresPrescription: false, manufacturer: 'Himalaya', image: 'https://placehold.co/300x200/e3f2fd/1565c0?text=Omega+3' },
  { name: 'Calcium + Vitamin D', description: 'Bone strengthening supplement. Prevents osteoporosis and fractures.', price: 265, category: 'Vitamins', stock: 130, requiresPrescription: false, manufacturer: 'Shelcal', image: 'https://placehold.co/300x200/fafafa/424242?text=Calcium+D' },
  { name: 'Zinc 50mg Tablets', description: 'Boosts immunity and supports wound healing and skin health.', price: 145, category: 'Vitamins', stock: 160, requiresPrescription: false, manufacturer: 'HealthVit', image: 'https://placehold.co/300x200/e8f5e9/2e7d32?text=Zinc' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany();
  await Product.deleteMany();

  await User.create([
    { name: 'Admin User', email: 'admin@pharmacy.com', password: 'admin123', role: 'admin' },
    { name: 'John Doe', email: 'john@example.com', password: 'user123', role: 'user' },
  ]);

  await Product.insertMany(products);
  console.log('Database seeded successfully!');
  console.log('Admin: admin@pharmacy.com / admin123');
  console.log('User:  john@example.com / user123');
  process.exit();
}

seed().catch((err) => { console.error(err); process.exit(1); });
