const { supabaseRole, createClient } = require("../config/supabase");
const { getToken } = require("./auth");

module.exports = async (req, res, next) => {
  const { pet_id1, pet_id2 } = req.body;
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: "Missing token" });

  const supabaseUser = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  try {
    const { data: pets, error } = await supabaseRole
      .from("Pets")
      .select("owner_uid")
      .in("id", [pet_id1, pet_id2]);
    if (error) return res.status(500).json({ error: error.code });
    if (pets.length !== 2)
      return res.status(400).json({ error: "Invalid pet IDs" });

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();
    if (userError || !user)
      return res.status(401).json({ error: "Invalid token" });

    if (
      pets[0].owner_uid !== pets[1].owner_uid ||
      pets[0].owner_uid !== user.id
    ) {
      return res
        .status(400)
        .json({ error: "Pets do not have the same owner" });
    }

    next();
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
