const getIKImage = (filename) => `https://ik.imagekit.io/xtsxmvsu4/Products/${filename}?tr=w-1200,q-80`;

export const products = [
  {
    id: 'p1',
    name: 'Multi-Function Manual Garlic Presser',
    price: 249,
    originalPrice: 499,
    hasOffer: true,
    category: 'Kitchen Utilities',
    longDescription: 'Say goodbye to the messy, tedious task of chopping garlic by hand. The Multi-Function Manual Garlic Presser is your ultimate kitchen companion, designed to make garlic preparation effortless, fast, and hygienic. Built with a premium stainless steel curved press plate and a comfortable ergonomic black handle, this tool lets you mince, crush, and press garlic cloves in a single rocking motion — no peeling required! The semi-circular rocking design evenly distributes pressure across the entire surface, giving you consistently fine garlic paste every time. Whether you are preparing a quick stir-fry, marinating meats, or making fresh garlic bread, this presser delivers restaurant-quality results right in your kitchen. The perforated stainless steel plate effortlessly presses juice and pulp through tiny holes, producing perfectly minced garlic in seconds. Unlike traditional squeezers, this presser is easy to rinse clean under running water, making maintenance a breeze. Durable, rust-resistant, and compact, it fits neatly in any kitchen drawer. A must-have tool that upgrades every cooking experience — from everyday meals to special occasions.',
    images: [getIKImage('p11.png'), getIKImage('p12.png')],
    features: [
      'Stainless steel press plate. Rust - proof, food - safe, and built to last for years',
      'Rocking motion design. One smooth rock crushes garlic evenly and quickly',
      'Ergonomic curved handle. Non- slip grip for effortless, pain - free pressing',
      'Easy rinse cleaning. Dishwasher - safe design cleans in seconds, zero residue'
    ],
    advantages: [
      '10x faster than chopping. Fresh minced garlic ready in under 10 seconds flat',
      'No peeling needed. Press unpeeled cloves directly — saves time and mess',
      'Odour-free hands. No direct contact means no stubborn garlic smell on skin',
      'Perfect for every dish. Ideal for curries, pastas, marinades, chutneys, and more'
    ],
    showOnFrontPage: true
  },
  {
    id: 'p2',
    name: '2 in 1 Oil Sprayer and Dispenser',
    price: 349,
    originalPrice: 599,
    hasOffer: true,
    category: 'Kitchen Utilities',
    longDescription: "Upgrade your kitchen with this 2 in 1 Oil Sprayer and Dispenser, designed for convenience and healthier cooking. This versatile bottle allows you to both spray and pour oil, giving you full control over the quantity used. Perfect for cooking, grilling, baking, and salad dressing, it helps reduce excess oil consumption while enhancing flavor. The fine mist spray ensures even distribution, making it ideal for air frying and non-stick cooking. Made from high-quality, food-grade materials, it is safe, durable, and easy to use. The transparent body lets you monitor oil levels, while the ergonomic design provides a comfortable grip. Its leak-proof construction prevents spills and mess, keeping your kitchen clean. Easy to refill and clean, this oil dispenser is a practical addition to any modern kitchen, helping you cook smarter, healthier, and more efficiently every day.",
    images: [getIKImage('p02_1.png'),getIKImage('p02_2.png'),getIKImage('p02_3.png')],
    features: [
      'Dual function design allows spraying and pouring from one bottle',
      'Fine mist spray ensures even oil distribution for cooking',
      'Leak- proof structure prevents spills and keeps kitchen clean always',
      'Transparent body helps monitor oil levels easily and quickly'
    ],
    advantages: [
      'Helps control oil usage for healthier cooking and better lifestyle',
      'Perfect for air frying, grilling, baking, and daily cooking',
      'Reduces mess and keeps kitchen neat and organized always',
      'Easy to use, refill, and clean for everyday convenience'
    ],
    showOnFrontPage: false
  },
  {
    id: 'p3',
    name: 'Portable Mesh Nebulizer for Adults & Kids',
    price: 399,
    originalPrice: 999,
    hasOffer: true,
    category: 'Health & Care',
    longDescription: "Experience fast and effective respiratory relief with this Portable Mesh Nebulizer, designed for both adults and kids. Using advanced mesh technology, it converts liquid medication into a fine mist that reaches deep into the lungs for better absorption and quicker results. Its ultra-quiet operation ensures a comfortable and stress-free experience, especially for children and elderly users. Compact and lightweight, this nebulizer is perfect for home use, travel, or emergencies. The ergonomic design allows easy handling, while the one-button operation makes it simple for anyone to use. It comes with multiple mask sizes and a mouthpiece, ensuring suitability for all age groups. The device is energy-efficient and can be powered via USB or batteries, offering maximum convenience. Ideal for asthma, cough, and other respiratory conditions, this nebulizer is a reliable solution for everyday breathing care.",
    images: [getIKImage('p03_1.png'), getIKImage('p03_2.png'), getIKImage('p03_3.png')],
    features: [
      'Advanced mesh technology delivers fine mist for efficient medication absorption',
      'Ultra- quiet operation ensures peaceful usage for kids and elderly',
      'Compact portable design perfect for travel and emergency use anytime',
      'Dual power options support USB and battery for flexible usage'
    ],
    advantages: [
      'Provides quick relief from asthma, cough, and breathing difficulties',
      'Easy to use design suitable for all age groups',
      'Portable size allows use anywhere anytime without inconvenience',
      'Silent operation ensures comfortable therapy without noise disturbance'
    ],
    showOnFrontPage: true
  },
  {
    id: 'p4',
    name: 'Dishwashing Hand Gloves',
    price: 149,
    originalPrice: 499,
    hasOffer: true,
    category: 'Kitchen Utilities',
    longDescription: 'Non-slip, waterproof cleaning gloves with a built-in elastic grip and PEVC protective layer for safe, comfortable use. Designed with durable nylon fiber and a powerful cleaning wire, they easily remove stubborn stains without scratching surfaces. Multi-functional for dishwashing, kitchen cleaning, and even heat protection, these reusable gloves are easy to wash and come with a convenient hanging loop.',
    images: [
      getIKImage('gloves1.jpg'),
      getIKImage('gloves2.jpg'),
      getIKImage('gloves3.jpg')
    ],
    features: [
      'Smart Grip Anti-Slip Technology',
      'Scratch-Free Power Scrub Layer',
      'Dual Protection Design',
      'Quick-Dry & Odor-Resistant Material'
    ],
    advantages: [
      'Protects hands from chemicals, heat, and dirt during cleaning.',
      'Built-in scrub removes tough stains quickly without extra effort.',
      'Saves time by combining gloves and scrubber into one tool.',
      'Reusable design reduces cost and avoids frequent replacement needs.'
    ],
    showOnFrontPage: true
  },
  {
    id: 'p5',
    name: 'Manual Food Chopper Vegetable Cutter for Guacamole, Coleslaw, Indian Cooking',
    price: 399,
    originalPrice: 699,
    hasOffer: true,
    category: 'Kitchen Utilities',
    longDescription: "Make food preparation faster and easier with this Manual Food Chopper, a must-have kitchen tool for every home. Designed for convenience, this compact vegetable cutter helps you quickly chop onions, garlic, vegetables, fruits, and even small portions of meat without electricity. The sharp stainless steel blades ensure efficient and uniform cutting, while the sturdy hand-press mechanism delivers effortless operation. Its transparent container lets you monitor the chopping process, ensuring perfect results every time. Ideal for preparing guacamole, coleslaw, salads, and more, this chopper saves time and reduces kitchen mess. The anti-slip base provides stability during use, and the detachable parts make cleaning quick and hassle-free. Compact and lightweight, it is perfect for small kitchens, travel, or outdoor cooking. Upgrade your cooking experience with this practical, durable, and user-friendly food chopper designed for everyday convenience.",
    images: [
      getIKImage('p05_1.png'),
      getIKImage('p05_2.png'),
      getIKImage('p05_3.png')
    ],
    features: [
      'Powerful hand - press mechanism ensures quick chopping without electricity needed',
      'Sharp stainless steel blades deliver precise and uniform cutting results',
      'Transparent container allows easy monitoring during chopping process always',
      'Detachable parts enable quick cleaning and convenient storage after use'
    ],
    advantages: [
      'Saves time during food preparation for busy daily cooking routine',
      'No electricity required making it perfect for outdoor or travel',
      'Easy to use design suitable for beginners and professionals alike',
      'Reduces effort while chopping vegetables, fruits, and small meat pieces'
    ],
    showOnFrontPage: false
  },
  {
    id: 'p6',
    name: 'Over Door Hook Hanger',
    price: 229,
    originalPrice: 399,
    hasOffer: true,
    category: 'Home Accessories',
    longDescription: "Upgrade your home organization with this sleek Over Door Hanger made from premium stainless steel. Designed to maximize unused space, this hanger easily fits over most standard doors without the need for drilling or tools. Its sturdy construction ensures durability and long-lasting performance, while the smooth polished finish adds a modern touch to any room. Featuring multiple hooks, it provides ample space to hang coats, bags, belts, scarves, and more, keeping your essentials neatly arranged and easily accessible. The anti-slip ball tips protect your items from damage and prevent them from falling off. Ideal for bedrooms, bathrooms, or entryways, this versatile door rack helps reduce clutter and keeps your living space tidy. Whether for daily use or extra storage, it is a practical and stylish solution for every home. Perfect for small spaces and busy lifestyles.",
    images: [getIKImage('p06_1.png'), getIKImage('p06_2.png'), getIKImage('p06_3.png')],
    features: [
      'Space - saving design maximizes unused door space efficiently and neatly',
      'Strong stainless steel build ensures durability and long - lasting performance',
      'Anti - slip ball ends prevent items from falling and damage',
      'Tool - free installation allows quick setup without drilling or effort'
    ],
    advantages: [
      'Keeps your room organized and clutter - free with minimal effort',
      'Perfect for small spaces where storage options are limited',
      'Easy to install and remove without damaging your doors',
      'Provides quick access to daily essentials like bags and clothes'
    ],
    showOnFrontPage: true
  },
  {
    id: 'p7',
    name: '3 in 1 Knife Sharpener with Easy-Grip Handle & Non-Slip Rubber Base',
    price: 299,
    originalPrice: 599,
    hasOffer: true,
    category: 'Kitchen Utilities',
    longDescription: "Restore your dull kitchen knives to razor-sharp perfection in seconds with the 3 in 1 Knife Sharpener. Featuring a professional 3-stage sharpening system — coarse, fine, and polishing — it works on all types of blades including chef knives, serrated knives, and pocket knives. The ergonomic red grip handle offers firm, comfortable control, while the non-slip rubber base keeps the sharpener stable on any surface. Safe, fast, and beginner-friendly — just a few strokes and your knives are kitchen-ready again.",
    images: [getIKImage('p07_1.png'), getIKImage('p07_2.png'), getIKImage('p07_3.png')],
    features: [
      '3 - stage sharpening system. Coarse, fine, and polish stages for any blade',
      'Ergonomic easy - grip handle. Non - slip red grip for safe and comfortable sharpening',
      'Non - slip rubber base. Stays firmly on countertop for stable, safe use',
      'Works on all knife types. Chef, serrated, pocket knives — sharpens them all',
    ],
    advantages: [
      'Sharp knives in seconds. Just 3–5 strokes restores a razor - sharp edge instantly',
      'Extends knife life span. Regular sharpening saves money on new knives',
      'Safer cooking every day. Sharp blades cut cleaner and reduce kitchen accidents',
      'Beginner - friendly design. No skill needed — anyone can sharpen like a pro',
    ],
    showOnFrontPage: true
  },
  {
    id: 'p8',
    name: 'Gas Saver Burner Stand | Gas Saver Jali | Windproof Gas Saver Stand',
    price: 299,
    originalPrice: 499,
    hasOffer: true,
    category: 'Kitchen Utilities',
    longDescription: "Cut your gas bills in half with the Gas Saver Burner Stand — a smart, stainless steel wind shield designed to concentrate flame heat directly onto your cookware. By blocking wind and reflecting heat inward, it dramatically reduces gas consumption while cooking faster. Made from high-grade stainless steel, it fits all standard gas burners and is built to handle high temperatures safely. Lightweight, easy to place, and simple to clean — it is the most affordable upgrade for every Indian kitchen. Save gas, save money, cook smarter.",
    images: [getIKImage('p08_1.png'), getIKImage('p08_2.png'), getIKImage('p08_3.png')],
    features: [
      'Windproof heat shield design',
      'Universal burner compatibility',
      'Premium stainless steel body',
      'Reflective inner surface',
      'Bounces heat upward to cook food up to 30 % faster'
    ],
    advantages: [
      'Cuts gas bills significantly',
      'Faster cooking every day',
      'Works in windy conditions',
      'Zero - effort maintenance',
      'Easy wipe - clean surface, no tools needed to install'
    ],
    showOnFrontPage: false
  },
  {
    id: 'p9',
    name: 'Jade Roller & Gua Sha Facial Massager Set',
    price: 399,
    originalPrice: 599,
    hasOffer: true,
    category: 'Health & Care',
    longDescription: "Bring the luxury of a professional facial massage into your daily skincare routine. This Jade Roller & Gua Sha set is crafted from 100% natural green jade stone, known for its cooling and healing properties. The dual-ended roller glides smoothly over the face, boosting blood circulation, reducing puffiness, and helping skincare products absorb deeper into the skin. The Gua Sha stone targets fine lines, jaw tension, and facial contour. Together, they deliver a spa-level glow from the comfort of your home — naturally, daily, effortlessly.",
    images: [getIKImage('p09_1.png'), getIKImage('p09_2.png'), getIKImage('p09_3.png')],
    features: [
      '100 % natural jade stone. Authentic cooling jade soothes and calms skin instantly',
      'Dual - ended roller design. Large end for face, small end for eyes and nose',
      'Gua sha sculpting tool. Contours jawline, cheekbones, and neck with ease',
      'Gold - plated steel frame. Premium rust - free frame for smooth, noiseless rolling',
    ],
    advantages: [
      'Reduces puffiness naturally. Cool jade drains fluid and de - puffs face fast',
      'Boosts serum absorption. Rolling pushes serums deeper for maximum benefit',
      '5 - minute daily ritual. Visible glow and lift with just minutes a day',
      'Perfect self - care gift. Elegant set loved by skincare enthusiasts worldwide',
    ],
    showOnFrontPage: true
  },
  {
    id: 'p10',
    name: 'Quick Dry Water Absorbing Rectangular Silicon Floor Mat',
    price: 199,
    originalPrice: 399,
    hasOffer: true,
    category: 'Home Accessories',
    longDescription: "Upgrade your bathroom with the Quick Dry Water Absorbing Silicon Floor Mat — designed to keep your floors safe, clean, and dry in seconds. Made from premium super-absorbent silicon, it soaks up water instantly the moment you step out of the shower. Unlike regular fabric mats, this one air-dries within minutes, staying fresh and odour-free all day. The non-slip rubber base grips tightly to wet tiles, preventing slips and falls. Lightweight, easy to clean, and built to last — simply rinse under tap water and it's ready to use again.Its elegant dual- tone oval design adds a modern touch to any bathroom décor.",
    images: [getIKImage('p10_1.png'), getIKImage('p10_2.png')],
    features: [
      'Super - absorbent silicon surface. Instantly soaks up water with one single step',
      'Ultra - fast air drying. Dries completely in minutes, stays fresh always',
      'Anti - slip rubber base. Grips wet tiles firmly for maximum safety',
      'Odour - free eco material. Non - toxic, hygienic, and safe for the whole family'
    ],
    advantages: [
      'Keeps floors completely dry and safe — no more slipping',
      'Eliminates bathroom odours with natural anti-bacterial properties',
      'Saves time and effort — no need for frequent washing',
      'Durable, long-lasting material that stays looking new'
    ],
    showOnFrontPage: false
  }
];
