const { generateText, generateJSON } = require('../config/ai');

// @desc    Generate captions
// @route   POST /api/ai/captions
const generateCaptions = async (req, res) => {
  try {
    const { topic, platform, tone } = req.body;
    if (!topic) return res.status(400).json({ success: false, message: 'Topic is required' });
    if (topic.length > 1000) return res.status(400).json({ success: false, message: 'Topic must be under 1000 characters' });

    const systemPrompt = `You are an expert social media copywriter who creates viral, engaging content. 
    Write captions that feel authentic, drive engagement, and match the platform's culture perfectly.`;

    const prompt = `Write 3 distinct ${platform || 'Instagram'} captions about: "${topic}".
    Tone: ${tone || 'Professional'}.
    
    Rules:
    - Number each caption (1. 2. 3.)
    - Make each one unique in angle and style
    - Include a strong hook in the first line
    - Add 5-8 relevant hashtags at the end of each caption
    - Keep platform best practices (Instagram = storytelling, TikTok = trendy/casual, LinkedIn = professional insights)`;

    const result = await generateText(prompt, { systemPrompt });

    res.json({
      success: true,
      data: { captions: result.text, provider: result.provider },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate hashtags
// @route   POST /api/ai/hashtags
const generateHashtags = async (req, res) => {
  try {
    const { niche } = req.body;
    if (!niche) return res.status(400).json({ success: false, message: 'Niche is required' });
    if (niche.length > 200) return res.status(400).json({ success: false, message: 'Niche must be under 200 characters' });

    const systemPrompt = 'You are a social media hashtag expert. Return ONLY valid JSON with no extra text.';

    const prompt = `Generate 3 sets of 10 Instagram hashtags for the niche: "${niche}".
    Return this exact JSON structure:
    {
      "sets": [
        {"label": "High Reach (1M+)", "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"]},
        {"label": "Mid Reach (100K-1M)", "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"]},
        {"label": "Niche (Under 100K)", "hashtags": ["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"]}
      ]
    }`;

    const data = await generateJSON(prompt, systemPrompt);
    res.json({ success: true, data: { ...data, provider: 'groq+gemini' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate content ideas
// @route   POST /api/ai/ideas
const generateIdeas = async (req, res) => {
  try {
    const { industry, goal } = req.body;
    if (!industry) return res.status(400).json({ success: false, message: 'Industry is required' });

    const systemPrompt = 'You are a creative social media strategist. Return ONLY valid JSON.';

    const prompt = `Generate 6 creative social media content ideas for:
    Industry: "${industry}"
    Goal: "${goal || 'Increase Engagement'}"
    
    Return this exact JSON:
    {
      "ideas": [
        {
          "title": "short catchy title",
          "type": "Reel",
          "hook": "one compelling opening hook line",
          "description": "2 sentence description of the content"
        }
      ]
    }
    
    Use a mix of types: Reel, Carousel, Story, Post. Make ideas specific to the industry.`;

    const data = await generateJSON(prompt, systemPrompt);
    res.json({ success: true, data: { ...data, provider: 'groq+gemini' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI strategic insights
// @route   POST /api/ai/insights
const getInsights = async (req, res) => {
  try {
    const { challenge } = req.body;
    if (!challenge) return res.status(400).json({ success: false, message: 'Challenge description is required' });
    if (challenge.length > 2000) return res.status(400).json({ success: false, message: 'Challenge must be under 2000 characters' });

    const systemPrompt = `You are a senior social media strategist with 10+ years of experience 
    helping agencies grow client accounts. You give direct, actionable, specific advice — 
    not generic platitudes. Reference real strategies, tools, and tactics.`;

    const prompt = `A social media manager describes this challenge: "${challenge}"
    
    Provide 4-5 numbered, specific strategic recommendations. 
    Be direct and practical. Reference specific tools, frameworks, or tactics where relevant.
    Each point should be actionable within the next 2 weeks.`;

    const result = await generateText(prompt, { systemPrompt, preferGemini: true });

    res.json({
      success: true,
      data: { advice: result.text, provider: result.provider },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate full content calendar for a client
// @route   POST /api/ai/calendar
const generateCalendar = async (req, res) => {
  try {
    const { clientName, industry, platforms, month } = req.body;
    if (!clientName || !industry) {
      return res.status(400).json({ success: false, message: 'Client name and industry are required' });
    }

    const systemPrompt = 'You are a social media content strategist. Return ONLY valid JSON.';

    const prompt = `Create a 2-week content calendar for:
    Client: "${clientName}" 
    Industry: "${industry}"
    Platforms: ${(platforms || ['Instagram']).join(', ')}
    Month: ${month || 'this month'}
    
    Return JSON:
    {
      "calendar": [
        {
          "day": 1,
          "platform": "Instagram",
          "type": "Reel",
          "title": "post title",
          "caption_idea": "brief caption idea",
          "hashtags": ["#tag1", "#tag2"]
        }
      ]
    }
    
    Create 10-14 posts spread across the platforms.`;

    const data = await generateJSON(prompt, systemPrompt);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateCaptions, generateHashtags, generateIdeas, getInsights, generateCalendar };
