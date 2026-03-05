import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const supabaseUrl = "https://faclulceyzjtkaqeidge.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2x1bGNleXpqdGthcWVpZGdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODk4MTg2MCwiZXhwIjoyMDg0NTU3ODYwfQ.MXQpoj6v166hXICGLLlOD7IiTfoIRbc7P1DLHJ7NxSI"; // Use service role key for server-side operations

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadLogo() {
  try {
    const file = readFileSync(
      "C:\\Users\\user\\Documents\\GitHub\\Portfolio\\public\\navy.webp",
    );

    const { data, error } = await supabase.storage
      .from("client-logos")
      .upload("eito-logo.webp", file, {
        contentType: "image/webp",
        upsert: true,
      });

    if (error) throw error;

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/client-logos/eito-logo.webp`;
    console.log("Logo uploaded successfully!");
    console.log("Public URL:", publicUrl);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

uploadLogo();
