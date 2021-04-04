const express = require("express");

const UserController = require("../controller/user");

const router = express.Router();

router.get("/user-details/:id", UserController.getDetails);
router.post("/addFunds", UserController.addFunds);

module.exports = router;