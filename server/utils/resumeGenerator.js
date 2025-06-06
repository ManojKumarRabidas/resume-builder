import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import PdfPrinter from 'pdfmake';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';

// These two lines recreate __filename and __dirname in ES modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

pdfMake.vfs = pdfFonts;

// Load fonts
const fonts = {
  Roboto: {
    normal: path.join(__dirname, '../fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '../fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '../fonts/Roboto-MediumItalic.ttf')
  }
};

const printer = new PdfPrinter(fonts);

// Helper function to format dates to DD/MM/YYYY
const formatDate = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    return 'Not Provided';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const generateResume = (userData, template) => {
    try{
        // Validate userData.content
        if (!userData || !userData.content) {
        throw new Error('userData.content is undefined or null');
        }

        const { basic = {}, education = [], experience = [], skills = {}, projects= [], certifications= [] } = userData.content;

        // Validate basic fields
        const basicDefaults = {
        name: 'Not Provided',
        email: 'Not Provided',
        phone: 'Not Provided',
        location: 'Not Provided',
        bio: 'Not Provided'
        };
        const validatedBasic = { ...basicDefaults, ...basic };

        // Validate skills
        const validatedSkills = {
        technical: skills.technical || ['Not Provided'],
        soft: skills.soft || ['Not Provided'],
        languages: skills.languages || ['Not Provided']
        };

        let documentDefinition = {}
        if(template == "modern") {
            documentDefinition = {
                pageSize: 'A4',
                pageMargins: [0, 0, 0, 0], // Full bleed for header
                content: [
                    // Modern Header with colored background
                    {
                        stack: [
                            {
                                canvas: [
                                    {
                                        type: 'rect',
                                        x: 0,
                                        y: 0,
                                        w: 595,
                                        h: 120,
                                        color: '#2C3E50'
                                    }
                                ]
                            },
                            {
                                stack: [
                                    { 
                                        text: validatedBasic.name, 
                                        style: 'headerName',
                                        margin: [40, -110, 40, 5]
                                    },
                                    { 
                                        text: userData.title || 'Professional', 
                                        style: 'headerTitle',
                                        margin: [40, 0, 40, 15]
                                    },
                                    {
                                        columns: [
                                            { 
                                                text: validatedBasic.email || 'email@example.com', 
                                                style: 'headerContact' 
                                            },
                                            { 
                                                text: validatedBasic.phone || 'Phone', 
                                                style: 'headerContact',
                                                alignment: 'center'
                                            },
                                            { 
                                                text: validatedBasic.location || 'Location', 
                                                style: 'headerContact',
                                                alignment: 'right'
                                            }
                                        ],
                                        margin: [40, 0, 40, 0]
                                    },
                                    validatedBasic.website && {
                                        text: validatedBasic.website,
                                        style: 'headerWebsite',
                                        margin: [40, 5, 40, 20]
                                    }
                                ].filter(Boolean)
                            }
                        ]
                    },
                    
                    // Main Content with proper margins
                    {
                        stack: [
                            // Professional Summary with modern styling
                            {
                                stack: [
                                    { 
                                        text: 'PROFESSIONAL SUMMARY', 
                                        style: 'modernSectionHeader' 
                                    },
                                    {
                                        canvas: [
                                            {
                                                type: 'line',
                                                x1: 0,
                                                y1: 0,
                                                x2: 60,
                                                y2: 0,
                                                lineWidth: 3,
                                                lineColor: '#3498DB'
                                            }
                                        ],
                                        margin: [0, 2, 0, 8]
                                    },
                                    { 
                                        text: validatedBasic.bio || 'Dedicated professional with expertise in delivering exceptional results.',
                                        style: 'summaryText'
                                    }
                                ],
                                margin: [40, 25, 40, 20]
                            },

                            // Work Experience with enhanced layout
                            {
                                stack: [
                                    { 
                                        text: 'WORK EXPERIENCE', 
                                        style: 'modernSectionHeader' 
                                    },
                                    {
                                        canvas: [
                                            {
                                                type: 'line',
                                                x1: 0,
                                                y1: 0,
                                                x2: 60,
                                                y2: 0,
                                                lineWidth: 3,
                                                lineColor: '#3498DB'
                                            }
                                        ],
                                        margin: [0, 2, 0, 12]
                                    },
                                    ...experience.map((exp, index) => ({
                                        stack: [
                                            {
                                                columns: [
                                                    {
                                                        stack: [
                                                            { 
                                                                text: exp.position || 'Position Title', 
                                                                style: 'jobTitle' 
                                                            },
                                                            { 
                                                                text: exp.company || 'Company Name', 
                                                                style: 'companyName' 
                                                            }
                                                        ],
                                                        width: '*'
                                                    },
                                                    {
                                                        stack: [
                                                            { 
                                                                text: `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`, 
                                                                style: 'dateRange',
                                                                alignment: 'right'
                                                            },
                                                            { 
                                                                text: exp.location || 'Location', 
                                                                style: 'jobLocation',
                                                                alignment: 'right'
                                                            }
                                                        ],
                                                        width: 'auto'
                                                    }
                                                ]
                                            },
                                            exp.description && { 
                                                text: exp.description, 
                                                style: 'jobDescription',
                                                margin: [0, 8, 0, 5]
                                            },
                                            exp.highlights && exp.highlights.length > 0 && {
                                                ul: exp.highlights.slice(0, 4).map(highlight => highlight || 'Achievement'),
                                                style: 'achievementsList',
                                                margin: [0, 5, 0, index < experience.length - 1 ? 15 : 0]
                                            }
                                        ].filter(Boolean)
                                    }))
                                ],
                                margin: [40, 0, 40, 20]
                            },

                            // Two-column layout for Skills and Education
                            {
                                columns: [
                                    // Left Column - Skills
                                    {
                                        stack: [
                                            { 
                                                text: 'SKILLS', 
                                                style: 'modernSectionHeader' 
                                            },
                                            {
                                                canvas: [
                                                    {
                                                        type: 'line',
                                                        x1: 0,
                                                        y1: 0,
                                                        x2: 40,
                                                        y2: 0,
                                                        lineWidth: 3,
                                                        lineColor: '#3498DB'
                                                    }
                                                ],
                                                margin: [0, 2, 0, 8]
                                            },
                                            validatedSkills.technical.length > 0 && {
                                                stack: [
                                                    { text: 'Technical', style: 'skillCategory' },
                                                    { 
                                                        text: validatedSkills.technical.slice(0, 8).join(' • ') || 'Technical skills',
                                                        style: 'skillsList'
                                                    }
                                                ],
                                                margin: [0, 0, 0, 8]
                                            },
                                            validatedSkills.soft.length > 0 && {
                                                stack: [
                                                    { text: 'Soft Skills', style: 'skillCategory' },
                                                    { 
                                                        text: validatedSkills.soft.slice(0, 6).join(' • ') || 'Soft skills',
                                                        style: 'skillsList'
                                                    }
                                                ],
                                                margin: [0, 0, 0, 8]
                                            },
                                            validatedSkills.languages.length > 0 && {
                                                stack: [
                                                    { text: 'Languages', style: 'skillCategory' },
                                                    { 
                                                        text: validatedSkills.languages.slice(0, 4).join(' • ') || 'Languages',
                                                        style: 'skillsList'
                                                    }
                                                ]
                                            }
                                        ].filter(Boolean),
                                        width: '48%'
                                    },
                                    
                                    // Right Column - Education
                                    {
                                        stack: [
                                            { 
                                                text: 'EDUCATION', 
                                                style: 'modernSectionHeader' 
                                            },
                                            {
                                                canvas: [
                                                    {
                                                        type: 'line',
                                                        x1: 0,
                                                        y1: 0,
                                                        x2: 40,
                                                        y2: 0,
                                                        lineWidth: 3,
                                                        lineColor: '#3498DB'
                                                    }
                                                ],
                                                margin: [0, 2, 0, 8]
                                            },
                                            ...education.map(edu => ({
                                                stack: [
                                                    { 
                                                        text: `${edu.degree || 'Degree'} in ${edu.field || 'Field'}`, 
                                                        style: 'degreeTitle' 
                                                    },
                                                    { 
                                                        text: edu.institution || 'Institution Name', 
                                                        style: 'institutionName' 
                                                    },
                                                    { 
                                                        text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, 
                                                        style: 'educationDate' 
                                                    }
                                                ],
                                                margin: [0, 0, 0, 10]
                                            }))
                                        ].filter(Boolean),
                                        width: '48%'
                                    }
                                ],
                                columnGap: 20,
                                margin: [40, 0, 40, 20]
                            },

                            // Projects Section (if exists)
                            projects.length > 0 && {
                                stack: [
                                    { 
                                        text: 'PROJECTS', 
                                        style: 'modernSectionHeader' 
                                    },
                                    {
                                        canvas: [
                                            {
                                                type: 'line',
                                                x1: 0,
                                                y1: 0,
                                                x2: 60,
                                                y2: 0,
                                                lineWidth: 3,
                                                lineColor: '#3498DB'
                                            }
                                        ],
                                        margin: [0, 2, 0, 8]
                                    },
                                    ...projects.slice(0, 3).map(proj => ({
                                        stack: [
                                            { 
                                                text: proj.name || 'Project Name', 
                                                style: 'projectTitle' 
                                            },
                                            { 
                                                text: proj.description || 'Project description and key achievements.',
                                                style: 'projectDescription' 
                                            },
                                            proj.technologies && {
                                                text: `Technologies: ${proj.technologies.join(', ')}`,
                                                style: 'projectTech'
                                            }
                                        ].filter(Boolean),
                                        margin: [0, 0, 0, 12]
                                    }))
                                ],
                                margin: [40, 0, 40, 20]
                            },

                            // Certifications Section (if exists)
                            certifications.length > 0 && {
                                stack: [
                                    { 
                                        text: 'CERTIFICATIONS', 
                                        style: 'modernSectionHeader' 
                                    },
                                    {
                                        canvas: [
                                            {
                                                type: 'line',
                                                x1: 0,
                                                y1: 0,
                                                x2: 60,
                                                y2: 0,
                                                lineWidth: 3,
                                                lineColor: '#3498DB'
                                            }
                                        ],
                                        margin: [0, 2, 0, 8]
                                    },
                                    {
                                        columns: certifications.slice(0, 4).map(cert => ({
                                            stack: [
                                                { 
                                                    text: cert.name || 'Certification Name', 
                                                    style: 'certTitle' 
                                                },
                                                { 
                                                    text: cert.issuer || 'Issuing Organization', 
                                                    style: 'certIssuer' 
                                                },
                                                { 
                                                    text: formatDate(cert.date) || 'Date', 
                                                    style: 'certDate' 
                                                }
                                            ],
                                            width: '*'
                                        })),
                                        columnGap: 15
                                    }
                                ],
                                margin: [40, 0, 40, 30]
                            }
                        ].filter(Boolean)
                    }
                ],
                
                styles: {
                    // Header Styles
                    headerName: { 
                        fontSize: 28, 
                        bold: true, 
                        color: '#FFFFFF',
                        alignment: 'center'
                    },
                    headerTitle: { 
                        fontSize: 16, 
                        color: '#ECF0F1',
                        alignment: 'center'
                    },
                    headerContact: { 
                        fontSize: 11, 
                        color: '#BDC3C7'
                    },
                    headerWebsite: { 
                        fontSize: 11, 
                        color: '#3498DB',
                        alignment: 'center',
                        decoration: 'underline'
                    },
                    
                    // Section Headers
                    modernSectionHeader: { 
                        fontSize: 13, 
                        bold: true, 
                        color: '#2C3E50'
                    },
                    
                    // Summary
                    summaryText: { 
                        fontSize: 11, 
                        lineHeight: 1.5, 
                        color: '#34495E',
                        alignment: 'justify'
                    },
                    
                    // Work Experience
                    jobTitle: { 
                        fontSize: 13, 
                        bold: true, 
                        color: '#2C3E50'
                    },
                    companyName: { 
                        fontSize: 11, 
                        color: '#3498DB',
                        italics: true,
                        margin: [0, 2, 0, 0]
                    },
                    dateRange: { 
                        fontSize: 10, 
                        color: '#7F8C8D',
                        bold: true
                    },
                    jobLocation: { 
                        fontSize: 10, 
                        color: '#95A5A6',
                        margin: [0, 2, 0, 0]
                    },
                    jobDescription: { 
                        fontSize: 10, 
                        lineHeight: 1.4, 
                        color: '#34495E',
                        alignment: 'justify'
                    },
                    achievementsList: { 
                        fontSize: 10, 
                        lineHeight: 1.3, 
                        color: '#2C3E50',
                        margin: [15, 0, 0, 0]
                    },
                    
                    // Skills
                    skillCategory: { 
                        fontSize: 11, 
                        bold: true, 
                        color: '#3498DB'
                    },
                    skillsList: { 
                        fontSize: 10, 
                        lineHeight: 1.3, 
                        color: '#34495E',
                        margin: [0, 3, 0, 0]
                    },
                    
                    // Education
                    degreeTitle: { 
                        fontSize: 11, 
                        bold: true, 
                        color: '#2C3E50'
                    },
                    institutionName: { 
                        fontSize: 10, 
                        color: '#3498DB',
                        italics: true,
                        margin: [0, 2, 0, 0]
                    },
                    educationDate: { 
                        fontSize: 9, 
                        color: '#7F8C8D',
                        margin: [0, 2, 0, 0]
                    },
                    
                    // Projects
                    projectTitle: { 
                        fontSize: 11, 
                        bold: true, 
                        color: '#2C3E50'
                    },
                    projectDescription: { 
                        fontSize: 10, 
                        lineHeight: 1.3, 
                        color: '#34495E',
                        margin: [0, 3, 0, 2]
                    },
                    projectTech: { 
                        fontSize: 9, 
                        color: '#3498DB',
                        italics: true
                    },
                    
                    // Certifications
                    certTitle: { 
                        fontSize: 10, 
                        bold: true, 
                        color: '#2C3E50'
                    },
                    certIssuer: { 
                        fontSize: 9, 
                        color: '#3498DB',
                        margin: [0, 2, 0, 0]
                    },
                    certDate: { 
                        fontSize: 9, 
                        color: '#7F8C8D',
                        margin: [0, 1, 0, 0]
                    }
                },
                
                defaultStyle: { 
                    fontSize: 10, 
                    color: '#2C3E50'
                }
            };
        } else if(template == "minimal") {
            documentDefinition = {
                pageSize: 'A4',
                pageMargins: [50, 50, 50, 50],
                content: [
                    // Header
                    {
                        stack: [
                            { 
                                text: validatedBasic.name, 
                                style: 'name' 
                            },
                            { 
                                text: userData.title || 'Professional', 
                                style: 'title' 
                            },
                            {
                                text: [
                                    validatedBasic.email || 'email@example.com',
                                    ' | ',
                                    validatedBasic.phone || 'Phone',
                                    ' | ',
                                    validatedBasic.location || 'Location'
                                ].join(''),
                                style: 'contact'
                            },
                            validatedBasic.website && {
                                text: validatedBasic.website,
                                style: 'website'
                            }
                        ],
                        margin: [0, 0, 0, 20]
                    },

                    // Professional Summary
                    validatedBasic.bio && {
                        stack: [
                            { text: 'SUMMARY', style: 'sectionHeader' },
                            { text: validatedBasic.bio, style: 'bodyText' }
                        ],
                        margin: [0, 0, 0, 15]
                    },

                    // Work Experience
                    experience.length > 0 && {
                        stack: [
                            { text: 'EXPERIENCE', style: 'sectionHeader' },
                            ...experience.map(exp => ({
                                stack: [
                                    {
                                        columns: [
                                            { 
                                                text: `${exp.position || 'Position'} - ${exp.company || 'Company'}`, 
                                                style: 'jobTitle',
                                                width: '*'
                                            },
                                            { 
                                                text: `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`, 
                                                style: 'dateText',
                                                alignment: 'right',
                                                width: 'auto'
                                            }
                                        ]
                                    },
                                    exp.location && { 
                                        text: exp.location, 
                                        style: 'locationText' 
                                    },
                                    exp.description && { 
                                        text: exp.description, 
                                        style: 'bodyText',
                                        margin: [0, 3, 0, 0]
                                    },
                                    exp.highlights && exp.highlights.length > 0 && {
                                        ul: exp.highlights.slice(0, 3),
                                        style: 'bulletList'
                                    }
                                ].filter(Boolean),
                                margin: [0, 0, 0, 10]
                            }))
                        ],
                        margin: [0, 0, 0, 15]
                    },

                    // Education
                    education.length > 0 && {
                        stack: [
                            { text: 'EDUCATION', style: 'sectionHeader' },
                            ...education.map(edu => ({
                                columns: [
                                    {
                                        text: `${edu.degree || 'Degree'} - ${edu.institution || 'Institution'}`,
                                        style: 'jobTitle',
                                        width: '*'
                                    },
                                    {
                                        text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`,
                                        style: 'dateText',
                                        alignment: 'right',
                                        width: 'auto'
                                    }
                                ],
                                margin: [0, 0, 0, 5]
                            }))
                        ],
                        margin: [0, 0, 0, 15]
                    },

                    // Skills
                    (validatedSkills.technical.length > 0 || validatedSkills.soft.length > 0) && {
                        stack: [
                            { text: 'SKILLS', style: 'sectionHeader' },
                            validatedSkills.technical.length > 0 && {
                                text: `Technical: ${validatedSkills.technical.slice(0, 8).join(', ')}`,
                                style: 'bodyText',
                                margin: [0, 0, 0, 3]
                            },
                            validatedSkills.soft.length > 0 && {
                                text: `Soft Skills: ${validatedSkills.soft.slice(0, 6).join(', ')}`,
                                style: 'bodyText',
                                margin: [0, 0, 0, 3]
                            },
                            validatedSkills.languages.length > 0 && {
                                text: `Languages: ${validatedSkills.languages.slice(0, 4).join(', ')}`,
                                style: 'bodyText'
                            }
                        ].filter(Boolean),
                        margin: [0, 0, 0, 15]
                    },

                    // Projects
                    projects.length > 0 && {
                        stack: [
                            { text: 'PROJECTS', style: 'sectionHeader' },
                            ...projects.slice(0, 2).map(proj => ({
                                stack: [
                                    { 
                                        text: proj.name || 'Project Name', 
                                        style: 'jobTitle' 
                                    },
                                    { 
                                        text: proj.description || 'Project description',
                                        style: 'bodyText',
                                        margin: [0, 2, 0, 0]
                                    },
                                    proj.technologies && {
                                        text: `Technologies: ${proj.technologies.join(', ')}`,
                                        style: 'techText'
                                    }
                                ].filter(Boolean),
                                margin: [0, 0, 0, 8]
                            }))
                        ],
                        margin: [0, 0, 0, 15]
                    },

                    // Certifications
                    certifications.length > 0 && {
                        stack: [
                            { text: 'CERTIFICATIONS', style: 'sectionHeader' },
                            ...certifications.slice(0, 3).map(cert => ({
                                columns: [
                                    {
                                        text: `${cert.name || 'Certification'} - ${cert.issuer || 'Issuer'}`,
                                        style: 'jobTitle',
                                        width: '*'
                                    },
                                    {
                                        text: formatDate(cert.date) || 'Date',
                                        style: 'dateText',
                                        alignment: 'right',
                                        width: 'auto'
                                    }
                                ],
                                margin: [0, 0, 0, 3]
                            }))
                        ]
                    }
                ].filter(Boolean),
                
                styles: {
                    name: { 
                        fontSize: 20, 
                        bold: true, 
                        alignment: 'center',
                        color: '#000000'
                    },
                    title: { 
                        fontSize: 12, 
                        alignment: 'center',
                        color: '#666666',
                        margin: [0, 3, 0, 5]
                    },
                    contact: { 
                        fontSize: 10, 
                        alignment: 'center',
                        color: '#333333'
                    },
                    website: { 
                        fontSize: 10, 
                        alignment: 'center',
                        color: '#0066CC',
                        margin: [0, 3, 0, 0]
                    },
                    sectionHeader: { 
                        fontSize: 12, 
                        bold: true,
                        color: '#000000',
                        margin: [0, 0, 0, 5]
                    },
                    jobTitle: { 
                        fontSize: 11, 
                        bold: true,
                        color: '#000000'
                    },
                    bodyText: { 
                        fontSize: 10,
                        color: '#333333',
                        lineHeight: 1.3
                    },
                    dateText: { 
                        fontSize: 10,
                        color: '#666666'
                    },
                    locationText: { 
                        fontSize: 9,
                        color: '#666666',
                        italics: true
                    },
                    bulletList: { 
                        fontSize: 10,
                        color: '#333333',
                        margin: [10, 3, 0, 0]
                    },
                    techText: { 
                        fontSize: 9,
                        color: '#666666',
                        italics: true,
                        margin: [0, 2, 0, 0]
                    }
                },
                
                defaultStyle: { 
                    fontSize: 10,
                    color: '#333333'
                }
            };
        } else if(template == "executive") {
            documentDefinition = {
                pageSize: 'A4',
                pageMargins: [60, 50, 60, 50],
                content: [
                    // Executive Header with refined styling
                    {
                        stack: [
                            { 
                                text: validatedBasic.name.toUpperCase(), 
                                style: 'executiveName' 
                            },
                            { 
                                text: userData.title || 'Senior Executive', 
                                style: 'executiveTitle' 
                            },
                            // Elegant separator line
                            {
                                canvas: [
                                    {
                                        type: 'line',
                                        x1: 0,
                                        y1: 0,
                                        x2: 475,
                                        y2: 0,
                                        lineWidth: 1,
                                        lineColor: '#8B4513'
                                    }
                                ],
                                margin: [0, 8, 0, 8]
                            },
                            // Premium contact layout
                            {
                                columns: [
                                    {
                                        text: validatedBasic.email || 'executive@company.com',
                                        style: 'executiveContact',
                                        width: '*'
                                    },
                                    {
                                        text: validatedBasic.phone || '+1 (555) 000-0000',
                                        style: 'executiveContact',
                                        alignment: 'center',
                                        width: '*'
                                    },
                                    {
                                        text: validatedBasic.location || 'City, State',
                                        style: 'executiveContact',
                                        alignment: 'right',
                                        width: '*'
                                    }
                                ]
                            },
                            validatedBasic.website && {
                                text: validatedBasic.website,
                                style: 'executiveWebsite',
                                alignment: 'center',
                                margin: [0, 5, 0, 0]
                            }
                        ],
                        margin: [0, 0, 0, 25]
                    },

                    // Executive Summary (emphasized)
                    validatedBasic.bio && {
                        stack: [
                            { text: 'EXECUTIVE SUMMARY', style: 'executiveSectionHeader' },
                            {
                                canvas: [
                                    {
                                        type: 'line',
                                        x1: 0,
                                        y1: 0,
                                        x2: 40,
                                        y2: 0,
                                        lineWidth: 2,
                                        lineColor: '#8B4513'
                                    }
                                ],
                                margin: [0, 3, 0, 8]
                            },
                            { 
                                text: validatedBasic.bio, 
                                style: 'executiveSummary'
                            }
                        ],
                        margin: [0, 0, 0, 20]
                    },

                    // Professional Experience (detailed focus)
                    experience.length > 0 && {
                        stack: [
                            { text: 'PROFESSIONAL EXPERIENCE', style: 'executiveSectionHeader' },
                            {
                                canvas: [
                                    {
                                        type: 'line',
                                        x1: 0,
                                        y1: 0,
                                        x2: 40,
                                        y2: 0,
                                        lineWidth: 2,
                                        lineColor: '#8B4513'
                                    }
                                ],
                                margin: [0, 3, 0, 12]
                            },
                            ...experience.map((exp, index) => ({
                                stack: [
                                    // Premium job header
                                    {
                                        columns: [
                                            {
                                                stack: [
                                                    { 
                                                        text: exp.position?.toUpperCase() || 'SENIOR POSITION', 
                                                        style: 'executivePosition' 
                                                    },
                                                    { 
                                                        text: exp.company || 'Company Name', 
                                                        style: 'executiveCompany' 
                                                    }
                                                ],
                                                width: '*'
                                            },
                                            {
                                                stack: [
                                                    { 
                                                        text: `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`, 
                                                        style: 'executiveDate',
                                                        alignment: 'right'
                                                    },
                                                    exp.location && { 
                                                        text: exp.location, 
                                                        style: 'executiveLocation',
                                                        alignment: 'right'
                                                    }
                                                ].filter(Boolean),
                                                width: 'auto'
                                            }
                                        ]
                                    },
                                    // Refined description
                                    exp.description && { 
                                        text: exp.description, 
                                        style: 'executiveDescription',
                                        margin: [0, 6, 0, 4]
                                    },
                                    // Key achievements with premium styling
                                    exp.highlights && exp.highlights.length > 0 && {
                                        stack: [
                                            { text: 'Key Achievements:', style: 'achievementHeader' },
                                            {
                                                ul: exp.highlights.slice(0, 4).map(highlight => highlight || 'Strategic achievement'),
                                                style: 'executiveAchievements'
                                            }
                                        ],
                                        margin: [0, 3, 0, index < experience.length - 1 ? 18 : 12]
                                    }
                                ].filter(Boolean)
                            }))
                        ],
                        margin: [0, 0, 0, 20]
                    },

                    // Two-column layout for supporting sections
                    {
                        columns: [
                            // Left Column - Education & Certifications
                            {
                                stack: [
                                    // Education
                                    education.length > 0 && {
                                        stack: [
                                            { text: 'EDUCATION', style: 'executiveSectionHeader' },
                                            {
                                                canvas: [
                                                    {
                                                        type: 'line',
                                                        x1: 0,
                                                        y1: 0,
                                                        x2: 30,
                                                        y2: 0,
                                                        lineWidth: 2,
                                                        lineColor: '#8B4513'
                                                    }
                                                ],
                                                margin: [0, 3, 0, 8]
                                            },
                                            ...education.map(edu => ({
                                                stack: [
                                                    { 
                                                        text: edu.degree || 'Degree', 
                                                        style: 'executiveDegree' 
                                                    },
                                                    { 
                                                        text: edu.institution || 'Institution', 
                                                        style: 'executiveInstitution' 
                                                    },
                                                    { 
                                                        text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, 
                                                        style: 'executiveEducationDate' 
                                                    }
                                                ],
                                                margin: [0, 0, 0, 8]
                                            }))
                                        ].filter(Boolean),
                                        margin: [0, 0, 0, 15]
                                    },
                                    
                                    // Certifications
                                    certifications.length > 0 && {
                                        stack: [
                                            { text: 'CERTIFICATIONS', style: 'executiveSectionHeader' },
                                            {
                                                canvas: [
                                                    {
                                                        type: 'line',
                                                        x1: 0,
                                                        y1: 0,
                                                        x2: 30,
                                                        y2: 0,
                                                        lineWidth: 2,
                                                        lineColor: '#8B4513'
                                                    }
                                                ],
                                                margin: [0, 3, 0, 8]
                                            },
                                            ...certifications.slice(0, 4).map(cert => ({
                                                stack: [
                                                    { 
                                                        text: cert.name || 'Professional Certification', 
                                                        style: 'executiveCertName' 
                                                    },
                                                    { 
                                                        text: `${cert.issuer || 'Issuing Organization'} • ${formatDate(cert.date) || 'Year'}`, 
                                                        style: 'executiveCertDetails' 
                                                    }
                                                ],
                                                margin: [0, 0, 0, 6]
                                            }))
                                        ]
                                    }
                                ].filter(Boolean),
                                width: '45%'
                            },
                            
                            // Right Column - Core Competencies & Projects
                            {
                                stack: [
                                    // Core Competencies
                                    (validatedSkills.technical.length > 0 || validatedSkills.soft.length > 0) && {
                                        stack: [
                                            { text: 'CORE COMPETENCIES', style: 'executiveSectionHeader' },
                                            {
                                                canvas: [
                                                    {
                                                        type: 'line',
                                                        x1: 0,
                                                        y1: 0,
                                                        x2: 30,
                                                        y2: 0,
                                                        lineWidth: 2,
                                                        lineColor: '#8B4513'
                                                    }
                                                ],
                                                margin: [0, 3, 0, 8]
                                            },
                                            validatedSkills.technical.length > 0 && {
                                                stack: [
                                                    { text: 'Technical Leadership', style: 'competencyCategory' },
                                                    { 
                                                        text: validatedSkills.technical.slice(0, 6).join(' • '), 
                                                        style: 'competencyList' 
                                                    }
                                                ],
                                                margin: [0, 0, 0, 6]
                                            },
                                            validatedSkills.soft.length > 0 && {
                                                stack: [
                                                    { text: 'Executive Skills', style: 'competencyCategory' },
                                                    { 
                                                        text: validatedSkills.soft.slice(0, 6).join(' • '), 
                                                        style: 'competencyList' 
                                                    }
                                                ],
                                                margin: [0, 0, 0, 6]
                                            },
                                            validatedSkills.languages.length > 0 && {
                                                stack: [
                                                    { text: 'Languages', style: 'competencyCategory' },
                                                    { 
                                                        text: validatedSkills.languages.slice(0, 4).join(' • '), 
                                                        style: 'competencyList' 
                                                    }
                                                ]
                                            }
                                        ].filter(Boolean),
                                        margin: [0, 0, 0, 15]
                                    },
                                    
                                    // Strategic Projects
                                    projects.length > 0 && {
                                        stack: [
                                            { text: 'STRATEGIC PROJECTS', style: 'executiveSectionHeader' },
                                            {
                                                canvas: [
                                                    {
                                                        type: 'line',
                                                        x1: 0,
                                                        y1: 0,
                                                        x2: 30,
                                                        y2: 0,
                                                        lineWidth: 2,
                                                        lineColor: '#8B4513'
                                                    }
                                                ],
                                                margin: [0, 3, 0, 8]
                                            },
                                            ...projects.slice(0, 2).map(proj => ({
                                                stack: [
                                                    { 
                                                        text: proj.name || 'Strategic Initiative', 
                                                        style: 'executiveProjectTitle' 
                                                    },
                                                    { 
                                                        text: proj.description || 'Executive-level project with measurable business impact.',
                                                        style: 'executiveProjectDesc',
                                                        margin: [0, 2, 0, 0]
                                                    }
                                                ],
                                                margin: [0, 0, 0, 8]
                                            }))
                                        ]
                                    }
                                ].filter(Boolean),
                                width: '45%'
                            }
                        ],
                        columnGap: 30
                    }
                ].filter(Boolean),
                
                styles: {
                    // Executive Header Styles
                    executiveName: { 
                        fontSize: 22, 
                        bold: true, 
                        alignment: 'center',
                        color: '#1A1A1A',
                        letterSpacing: 1
                    },
                    executiveTitle: { 
                        fontSize: 14, 
                        alignment: 'center',
                        color: '#8B4513',
                        margin: [0, 4, 0, 0]
                    },
                    executiveContact: { 
                        fontSize: 10, 
                        color: '#4A4A4A'
                    },
                    executiveWebsite: { 
                        fontSize: 10, 
                        color: '#8B4513',
                        decoration: 'underline'
                    },
                    
                    // Section Headers
                    executiveSectionHeader: { 
                        fontSize: 11, 
                        bold: true,
                        color: '#1A1A1A',
                        letterSpacing: 0.5
                    },
                    
                    // Summary
                    executiveSummary: { 
                        fontSize: 11,
                        color: '#2A2A2A',
                        lineHeight: 1.4,
                        alignment: 'justify'
                    },
                    
                    // Experience Styles
                    executivePosition: { 
                        fontSize: 12, 
                        bold: true,
                        color: '#1A1A1A',
                        letterSpacing: 0.3
                    },
                    executiveCompany: { 
                        fontSize: 11,
                        color: '#8B4513',
                        italics: true,
                        margin: [0, 2, 0, 0]
                    },
                    executiveDate: { 
                        fontSize: 10,
                        color: '#666666',
                        bold: true
                    },
                    executiveLocation: { 
                        fontSize: 9,
                        color: '#888888',
                        margin: [0, 1, 0, 0]
                    },
                    executiveDescription: { 
                        fontSize: 10,
                        color: '#333333',
                        lineHeight: 1.3,
                        alignment: 'justify'
                    },
                    achievementHeader: { 
                        fontSize: 10,
                        bold: true,
                        color: '#8B4513'
                    },
                    executiveAchievements: { 
                        fontSize: 10,
                        color: '#2A2A2A',
                        lineHeight: 1.2,
                        margin: [12, 2, 0, 0]
                    },
                    
                    // Education & Certifications
                    executiveDegree: { 
                        fontSize: 10, 
                        bold: true,
                        color: '#1A1A1A'
                    },
                    executiveInstitution: { 
                        fontSize: 10,
                        color: '#8B4513',
                        margin: [0, 1, 0, 0]
                    },
                    executiveEducationDate: { 
                        fontSize: 9,
                        color: '#666666',
                        margin: [0, 1, 0, 0]
                    },
                    executiveCertName: { 
                        fontSize: 10,
                        bold: true,
                        color: '#1A1A1A'
                    },
                    executiveCertDetails: { 
                        fontSize: 9,
                        color: '#666666',
                        margin: [0, 1, 0, 0]
                    },
                    
                    // Competencies
                    competencyCategory: { 
                        fontSize: 10,
                        bold: true,
                        color: '#8B4513'
                    },
                    competencyList: { 
                        fontSize: 9,
                        color: '#333333',
                        lineHeight: 1.2,
                        margin: [0, 2, 0, 0]
                    },
                    
                    // Projects
                    executiveProjectTitle: { 
                        fontSize: 10,
                        bold: true,
                        color: '#1A1A1A'
                    },
                    executiveProjectDesc: { 
                        fontSize: 9,
                        color: '#444444',
                        lineHeight: 1.2
                    }
                },
                
                defaultStyle: { 
                    fontSize: 10,
                    color: '#333333'
                }
            };
        } else if(template == "creative") {
            documentDefinition = {
                pageSize: 'A4',
                pageMargins: [0, 0, 30, 40],
                background: [
                    {
                        canvas: [
                            {
                                type: 'rect',
                                x: 0,
                                y: 0,
                                w: 150,
                                h: 841.89, // Full A4 page height
                                color: '#5d80e6' // Blue background
                            }
                        ]
                    }
                ],
                content: [
                    {
                        table: {
                            widths: [150, '*'], // Sidebar: 150px, Main content: remaining space
                            body: [
                                [
                                    // Sidebar cell
                                    {
                                        stack: [
                                            { text: 'Profile', style: 'sidebarHeader' },
                                            { text: validatedBasic.bio || 'Not Provided', style: 'sidebarBody' },
                                            { text: 'Technical Skills', style: 'sidebarHeader' },
                                            { ul: validatedSkills.technical.slice(0, 4).map(skill => skill || 'Not Provided'), style: 'sidebarBulletPoints' },
                                            { text: 'Soft Skills', style: 'sidebarHeader' },
                                            { ul: validatedSkills.soft.slice(0, 3).map(skill => skill || 'Not Provided'), style: 'sidebarBulletPoints' },
                                            { text: 'Languages', style: 'sidebarHeader' },
                                            { ul: validatedSkills.languages.slice(0, 3).map(lang => lang || 'Not Provided'), style: 'sidebarBulletPoints' },
                                            certifications.length > 0 && {
                                                stack: [
                                                    { text: 'Certifications', style: 'sidebarHeader' },
                                                    { ul: certifications.slice(0, 2).map(cert => `${cert.name || 'Not Provided'} (${formatDate(cert.date) || 'Not Provided'})`), style: 'sidebarBulletPoints' }
                                                ]
                                            }
                                        ].filter(Boolean),
                                        color: '#FFFFFF' // White text for readability
                                    },
                                    // Main content cell
                                    {
                                        stack: [
                                            // Header
                                            {
                                                stack: [
                                                    { text: validatedBasic.name, style: 'header' },
                                                    {
                                                        text: [
                                                            validatedBasic.email,
                                                            validatedBasic.phone,
                                                            validatedBasic.location,
                                                            validatedBasic.website || 'Not Provided'
                                                        ].filter(val => val !== 'Not Provided').join(' | ') || 'Contact Information Not Provided',
                                                        style: 'contactInfo'
                                                    },
                                                    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 385, y2: 0, lineWidth: 1, lineColor: '#3B82F6' }] }
                                                ],
                                                margin: [15, 20, 20, 15]
                                            },
                                            // Work Experience
                                            {
                                                table: {
                                                    widths: ['*'],
                                                    body: [
                                                        [
                                                            {
                                                                stack: [
                                                                    { text: 'Work Experience', style: 'sectionHeader' },
                                                                    ...experience.map(exp => [
                                                                        { text: `${exp.position || 'Not Provided'} at ${exp.company || 'Not Provided'}, ${exp.location || 'Not Provided'}`, style: 'subheader' },
                                                                        { text: `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`, style: 'date' },
                                                                        { text: exp.description || 'Not Provided', style: 'body' },
                                                                        exp.highlights && exp.highlights.length > 0 ? {
                                                                            ul: exp.highlights.slice(0, 3).map(highlight => highlight || 'Not Provided'),
                                                                            style: 'bulletPoints'
                                                                        } : null
                                                                    ].filter(Boolean))
                                                                ],
                                                                fillColor: '#FFFFFF',
                                                                margin: [10, 10, 10, 10]
                                                            }
                                                        ]
                                                    ]
                                                },
                                                layout: {
                                                    hLineWidth: () => 0.5,
                                                    vLineWidth: () => 0.5,
                                                    hLineColor: () => '#1E3A8A',
                                                    vLineColor: () => '#1E3A8A'
                                                },
                                                margin: [10, 10, 0, 10]
                                            },
                                            // Education
                                            {
                                                table: {
                                                    widths: ['*'],
                                                    body: [
                                                        [
                                                            {
                                                                stack: [
                                                                    { text: 'Education', style: 'sectionHeader' },
                                                                    ...education.map(edu => [
                                                                        { text: `${edu.degree || 'Not Provided'} in ${edu.field || 'Not Provided'}, ${edu.institution || 'Not Provided'}`, style: 'subheader' },
                                                                        { text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, style: 'date' },
                                                                        edu.description && { text: edu.description || 'Not Provided', style: 'body' }
                                                                    ].filter(Boolean))
                                                                ],
                                                                fillColor: '#FFFFFF',
                                                                margin: [10, 10, 10, 10]
                                                            }
                                                        ]
                                                    ]
                                                },
                                                layout: {
                                                    hLineWidth: () => 0.5,
                                                    vLineWidth: () => 0.5,
                                                    hLineColor: () => '#1E3A8A',
                                                    vLineColor: () => '#1E3A8A'
                                                },
                                                margin: [10, 10, 0, 10]
                                            },
                                            // Projects
                                            projects.length > 0 && {
                                                table: {
                                                    widths: ['*'],
                                                    body: [
                                                        [
                                                            {
                                                                stack: [
                                                                    { text: 'Projects', style: 'sectionHeader' },
                                                                    ...projects.slice(0, 2).map(proj => [
                                                                        { text: proj.name || 'Not Provided', style: 'subheader' },
                                                                        { text: proj.description || 'Not Provided', style: 'body' },
                                                                        { text: `Technologies: ${proj.technologies?.join(', ') || 'Not Provided'}`, style: 'body' }
                                                                    ])
                                                                ],
                                                                fillColor: '#FFFFFF',
                                                                margin: [10, 10, 10, 10]
                                                            }
                                                        ]
                                                    ]
                                                },
                                                layout: {
                                                    hLineWidth: () => 0.5,
                                                    vLineWidth: () => 0.5,
                                                    hLineColor: () => '#1E3A8A',
                                                    vLineColor: () => '#1E3A8A'
                                                },
                                                margin: [10, 10, 0, 10]
                                            }
                                        ].filter(Boolean)
                                    }
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: () => 0,
                            vLineWidth: () => 0,
                            hLineColor: () => '#FFFFFF',
                            vLineColor: () => '#FFFFFF',
                            paddingLeft: () => 0,
                            paddingRight: () => 0,
                            paddingTop: () => 0,
                            paddingBottom: () => 0
                        }
                    }
                ],
                styles: {
                    header: { 
                        fontSize: 24,
                        bold: true,
                        alignment: 'center',
                        color: '#1E3A8A',
                        font: 'Roboto',
                        margin: [0, 0, 0, 5]
                    },
                    contactInfo: {
                        fontSize: 9,
                        alignment: 'center',
                        color: '#4B5563',
                        font: 'Roboto',
                        lineHeight: 1.2
                    },
                    sidebarHeader: {
                        fontSize: 14,
                        bold: true,
                        color: '#FFFFFF',
                        font: 'Roboto',
                        margin: [15, 10, 5, 10]
                    },
                    sidebarBody: {
                        fontSize: 10,
                        color: '#E2E8F0',
                        font: 'Roboto',
                        lineHeight: 1.3,
                        margin: [15, 10, 15, 10]
                    },
                    sidebarBulletPoints: {
                        fontSize: 10,
                        color: '#E2E8F0',
                        font: 'Roboto',
                        margin: [25, 2, 0, 5]
                    },
                    sectionHeader: {
                        fontSize: 14,
                        bold: true,
                        color: '#1E3A8A',
                        margin: [0, 5, 0, 10],
                        font: 'Roboto',
                        decoration: 'underline',
                        decorationColor: '#3B82F6'
                    },
                    subheader: {
                        fontSize: 12,
                        bold: true,
                        color: '#1E3A8A',
                        margin: [0, 5, 0, 3],
                        font: 'Roboto'
                    },
                    body: {
                        fontSize: 10,
                        lineHeight: 1.5,
                        color: '#1F2937',
                        font: 'Roboto'
                    },
                    date: {
                        fontSize: 9,
                        italics: true,
                        color: '#4B5563',
                        margin: [0, 2, 0, 5],
                        font: 'Roboto'
                    },
                    bulletPoints: {
                        fontSize: 10,
                        margin: [10, 2, 0, 5],
                        color: '#1F2937',
                        font: 'Roboto'
                    }
                },
                defaultStyle: {
                    font: 'Roboto',
                    fontSize: 10,
                    color: '#1F2937'
                }
            };
        }  else {
            documentDefinition = {
                pageSize: 'A4',
                pageMargins: [40, 60, 40, 60],
                content: [
                // Header
                { text: basic.name, style: 'header' },
                { text: userData.title, style: 'header' },
                { text: "Default", style: 'header' },
                { 
                    text: `${basic.email} | ${basic.phone} | ${basic.location} | ${basic.website}`,
                    style: 'contactInfo',
                    margin: [0, 5, 0, 10]
                },
                // Professional Summary
                { text: 'Professional Summary', style: 'sectionHeader' },
                { text: basic.bio, style: 'body', margin: [0, 0, 0, 10] },
                // Work Experience
                { text: 'Work Experience', style: 'sectionHeader' },
                ...experience.map(exp => [
                    { 
                    text: `${exp.position} at ${exp.company}, ${exp.location}`, 
                    style: 'subheader' 
                    },
                    { 
                    text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, 
                    style: 'date' 
                    },
                    { text: exp.description, style: 'body' },
                    exp.highlights && exp.highlights.length > 0 ? {
                    ul: exp.highlights.slice(0, 3), // Limit to 3 highlights
                    style: 'bulletPoints'
                    } : null
                ].filter(Boolean)),
                // Education
                { text: 'Education', style: 'sectionHeader' },
                ...education.map(edu => [
                    { 
                    text: `${edu.degree} in ${edu.field}, ${edu.institution}`, 
                    style: 'subheader' 
                    },
                    { 
                    text: `${edu.startDate} - ${edu.endDate}`, 
                    style: 'date' 
                    },
                    edu.description && { text: edu.description, style: 'body' }
                ].filter(Boolean)),
                // Skills
                { text: 'Skills', style: 'sectionHeader' },
                {
                    columns: [
                    { text: 'Technical Skills', style: 'subheader' },
                    { ul: skills.technical.slice(0, 8), style: 'bulletPoints' } // Limit to 8
                    ],
                    columnGap: 10
                },
                {
                    columns: [
                    { text: 'Soft Skills', style: 'subheader' },
                    { ul: skills.soft.slice(0, 5), style: 'bulletPoints' } // Limit to 5
                    ],
                    columnGap: 10
                },
                {
                    columns: [
                    { text: 'Languages', style: 'subheader' },
                    { ul: skills.languages.slice(0, 5), style: 'bulletPoints' }
                    ],
                    columnGap: 10
                },
                // Projects (limited to 2)
                projects.length > 0 && { text: 'Projects', style: 'sectionHeader' },
                ...projects.slice(0, 2).map(proj => [
                    { text: proj.name, style: 'subheader' },
                    { text: proj.description, style: 'body' },
                    { text: `Technologies: ${proj.technologies.join(', ')}`, style: 'body' }
                ]),
                // Certifications (limited to 2)
                certifications.length > 0 && { text: 'Certifications', style: 'sectionHeader' },
                ...certifications.slice(0, 2).map(cert => [
                    { text: `${cert.name} by ${cert.issuer}`, style: 'subheader' },
                    { text: cert.date, style: 'date' }
                ])
                ].filter(Boolean), // Remove null/undefined entries
                styles: {
                header: { fontSize: 22, bold: true, alignment: 'center' },
                contactInfo: { fontSize: 10, alignment: 'center' },
                sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                subheader: { fontSize: 12, bold: true, margin: [0, 5, 0, 2] },
                body: { fontSize: 10, margin: [0, 0, 0, 5] },
                date: { fontSize: 10, italics: true, margin: [0, 0, 0, 5] },
                bulletPoints: { fontSize: 10, margin: [10, 0, 0, 5] }
                },
                defaultStyle: { fontSize: 10 }
            };
        }

        return new Promise((resolve, reject) => {
            const pdfDoc = printer.createPdfKitDocument(documentDefinition);
            const chunks = [];
            pdfDoc.on('data', chunk => chunks.push(chunk));
            pdfDoc.on('end', () => {
                const result = Buffer.concat(chunks);
                resolve(result);
            });
            pdfDoc.on('error', err => reject(err));
            pdfDoc.end();
        });
    } catch (error) {
        console.error("Error generating resume:", error);
        throw error;
    }
};

export default generateResume;