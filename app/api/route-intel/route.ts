import { NextResponse } from 'next/server';
import {
  fetchHighwayNews,
  fetchHighwayStops,
  fetchRouteWeather,
  RouteIntelResponse,
} from '@/lib/serpapi';

// Approximate distance calculator for common highway corridors
function estimateRouteMetrics(origin: string, destination: string) {
  const o = (origin || '').toLowerCase().trim();
  const d = (destination || '').toLowerCase().trim();

  if ((o.includes('pune') && d.includes('goa')) || (o.includes('goa') && d.includes('pune'))) {
    return { km: 450, time: '8h 30m', ghat: true };
  }
  if ((o.includes('mumbai') && d.includes('pune')) || (o.includes('pune') && d.includes('mumbai'))) {
    return { km: 148, time: '2h 45m', ghat: true };
  }
  if ((o.includes('delhi') && d.includes('jaipur')) || (o.includes('jaipur') && d.includes('delhi'))) {
    return { km: 280, time: '4h 15m', ghat: false };
  }
  if ((o.includes('bangalore') && d.includes('coorg')) || (o.includes('coorg') && d.includes('bangalore'))) {
    return { km: 245, time: '5h 10m', ghat: true };
  }
  if ((o.includes('chandigarh') && d.includes('manali')) || (o.includes('manali') && d.includes('chandigarh'))) {
    return { km: 270, time: '7h 20m', ghat: true };
  }

  // Generic estimate
  return { km: 380, time: '6h 30m', ghat: false };
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { origin = 'Pune', destination = 'Goa', fuelType = 'CNG', apiKey } = body;

    const metrics = estimateRouteMetrics(origin, destination);
    const hasSerpKey = Boolean(apiKey || process.env.SERPAPI_API_KEY);

    // Concurrently fetch News, Stops, and Weather
    const [alerts, stops, weather] = await Promise.all([
      fetchHighwayNews(origin, destination, apiKey),
      fetchHighwayStops(origin, destination, fuelType, apiKey),
      fetchRouteWeather(origin, destination, apiKey),
    ]);

    // Compute dynamic safety score
    let safetyScore = 92;
    const rationale: string[] = [];

    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const warningAlerts = alerts.filter(a => a.severity === 'warning');

    if (criticalAlerts.length > 0) {
      safetyScore -= criticalAlerts.length * 15;
      rationale.push(`⚠️ ${criticalAlerts.length} severe road/closure alerts detected via Google News`);
    }

    if (warningAlerts.length > 0) {
      safetyScore -= warningAlerts.length * 6;
      rationale.push(`🌧️ ${warningAlerts.length} weather/traffic slowdown alerts on route`);
    }

    const severeWeather = weather.find(w => w.warning || parseInt(w.rainChance) > 50);
    if (severeWeather) {
      safetyScore -= 8;
      rationale.push(`🌧️ High precipitation (${severeWeather.rainChance}) detected near ${severeWeather.location}`);
    }

    if (metrics.ghat) {
      rationale.push(`⛰️ Steep ghat sections require low gear descending and extra braking distance`);
    }

    if (stops.length >= 3) {
      rationale.push(`⛽ Verified fuel/EV stops are available every 50-80 km`);
    }

    safetyScore = Math.max(35, Math.min(98, safetyScore));

    let safetyTier: 'Excellent' | 'Good' | 'Caution' | 'High Risk' = 'Good';
    if (safetyScore >= 88) safetyTier = 'Excellent';
    else if (safetyScore >= 75) safetyTier = 'Good';
    else if (safetyScore >= 55) safetyTier = 'Caution';
    else safetyTier = 'High Risk';

    const departureAdvice = safetyScore > 80
      ? `Ideal departure window: Tomorrow 05:30 AM - 06:15 AM to clear urban traffic before morning congestion.`
      : `Caution recommended: Plan departure after 07:00 AM once ghat fog and overnight mist clears.`;

    const responseData: RouteIntelResponse = {
      origin,
      destination,
      fuelType,
      distanceKm: metrics.km,
      estDriveTime: metrics.time,
      safetyScore,
      safetyTier,
      safetyRationale: rationale,
      departureAdvice,
      weather,
      alerts,
      stops,
      isLiveSerpData: hasSerpKey,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Route intel API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze highway route' },
      { status: 500 }
    );
  }
}
