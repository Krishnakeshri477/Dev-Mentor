import mongoose from 'mongoose';

const interactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    query: {
      type: String,
      required: true,
    },
    aiResponse: {
      type: String,
      required: true,
    },
    identifiedWeakSpots: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Interaction = mongoose.model('Interaction', interactionSchema);

export default Interaction;
