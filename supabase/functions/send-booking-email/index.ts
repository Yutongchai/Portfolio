// supabase/functions/send-booking-email/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "apikey, Authorization, Content-Type, x-client-info", // Must include x-client-info
};

serve(async (req: any) => {
    // 1. Handle the browser's "preflight" check
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: CORS_HEADERS });
    }
    try {
        const body = await req.json();
        console.log('Received payload:', JSON.stringify(body));

        const { email, slot, customerName, companyName, bookingId } = body;

        // Validate required fields
        if (!email || !customerName) {
            console.error('Validation failed - missing required fields:', { email: !!email, customerName: !!customerName });
            return new Response(JSON.stringify({
                error: 'Missing required fields',
                details: { email: !!email, customerName: !!customerName, slot: !!slot }
            }), {
                headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
                status: 400,
            });
        }

        const OWNER_EMAIL = 'yutongchai2@gmail.com';

        // HTML template for customer
        const customerHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="col  or: #153462;">Booking Confirmed</h2>
        <p>Hi ${customerName},</p>
        <p>Your consultation with <strong>EITO Group</strong> is confirmed:</p>
        <ul style="list-style: none; padding: 0;">
          <li><b>Date:</b> ${slot.day}</li>
          <li><b>Time:</b> ${slot.time}</li>
          <li><b>Company:</b> ${companyName}</li>
        </ul>
        <p>Booking ID: <small>${bookingId}</small></p>
      </div>
    `;

        // HTML template for owner
        const ownerHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #153462;">New Booking Received</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <ul style="list-style: none; padding: 0;">
          <li><b>Date:</b> ${slot.day}</li>
          <li><b>Time:</b> ${slot.time}</li>
        </ul>
        <p>Booking ID: <small>${bookingId}</small></p>
      </div>
    `;

        // Send email to owner first
        console.log('Sending email to owner:', OWNER_EMAIL);
        const ownerResult = await resend.emails.send({
            from: "EITO Admin <onboarding@resend.dev>", // Added 'Admin' to distinguish
            to: [OWNER_EMAIL],
            subject: `NEW BOOKING: ${companyName}`,
            html: ownerHtml,
        });
        console.log('Owner email result:', JSON.stringify(ownerResult));

        // Send confirmation email to customer (may fail in Resend sandbox mode)
        let customerEmailId = null;
        try {
            console.log('Sending email to customer (redirected to owner for testing):', OWNER_EMAIL);
            const customerResult = await resend.emails.send({
                from: "EITO Confirmation <onboarding@resend.dev>", // Different name
                to: [OWNER_EMAIL], // You are sending to yourself for testing
                subject: `CONFIRMATION: ${companyName}`,
                html: customerHtml,
            });
            console.log('Customer email result:', JSON.stringify(customerResult));

            if (customerResult.error) {
                console.warn('Customer email failed (likely Resend sandbox restriction):', customerResult.error);
            } else {
                customerEmailId = customerResult.data?.id;
            }
        } catch (customerError: any) {
            console.warn('Customer email failed:', customerError?.message);
            // Don't fail the whole request if customer email fails (Resend sandbox limitation)
        }

        return new Response(JSON.stringify({
            success: true,
            ownerEmailId: ownerResult.data?.id,
            customerEmailId: customerEmailId,
            note: customerEmailId ? 'Both emails sent' : 'Owner notified (customer email skipped - verify domain in Resend for production)'
        }), {
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error: any) {
        console.error('Function error:', error);
        // 3. Ensure your error response also includes the CORS_HEADERS
        return new Response(JSON.stringify({
            error: error?.message || String(error),
            stack: error?.stack
        }), {
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
            status: 500,
        });
    }
});