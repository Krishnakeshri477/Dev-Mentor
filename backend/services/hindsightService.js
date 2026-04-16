import axios from 'axios';

// Fallback implementation if @vectorize-io/hindsight-client is tricky to configure without docs
export const storeInteraction = async (userId, query, response, mistakes) => {
  try {
    if(!process.env.HINDSIGHT_API_KEY) {
       console.log('Skipping Hindsight retain: No API KEY');
       return;
    }
    await axios.post('https://api.vectorize.io/v1/hindsight/retain', {
      user_id: userId.toString(),
      text: `User Query: ${query}\nAI Response: ${response}\nIdentified Weaknesses: ${mistakes.join(', ')}`
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.HINDSIGHT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Hindsight retain error:', error.message);
  }
};

export const recallContext = async (userId, currentQuery) => {
  try {
    if(!process.env.HINDSIGHT_API_KEY) {
       return 'No API KEY for memory context.';
    }
    const res = await axios.post('https://api.vectorize.io/v1/hindsight/recall', {
      user_id: userId.toString(),
      query: currentQuery,
      top_k: 3
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.HINDSIGHT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return res.data.context || 'No specific history related to this query.';
  } catch (error) {
    console.error('Hindsight recall error:', error.message);
    return '';
  }
};
