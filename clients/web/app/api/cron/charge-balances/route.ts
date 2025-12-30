// src/app/api/cron/charge-balances/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Redirect to the comprehensive daily cron job
  const dailyUrl = new URL('/api/cron/daily', request.url);
  
  // Pass along the authorization header
  const authHeader = request.headers.get('authorization');
  
  const response = await fetch(dailyUrl, {
    headers: {
      'authorization': authHeader || '',
    },
  });
  
  return response;
}