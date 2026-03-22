import { PrismaClient } from "@prisma/client";

// Standalone client — seed runs as isolated process, not alongside the app server
// Do NOT import from ../../src/db/index.js — that module assumes Express app context
const prisma = new PrismaClient({
  log: ["warn", "error"], // see warnings during seed without query noise
});

const categories = [
  {
    name: "Cinematic & Bollywood",
    slug: "cinematic-bollywood",
    description:
      "Dramatic filmy aesthetics including Bollywood movie posters, South Indian mass hero styles, and period drama looks.",
    isSystem: true,
    subcategories: [
      {
        name: "Bollywood Movie Poster",
        slug: "bollywood-movie-poster",
        description:
          "Transform your photo into a dramatic Bollywood movie poster with cinematic lighting and filmy text.",
      },
      {
        name: "South Indian Mass Hero",
        slug: "south-indian-mass-hero",
        description:
          "Recreate the iconic mass hero style from South Indian blockbusters with action poses and dramatic effects.",
      },
      {
        name: "Period Drama",
        slug: "period-drama",
        description:
          "Convert your photo into a Mughal, Maratha, or Rajput era period drama character with royal costumes.",
      },
      {
        name: "Award Night Glam",
        slug: "award-night-glam",
        description:
          "Get the red carpet Filmfare Awards look with glamorous styling and stage lighting.",
      },
      {
        name: "Movie Still Style",
        slug: "movie-still-style",
        description:
          "Turn your photo into a cinematic movie still with professional colour grading and dramatic composition.",
      },
    ],
  },
  {
    name: "Traditional & Cultural",
    slug: "traditional-cultural",
    description:
      "Prompts celebrating Indian cultural heritage including traditional attire, festivals, classical dance forms, and regional clothing styles.",
    isSystem: true,
    subcategories: [
      {
        name: "Bridal & Wedding",
        slug: "bridal-wedding",
        description:
          "Transform into a stunning Indian bride or groom with traditional wedding attire and jewelry.",
      },
      {
        name: "Festival Special",
        slug: "festival-special",
        description:
          "Create festive looks for Diwali, Holi, Navratri, Eid, and other Indian celebrations.",
      },
      {
        name: "Classical Dance",
        slug: "classical-dance",
        description:
          "Recreate poses from Bharatanatyam, Kathak, Odissi, and other classical Indian dance forms.",
      },
      {
        name: "Regional Attire",
        slug: "regional-attire",
        description:
          "Dress up in regional Indian clothing including sarees, lehengas, sherwanis, and traditional garments from every state.",
      },
      {
        name: "Temple & Devotional",
        slug: "temple-devotional",
        description:
          "Create serene devotional portraits with temple backdrops and spiritual aesthetics.",
      },
      {
        name: "Tribal & Folk Art",
        slug: "tribal-folk-art",
        description:
          "Transform your photo using tribal patterns and folk art aesthetics from across India.",
      },
    ],
  },
  {
    name: "Mythology & Spiritual",
    slug: "mythology-spiritual",
    description:
      "Convert photos into divine, mythological, and spiritual characters inspired by Hindu, Buddhist, Jain, Sikh, and Islamic traditions.",
    isSystem: true,
    subcategories: [
      {
        name: "Hindu Deity Style",
        slug: "hindu-deity-style",
        description:
          "Transform into divine forms inspired by Shiva, Krishna, Durga, Lakshmi, and other deities.",
      },
      {
        name: "Epic Warrior",
        slug: "epic-warrior",
        description:
          "Become a warrior from the Mahabharata or Ramayana with period-accurate armour and weapons.",
      },
      {
        name: "Buddhist & Jain Art",
        slug: "buddhist-jain-art",
        description:
          "Recreate serene Buddhist and Jain artistic styles with meditative poses and sacred motifs.",
      },
      {
        name: "Sufi & Islamic Art",
        slug: "sufi-islamic-art",
        description:
          "Create portraits inspired by Sufi mysticism and classical Islamic geometric art traditions.",
      },
      {
        name: "Sikh Heritage",
        slug: "sikh-heritage",
        description:
          "Transform into regal Sikh warrior or devotee portraits with traditional dastar and shastras.",
      },
      {
        name: "Celestial & Apsara",
        slug: "celestial-apsara",
        description:
          "Become a celestial being, apsara, or gandharva with ethereal styling and divine backdrops.",
      },
    ],
  },
  {
    name: "Portrait & Fashion",
    slug: "portrait-fashion",
    description:
      "High-fashion editorial portraits, street style photography, and magazine cover looks for urban Indian users.",
    isSystem: true,
    subcategories: [
      {
        name: "High Fashion Editorial",
        slug: "high-fashion-editorial",
        description:
          "Create Vogue India style editorial portraits with luxury fashion and professional studio lighting.",
      },
      {
        name: "Street Style",
        slug: "street-style",
        description:
          "Capture the urban street fashion energy of Mumbai, Delhi, and Bangalore.",
      },
      {
        name: "Ethnic Fusion Fashion",
        slug: "ethnic-fusion-fashion",
        description:
          "Blend traditional Indian elements with modern fashion for a contemporary fusion look.",
      },
      {
        name: "Bridal Beauty",
        slug: "bridal-beauty",
        description:
          "Create stunning bridal makeup and jewellery looks for the modern Indian bride.",
      },
      {
        name: "Magazine Cover",
        slug: "magazine-cover",
        description:
          "Transform your photo into a professional magazine cover with editorial styling.",
      },
    ],
  },
  {
    name: "Fantasy & Sci-Fi",
    slug: "fantasy-sci-fi",
    description:
      "Fantasy warriors, cyberpunk Indian cityscapes, space explorers, and desi superhero styles for young Indian creators.",
    isSystem: true,
    subcategories: [
      {
        name: "Indian Mythology Fantasy",
        slug: "indian-mythology-fantasy",
        description:
          "Blend Indian mythological characters with high fantasy aesthetics and magical environments.",
      },
      {
        name: "Cyberpunk India",
        slug: "cyberpunk-india",
        description:
          "Imagine yourself in a neon-lit futuristic Mumbai or cyber Delhi with dystopian aesthetics.",
      },
      {
        name: "Space & Cosmic",
        slug: "space-cosmic",
        description:
          "Create astronaut portraits and cosmic backgrounds inspired by ISRO and space exploration.",
      },
      {
        name: "Desi Superhero",
        slug: "desi-superhero",
        description:
          "Become an original Indian superhero with desi-inspired costume design and powers.",
      },
      {
        name: "Post-Apocalyptic India",
        slug: "post-apocalyptic-india",
        description:
          "Explore ruined Indian cities and survival aesthetics in a post-apocalyptic world.",
      },
    ],
  },
  {
    name: "Art Styles & Painting",
    slug: "art-styles-painting",
    description:
      "Transform photos into traditional Indian art forms like Madhubani and Warli or global styles like oil painting and watercolour.",
    isSystem: true,
    subcategories: [
      {
        name: "Madhubani Art",
        slug: "madhubani-art",
        description:
          "Convert your photo into the intricate line-work and natural motifs of Madhubani painting from Bihar.",
      },
      {
        name: "Warli Art",
        slug: "warli-art",
        description:
          "Transform into the simple geometric white-on-brown tribal art style of the Warli people of Maharashtra.",
      },
      {
        name: "Tanjore Painting",
        slug: "tanjore-painting",
        description:
          "Recreate the rich gold embossed and jewel-coloured style of classical Tanjore paintings from Tamil Nadu.",
      },
      {
        name: "Mughal Miniature",
        slug: "mughal-miniature",
        description:
          "Transform into a detailed Mughal court miniature painting with intricate borders and royal settings.",
      },
      {
        name: "Oil Painting Portrait",
        slug: "oil-painting-portrait",
        description:
          "Convert your photo into a classical oil painting with rich textures and painterly brushwork.",
      },
      {
        name: "Watercolour & Sketch",
        slug: "watercolour-sketch",
        description:
          "Create soft watercolour portraits or detailed pencil sketch versions of your photo.",
      },
    ],
  },
  {
    name: "Gaming & Anime",
    slug: "gaming-anime",
    description:
      "Convert photos into anime characters, RPG heroes, and gaming avatars popular among young Indian gamers and otaku culture.",
    isSystem: true,
    subcategories: [
      {
        name: "Anime Portrait",
        slug: "anime-portrait",
        description:
          "Transform into a detailed anime-style character with expressive eyes and stylised hair.",
      },
      {
        name: "Manga Style",
        slug: "manga-style",
        description:
          "Create black and white manga panel versions of your photo with dramatic shading.",
      },
      {
        name: "RPG Game Character",
        slug: "rpg-game-character",
        description:
          "Become a fully equipped RPG hero with armour, weapons, and fantasy game aesthetics.",
      },
      {
        name: "Battle Royale Style",
        slug: "battle-royale-style",
        description:
          "Get the BGMI or Free Fire character look with tactical gear and game UI elements.",
      },
      {
        name: "Pixel Art",
        slug: "pixel-art",
        description:
          "Transform your photo into retro pixel art style reminiscent of classic video games.",
      },
    ],
  },
  {
    name: "Nature & Landscape",
    slug: "nature-landscape",
    description:
      "Place yourself in stunning Indian natural settings from Himalayan peaks to Kerala backwaters and Rajasthan deserts.",
    isSystem: true,
    subcategories: [
      {
        name: "Himalayan Backdrop",
        slug: "himalayan-backdrop",
        description:
          "Place yourself against dramatic snow-capped Himalayan peaks with misty mountain aesthetics.",
      },
      {
        name: "Rajasthan Desert Palace",
        slug: "rajasthan-desert-palace",
        description:
          "Stand before iconic Rajasthani palaces, sand dunes, and desert sunsets.",
      },
      {
        name: "Kerala Backwaters",
        slug: "kerala-backwaters",
        description:
          "Recreate the serene beauty of Kerala backwaters with houseboats and lush greenery.",
      },
      {
        name: "Monsoon Aesthetic",
        slug: "monsoon-aesthetic",
        description:
          "Capture the romantic mood of Indian monsoon with rain, petrichor colours, and dramatic skies.",
      },
      {
        name: "Sacred Ghats",
        slug: "sacred-ghats",
        description:
          "Place yourself at the ghats of Varanasi or Haridwar with spiritual river aesthetics and diyas.",
      },
    ],
  },
  {
    name: "Seasonal & Occasions",
    slug: "seasonal-occasions",
    description:
      "Festival and occasion-specific prompts for Diwali, Holi, Eid, weddings, cricket season, and national celebrations.",
    isSystem: true,
    subcategories: [
      {
        name: "Diwali Special",
        slug: "diwali-special",
        description:
          "Create glowing Diwali portraits with diyas, fireworks, and golden festive lighting.",
      },
      {
        name: "Holi Special",
        slug: "holi-special",
        description:
          "Transform into vibrant Holi celebration portraits covered in bright festival colours.",
      },
      {
        name: "Eid Special",
        slug: "eid-special",
        description:
          "Create elegant Eid portraits with traditional attire, mehndi, and crescent moon aesthetics.",
      },
      {
        name: "Wedding Season",
        slug: "wedding-season",
        description:
          "Full wedding function looks from mehendi to reception for the complete Indian wedding experience.",
      },
      {
        name: "Independence Day",
        slug: "independence-day",
        description:
          "Create patriotic portraits for Independence Day and Republic Day with tricolour aesthetics.",
      },
      {
        name: "Cricket Special",
        slug: "cricket-special",
        description:
          "Become a cricket hero with stadium backdrops and Indian team aesthetics during cricket season.",
      },
    ],
  },
];

// ── Seed Function ─────────────────────────────────────────────────────────────

const SUPER_ADMIN_ID = "71ce1bbd-dd8f-46af-826b-8fd37e35cd45";

const seedCategories = async () => {
  console.log("🌱 Seeding categories...");

  for (const category of categories) {
    const { subcategories, ...categoryData } = category;

    // Upsert parent category
    const parent = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: {
        ...categoryData,
        createdById: SUPER_ADMIN_ID,
      },
    });

    console.log(`✅ Category: ${parent.name}`);

    // Upsert subcategories
    // for (const sub of subcategories) {
    //   await prisma.category.upsert({
    //     where: { slug: sub.slug },
    //     update: { ...sub, parentId: parent.id },
    //     create: {
    //       ...sub,
    //       parentId: parent.id,
    //       isSystem: true,
    //       isActive: true,
    //       createdById: SUPER_ADMIN_ID,
    //     },
    //   });
    //   console.log(`   ↳ ${sub.name}`);
    // }
  }

  console.log("✅ Categories seeded successfully");
};

seedCategories()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
