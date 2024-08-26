const express = require("express");
const router = express.Router();
const PartyListingcontroller = require("../controllers/PartyListingcontroller");

router.post("/createPartyListing", PartyListingcontroller.createPartyListing);
router.post(
  "/partyListingInformation",
  PartyListingcontroller.createPartyListingInformation
);
router.delete(
  "/deleteCitizenPartyList/:nationalID",
  PartyListingcontroller.deleteCitizenPartyList
);

module.exports = router;
