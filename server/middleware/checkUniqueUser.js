const { supabaseRole } = require("../config/supabase");

module.exports = async (req, res, next) => {
  const { display_name } = req.body;
  try {
    const { data: profiles, error } = await supabaseRole
      .from("User_Data")
      .select("auth_id")
      .eq("name", display_name);

    if (error) return res.status(500).json({ error: error.message });
    if (profiles.length > 0)
      return res.status(400).json({ error: "Display name already taken" });

    next();
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
