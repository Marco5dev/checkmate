import { NextResponse } from "next/server";
import { DBConnect } from "@/utils/mongodb";
import DailyQuote from "@/models/DailyQuote";

export async function GET() {
  try {
    await DBConnect();
    
    // Get today's date (start of day in UTC)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Try to find today's quote
    let quote = await DailyQuote.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // If no quote exists for today, fetch a new one
    if (!quote) {
      const apiKey = process.env.X_Api_Key;
      const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
        headers: {
          'X-Api-Key': apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quote from API');
      }

      const [quoteData] = await response.json();
      
      // Store the new quote
      quote = await DailyQuote.create({
        quote: quoteData.quote,
        author: quoteData.author,
        category: quoteData.category,
        date: today
      });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Quote error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
