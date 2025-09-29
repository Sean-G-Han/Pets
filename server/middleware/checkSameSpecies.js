const { supabaseRole } = require("../config/supabase");

module.exports = async (req, res, next) => {
  const { pet_id1, pet_id2 } = req.body;
  try {
    const { data: pets, error } = await supabaseRole
      .from("Pets")
      .select("species_id")
      .in("id", [pet_id1, pet_id2]);

    if (error) return res.status(500).json({ error: error.code });
    if (pets.length !== 2)
      return res.status(400).json({ error: "Invalid pet IDs" });
    if (pets[0].species_id !== pets[1].species_id)
      return res.status(400).json({ error: "Pets are not the same species" });

    next();
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
