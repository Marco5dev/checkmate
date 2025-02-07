import mongoose from 'mongoose';

const DailyQuoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: String,
  date: {
    type: Date,
    required: true,
    default: function() {
      // Set to start of current day in UTC
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    }
  }
}, { timestamps: true });

export default mongoose.models.DailyQuote || mongoose.model('DailyQuote', DailyQuoteSchema);
