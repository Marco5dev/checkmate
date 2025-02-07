import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  color: {
    type: String,
    default: '#B85C38'
  }
}, { timestamps: true });

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);
