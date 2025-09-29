const express = require("express");
const router = express.Router();
const { createClient } = require("../config/supabase");
const { getToken } = require("../middleware/auth");
const checkSameSpecies = require("../middleware/checkSameSpecies");
const checkSameOwner = require("../middleware/checkSameOwner");
const { statsBound } = require("../middleware/stats");

router.get("/my-pets", async (req, res) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: "Missing token" });

  const supabaseUser = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const {
    data: { user },
    error: userError,
  } = await supabaseUser.auth.getUser();
  if (userError || !user)
    return res.status(401).json({ error: "Invalid token" });

  const { data, error } = await supabaseUser
    .from("Pets")
    .select(`id, atk, def, spd, hp, Species(species_name, atk, def, spd, hp)`)
    .eq("owner_uid", user.id);

  if (error) return res.status(400).json({ error: error.code });

  const flattened = data.map((pet) => {
    const base = pet.Species;
    return {
      id: pet.id,
      species_name: base.species_name,
      atk: Math.round(base.atk * (1 + pet.atk / 100)),
      def: Math.round(base.def * (1 + pet.def / 100)),
      spd: Math.round(base.spd * (1 + pet.spd / 100)),
      hp: Math.round(base.hp * (1 + pet.hp / 100)),
    };
  });

  res.json({ pets: flattened });
});

router.post(
  "/breed-pets",
  checkSameSpecies,
  checkSameOwner,
  async (req, res) => {
    const { pet_id1, pet_id2 } = req.body;
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: "Missing token" });

    const supabaseUser = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: pets, error } = await supabaseUser
      .from("Pets")
      .select(
        `species_id, atk, def, spd, hp, owner_uid, Species(species_name, atk, def, spd, hp)`
      )
      .in("id", [pet_id1, pet_id2]);

    if (error) return res.status(400).json({ error: error.code });
    if (!pets || pets.length < 2)
      return res.status(400).json({ error: "Both parents not found" });

    const childInsert = {
      species_id: pets[0].species_id,
      atk: statsBound((pets[0].atk + pets[1].atk) / 2 + (2.5 - Math.random() * 5)),
      def: statsBound((pets[0].def + pets[1].def) / 2 * (2.5 - Math.random() * 5)),
      spd: statsBound((pets[0].spd + pets[1].spd) / 2 * (2.5 - Math.random() * 5)),
      hp: statsBound((pets[0].hp + pets[1].hp) / 2 * (2.5 - Math.random() * 5)),
      owner_uid: pets[0].owner_uid,
    };

    const { data: insertedData, error: breedingError } = await supabaseUser
      .from("Pets")
      .insert([childInsert])
      .select(
        `id, atk, def, spd, hp, owner_uid, Species (species_name, atk, def, spd, hp)`
      );

    if (breedingError)
      return res.status(400).json({ error: breedingError.code });

    const newPet = insertedData[0];
    const base = newPet.Species;

    const childResponse = {
      id: newPet.id,
      owner_uid: newPet.owner_uid,
      species_name: base.species_name,
      atk: Math.round(base.atk * (1 + newPet.atk / 100)),
      def: Math.round(base.def * (1 + newPet.def / 100)),
      spd: Math.round(base.spd * (1 + newPet.spd / 100)),
      hp: Math.round(base.hp * (1 + newPet.hp / 100)),
    };

    res.json({ message: "Breeding successful", child: childResponse });
  }
);

module.exports = router;
