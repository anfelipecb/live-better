import type { Recipe } from '@/types';

export const recipes: Recipe[] = [
  // ── Breakfast (4) ─────────────────────────────────────────────────────

  {
    id: 'recipe-protein-overnight-oats',
    name: 'Protein Overnight Oats',
    description:
      'Creamy overnight oats packed with protein powder and chia seeds for a grab-and-go breakfast.',
    category: 'breakfast',
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    calories: 420,
    macros: { protein: 35, carbs: 48, fat: 10 },
    // 35*4 + 48*4 + 10*9 = 140 + 192 + 90 = 422
    ingredients: [
      { name: 'Rolled oats', amount: 60, unit: 'g', category: 'grains' },
      { name: 'Protein powder (vanilla)', amount: 30, unit: 'g', category: 'protein' },
      { name: 'Chia seeds', amount: 10, unit: 'g', category: 'pantry' },
      { name: 'Almond milk', amount: 200, unit: 'ml', category: 'dairy' },
      { name: 'Banana', amount: 0.5, unit: 'medium', category: 'produce' },
      { name: 'Honey', amount: 1, unit: 'tsp', category: 'pantry' },
    ],
    steps: [
      'Mix oats, protein powder, and chia seeds in a jar.',
      'Pour in almond milk and stir until well combined.',
      'Slice banana on top and drizzle with honey.',
      'Seal the jar and refrigerate overnight (or at least 4 hours).',
    ],
    tags: ['high-protein', 'meal-prep', 'no-cook'],
    imageEmoji: '🥣',
  },

  {
    id: 'recipe-greek-yogurt-parfait',
    name: 'Greek Yogurt Parfait',
    description:
      'Layers of thick Greek yogurt, crunchy granola, and fresh berries for a protein-rich start.',
    category: 'breakfast',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 350,
    macros: { protein: 28, carbs: 40, fat: 8 },
    // 28*4 + 40*4 + 8*9 = 112 + 160 + 72 = 344
    ingredients: [
      { name: 'Greek yogurt (0% fat)', amount: 200, unit: 'g', category: 'dairy' },
      { name: 'Granola', amount: 40, unit: 'g', category: 'grains' },
      { name: 'Blueberries', amount: 60, unit: 'g', category: 'produce' },
      { name: 'Strawberries', amount: 60, unit: 'g', category: 'produce' },
      { name: 'Honey', amount: 1, unit: 'tsp', category: 'pantry' },
    ],
    steps: [
      'Spoon half the yogurt into a glass or bowl.',
      'Add a layer of granola and half the berries.',
      'Add remaining yogurt, top with the rest of the berries and granola.',
      'Drizzle with honey and serve immediately.',
    ],
    tags: ['high-protein', 'quick', 'no-cook'],
    imageEmoji: '🍓',
  },

  {
    id: 'recipe-egg-white-veggie-scramble',
    name: 'Egg White Veggie Scramble',
    description:
      'Fluffy egg whites scrambled with spinach, bell peppers, and mushrooms. Low fat, high protein.',
    category: 'breakfast',
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    calories: 280,
    macros: { protein: 32, carbs: 18, fat: 8 },
    // 32*4 + 18*4 + 8*9 = 128 + 72 + 72 = 272
    ingredients: [
      { name: 'Egg whites', amount: 200, unit: 'ml', category: 'protein' },
      { name: 'Baby spinach', amount: 50, unit: 'g', category: 'produce' },
      { name: 'Bell pepper', amount: 0.5, unit: 'medium', category: 'produce' },
      { name: 'Mushrooms', amount: 60, unit: 'g', category: 'produce' },
      { name: 'Whole wheat toast', amount: 1, unit: 'slice', category: 'grains' },
      { name: 'Olive oil spray', amount: 1, unit: 'spray', category: 'pantry' },
      { name: 'Salt & pepper', amount: 1, unit: 'pinch', category: 'spices' },
    ],
    steps: [
      'Heat a non-stick pan over medium heat with olive oil spray.',
      'Sauté diced bell pepper and mushrooms for 3 minutes until softened.',
      'Add spinach, stir until wilted, then pour in egg whites.',
      'Scramble gently until set. Season with salt and pepper, serve with toast.',
    ],
    tags: ['high-protein', 'low-fat', 'quick'],
    imageEmoji: '🍳',
  },

  {
    id: 'recipe-protein-smoothie-bowl',
    name: 'Protein Smoothie Bowl',
    description:
      'A thick, creamy smoothie bowl with frozen fruits, protein powder, and crunchy toppings.',
    category: 'breakfast',
    prepTime: 8,
    cookTime: 0,
    servings: 1,
    calories: 390,
    macros: { protein: 32, carbs: 50, fat: 6 },
    // 32*4 + 50*4 + 6*9 = 128 + 200 + 54 = 382
    ingredients: [
      { name: 'Frozen mixed berries', amount: 150, unit: 'g', category: 'produce' },
      { name: 'Protein powder (chocolate)', amount: 30, unit: 'g', category: 'protein' },
      { name: 'Banana (frozen)', amount: 0.5, unit: 'medium', category: 'produce' },
      { name: 'Almond milk', amount: 100, unit: 'ml', category: 'dairy' },
      { name: 'Granola', amount: 20, unit: 'g', category: 'grains' },
      { name: 'Chia seeds', amount: 5, unit: 'g', category: 'pantry' },
    ],
    steps: [
      'Blend frozen berries, banana, protein powder, and almond milk until thick and smooth.',
      'Pour into a bowl (the consistency should be thicker than a drinkable smoothie).',
      'Top with granola and chia seeds.',
      'Serve immediately before it melts.',
    ],
    tags: ['high-protein', 'no-cook', 'vegetarian'],
    imageEmoji: '🫐',
  },

  // ── Lunch (4) ─────────────────────────────────────────────────────────

  {
    id: 'recipe-chicken-quinoa-bowl',
    name: 'Chicken & Quinoa Power Bowl',
    description:
      'Grilled chicken breast over fluffy quinoa with roasted veggies and a lemon tahini drizzle.',
    category: 'lunch',
    prepTime: 10,
    cookTime: 25,
    servings: 1,
    calories: 520,
    macros: { protein: 45, carbs: 50, fat: 14 },
    // 45*4 + 50*4 + 14*9 = 180 + 200 + 126 = 506
    ingredients: [
      { name: 'Chicken breast', amount: 170, unit: 'g', category: 'protein' },
      { name: 'Quinoa (dry)', amount: 70, unit: 'g', category: 'grains' },
      { name: 'Broccoli florets', amount: 80, unit: 'g', category: 'produce' },
      { name: 'Cherry tomatoes', amount: 60, unit: 'g', category: 'produce' },
      { name: 'Cucumber', amount: 50, unit: 'g', category: 'produce' },
      { name: 'Tahini', amount: 1, unit: 'tbsp', category: 'pantry' },
      { name: 'Lemon juice', amount: 1, unit: 'tbsp', category: 'produce' },
      { name: 'Olive oil', amount: 1, unit: 'tsp', category: 'pantry' },
    ],
    steps: [
      'Cook quinoa according to package directions. Season chicken with salt, pepper, and olive oil.',
      'Grill or pan-sear chicken breast for 6-7 minutes per side until cooked through. Let rest, then slice.',
      'Roast broccoli at 200C for 12 minutes. Halve cherry tomatoes and dice cucumber.',
      'Assemble bowl with quinoa, chicken, and veggies. Drizzle with tahini mixed with lemon juice.',
    ],
    tags: ['high-protein', 'meal-prep', 'balanced'],
    imageEmoji: '🥗',
  },

  {
    id: 'recipe-turkey-avocado-wrap',
    name: 'Turkey & Avocado Wrap',
    description:
      'A whole-wheat wrap loaded with sliced turkey, creamy avocado, and crunchy veggies.',
    category: 'lunch',
    prepTime: 8,
    cookTime: 0,
    servings: 1,
    calories: 450,
    macros: { protein: 35, carbs: 38, fat: 18 },
    // 35*4 + 38*4 + 18*9 = 140 + 152 + 162 = 454
    ingredients: [
      { name: 'Sliced turkey breast', amount: 120, unit: 'g', category: 'protein' },
      { name: 'Whole wheat wrap', amount: 1, unit: 'large', category: 'grains' },
      { name: 'Avocado', amount: 0.5, unit: 'medium', category: 'produce' },
      { name: 'Romaine lettuce', amount: 30, unit: 'g', category: 'produce' },
      { name: 'Tomato', amount: 2, unit: 'slices', category: 'produce' },
      { name: 'Dijon mustard', amount: 1, unit: 'tsp', category: 'pantry' },
    ],
    steps: [
      'Lay the wrap flat and spread Dijon mustard across the center.',
      'Layer turkey slices, sliced avocado, lettuce, and tomato.',
      'Fold in the sides and roll tightly into a wrap.',
      'Slice in half diagonally and serve.',
    ],
    tags: ['high-protein', 'quick', 'no-cook'],
    imageEmoji: '🌯',
  },

  {
    id: 'recipe-salmon-poke-bowl',
    name: 'Salmon Poke Bowl',
    description:
      'Fresh cubed salmon over sushi rice with edamame, cucumber, avocado, and soy-sesame dressing.',
    category: 'lunch',
    prepTime: 15,
    cookTime: 15,
    servings: 1,
    calories: 530,
    macros: { protein: 38, carbs: 52, fat: 18 },
    // 38*4 + 52*4 + 18*9 = 152 + 208 + 162 = 522
    ingredients: [
      { name: 'Sushi-grade salmon', amount: 140, unit: 'g', category: 'protein' },
      { name: 'Sushi rice (dry)', amount: 75, unit: 'g', category: 'grains' },
      { name: 'Edamame (shelled)', amount: 50, unit: 'g', category: 'protein' },
      { name: 'Cucumber', amount: 60, unit: 'g', category: 'produce' },
      { name: 'Avocado', amount: 0.25, unit: 'medium', category: 'produce' },
      { name: 'Soy sauce (low sodium)', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Sesame oil', amount: 1, unit: 'tsp', category: 'pantry' },
      { name: 'Sesame seeds', amount: 1, unit: 'tsp', category: 'spices' },
    ],
    steps: [
      'Cook sushi rice according to package directions and let cool slightly.',
      'Cube the salmon into bite-size pieces. Toss with soy sauce and sesame oil.',
      'Dice cucumber and slice avocado. Thaw edamame if frozen.',
      'Assemble bowl: rice base, salmon, edamame, cucumber, and avocado. Sprinkle with sesame seeds.',
    ],
    tags: ['high-protein', 'omega-3', 'fresh'],
    imageEmoji: '🍣',
  },

  {
    id: 'recipe-mediterranean-chickpea-salad',
    name: 'Mediterranean Chickpea Salad',
    description:
      'A hearty salad with chickpeas, feta, olives, and sun-dried tomatoes in a lemon-herb vinaigrette.',
    category: 'lunch',
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    calories: 420,
    macros: { protein: 22, carbs: 48, fat: 16 },
    // 22*4 + 48*4 + 16*9 = 88 + 192 + 144 = 424
    ingredients: [
      { name: 'Canned chickpeas (drained)', amount: 150, unit: 'g', category: 'protein' },
      { name: 'Feta cheese', amount: 30, unit: 'g', category: 'dairy' },
      { name: 'Kalamata olives', amount: 20, unit: 'g', category: 'pantry' },
      { name: 'Sun-dried tomatoes', amount: 20, unit: 'g', category: 'produce' },
      { name: 'Cucumber', amount: 80, unit: 'g', category: 'produce' },
      { name: 'Red onion', amount: 20, unit: 'g', category: 'produce' },
      { name: 'Lemon juice', amount: 1, unit: 'tbsp', category: 'produce' },
      { name: 'Olive oil', amount: 1, unit: 'tbsp', category: 'pantry' },
      { name: 'Dried oregano', amount: 0.5, unit: 'tsp', category: 'spices' },
    ],
    steps: [
      'Rinse and drain chickpeas. Dice cucumber, red onion, and sun-dried tomatoes.',
      'Combine chickpeas, veggies, crumbled feta, and olives in a large bowl.',
      'Whisk together olive oil, lemon juice, and oregano for the dressing.',
      'Toss salad with dressing, season with salt and pepper, and serve.',
    ],
    tags: ['vegetarian', 'high-fiber', 'meal-prep', 'no-cook'],
    imageEmoji: '🫒',
  },

  // ── Dinner (4) ────────────────────────────────────────────────────────

  {
    id: 'recipe-grilled-chicken-sweet-potato',
    name: 'Grilled Chicken with Sweet Potato',
    description:
      'Juicy seasoned chicken breast paired with roasted sweet potato wedges and steamed green beans.',
    category: 'dinner',
    prepTime: 10,
    cookTime: 30,
    servings: 1,
    calories: 490,
    macros: { protein: 42, carbs: 50, fat: 12 },
    // 42*4 + 50*4 + 12*9 = 168 + 200 + 108 = 476
    ingredients: [
      { name: 'Chicken breast', amount: 170, unit: 'g', category: 'protein' },
      { name: 'Sweet potato', amount: 200, unit: 'g', category: 'produce' },
      { name: 'Green beans', amount: 100, unit: 'g', category: 'produce' },
      { name: 'Olive oil', amount: 1, unit: 'tbsp', category: 'pantry' },
      { name: 'Paprika', amount: 1, unit: 'tsp', category: 'spices' },
      { name: 'Garlic powder', amount: 0.5, unit: 'tsp', category: 'spices' },
      { name: 'Salt & pepper', amount: 1, unit: 'pinch', category: 'spices' },
    ],
    steps: [
      'Preheat oven to 200C. Cut sweet potato into wedges, toss with half the olive oil and paprika.',
      'Roast sweet potato wedges for 25-30 minutes, flipping halfway.',
      'Season chicken with garlic powder, salt, and pepper. Grill or pan-sear for 6-7 minutes per side.',
      'Steam green beans for 4 minutes until tender-crisp. Plate everything together and serve.',
    ],
    tags: ['high-protein', 'balanced', 'classic'],
    imageEmoji: '🍗',
  },

  {
    id: 'recipe-shrimp-stir-fry',
    name: 'Shrimp Stir Fry',
    description:
      'Quick and flavorful shrimp stir fry with colorful vegetables and a savory garlic-ginger sauce.',
    category: 'dinner',
    prepTime: 10,
    cookTime: 12,
    servings: 1,
    calories: 400,
    macros: { protein: 36, carbs: 40, fat: 10 },
    // 36*4 + 40*4 + 10*9 = 144 + 160 + 90 = 394
    ingredients: [
      { name: 'Shrimp (peeled)', amount: 170, unit: 'g', category: 'protein' },
      { name: 'Jasmine rice (dry)', amount: 65, unit: 'g', category: 'grains' },
      { name: 'Bell pepper', amount: 1, unit: 'medium', category: 'produce' },
      { name: 'Snap peas', amount: 60, unit: 'g', category: 'produce' },
      { name: 'Carrot', amount: 1, unit: 'medium', category: 'produce' },
      { name: 'Garlic', amount: 2, unit: 'cloves', category: 'produce' },
      { name: 'Fresh ginger', amount: 1, unit: 'tsp', category: 'produce' },
      { name: 'Soy sauce (low sodium)', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Sesame oil', amount: 1, unit: 'tsp', category: 'pantry' },
    ],
    steps: [
      'Cook rice according to package directions. Slice vegetables into thin strips.',
      'Heat sesame oil in a wok over high heat. Sear shrimp for 2 minutes per side, then remove.',
      'Stir fry garlic, ginger, and vegetables for 3-4 minutes until tender-crisp.',
      'Return shrimp to the wok, add soy sauce, toss to combine, and serve over rice.',
    ],
    tags: ['high-protein', 'quick', 'low-fat'],
    imageEmoji: '🍤',
  },

  {
    id: 'recipe-lean-beef-broccoli',
    name: 'Lean Beef & Broccoli',
    description:
      'Tender strips of lean beef stir-fried with broccoli in a rich oyster-soy glaze served over rice.',
    category: 'dinner',
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    calories: 510,
    macros: { protein: 42, carbs: 48, fat: 15 },
    // 42*4 + 48*4 + 15*9 = 168 + 192 + 135 = 495
    ingredients: [
      { name: 'Lean beef sirloin', amount: 170, unit: 'g', category: 'protein' },
      { name: 'Broccoli florets', amount: 150, unit: 'g', category: 'produce' },
      { name: 'Jasmine rice (dry)', amount: 65, unit: 'g', category: 'grains' },
      { name: 'Soy sauce (low sodium)', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Oyster sauce', amount: 1, unit: 'tbsp', category: 'pantry' },
      { name: 'Garlic', amount: 2, unit: 'cloves', category: 'produce' },
      { name: 'Cornstarch', amount: 1, unit: 'tsp', category: 'pantry' },
      { name: 'Vegetable oil', amount: 1, unit: 'tsp', category: 'pantry' },
    ],
    steps: [
      'Cook rice. Slice beef into thin strips and toss with cornstarch, soy sauce, and minced garlic.',
      'Heat oil in a wok over high heat. Sear beef strips for 2-3 minutes until browned. Remove.',
      'Add broccoli to the wok with a splash of water, cover and steam for 3 minutes.',
      'Return beef, add oyster sauce, toss until glazed and heated through. Serve over rice.',
    ],
    tags: ['high-protein', 'classic', 'balanced'],
    imageEmoji: '🥦',
  },

  {
    id: 'recipe-baked-salmon-asparagus',
    name: 'Baked Salmon with Asparagus',
    description:
      'Omega-3 rich salmon fillet baked with asparagus, lemon, and herbs on a single sheet pan.',
    category: 'dinner',
    prepTime: 8,
    cookTime: 18,
    servings: 1,
    calories: 480,
    macros: { protein: 40, carbs: 24, fat: 24 },
    // 40*4 + 24*4 + 24*9 = 160 + 96 + 216 = 472
    ingredients: [
      { name: 'Salmon fillet', amount: 170, unit: 'g', category: 'protein' },
      { name: 'Asparagus', amount: 150, unit: 'g', category: 'produce' },
      { name: 'Brown rice (dry)', amount: 50, unit: 'g', category: 'grains' },
      { name: 'Lemon', amount: 0.5, unit: 'medium', category: 'produce' },
      { name: 'Olive oil', amount: 1, unit: 'tbsp', category: 'pantry' },
      { name: 'Garlic', amount: 1, unit: 'clove', category: 'produce' },
      { name: 'Dried dill', amount: 0.5, unit: 'tsp', category: 'spices' },
      { name: 'Salt & pepper', amount: 1, unit: 'pinch', category: 'spices' },
    ],
    steps: [
      'Preheat oven to 200C. Cook brown rice according to package directions.',
      'Place salmon and trimmed asparagus on a lined baking sheet. Drizzle with olive oil.',
      'Season with minced garlic, dill, salt, pepper, and squeeze lemon over everything.',
      'Bake for 15-18 minutes until salmon flakes easily. Serve alongside rice.',
    ],
    tags: ['high-protein', 'omega-3', 'sheet-pan', 'low-carb'],
    imageEmoji: '🐟',
  },

  // ── Snack (3) ─────────────────────────────────────────────────────────

  {
    id: 'recipe-protein-energy-balls',
    name: 'Protein Energy Balls',
    description:
      'No-bake energy balls made with oats, protein powder, peanut butter, and dark chocolate chips.',
    category: 'snack',
    prepTime: 15,
    cookTime: 0,
    servings: 6,
    calories: 180,
    macros: { protein: 12, carbs: 18, fat: 7 },
    // 12*4 + 18*4 + 7*9 = 48 + 72 + 63 = 183
    ingredients: [
      { name: 'Rolled oats', amount: 100, unit: 'g', category: 'grains' },
      { name: 'Protein powder (chocolate)', amount: 40, unit: 'g', category: 'protein' },
      { name: 'Peanut butter', amount: 60, unit: 'g', category: 'pantry' },
      { name: 'Honey', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Dark chocolate chips', amount: 30, unit: 'g', category: 'pantry' },
      { name: 'Almond milk', amount: 2, unit: 'tbsp', category: 'dairy' },
    ],
    steps: [
      'Mix oats, protein powder, and chocolate chips in a bowl.',
      'Add peanut butter, honey, and almond milk. Stir until a sticky dough forms.',
      'Roll into 12 even balls (about 2 per serving) and place on a parchment-lined tray.',
      'Refrigerate for at least 30 minutes until firm. Store in the fridge for up to 5 days.',
    ],
    tags: ['high-protein', 'meal-prep', 'no-cook', 'portable'],
    imageEmoji: '🍫',
  },

  {
    id: 'recipe-cottage-cheese-berries',
    name: 'Cottage Cheese & Berries',
    description:
      'Simple high-protein snack of creamy cottage cheese topped with fresh berries and a drizzle of honey.',
    category: 'snack',
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    calories: 200,
    macros: { protein: 24, carbs: 18, fat: 3 },
    // 24*4 + 18*4 + 3*9 = 96 + 72 + 27 = 195
    ingredients: [
      { name: 'Cottage cheese (low fat)', amount: 200, unit: 'g', category: 'dairy' },
      { name: 'Mixed berries', amount: 80, unit: 'g', category: 'produce' },
      { name: 'Honey', amount: 1, unit: 'tsp', category: 'pantry' },
    ],
    steps: [
      'Scoop cottage cheese into a bowl.',
      'Top with fresh mixed berries.',
      'Drizzle with honey and serve immediately.',
    ],
    tags: ['high-protein', 'quick', 'low-fat', 'no-cook'],
    imageEmoji: '🍇',
  },

  {
    id: 'recipe-hummus-veggie-plate',
    name: 'Hummus & Veggie Plate',
    description:
      'Creamy hummus served with crunchy raw vegetables and whole wheat pita for dipping.',
    category: 'snack',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 260,
    macros: { protein: 10, carbs: 30, fat: 12 },
    // 10*4 + 30*4 + 12*9 = 40 + 120 + 108 = 268
    ingredients: [
      { name: 'Hummus', amount: 60, unit: 'g', category: 'pantry' },
      { name: 'Carrots', amount: 80, unit: 'g', category: 'produce' },
      { name: 'Cucumber', amount: 80, unit: 'g', category: 'produce' },
      { name: 'Bell pepper', amount: 0.5, unit: 'medium', category: 'produce' },
      { name: 'Whole wheat pita', amount: 0.5, unit: 'piece', category: 'grains' },
    ],
    steps: [
      'Cut carrots, cucumber, and bell pepper into sticks.',
      'Slice pita into triangles.',
      'Arrange veggies and pita around a bowl of hummus and serve.',
    ],
    tags: ['vegetarian', 'high-fiber', 'quick', 'no-cook'],
    imageEmoji: '🥕',
  },
];
