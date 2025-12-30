import { NextResponse } from 'next/server';

const GREEN_API_URL = 'https://api.green-api.com';

export async function POST() {
  try {
    // Get environment variables (only available server-side)
    const instanceId = process.env.GREEN_API_INSTANCE_ID;
    const token = process.env.GREEN_API_TOKEN;
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
    
    console.log('🔍 WhatsApp Test Debug:', {
      envVarsExist: {
        instanceId: !!instanceId,
        token: !!token,
        adminPhone: !!adminPhone
      },
      values: {
        instanceId: instanceId || 'MISSING',
        tokenLength: token?.length || 0,
        adminPhone: adminPhone || 'MISSING'
      }
    });
    
    // Check if variables exist
    if (!instanceId || !token || !adminPhone) {
      console.error('❌ Missing environment variables:', {
        instanceId: !instanceId,
        token: !token,
        adminPhone: !adminPhone
      });
      
      return NextResponse.json({
        success: false,
        message: 'WhatsApp not configured. Missing environment variables.',
        debug: {
          hasInstanceId: !!instanceId,
          hasToken: !!token,
          hasPhone: !!adminPhone
        }
      }, { status: 500 });
    }
    
    // Smart chatId handling: Groups use @g.us, personal numbers use @c.us
    const chatId = adminPhone.includes('@') ? adminPhone : `${adminPhone}@c.us`;
    
    // Construct message
    const message = 
      `🚨 🟢 *Elaview Alert*\n\n` +
      `*Test Connection*\n` +
      `Green API WhatsApp integration is working! 🎉\n` +
      `Booking: test-${Date.now().toString().slice(-8)}...\n` +
      `\n📱 View Dashboard:\n` +
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/payment-flows`;
    
    const url = `${GREEN_API_URL}/waInstance${instanceId}/sendMessage/${token}`;
    console.log('📤 Sending to:', {
      url: url.replace(token, 'TOKEN_HIDDEN'),
      chatType: adminPhone.includes('@g.us') ? 'GROUP' : 'PERSONAL',
      chatId: chatId
    });
    
    // Make API request
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId,  // ← FIXED: Now uses smart chatId
        message: message
      })
    });
    
    const responseText = await response.text();
    console.log('📥 Green API Response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });
    
    if (!response.ok) {
      let errorMessage = `Green API error ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(responseText);
        console.error('❌ Green API Error Details:', errorData);
        
        // Common error codes
        if (response.status === 401) {
          errorMessage = 'Invalid Green API token. Check your GREEN_API_TOKEN.';
        } else if (response.status === 466) {
          errorMessage = 'WhatsApp disconnected. Please re-scan QR code in Green API console.';
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Response wasn't JSON
        errorMessage += ` - ${responseText}`;
      }
      
      return NextResponse.json({
        success: false,
        message: errorMessage,
        debug: {
          status: response.status,
          response: responseText
        }
      }, { status: response.status });
    }
    
    // Success!
    const result = JSON.parse(responseText);
    console.log('✅ WhatsApp message sent successfully!', result);
    
    return NextResponse.json({
      success: true,
      message: 'Test message sent successfully! Check your WhatsApp.',
      data: result
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      error: error instanceof Error ? error.stack : String(error)
    }, { status: 500 });
  }
}