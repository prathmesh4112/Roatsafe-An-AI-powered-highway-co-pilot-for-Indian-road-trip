import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { origin, destination, fuelType, safetyScore, alertsCount, severeWeather } = await req.json();

    const briefing = `
**RoadSafe AI Co-pilot Briefing for ${origin} → ${destination}**

• **Overall Route Risk**: Score ${safetyScore}/100.
• **Highway Corridor**: Active corridor monitoring found ${alertsCount} live alerts. ${
      severeWeather ? `Expect wet conditions and fog in the ghat section (${severeWeather}). Keep fog lights on and reduce downhill speed.` : 'Weather along the highway is mostly clear.'
    }
• **Fuel & Charging Strategy**: Configured for **${fuelType}**. Key pitstops with verified high ratings and 24/7 amenities have been mapped at 80km intervals.
• **Safety Checklist Before Departure**:
  1. Ensure tire cold pressure is set correctly (including spare wheel).
  2. Top up windshield wiper fluid with washer detergent.
  3. Verify Fastag balance before the first highway toll plaza.
  4. Avoid tailgating heavy vehicles on steep inclines.
    `.trim();

    return NextResponse.json({
      briefing,
      audioDurationSec: 28,
      status: 'ready',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to generate briefing' }, { status: 500 });
  }
}
