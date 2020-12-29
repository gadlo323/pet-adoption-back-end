const router = require("express").Router();
const petControllar = require("../controllars/adoptionCon");
const upload = require("../utils/multer");
const { verifyToken } = require("../utils/auth");
const { isAdmin } = require("../utils/auth");

router.post("/signup", petControllar.sign_up);

router.post("/login", petControllar.sign_in);

router.post(
  "/addpet",
  isAdmin,
  upload.single("petImage"),
  petControllar.add_pet
);
router.post("/user/tokenValid", petControllar.token_valid);

router.patch("/user/:id", petControllar.user_update);

router.get("/user/:id", petControllar.get_user);

router.get("/pet/:id", petControllar.get_pet);

router.post("/searchType", petControllar.search_type);
router.post("/searchAdvance", petControllar.search_advance);

module.exports = router;
