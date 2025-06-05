import express from 'express';
import Resume from '../models/Resume.js';
import { protect } from '../middleware/auth.js';
import generateResume from '../utils/resumeGenerator.js'
import User from '../models/User.js' // Adjust path to your User model
import moment from 'moment';
import mongoose from 'mongoose';
const router = express.Router();

// @route   GET /api/resumes
// @desc    Get all user's resumes
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    
    // Validate limit parameter
    if (limit !== undefined && (isNaN(limit) || limit < 1)) {
      return res.status(400).json({ message: 'Limit must be a positive integer' });
    }

    // Fetch resumes and total count in parallel
    const [resumes, totalResumes] = await Promise.all([
      Resume.find({ user: req.user._id })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .lean(),
      Resume.countDocuments({ user: req.user._id })
    ]);

    // Format response
    res.json({
      resumes,
      totalResumes
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/resumes
// @desc    Create a new resume
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, template } = req.body;
    
    const user = await User.findById(req.user._id );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    };

    
    const content = user.profile || {
          // Default content structure if user profile is not available
          basic: {},
          education: [],
          experience: [],
          skills: {
            technical: [],
            soft: [],
            languages: []
          },
          projects: [],
          certifications: []
        }
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

router.get('/generate-resume/:id', protect, async (req, res, next) => {
  try {
    if(!req.params.id){
      return res.status(401).json({ message: 'Resumne id missing!' });
    }
    // Assuming user is authenticated and req.user contains user info
    const resume = await Resume.findById(req.params.id);
    if (!resume && !resume.template) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    // Generate the PDF using the user's profile data
    const pdfBuffer = await generateResume(resume, resume.template);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${req.user.name}_resume.pdf`);
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
    let { title, template, content } = req.body;
    
    let resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    // Define date fields for each section of the profile
    const dateFields = {
      education: ['startDate', 'endDate'],
      experience: ['startDate', 'endDate'],
      certifications: ['date'],
    };
    // Define sections that contain arrays with _id fields
    const idFields = ['education', 'experience', 'projects', 'certifications'];

    /* Sanitizes _id fields in array sections by removing invalid _id fields
     * @param {Object} data - The resume data object
     * @returns {Object} - The resume data with sanitized _id fields
     */
    function sanitizeIds(data) {
      const newData = JSON.parse(JSON.stringify(data));
      for (const section of idFields) {
        if (newData && newData[section]) {
          newData[section] = newData[section].map((item) => {
            const newItem = { ...item };
            // Check if _id is an object with $oid and starts with 'new-'
            if (
              newItem._id &&
              typeof newItem._id === 'object' &&
              newItem._id.$oid &&
              newItem._id.$oid.startsWith('new-')
            ) {
              // Remove _id for new entries, letting Mongoose generate a new ObjectId
              delete newItem._id;
            } else if (newItem._id && !mongoose.Types.ObjectId.isValid(newItem._id)) {
              // Remove invalid _id fields that aren't proper ObjectIds
              delete newItem._id;
            }
            return newItem;
          });
        }
      }

      return newData;
    }
    // Function to convert date strings to Date objects
     /* Converts date fields in the resume data to YYYY-MM-DD format
     * @param {Object} data - The resume data object
     * @returns {Object} - The resume data with converted dates
     */
    function convertDates(data) {
      // Create a deep copy of the input data to avoid mutating it
      const newData = JSON.parse(JSON.stringify(data));

      // Iterate over sections with date fields
      for (const [section, fields] of Object.entries(dateFields)) {
        if (newData.content && newData.content[section]) {
          newData.content[section] = newData.content[section].map((item) => {
            const newItem = { ...item };
            fields.forEach((field) => {
              if (newItem[field]) {
                // Try parsing as ISO date (YYYY-MM-DD) or full JavaScript date string
                const parsedDate = moment(
                  newItem[field],
                  ['YYYY-MM-DD', 'ddd MMM DD YYYY HH:mm:ss [GMT]Z (z)'],
                  true
                );
                if (parsedDate.isValid()) {
                  newItem[field] = parsedDate.format('YYYY-MM-DD');
                } else {
                  // Handle invalid dates by setting to empty string
                  newItem[field] = '';
                }
              } else {
                // Handle empty string or null
                newItem[field] = '';
              }
            });
            return newItem;
          });
        }
      }

      return newData;
    }

    // Sanitize _id fields
    content = sanitizeIds(content);
    // Convert dates in the content
    content = convertDates(content);

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