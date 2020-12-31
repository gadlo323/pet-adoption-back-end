const router = require("express").Router();
const petControllar = require("../controllars/petsControllars");
const upload = require("../utils/multer");
const { isAdmin } = require("../utils/auth");

// ADMIN :Edit Pet API
router.post(
  "/addpet",
  isAdmin,
  upload.single("petImage"),
  petControllar.add_pet
);

//Get Pet By ID API
router.get("/pet/:id", petControllar.get_pet);

//Get Pets API
router.post("/search", petControllar.search);

module.exports = router;
