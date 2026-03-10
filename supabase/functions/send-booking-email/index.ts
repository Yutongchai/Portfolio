import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

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
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY_BOOKING');
        const resend = async (to: string, subject: string, html: string) => {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        };
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

        // PRODUCTION: secrets set via Supabase dashboard / CLI
        // TESTING: swap ADMIN_EMAIL_TO secret to yutongchai2@gmail.com
        //   npx supabase secrets set ADMIN_EMAIL_TO=yutongchai2@gmail.com
        const OWNER_EMAIL = Deno.env.get('ADMIN_EMAIL_TO') || 'info@eitogroup.com.my';
        const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'EITO Group <info@eitogroup.com.my>';

        // HTML template for customer
        const customerHtml = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,0.1);">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding:28px 24px 12px;">
                <img src="https://www.eitogroup.com.my/black.webp" alt="EITO" height="56" style="display:block;" />
              </td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="background:#0F3B5F;color:#ffffff;padding:24px 32px;">
                <h2 style="margin:0;font-size:22px;font-weight:700;">Booking Confirmed</h2>
                <p style="margin:8px 0 0;font-size:14px;color:#dbeafe;">Your consultation with EITO Group is confirmed</p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px 36px;color:#1f2937;">
                <p style="margin:0 0 24px;">Hi <strong>${customerName}</strong>, thank you for booking with us. Kindly wait for our admin to contact you to confirm the details.</p>

                <h3 style="margin:0 0 12px;font-size:16px;color:#0F3B5F;">Booking Details</h3>
                <table width="100%" cellpadding="6" cellspacing="0" style="margin-bottom:28px;">
                  <tr><td width="35%" style="color:#6b7280;">Company</td><td style="font-weight:600;">${companyName}</td></tr>
                  <tr><td style="color:#6b7280;">Date</td><td style="font-weight:600;">${slot.day}</td></tr>
                  <tr><td style="color:#6b7280;">Time</td><td style="font-weight:600;">${slot.time}</td></tr>
                  <tr><td style="color:#6b7280;">Booking ID</td><td style="font-weight:600;font-size:12px;color:#6b7280;">${bookingId}</td></tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;padding:18px 32px;font-size:12px;color:#6b7280;text-align:center;">
                This email was generated automatically from the EITO booking system.<br/>
                Please do not reply to this email. Our team will reach out to you shortly.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

        // HTML template for owner
        const ownerHtml = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,0.1);">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding:28px 24px 12px;">
                <img src="https://www.eitogroup.com.my/black.webp" alt="EITO" height="56" style="display:block;" />
              </td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="background:#0F3B5F;color:#ffffff;padding:24px 32px;">
                <h2 style="margin:0;font-size:22px;font-weight:700;">New Booking Received</h2>
                <p style="margin:8px 0 0;font-size:14px;color:#dbeafe;">Submitted via EITO website</p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px 36px;color:#1f2937;">
                <h3 style="margin:0 0 12px;font-size:16px;color:#0F3B5F;">Customer Information</h3>
                <table width="100%" cellpadding="6" cellspacing="0" style="margin-bottom:28px;">
                  <tr><td width="35%" style="color:#6b7280;">Customer</td><td style="font-weight:600;">${customerName}</td></tr>
                  <tr><td style="color:#6b7280;">Company</td><td style="font-weight:600;">${companyName}</td></tr>
                  <tr><td style="color:#6b7280;">Email</td><td style="font-weight:600;">${email}</td></tr>
                </table>

                <div style="height:2px;background:#F7931E;width:48px;margin:32px 0;"></div>

                <h3 style="margin:0 0 12px;font-size:16px;color:#0F3B5F;">Booking Details</h3>
                <table width="100%" cellpadding="6" cellspacing="0">
                  <tr><td width="35%" style="color:#6b7280;">Date</td><td style="font-weight:600;">${slot.day}</td></tr>
                  <tr><td style="color:#6b7280;">Time</td><td style="font-weight:600;">${slot.time}</td></tr>
                  <tr><td style="color:#6b7280;">Booking ID</td><td style="font-weight:600;font-size:12px;color:#6b7280;">${bookingId}</td></tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;padding:18px 32px;font-size:12px;color:#6b7280;text-align:center;">
                This email was generated automatically from the EITO booking system.<br/>
                Please respond directly to the customer using the email address above.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

        // Send email to owner
        console.log('Sending email to owner:', OWNER_EMAIL);
        await resend(OWNER_EMAIL, `NEW BOOKING from ${companyName}`, ownerHtml);
        console.log('Owner email sent');

        // Send confirmation email to customer
        console.log('Sending confirmation email to customer:', email);
        const customerResult = await resend(email, `Booking Confirmed – ${companyName}`, customerHtml);
        console.log('Customer email result:', JSON.stringify(customerResult));
        const customerEmailId = customerResult?.id;

        return new Response(JSON.stringify({
            success: true,
            customerEmailId: customerEmailId,
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