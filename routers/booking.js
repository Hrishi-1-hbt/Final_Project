const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

// Show listing details
// GET route to render the booking form
router.get("/:id/book", isLoggedIn, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    // Render the booking form view and pass the listing details
    res.render("listings/booking", { listing, currUser: req.user });
  } catch (err) {
    console.error("Error fetching listing for booking:", err);
    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect("/listings");
  }
});



// Add booking route with improved validation & error handling
router.post("/:id/book", isLoggedIn, async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.body.booking;
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Validate date inputs
    if (!dateFrom || !dateTo || new Date(dateFrom) >= new Date(dateTo)) {
      req.flash("error", "Invalid booking dates!");
      return res.redirect(`/listings/${listing._id}`);
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      listing: listing._id,
      $or: [
        { dateFrom: { $lte: dateTo }, dateTo: { $gte: dateFrom } }
      ]
    });

    if (overlappingBooking) {
      req.flash("error", "This listing is already booked for the selected dates.");
      return res.redirect(`/listings/${listing._id}`);
    }

    // Create a new booking
    const booking = new Booking({
      user: req.user._id,
      listing: listing._id,
      dateFrom,
      dateTo,
    });

    await booking.save();
    req.flash("success", "Booking successful!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error("Booking Error:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/listings");
  }
});

module.exports = router;
