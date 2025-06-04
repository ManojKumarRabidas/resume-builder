import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true
  },
  template: {
    type: String,
    required: [true, 'Template is required'],
    enum: ['modern', 'minimal', 'executive', 'creative'],
    default: 'modern'
  },
  content: {
    personal: {
      name: String,
      email: String,
      phone: String,
      location: String,
      website: String,
      title: String,
      summary: String
    },
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      description: String
    }],
    experience: [{
      company: String,
      position: String,
      location: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String,
      highlights: [String]
    }],
    skills: {
      technical: [String],
      soft: [String],
      languages: [String]
    },
    projects: [{
      name: String,
      description: String,
      link: String,
      technologies: [String],
      highlights: [String]
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String,
      link: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ResumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Resume = mongoose.model('Resume', ResumeSchema);

export default Resume;