import express from 'express';
import Resume from '../models/Resume.js';
import { protect } from '../middleware/auth.js';
import generateResume from '../utils/resumeGenerator.js'
import User from '../models/User.js' // Adjust path to your User model
const router = express.Router();

// @route   GET /api/resumes
// @desc    Get all user's resumes
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(limit);
    
    res.json(resumes);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/resumes
// @desc    Create a new resume
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, template, content } = req.body;
    
    const resume = await Resume.create({
      user: req.user._id,
      title,
      template,
      content
    });
    
    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
});

router.get('/generate-resume', protect, async (req, res, next) => {
  try {
    if(!req.user){
      return res.status(401).json({ message: 'User not authenticated' });
    }
    // Assuming user is authenticated and req.user contains user info
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate the PDF using the user's profile data
    const pdfBuffer = await generateResume(user.profile);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${user.name}_resume.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/resumes/:id
// @desc    Get resume by ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/resumes/:id
// @desc    Update resume
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const { title, template, content } = req.body;
    
    let resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    // Update resume fields
    resume.title = title || resume.title;
    resume.template = template || resume.template;
    
    if (content) {
      resume.content = {
        ...resume.content,
        ...content
      };
    }
    
    // Save updates
    await resume.save();
    
    res.json(resume);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/resumes/:id
// @desc    Delete resume
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    await resume.deleteOne();
    
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    next(error);
  }
});
export default router;