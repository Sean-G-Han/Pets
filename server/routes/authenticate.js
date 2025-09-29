const express = require("express");
const router = express.Router();
const { supabaseRole, supabaseLower } = require("../config/supabase");
const checkUniqueUser = require("../middleware/checkUniqueUser");

router.post("/register", checkUniqueUser, async (req, res) => {
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
    maxAge: 86400000,
  });

  res.json({ message: "User registered", access_token });
});

router.post("/login", async (req, res) => {
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
    maxAge: 86400000,
  });

  res.json({
    message: "Logged in successfully",
    access_token: data.session?.access_token,
  });
});

module.exports = router;
