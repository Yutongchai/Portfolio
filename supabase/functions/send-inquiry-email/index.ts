import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  try {
    // 1. Read secrets
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const ADMIN_EMAIL_TO = Deno.env.get("ADMIN_EMAIL_TO");
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL");

    if (!RESEND_API_KEY || !ADMIN_EMAIL_TO || !FROM_EMAIL) {
      throw new Error("Missing email configuration");
    }

    // 2. Read webhook payload
    const payload = await req.json();

    const table = payload.table;
    const record = payload.record;

    const isTrainingProgram = table === "training_program_inquiries";

    if (!record) {
      return new Response("No record found", { status: 200 });
    }

// 3. Friendly subject
const tableNameMap: Record<string, string> = {
  csr_inquiries: "CSR",
  team_building_inquiries: "Team Building",
  corporate_event_inquiries: "Corporate Event",
  training_program_inquiries: "Training Program",
};

const inquiryType = tableNameMap[table] ?? "General";

const subject = `📩 New ${inquiryType} Inquiry`;

// 4. Build clean HTML email
const emailHtml = `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <!-- Card -->
          <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,0.1);">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding:28px 24px 12px;">
                <img src="LOGO_URL_HERE" alt="EITO" height="56" style="display:block;" />
              </td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="background:#0F3B5F;color:#ffffff;padding:24px 32px;">
                <h2 style="margin:0;font-size:22px;font-weight:700;">
                  New ${inquiryType} Inquiry
                </h2>
                <p style="margin:8px 0 0;font-size:14px;color:#dbeafe;">
                  Submitted via EITO website
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px 36px;color:#1f2937;">

                <!-- Contact -->
                <h3 style="margin:0 0 12px;font-size:16px;color:#0F3B5F;">
                  Contact Information
                </h3>
                <table width="100%" cellpadding="6" cellspacing="0" style="margin-bottom:28px;">
                  <tr><td width="35%" style="color:#6b7280;">Name</td><td style="font-weight:600;">${record.name ?? "-"}</td></tr>
                  <tr><td style="color:#6b7280;">Company</td><td style="font-weight:600;">${record.company_name ?? "-"}</td></tr>
                  <tr><td style="color:#6b7280;">Email</td><td style="font-weight:600;">${record.company_email ?? "-"}</td></tr>
                  <tr><td style="color:#6b7280;">Contact</td><td style="font-weight:600;">${record.contact ?? "-"}</td></tr>
                </table>

                <!-- Divider -->
                <div style="height:2px;background:#F7931E;width:48px;margin:32px 0;"></div>

                <!-- Event & Training Details -->
                <h3 style="margin:0 0 12px;font-size:16px;color:#0F3B5F;">
                  Event Details
                </h3>

                <table width="100%" cellpadding="6" cellspacing="0">

                  <tr>
                    <td width="35%" style="color:#6b7280;">Industry</td>
                    <td style="font-weight:600;">${record.industry ?? "-"}</td>
                  </tr>

                  <tr>
                    <td style="color:#6b7280;">No. of Pax</td>
                    <td style="font-weight:600;">${record.no_of_pax ?? "-"}</td>
                  </tr>

                  <tr>
                    <td style="color:#6b7280;">Duration</td>
                    <td style="font-weight:600;">${record.duration ?? "-"}</td>
                  </tr>

                  ${isTrainingProgram ? `
                    <!-- Spacer -->
                    <tr><td colspan="2" style="padding-top:18px;"></td></tr>

                    <!-- Section Title -->
                    <tr>
                      <td colspan="2" style="font-weight:700;color:#0F3B5F;padding-bottom:6px;">
                        Training Program Details
                      </td>
                    </tr>

                    <tr>
                      <td style="color:#6b7280;">Training Types</td>
                      <td style="font-weight:600;">
                        ${
                          Array.isArray(record.types_of_training)
                            ? record.types_of_training.join(", ")
                            : record.types_of_training ?? "-"
                        }
                      </td>
                    </tr>

                    <tr>
                      <td style="color:#6b7280;">Estimated Training Month</td>
                      <td style="font-weight:600;">
                        ${record.estimated_training_month ?? "-"}
                      </td>
                    </tr>

                    <tr>
                      <td style="color:#6b7280;">HRDC Claimable</td>
                      <td style="font-weight:600;">
                        ${record.hrdc ? "Yes" : "No"}
                      </td>
                    </tr>
                  ` : ""}

                  <!-- Spacer -->
                  <tr><td colspan="2" style="padding-top:18px;"></td></tr>

                  <tr>
                    <td style="color:#6b7280;">Budget</td>
                    <td style="font-weight:600;">RM ${record.budget ?? "-"}</td>
                  </tr>

                  <tr>
                    <td style="color:#6b7280;">Location</td>
                    <td style="font-weight:600;">${record.preferred_location ?? "-"}</td>
                  </tr>

                  <tr>
                    <td style="color:#6b7280;">Language</td>
                    <td style="font-weight:600;">${record.language ?? "-"}</td>
                  </tr>

                </table>
                <!-- Additional Remarks -->
                ${
                  record.remarks
                    ? `
                      <div style="margin-top:32px;padding:20px;background:#FBE9D0;border-radius:10px;">
                        <h4 style="margin:0 0 6px;color:#0F3B5F;">Additional Remarks</h4>
                        <p style="margin:0;color:#374151;line-height:1.6;">
                          ${record.remarks}
                        </p>
                      </div>
                    `
                    : ""
                }

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;padding:18px 32px;font-size:12px;color:#6b7280;text-align:center;">
                This email was generated automatically from the EITO inquiry system.<br/>
                Please respond directly using the contact details above.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    // 5. Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL_TO,
        subject,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    return new Response("Email sent", { status: 200 });
  } catch (error) {
    console.error("Email function error:", error);
    return new Response("Internal error", { status: 500 });
  }
});

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-inquiry-email' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODU0NjI2NTF9.6CtFOCPGXXwiX6NGOHiyqocQN6ulHFPIVaMV9tNNahybXjgsT3HbFbADSQtkyRi7FdBVnH5A3mp9nkC1dI2l_A' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/