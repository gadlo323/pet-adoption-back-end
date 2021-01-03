const router = require("express").Router();
const userControllar = require("../controllars/usersControllars");

//Signup API
router.post("/signup", userControllar.sign_up);

//Login API
router.post("/login", userControllar.sign_in);

router.post("/user/tokenValid", userControllar.token_valid);

//Update User API
router.patch("/user/:id", userControllar.user_update);

//Get User By ID API
router.get("/user/:id", userControllar.get_user);

//Get Pets By User ID API
router.get("/myPets/:id", userControllar.my_pets);

//Adopt/Foster API
router.post("/adopteFoster/:id", userControllar.adopet_foster);

//Save Pet API
router.post("/savePet/:id", userControllar.save_pet);

//delete Save Pet API
router.delete("/deletesavepet", userControllar.remove_save_pet);

//Return Pet API
router.post("/returnPet/", userControllar.return_pet);

module.exports = router;
