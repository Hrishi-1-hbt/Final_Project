const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware"); // Ensure this exists
const Listing = require("../models/listing");
const Booking = require("../models/booking");

// Show listing details
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("show", { listing });
  } catch (err) {
    console.error(err);
    res.redirect("/listings");
  }
});

// Add booking route (Ensure this exists)
router.post("/:id/book", isLoggedIn, async (req, res) => {
  const { dateFrom, dateTo } = req.body.booking;
  const listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const booking = new Booking({
    user: req.user._id,
    listing: listing._id,
    dateFrom,
    dateTo,
  });

  await booking.save();
  req.flash("success", "Booking successful!");
  res.redirect(`/listings/${listing._id}`);
});

module.exports = router;
