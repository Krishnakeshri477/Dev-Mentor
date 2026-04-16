import Interaction from '../models/Interaction.js';
import { getGroqResponse } from '../services/groqService.js';
import { recallContext, storeInteraction } from '../services/hindsightService.js';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // 1. Fetch relevant memory context for this user & query from Hindsight
    const previousContext = await recallContext(userId, message);

    // 2. Call Groq with query and contextual memory
    const { response, mistakes } = await getGroqResponse(message, previousContext);

    // 3. Store the interaction locally in MongoDB for static history
    const interaction = await Interaction.create({
      userId,
      query: message,
      aiResponse: response,
      identifiedWeakSpots: mistakes || []
    });

    // 4. Save this new interaction to Hindsight to improve future memory
    await storeInteraction(userId, message, response, mistakes || []);

    res.status(200).json({
      success: true,
      data: {
        interactionId: interaction._id,
        aiResponse: response,
        identifiedWeakSpots: mistakes || []
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to process message' });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const interactions = await Interaction.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.status(200).json({ interactions });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving chat history', error: error.message });
  }
};
