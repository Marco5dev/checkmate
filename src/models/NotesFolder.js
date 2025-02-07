import mongoose from 'mongoose';

const NotesFolderSchema = new mongoose.Schema({
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
  description: {
    type: String,
    default: ''
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NotesFolder',
    default: null
  },
  color: {
    type: String,
    default: '#B85C38'
  }
}, { timestamps: true });

export default mongoose.models.NotesFolder || mongoose.model('NotesFolder', NotesFolderSchema);
