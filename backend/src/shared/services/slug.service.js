import prisma from "../../db/index.js";
import { generateSlug, randomHex } from "../utils/helpers.js";

/**
 * Generate a unique slug for a given model by checking DB collisions
 * @param {string} text - source text to slugify
 * @param {string} model - prisma model name (e.g. 'prompt', 'category', 'tag')
 * @param {string} [existingId] - pass current record id when updating to exclude self
 */
export const generateUniqueSlug = async (text, model, existingId = null) => {
  let slug = generateSlug(text);
  let isUnique = false;
  let attempt = 0;

  while (!isUnique) {
    const candidate = attempt === 0 ? slug : `${slug}-${randomHex(3)}`;

    const where = { slug: candidate };
    if (existingId) where.NOT = { id: existingId };

    const existing = await prisma[model].findFirst({ where });

    if (!existing) {
      slug = candidate;
      isUnique = true;
    }

    attempt++;
    if (attempt > 10) {
      // Fallback: add longer random suffix
      slug = `${generateSlug(text)}-${randomHex(6)}`;
      isUnique = true;
    }
  }

  return slug;
};

// Transactional version — accepts tx (use inside prisma.$transaction)
export const generateUniqueSlugTx = async (
  text,
  model,
  tx,
  existingId = null,
) => {
  let slug = generateSlug(text);
  let attempt = 0;

  while (attempt <= 10) {
    const candidate = attempt === 0 ? slug : `${slug}-${randomHex(3)}`;
    const where = {
      slug: candidate,
      ...(existingId && { NOT: { id: existingId } }),
    };

    const existing = await tx[model].findFirst({ where });

    if (!existing) return candidate;

    attempt++;
  }

  // Hard fallback after 10 collisions
  return `${generateSlug(text)}-${randomHex(6)}`;
};
