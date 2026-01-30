const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load the server-specific .env in the server/ directory so the service
// role key can live there while the project root may have other VITE_ vars.
dotenv.config({ path: path.join(__dirname, ".env") });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Root: friendly guide for human visitors
app.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(`
    <html>
      <head><title>Portfolio API</title></head>
      <body style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#111;margin:3rem">
        <h1>Portfolio API</h1>
        <p>Available endpoints:</p>
        <ul>
          <li><a href="/api/health">/api/health</a> — health check</li>
          <li>/api/projects — GET/POST projects (see README)</li>
          <li>/api/project-types — POST to add a new type</li>
        </ul>
        <p>Use the API endpoints from your client or curl. Do not expose the service role key in client-side code.</p>
      </body>
    </html>
  `);
});

// GET all projects (including gallery and type)
app.get("/api/projects", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `*, project_gallery(url, alt), project_types(type_key, id as type_id)`,
      )
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create or update project
app.post("/api/projects", async (req, res) => {
  const payload = req.body;
  if (!payload) return res.status(400).json({ error: "Missing body" });

  try {
    let projectId = payload.id || null;

    if (projectId) {
      const { error: updateErr } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", projectId);
      if (updateErr) throw updateErr;
    } else {
      const { data: inserted, error: insertErr } = await supabase
        .from("projects")
        .insert([payload])
        .select()
        .single();
      if (insertErr) throw insertErr;
      projectId = inserted.id;
    }

    // sync gallery if provided
    if (projectId && Array.isArray(payload.gallery)) {
      const { error: delErr } = await supabase
        .from("project_gallery")
        .delete()
        .eq("project_id", projectId);
      if (delErr) throw delErr;
      if (payload.gallery.length) {
        const rows = payload.gallery.map((g) => ({
          project_id: projectId,
          url: g.url,
          alt: g.alt || null,
        }));
        const { error: insErr } = await supabase
          .from("project_gallery")
          .insert(rows);
        if (insErr) throw insErr;
      }
    }

    return res.json({ ok: true, id: projectId });
  } catch (err) {
    console.error("Error in /api/projects", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// Create a project type
app.post("/api/project-types", async (req, res) => {
  const { type_key, description } = req.body || {};
  if (!type_key) return res.status(400).json({ error: "type_key required" });
  try {
    const { data, error } = await supabase
      .from("project_types")
      .insert([{ type_key, description: description || null }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// List project types
app.get("/api/project-types", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("project_types")
      .select("id, type_key, description, display_order")
      .order("display_order", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data || []);
  } catch (err) {
    console.error("Error fetching project types:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// === FORM SUBMISSION ENDPOINTS ===

// Submit Team Building Inquiry
app.post("/api/inquiries/team-building", async (req, res) => {
  try {
    const { error } = await supabase
      .from("team_building_inquiries")
      .insert([req.body]);

    if (error) throw error;

    // TODO: Send email notification to client email
    // For now, just log the submission
    console.log("Team Building Inquiry:", req.body);

    return res.json({ ok: true, message: "Inquiry submitted successfully" });
  } catch (err) {
    console.error("Error submitting team building inquiry:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// Submit Training Program Inquiry
app.post("/api/inquiries/training-program", async (req, res) => {
  try {
    const { error } = await supabase
      .from("training_program_inquiries")
      .insert([req.body]);

    if (error) throw error;

    // TODO: Send email notification to client email
    console.log("Training Program Inquiry:", req.body);

    return res.json({ ok: true, message: "Inquiry submitted successfully" });
  } catch (err) {
    console.error("Error submitting training program inquiry:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// Submit CSR Inquiry
app.post("/api/inquiries/csr", async (req, res) => {
  try {
    const { error } = await supabase.from("csr_inquiries").insert([req.body]);

    if (error) throw error;

    // TODO: Send email notification to client email
    console.log("CSR Inquiry:", req.body);

    return res.json({ ok: true, message: "Inquiry submitted successfully" });
  } catch (err) {
    console.error("Error submitting CSR inquiry:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// Submit Corporate Event Inquiry
app.post("/api/inquiries/corporate-event", async (req, res) => {
  try {
    const { error } = await supabase
      .from("corporate_event_inquiries")
      .insert([req.body]);

    if (error) throw error;

    // TODO: Send email notification to client email
    console.log("Corporate Event Inquiry:", req.body);

    return res.json({ ok: true, message: "Inquiry submitted successfully" });
  } catch (err) {
    console.error("Error submitting corporate event inquiry:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () =>
  console.log(`API server listening on http://localhost:${port}`),
);
