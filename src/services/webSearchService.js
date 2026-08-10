export const searchWeb = async (query) => {
  if (!query) return { success: false, error: 'Query is required' };

  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`DuckDuckGo API error: ${response.status}`);
    }

    const data = await response.json();
    const results = [];

    if (data.AbstractText) {
      results.push({
        title: data.Heading || 'Abstract',
        snippet: data.AbstractText,
        url: data.AbstractURL,
        source: data.AbstractSource || 'DuckDuckGo'
      });
    }

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const topics = data.RelatedTopics.filter(t => t.Text && t.FirstURL).slice(0, 8);
      topics.forEach(t => {
        const titleMatch = t.Text.match(/^([^:-]+)/);
        const title = titleMatch ? titleMatch[1].trim() : 'Related Topic';
        results.push({
          title,
          snippet: t.Text,
          url: t.FirstURL,
          source: 'DuckDuckGo Related'
        });
      });
    }

    if (results.length === 0) {
      return getFallbackResults(query);
    }

    return { 
      success: true, 
      results,
      summary: generateSearchSummary(results)
    };
  } catch (error) {
    console.warn('Web search failed, using fallback', error);
    return getFallbackResults(query);
  }
};

export const generateSearchSummary = (results) => {
  if (!results || results.length === 0) return 'No relevant information found.';
  const snippets = results.map(r => r.snippet).filter(Boolean);
  return `Search retrieved ${results.length} results. Key points: ${snippets.slice(0, 3).join(' ')}`;
};

const getFallbackResults = (query) => {
  const fallback = [
    {
      title: 'Cybersecurity Best Practices',
      snippet: 'Ensure multi-factor authentication is enabled, keep software updated, and use strong, unique passwords.',
      url: 'https://www.cisa.gov/cybersecurity',
      source: 'Cyber Knowledge Base'
    },
    {
      title: 'Zero Trust Architecture',
      snippet: 'Never trust, always verify. Zero trust implies continuous authentication and strict access controls.',
      url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf',
      source: 'NIST Guidelines'
    }
  ];

  return {
    success: true,
    results: fallback,
    summary: generateSearchSummary(fallback),
    error: 'API failed or CORS blocked. Returning fallback results.'
  };
};
