/**
 * Green API Webhook Handler
 * 
 * Receives incoming WhatsApp messages and processes commands.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.green-api.com
 * 2. Select your instance
 * 3. Navigate to "Settings" → "Notifications"
 * 4. Set webhook URL to: https://your-domain.com/api/webhooks/green-api
 *    (For local testing: Use ngrok or similar to expose localhost)
 * 5. Enable "Incoming messages and files" notification type
 * 6. Save settings
 * 
 * SUPPORTED COMMANDS:
 * - "Commands" or "Help" - Show all available commands
 * - "Elaview-simulate" - Create test booking
 * - "Elaview-status" - View active simulations
 * - "Approve [booking-id]" - Approve booking or proof
 * - "Deny [booking-id]" - Cancel booking or reject proof
 * - "Wait [booking-id]" - Run simulation with 5s delays
 * - "Bypass [booking-id]" - Instant simulation completion
 * - "Close [booking-id]" - End and archive simulation
 */

import { type NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../elaview-mvp/src/server/db';
import { sendWhatsAppMessage } from '../../../../../elaview-mvp/src/lib/notifications/whatsapp';

// Helper to format booking ID
function formatBookingId(id: string): string {
  return id.slice(0, 8);
}

// Helper to calculate time elapsed
function getTimeElapsed(createdAt: number): string {
  const minutes = Math.floor((Date.now() - createdAt) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Helper to get status emoji
function getStatusEmoji(status: string): string {
  const emojiMap: Record<string, string> = {
    'PENDING_APPROVAL': '🟡',
    'ACTIVE': '🔵',
    'AWAITING_PROOF': '🟠',
    'COMPLETED': '✅',
    'REJECTED': '❌',
    'CANCELLED': '❌'
  };
  return emojiMap[status] || '⚪';
}

// Delay helper for "Wait" command
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📥 Green API Webhook received:', JSON.stringify(body, null, 2));
    
    // Green API sends different types of notifications
    // We only care about incoming text messages
    const typeWebhook = body.typeWebhook;
    
    if (typeWebhook !== 'incomingMessageReceived' && typeWebhook !== 'outgoingMessageReceived') {
  console.log('ℹ️  Ignoring webhook type:', typeWebhook);
  return NextResponse.json({ received: true });
}
    
    // Extract message data - FIX: Check for textMessageData instead of typeMessage
    const messageData = body.messageData;
    if (!messageData?.textMessageData) {
      console.log('ℹ️  Not a text message, ignoring');
      return NextResponse.json({ received: true });
    }
    
    const messageText = messageData.textMessageData?.textMessage;
    const senderData = body.senderData;
    const chatId = senderData?.chatId;
    
    if (!messageText) {
      console.log('ℹ️  No message text found');
      return NextResponse.json({ received: true });
    }
    
    console.log(`💬 Processing message: "${messageText}" from ${chatId}`);
    
    // Parse command
    const message = messageText.trim();
    
    // Help command
    if (message.toLowerCase() === 'commands' || message.toLowerCase() === 'help') {
      await sendWhatsAppMessage(
        `📋 *Elaview WhatsApp Commands*\n\n` +
        `🧪 *SIMULATION:*\n` +
        `• Elaview-simulate - Create test booking\n` +
        `• Elaview-status - View active simulations & IDs\n` +
        `• Wait [id] - Run real-time flow (5s delays)\n` +
        `• Bypass [id] - Instant completion\n` +
        `• Close [id] - End simulation\n\n` +
        `✅ *APPROVAL:*\n` +
        `• Approve [id] - Approve booking/proof\n` +
        `• Deny [id] - Cancel booking\n\n` +
        `ℹ️ *INFO:*\n` +
        `• Commands - Show this help\n` +
        `• Elaview-status - Get active booking IDs\n\n` +
        `💡 *Tip:* Use "Elaview-status" to see all active IDs\n` +
        `📝 *Example:* "Approve clxx1234"`
      );
      return NextResponse.json({ received: true, command: 'help' });
    }
    
    // Elaview-simulate command
    if (message.toLowerCase() === 'elaview-simulate') {
      console.log('🧪 Creating simulation booking...');
      
      const testBooking = await db.booking.create({
        data: {
          campaignId: 'test-campaign-' + Date.now(),
          spaceId: 'test-space-' + Date.now(),
          status: 'PENDING_APPROVAL',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          totalDays: 30,
          pricePerDay: 16.67,
          totalAmount: 500,
          platformFee: 50,
          spaceOwnerAmount: 450,
          paymentType: 'IMMEDIATE',
          payoutStatus: 'PENDING',
          adminNotes: JSON.stringify({
            isSimulation: true,
            createdAt: Date.now()
          })
        }
      });
      
      await sendWhatsAppMessage(
        `🧪 *Simulation Started!*\n\n` +
        `📋 *ID:* ${formatBookingId(testBooking.id)}\n` +
        `Status: PENDING_APPROVAL\n` +
        `Amount: $${Number(testBooking.totalAmount).toFixed(2)}\n\n` +
        `*Quick Actions:*\n` +
        `• Approve ${formatBookingId(testBooking.id)}\n` +
        `• Deny ${formatBookingId(testBooking.id)}\n` +
        `• Wait ${formatBookingId(testBooking.id)} (auto-flow with delays)\n` +
        `• Bypass ${formatBookingId(testBooking.id)} (instant complete)\n\n` +
        `💡 Type "Elaview-status" to see all active IDs`
      );
      
      return NextResponse.json({ 
        received: true, 
        command: 'simulate',
        bookingId: testBooking.id
      });
    }
    
    // Elaview-status command
    if (message.toLowerCase() === 'elaview-status') {
      console.log('📊 Fetching active simulations...');
      
      const activeBookings = await db.booking.findMany({
        where: {
          AND: [
            { status: { in: ['PENDING_APPROVAL', 'ACTIVE', 'AWAITING_PROOF'] } },
            { adminNotes: { contains: '"isSimulation":true' } },
            { NOT: { adminNotes: { contains: '"closed":true' } } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });
      
      if (activeBookings.length === 0) {
        await sendWhatsAppMessage(
          `📊 *Active Simulations*\n\n` +
          `No active simulations.\n\n` +
          `Type "Elaview-simulate" to create one.`
        );
      } else {
        const bookingList = activeBookings.map(b => {
          let createdAt = Date.now();
          try {
            const notes = JSON.parse(b.adminNotes || '{}');
            createdAt = notes.createdAt || Date.now();
          } catch {}
          
          return (
            `${getStatusEmoji(b.status)} *${formatBookingId(b.id)}* - ${b.status}\n` +
            `Created: ${getTimeElapsed(createdAt)}\n` +
            `Amount: $${Number(b.totalAmount).toFixed(2)}`
          );
        }).join('\n\n');
        
        await sendWhatsAppMessage(
          `📊 *Active Simulations:*\n\n` +
          `${bookingList}\n\n` +
          `Total: ${activeBookings.length} active simulation${activeBookings.length > 1 ? 's' : ''}\n\n` +
          `Copy/paste IDs to use commands.\n` +
          `Type "Commands" for help.`
        );
      }
      
      return NextResponse.json({ 
        received: true, 
        command: 'status',
        count: activeBookings.length
      });
    }
    
    // Wait command (with delays)
    const waitMatch = message.match(/^wait\s+([a-z0-9]+)/i);
    if (waitMatch) {
      const bookingIdPart = waitMatch[1]!;
      console.log(`⏳ Starting Wait simulation for: ${bookingIdPart}`);
      
      const bookings = await db.booking.findMany({
        where: { id: { startsWith: bookingIdPart } }
      });
      
      if (bookings.length === 0) {
        await sendWhatsAppMessage(
          `❌ Booking ${bookingIdPart} not found.\n\n` +
          `Type "Elaview-status" to see active IDs.`
        );
        return NextResponse.json({ received: true, error: 'Not found' });
      }
      
      const booking = bookings[0]!;
      
      // Run async workflow
      (async () => {
        try {
          await sendWhatsAppMessage(
            `⏳ Starting simulation for ${formatBookingId(booking.id)}...`
          );
          
          await delay(5000);
          await db.booking.update({
            where: { id: booking.id },
            data: { status: 'ACTIVE' }
          });
          await sendWhatsAppMessage(
            `✅ *Booking approved!* (ID: ${formatBookingId(booking.id)})\n` +
            `Status: ACTIVE`
          );
          
          await delay(5000);
          await db.booking.update({
            where: { id: booking.id },
            data: { 
              status: 'AWAITING_PROOF',
              proofPhotos: ['https://example.com/proof.jpg']
            }
          });
          await sendWhatsAppMessage(
            `📸 *Proof submitted!* (ID: ${formatBookingId(booking.id)})\n` +
            `Status: AWAITING_PROOF`
          );
          
          await delay(5000);
          await db.booking.update({
            where: { id: booking.id },
            data: { 
              status: 'COMPLETED',
              proofStatus: 'APPROVED',
              proofApprovedAt: new Date()
            }
          });
          await sendWhatsAppMessage(
            `✅ *Proof approved!* (ID: ${formatBookingId(booking.id)})\n` +
            `Processing payout...`
          );
          
          await delay(2000);
          await sendWhatsAppMessage(
            `💰 *Payout scheduled* for $${Number(booking.spaceOwnerAmount).toFixed(2)} (ID: ${formatBookingId(booking.id)})\n\n` +
            `✅ *Simulation complete!*`
          );
        } catch (error) {
          console.error('❌ Wait workflow error:', error);
          await sendWhatsAppMessage(
            `❌ Error in simulation: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      })();
      
      return NextResponse.json({ 
        received: true, 
        command: 'wait',
        bookingId: booking.id,
        message: 'Workflow started'
      });
    }
    
    // Bypass command (instant)
    const bypassMatch = message.match(/^bypass\s+([a-z0-9]+)/i);
    if (bypassMatch) {
      const bookingIdPart = bypassMatch[1]!;
      console.log(`⚡ Starting Bypass simulation for: ${bookingIdPart}`);
      
      const bookings = await db.booking.findMany({
        where: { id: { startsWith: bookingIdPart } }
      });
      
      if (bookings.length === 0) {
        await sendWhatsAppMessage(
          `❌ Booking ${bookingIdPart} not found.\n\n` +
          `Type "Elaview-status" to see active IDs.`
        );
        return NextResponse.json({ received: true, error: 'Not found' });
      }
      
      const booking = bookings[0]!;
      
      // Instant progression
      await db.booking.update({
        where: { id: booking.id },
        data: { 
          status: 'COMPLETED',
          proofStatus: 'APPROVED',
          proofPhotos: ['https://example.com/proof.jpg'],
          proofApprovedAt: new Date()
        }
      });
      
      await sendWhatsAppMessage(
        `⚡ *Bypass Complete!* (ID: ${formatBookingId(booking.id)})\n\n` +
        `✅ Booking approved\n` +
        `✅ Proof submitted\n` +
        `✅ Proof approved\n` +
        `💰 Payout scheduled: $${Number(booking.spaceOwnerAmount).toFixed(2)}\n\n` +
        `*Status:* COMPLETED`
      );
      
      return NextResponse.json({ 
        received: true, 
        command: 'bypass',
        bookingId: booking.id
      });
    }
    
    // Close command
    const closeMatch = message.match(/^close\s+([a-z0-9]+)/i);
    if (closeMatch) {
      const bookingIdPart = closeMatch[1]!;
      console.log(`🔒 Closing simulation: ${bookingIdPart}`);
      
      const bookings = await db.booking.findMany({
        where: { id: { startsWith: bookingIdPart } }
      });
      
      if (bookings.length === 0) {
        await sendWhatsAppMessage(
          `❌ Booking ${bookingIdPart} not found.\n\n` +
          `Type "Elaview-status" to see active IDs.`
        );
        return NextResponse.json({ received: true, error: 'Not found' });
      }
      
      const booking = bookings[0]!;
      
      let currentNotes = {};
      try {
        currentNotes = JSON.parse(booking.adminNotes || '{}');
      } catch {}
      
      await db.booking.update({
        where: { id: booking.id },
        data: {
          adminNotes: JSON.stringify({
            ...currentNotes,
            closed: true,
            closedAt: Date.now()
          })
        }
      });
      
      await sendWhatsAppMessage(
        `✅ *Simulation ${formatBookingId(booking.id)} closed* and removed from active list.`
      );
      
      return NextResponse.json({ 
        received: true, 
        command: 'close',
        bookingId: booking.id
      });
    }
    
    // Approve/Deny commands
    const approveMatch = message.match(/^approve\s+([a-z0-9]+)/i);
    const denyMatch = message.match(/^deny\s+([a-z0-9]+)/i);
    
    if (!approveMatch && !denyMatch) {
      console.log('ℹ️  Not a recognized command');
      await sendWhatsAppMessage(
        `❓ Command not recognized.\n\n` +
        `Type "Commands" to see available commands.`
      );
      return NextResponse.json({ received: true });
    }
    
    const command = approveMatch ? 'approve' : 'deny';
    const bookingIdPart = (approveMatch || denyMatch)![1];
    
    console.log(`🎯 Command: ${command}, Booking ID part: ${bookingIdPart}`);
    
    // Find booking by partial ID (first 8 characters)
    const bookings = await db.booking.findMany({
      where: {
        id: {
          startsWith: bookingIdPart
        }
      },
      include: {
        campaign: {
          select: {
            name: true,
            advertiser: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        space: {
          select: {
            title: true,
            owner: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    if (bookings.length === 0) {
      console.log('❌ No booking found');
      await sendWhatsAppMessage(
        `❌ Booking not found: ${bookingIdPart}\n\nPlease check the booking ID and try again.`
      );
      return NextResponse.json({ received: true, error: 'Booking not found' });
    }
    
    if (bookings.length > 1) {
      console.log('⚠️  Multiple bookings found');
      const bookingList = bookings.map(b => `• ${b.id.slice(0, 8)}`).join('\n');
      await sendWhatsAppMessage(
        `⚠️ Multiple bookings match "${bookingIdPart}":\n\n${bookingList}\n\nPlease be more specific.`
      );
      return NextResponse.json({ received: true, error: 'Multiple matches' });
    }
    
    const booking = bookings[0]!;
    console.log(`✅ Found booking: ${booking.id} (Status: ${booking.status})`);
    
    // Process command based on current status
    if (command === 'approve') {
      if (booking.status === 'PENDING_APPROVAL') {
        // Approve booking request
        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'ACTIVE',
            adminNotes: `Approved via WhatsApp command at ${new Date().toISOString()}`
          }
        });
        
        await sendWhatsAppMessage(
          `✅ *Booking Approved*\n\n` +
          `ID: ${booking.id.slice(0, 8)}\n` +
          `Campaign: ${booking.campaign.name}\n` +
          `Space: ${booking.space.title}\n` +
          `Amount: $${Number(booking.totalAmount).toFixed(2)}\n\n` +
          `Status changed: PENDING_APPROVAL → ACTIVE`
        );
        
        console.log('✅ Booking approved successfully');
        
      } else if (booking.status === 'AWAITING_PROOF') {
        // Approve installation proof
        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'COMPLETED',
            proofStatus: 'APPROVED',
            proofApprovedAt: new Date(),
            adminNotes: `Proof approved via WhatsApp command at ${new Date().toISOString()}`
          }
        });
        
        await sendWhatsAppMessage(
          `✅ *Proof Approved*\n\n` +
          `ID: ${booking.id.slice(0, 8)}\n` +
          `Space: ${booking.space.title}\n\n` +
          `Status changed: AWAITING_PROOF → COMPLETED\n` +
          `Payout processing initiated 💰`
        );
        
        console.log('✅ Proof approved successfully');
        
      } else {
        await sendWhatsAppMessage(
          `⚠️ Cannot approve booking ${booking.id.slice(0, 8)}\n\n` +
          `Current status: ${booking.status}\n` +
          `Expected: PENDING_APPROVAL or AWAITING_PROOF`
        );
        console.log(`⚠️  Invalid status for approval: ${booking.status}`);
      }
      
    } else if (command === 'deny') {
      if (booking.status === 'PENDING_APPROVAL') {
        // Deny booking request
        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'REJECTED',
            adminNotes: `Rejected via WhatsApp command at ${new Date().toISOString()}`
          }
        });
        
        await sendWhatsAppMessage(
          `🚫 *Booking Denied*\n\n` +
          `ID: ${booking.id.slice(0, 8)}\n` +
          `Campaign: ${booking.campaign.name}\n` +
          `Space: ${booking.space.title}\n\n` +
          `Status changed: PENDING_APPROVAL → REJECTED`
        );
        
        console.log('✅ Booking denied successfully');
        
      } else if (booking.status === 'AWAITING_PROOF') {
        // Reject installation proof
        await db.booking.update({
          where: { id: booking.id },
          data: {
            proofStatus: 'REJECTED',
            adminNotes: `Proof rejected via WhatsApp command at ${new Date().toISOString()}`
          }
        });
        
        await sendWhatsAppMessage(
          `🚫 *Proof Rejected*\n\n` +
          `ID: ${booking.id.slice(0, 8)}\n` +
          `Space: ${booking.space.title}\n\n` +
          `Proof status: REJECTED\n` +
          `Advertiser will be notified to resubmit.`
        );
        
        console.log('✅ Proof rejected successfully');
        
      } else {
        await sendWhatsAppMessage(
          `⚠️ Cannot deny booking ${booking.id.slice(0, 8)}\n\n` +
          `Current status: ${booking.status}\n` +
          `Expected: PENDING_APPROVAL or AWAITING_PROOF`
        );
        console.log(`⚠️  Invalid status for denial: ${booking.status}`);
      }
    }
    
    return NextResponse.json({ 
      received: true, 
      processed: true,
      command,
      bookingId: booking.id
    });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    
    // Try to send error message to WhatsApp
    try {
      await sendWhatsAppMessage(
        `❌ *Error Processing Command*\n\n` +
        `${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
        `Please try again or check the admin dashboard.`
      );
    } catch (sendError) {
      console.error('❌ Failed to send error message:', sendError);
    }
    
    return NextResponse.json({ 
      received: true, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Green API webhook endpoint is ready',
    timestamp: new Date().toISOString()
  });
}