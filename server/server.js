const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS for frontend (browser)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  })
);

const supabaseRole = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabaseLower = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function getToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.split(" ")[1];
  return req.cookies?.access_token || null;
}

const _checkUniqueUser = async (req, res, next) => {
  const { display_name } = req.body;
  try {
    const { data: profiles, error: profileError } = await supabaseRole
      .from("User_Data")
      .select("auth_id")
      .eq("name", display_name);

    if (profileError)
      return res.status(500).json({ error: profileError.message });
    if (profiles.length > 0)
      return res.status(400).json({ error: "Display name already taken" });

    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const _checkSameSpecies = async (req, res, next) => {
  const { pet_id1, pet_id2 } = req.body;
  try {
    const { data: pets, error: petsError } = await supabaseRole
      .from("Pets")
      .select("species_id")
      .in("id", [pet_id1, pet_id2]);

    if (petsError) return res.status(500).json({ error: petsError.code });
    if (pets.length !== 2)
      return res.status(400).json({ error: "Invalid pet IDs" });
    if (pets[0].species_id !== pets[1].species_id) {
      return res.status(400).json({ error: "Pets are not the same species" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const _checkSameOwner = async (req, res, next) => {
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
      return res.status(400).json({ error: "Pets do not have the same owner" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

app.post("/register", _checkUniqueUser, async (req, res) => {
  const { email, password, display_name } = req.body;

  const { data: userData, error: userError } = await supabaseRole.auth.signUp({
    email,
    password,
  });

  const auth_id = userData?.user?.id;
  const access_token = userData?.session?.access_token;

  if (userError) return res.status(400).json({ error: userError.code });

  const { error: profileError } = await supabaseRole
    .from("User_Data")
    .insert([{ auth_id, name: display_name }]);
  if (profileError) return res.status(400).json({ error: profileError.code });

  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.json({ message: "User registered", access_token });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabaseLower.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.code });

  res.cookie("access_token", data.session?.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.json({
    message: "Logged in successfully",
    access_token: data.session?.access_token,
  });
});

app.get("/my-pets", async (req, res) => {
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
    .select("species:Species(species_name), atk, def, spd, hp, id")
    .eq("owner_uid", user.id);

  if (error) return res.status(400).json({ error: error.code });

  const flattened = data.map((pet) => ({
    id: pet.id,
    atk: pet.atk,
    def: pet.def,
    spd: pet.spd,
    hp: pet.hp,
    species_name: pet.species.species_name,
  }));

  res.json({ pets: flattened });
});

app.post(
  "/breed-pets",
  _checkSameSpecies,
  _checkSameOwner,
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
        "species:Species(species_name), species_id, atk, def, spd, hp, owner_uid"
      )
      .in("id", [pet_id1, pet_id2]);
    if (error) return res.status(400).json({ error: error.code });

    const childInsert = {
      species_id: pets[0].species_id,
      atk: Math.floor(
        ((pets[0].atk + pets[1].atk) / 2) * (0.9 + Math.random() * 0.2)
      ),
      def: Math.floor(
        ((pets[0].def + pets[1].def) / 2) * (0.9 + Math.random() * 0.2)
      ),
      spd: Math.floor(
        ((pets[0].spd + pets[1].spd) / 2) * (0.9 + Math.random() * 0.2)
      ),
      hp: Math.floor(
        ((pets[0].hp + pets[1].hp) / 2) * (0.9 + Math.random() * 0.2)
      ),
      owner_uid: pets[0].owner_uid,
    };

    const { data: insertedData, error: breedingError } = await supabaseUser
      .from("Pets")
      .insert([childInsert])
      .select("id, atk, def, spd, hp, owner_uid");

    if (breedingError)
      return res.status(400).json({ error: breedingError.code });

    const childResponse = {
      ...insertedData[0],
      species_name: pets[0].species?.species_name ?? "ERROR",
    };

    console.log("New pet bred:", childResponse);

    res.json({ message: "Breeding successful", child: childResponse });
  }
);

// Start server
app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
