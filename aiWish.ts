import { GoogleGenAI } from "@google/genai";

export type WishTone = 'heartfelt' | 'funny' | 'poem' | 'inspirational' | 'short';

export const WISH_TEMPLATES: Record<WishTone, string[]> = {
  heartfelt: [
    "Wishing you a year filled with the same joy, laughter, and light that you bring into the lives of everyone around you. May all your dreams sparkle as bright as your birthday candles today! Happy Birthday! ❤️✨",
    "On your special day, I want to remind you how deeply loved and appreciated you are. Thank you for being such an extraordinary friend and guiding star. Cheers to another chapter of beautiful memories!",
    "Happy Birthday! May your day be packed with sweet moments, warm hugs, delicious cake, and unforgettable smiles. You deserve the absolute best today and every single day."
  ],
  funny: [
    "Happy Birthday! Remember: Age is merely the number of years the world has been enjoying you! Plus, you're officially one year closer to getting senior citizen discounts! 🎂🎉",
    "Happy Birthday! They say wisdom comes with age... so you must be the smartest person on the planet by now! Have a fantastic day full of cake and zero calories!",
    "Congratulations on surviving another 365 days of my jokes! May your day be filled with lots of presents and none of them being socks!"
  ],
  poem: [
    "Another year around the sun,\nA brand new journey has begun!\nMay laughter fill your happy heart,\nAnd magic follow from the start.\n\nHappy Birthday! 🌟✨",
    "Candles glow upon your cake,\nSpecial wishes you will make.\nMay every dream you hold so dear,\nCome true for you throughout this year!",
    "A toast to you on this bright day,\nTo joy and love that’s here to stay.\nWith every candle’s golden light,\nMay your future be forever bright!"
  ],
  inspirational: [
    "Happy Birthday! Keep shining your unique light on the world. May this year open new doors, unleash new achievements, and bring you endless happiness in everything you reach for.",
    "Another year is a fresh canvas waiting for your vibrant colors. Paint your story with courage, passion, and boundless joy. Happy Birthday!",
    "May this year bring you boundless inspiration, grand adventures, and deep peace. Never stop reaching for the stars!"
  ],
  short: [
    "Happy Birthday! Wishing you endless joy, laughter, and delicious cake today! 🥳🎂",
    "Cheers to you on your special day! Have the happiest birthday ever! 🎉✨",
    "Wishing you a magical birthday filled with love and wonderful surprises! ❤️🎁"
  ]
};

export async function generateWishWithAI(name: string, age: number, tone: WishTone, relationship?: string): Promise<string> {
  // If VITE_GEMINI_API_KEY is available in import.meta.env, use @google/genai
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Write a personalized ${tone} birthday wish message for ${name} who is turning ${age} years old.${relationship ? ` Relationship: ${relationship}.` : ''} Keep it engaging, festive, and warm. Length: 2 to 4 sentences. Include relevant festive emojis.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn("AI generation error, falling back to templates:", err);
    }
  }

  // Fallback to rich built-in template
  const templates = WISH_TEMPLATES[tone] || WISH_TEMPLATES.heartfelt;
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex].replace(/\[Name\]/g, name);
}