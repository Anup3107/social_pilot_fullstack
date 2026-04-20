const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

// Lazy singletons — initialized on first use so dotenv has already run
let _groq = null;
let _geminiModel = null;

const getGroq = () => {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not set in .env');
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
};

const getGeminiModel = () => {
  if (!_geminiModel) {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set in .env');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    _geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
  return _geminiModel;
};

/**
 * Generate text using Groq (fast) with Gemini as fallback.
 * @param {string} prompt
 * @param {object} options - { preferGemini, jsonMode, systemPrompt }
 */
const generateText = async (prompt, options = {}) => {
  const { preferGemini = false, jsonMode = false, systemPrompt = '' } = options;

  if (!preferGemini) {
    try {
      const messages = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });

      const completion = await getGroq().chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
        ...(jsonMode && { response_format: { type: 'json_object' } }),
      });
      return { text: completion.choices[0]?.message?.content || '', provider: 'groq' };
    } catch (groqError) {
      console.warn('Groq failed, falling back to Gemini:', groqError.message);
    }
  }

  // Gemini (primary when preferGemini=true, fallback otherwise)
  try {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    const result = await getGeminiModel().generateContent(fullPrompt);
    const text = result.response.text();
    return { text, provider: 'gemini' };
  } catch (geminiError) {
    // Last resort: try Groq even when preferGemini was set
    if (preferGemini) {
      try {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });
        const completion = await getGroq().chat.completions.create({
          messages,
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1024,
        });
        return { text: completion.choices[0]?.message?.content || '', provider: 'groq-fallback' };
      } catch (groqFallbackErr) {
        console.error('Groq fallback also failed:', groqFallbackErr.message);
      }
    }
    throw new Error(`Both AI providers failed. Last error: ${geminiError.message}`);
  }
};

/**
 * Generate and parse JSON using Groq (json_object mode) with Gemini fallback.
 */
const generateJSON = async (prompt, systemPrompt = '') => {
  try {
    const result = await generateText(prompt, { jsonMode: true, systemPrompt });
    return JSON.parse(result.text);
  } catch {
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no backticks, no explanation.`;
    const result = await generateText(jsonPrompt, { preferGemini: true, systemPrompt });
    const clean = result.text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }
};

module.exports = { generateText, generateJSON };
