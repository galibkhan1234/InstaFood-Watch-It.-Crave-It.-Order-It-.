const express = require("express");
const router = express.Router();

const controller = require("../controllers/partner.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

// USER: submit application
router.post("/apply", protect, authorize("USER"), controller.applyPartner);

// ADMIN: list all applications (with ?status=PENDING|APPROVED|REJECTED)
router.get("/applications", protect, authorize("ADMIN"), controller.getAllApplications);

// ADMIN: view single application
router.get("/applications/:id", protect, authorize("ADMIN"), controller.getApplicationById);

// ADMIN: approve or reject
router.put("/review/:id", protect, authorize("ADMIN"), controller.reviewApplication);

module.exports = router;