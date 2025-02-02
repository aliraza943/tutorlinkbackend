const express = require('express');
const router = express.Router();
const Tutor = require('../models/tutors');
const User = require('../models/userModel');
const Review = require("../models/reviewModel");
const Session = require("../models/sessionModel")


router.get('/', async (req, res) => {
  try {
    const { status, subject, rating, teacherName } = req.query;
    console.log(req.query);
    const filter = {};
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (rating) filter.rating = parseInt(rating);
    if (teacherName) filter.name = { $regex: teacherName, $options: 'i' };

    const tutors = await Tutor.find(filter).select('-email -password');

    res.json(tutors);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching tutors');
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      return res.json({
        message: 'Login successful',
        role: 'student',
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
      });
    }

    const tutor = await Tutor.findOne({ email, password });
    if (tutor) {
      return res.json({
        message: 'Login successful',
        role: 'teacher',
        user: {
          id: tutor._id,
          email: tutor.email,
          name: tutor.name
        },
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/getSession/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)

    const tutor = await Tutor.findById(id).select(' -password');

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    res.json(tutor);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching tutor');
  }
});


router.post("/submitReview", async (req, res) => {

  try {
    const { sessionId, teacherId, studentId, stars, teacherName, studentName, review } = req.body;
    console.log("Incoming Review Request:", req.body);
    const existingReview = await Review.findOne({ sessionId });
    if (existingReview) {
      return res.status(400).json({ error: "Review for this session already exists." });
    }

    const newReview = new Review({
      sessionId,
      teacherId,
      studentId,
      stars,
      teacherName,
      studentName,
      review,
    });

    const savedReview = await newReview.save();

    const reviews = await Review.find({ teacherId });
    const totalReviews = reviews.length;
    const totalStars = reviews.reduce((sum, r) => sum + r.stars, 0);
    const averageRating = totalReviews > 0 ? (totalStars / totalReviews).toFixed(2) : 0;

    await Tutor.findOneAndUpdate(
      { _id: teacherId },
      { $set: { rating: averageRating, isRated: true } }
    );

    await Session.findOneAndUpdate(
      { _id: sessionId },
      { $set: { isReviewed: true } }
    );

    res.status(201).json({
      message: "Review submitted successfully!",
      review: savedReview,
      newAverageRating: averageRating,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
});
router.put('/updateTutor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, availableDays, availableTime, status, price } = req.body;
    console.log(req.body)

    const updatedTutor = await Tutor.findByIdAndUpdate(
      id,
      { name, description, availableDays, availableTime, status, price },
      { new: true, runValidators: true }
    );

    if (!updatedTutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.json({ message: "Tutor updated successfully", tutor: updatedTutor });
  } catch (error) {
    console.error("Error updating tutor:", error);
    res.status(500).json({ message: "Failed to update tutor" });
  }
});
router.get('/getReviews/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;

    const reviews = await Review.find({ teacherId });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this teacher' });
    }

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching reviews');
  }
});
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, username, subject, description, price, availableDays, startTime, endTime
    } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists in User database' });
    }

    let tutor = await Tutor.findOne({ email });
    if (tutor) {
      return res.status(400).json({ message: 'Email already exists in Tutor database' });
    }

    if (role === 'teacher') {
      const availableTime = [startTime, endTime];
      tutor = new Tutor({
        email,
        password,
        name: username,
        rating: 1,
        status: 'offline',
        subject,
        price,
        description,
        availableDays,
        availableTime
      });
      await tutor.save();
      return res.status(201).json({
        message: 'Teacher account created successfully',
        user: {
          id: tutor._id,
          email: tutor.email,
          role: 'teacher',
        },
      });
    } else if (role === 'student') {
      user = new User({
        email,
        password,
        name: username,
      });
      await user.save();
      return res.status(201).json({
        message: 'Student account created successfully',
        user: {
          id: user._id,
          email: user.email,
          role: 'student',
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;
