const router = require("express").Router();
const petControllar = require("../controllars/adoptionCon");
const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../utils/auth");
const { isAdmin } = require("../utils/auth");

const storage = multer.diskStorage({
  destination: "./pets-photos",
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname} - ${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

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

module.exports = router;
