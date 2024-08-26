const { PartyListing, PartyListingInformation, Citizen } = require("../models");
const { Op, where, Sequelize } = require("sequelize");

/****************create partyID Listing****************** */
exports.createPartyListing = async (req, res) => {
  try {
    // 1. إنشاء دائرة جديدة
    const partylist = await PartyListing.create(req.body);
    res.status(201).json({
      message: "party listing created successfully",
      partyID: partylist.partyID,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res
        .status(400)
        .json({ error: "A party listing with this name already exists." });
    } else {
      console.error("Error creating party listing :", error);
      res.status(500).json({ error: "Error creating party listing " });
    }
  }
};

/****************end create partyID Listing****************** */
/****************create candidates from party Listing Information****************** */

exports.createPartyListingInformation = async (req, res) => {
  try {
    // التحقق من وجود nationalID في جدول Citizens

    const citizen = await Citizen.findOne({
      where: {
        nationalID: req.body.nationalID,
        [Op.or]: [{ isCandidate: false }, { isCandidate: null }],
      },
    });

    // إذا لم يتم العثور على المواطن
    if (!citizen) {
      return res
        .status(400)
        .json({ error: "Citizen with this nationalID does not exist" });
    }

    // إنشاء السجل إذا كان nationalID موجودًا
    const partyListingInformation = await PartyListingInformation.create(
      req.body
    );
    res.status(201).json({
      message: "party Listing Information created successfully",
      partyListingInformationId: PartyListingInformation.partyInformationID,
    });
  } catch (error) {
    console.error("Error creating party Listing Information:", error);
    res.status(500).json({ error: "Error creating party Listing Information" });
  }
};
/****************end create candidates from party Listing Information****************** */

/****************delete Citizen from party Listing Information****************** */
exports.deleteCitizenPartyList = async (req, res) => {
  const { nationalID } = req.params; // الحصول على nationalID من req.params
  try {
    const deletedCitizen = await PartyListingInformation.destroy({
      where: { nationalID: nationalID },
    });

    if (deletedCitizen) {
      res.status(200).json({
        message: "Citizen information deleted successfully",
      });
    } else {
      res.status(404).json({ error: "Citizen not found" });
    }
  } catch (error) {
    console.error("Error deleting citizen", error);
    res.status(500).json({ error: "Error deleting citizen" });
  }
};
/****************end delete Citizen from party Listing Information****************** */
