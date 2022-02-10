const express = require("express");
const { getUsers, updateUser, getUserById, getCsvFile } = require("../controllers/user");
const router = express.Router();

router.get("/getusers", getUsers);
router.put("/updateuser/:id", updateUser);
router.get("/getuserbyId/:id", getUserById);
router.get("/getCsvFile", getCsvFile);

module.exports = router;
