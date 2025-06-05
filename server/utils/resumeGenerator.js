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
                pageMargins: [40, 60, 40, 60],
                content: [
                    // Header
                    {
                        stack: [
                            { text: validatedBasic.name, style: 'header' },
                            { text: userData.title || 'Not Provided', style: 'subheader' },
                            {
                                text: [
                                    validatedBasic.email,
                                    validatedBasic.phone,
                                    validatedBasic.location,
                                    validatedBasic.website || 'Not Provided'
                                ].filter(val => val !== 'Not Provided').join(' | ') || 'Contact Information Not Provided',
                                style: 'contactInfo',
                                margin: [0, 5, 0, 10]
                            },
                            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#2E2E2E' }] }
                        ],
                        margin: [0, 0, 0, 20]
                    },
                    // Professional Summary
                    {
                        stack: [
                            { text: 'Professional Summary', style: 'sectionHeader' },
                            { text: validatedBasic.bio, style: 'body', margin: [0, 5, 0, 10] }
                        ]
                    },
                    // Work Experience
                    {
                        stack: [
                            { text: 'Work Experience', style: 'sectionHeader' },
                            ...experience.map(exp => [
                                { 
                                    text: `${exp.position || 'Not Provided'} at ${exp.company || 'Not Provided'}, ${exp.location || 'Not Provided'}`, 
                                    style: 'subheader' 
                                },
                                { 
                                    text: `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`, 
                                    style: 'date' 
                                },
                                { text: exp.description || 'Not Provided', style: 'body' },
                                exp.highlights && exp.highlights.length > 0 ? {
                                    ul: exp.highlights.slice(0, 3).map(highlight => highlight || 'Not Provided'),
                                    style: 'bulletPoints'
                                } : null
                            ].filter(Boolean))
                        ],
                        margin: [0, 10, 0, 10]
                    },
                    // Education
                    {
                        stack: [
                            { text: 'Education', style: 'sectionHeader' },
                            ...education.map(edu => [
                                { 
                                    text: `${edu.degree || 'Not Provided'} in ${edu.field || 'Not Provided'}, ${edu.institution || 'Not Provided'}`, 
                                    style: 'subheader' 
                                },
                                { 
                                    text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, 
                                    style: 'date' 
                                },
                                edu.description && { text: edu.description || 'Not Provided', style: 'body' }
                            ].filter(Boolean))
                        ],
                        margin: [0, 10, 0, 10]
                    },
                    // Skills
                    {
                        stack: [
                            { text: 'Skills', style: 'sectionHeader' },
                            {
                                columns: [
                                    { text: 'Technical Skills', style: 'subheader' },
                                    { ul: validatedSkills.technical.slice(0, 8).map(skill => skill || 'Not Provided'), style: 'bulletPoints' }
                                ],
                                columnGap: 20
                            },
                            {
                                columns: [
                                    { text: 'Soft Skills', style: 'subheader' },
                                    { ul: validatedSkills.soft.slice(0, 5).map(skill => skill || 'Not Provided'), style: 'bulletPoints' }
                                ],
                                columnGap: 20
                            },
                            {
                                columns: [
                                    { text: 'Languages', style: 'subheader' },
                                    { ul: validatedSkills.languages.slice(0, 5).map(lang => lang || 'Not Provided'), style: 'bulletPoints' }
                                ],
                                columnGap: 20
                            }
                        ],
                        margin: [0, 10, 0, 10]
                    },
                    // Projects
                    projects.length > 0 && {
                        stack: [
                            { text: 'Projects', style: 'sectionHeader' },
                            ...projects.slice(0, 2).map(proj => [
                                { text: proj.name || 'Not Provided', style: 'subheader' },
                                { text: proj.description || 'Not Provided', style: 'body' },
                                { text: `Technologies: ${proj.technologies?.join(', ') || 'Not Provided'}`, style: 'body' }
                            ])
                        ],
                        margin: [0, 10, 0, 10]
                    },
                    // Certifications
                    certifications.length > 0 && {
                        stack: [
                            { text: 'Certifications', style: 'sectionHeader' },
                            ...certifications.slice(0, 2).map(cert => [
                                { text: `${cert.name || 'Not Provided'} by ${cert.issuer || 'Not Provided'}`, style: 'subheader' },
                                { text: formatDate(cert.date) || 'Not Provided', style: 'date' }
                            ])
                        ],
                        margin: [0, 10, 0, 10]
                    }
                ].filter(Boolean),
                styles: {
                    header: { 
                        fontSize: 24, 
                        bold: true, 
                        alignment: 'center', 
                        color: '#2E2E2E',
                        font: 'Roboto'
                    },
                    subheader: { 
                        fontSize: 12, 
                        bold: true, 
                        color: '#2E2E2E', 
                        margin: [0, 5, 0, 3],
                        font: 'Roboto'
                    },
                    contactInfo: { 
                        fontSize: 10, 
                        alignment: 'center', 
                        color: '#555555',
                        font: 'Roboto'
                    },
                    sectionHeader: { 
                        fontSize: 14, 
                        bold: true, 
                        color: '#1A3C5A', 
                        margin: [0, 15, 0, 8],
                        decoration: 'underline',
                        decorationStyle: 'solid',
                        decorationColor: '#1A3C5A',
                        font: 'Roboto'
                    },
                    body: { 
                        fontSize: 10, 
                        lineHeight: 1.4, 
                        color: '#333333',
                        font: 'Roboto'
                    },
                    date: { 
                        fontSize: 10, 
                        italics: true, 
                        color: '#555555', 
                        margin: [0, 2, 0, 5],
                        font: 'Roboto'
                    },
                    bulletPoints: { 
                        fontSize: 10, 
                        margin: [10, 2, 0, 5], 
                        color: '#333333',
                        font: 'Roboto'
                    }
                },
                defaultStyle: { 
                    font: 'Roboto', 
                    fontSize: 10, 
                    color: '#333333'
                }
            };
        } else if(template == "minimal") {
            documentDefinition = {
                pageSize: 'A4',
                pageMargins: [30, 40, 30, 40],
                content: [
                    // Header
                    {
                        stack: [
                            { text: validatedBasic.name, style: 'header' },
                            {
                                text: [
                                    validatedBasic.email,
                                    validatedBasic.phone,
                                    validatedBasic.location
                                ].filter(val => val !== 'Not Provided').join(' | ') || 'Contact Information Not Provided',
                                style: 'contactInfo',
                                margin: [0, 5, 0, 10]
                            },
                            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 0.5, lineColor: '#4A4A4A' }] }
                        ],
                        margin: [0, 0, 0, 15]
                    },
                    // Professional Summary
                    {
                        stack: [
                            { text: 'Summary', style: 'sectionHeader' },
                            { text: validatedBasic.bio, style: 'body', margin: [0, 5, 0, 10] }
                        ]
                    },
                    // Work Experience
                    {
                        stack: [
                            { text: 'Experience', style: 'sectionHeader' },
                            ...experience.map(exp => [
                                { 
                                    text: `${exp.position || 'Not Provided'} - ${exp.company || 'Not Provided'}`, 
                                    style: 'subheader' 
                                },
                                { 
                                    text: `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`, 
                                    style: 'date' 
                                },
                                exp.highlights && exp.highlights.length > 0 ? {
                                    ul: exp.highlights.slice(0, 3).map(highlight => highlight || 'Not Provided'),
                                    style: 'bulletPoints'
                                } : { text: 'Not Provided', style: 'body' }
                            ].filter(Boolean))
                        ],
                        margin: [0, 10, 0, 10]
                    },
                    // Education
                    {
                        stack: [
                            { text: 'Education', style: 'sectionHeader' },
                            ...education.map(edu => [
                                { 
                                    text: `${edu.degree || 'Not Provided'}, ${edu.institution || 'Not Provided'}`, 
                                    style: 'subheader' 
                                },
                                { 
                                    text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, 
                                    style: 'date' 
                                }
                            ].filter(Boolean))
                        ],
                        margin: [0, 10, 0, 10]
                    },
                    // Skills
                    {
                        stack: [
                            { text: 'Skills', style: 'sectionHeader' },
                            {
                                ul: [
                                    ...validatedSkills.technical.slice(0, 6).map(skill => skill || 'Not Provided'),
                                    ...validatedSkills.soft.slice(0, 4).map(skill => skill || 'Not Provided'),
                                    ...validatedSkills.languages.slice(0, 3).map(lang => lang || 'Not Provided')
                                ],
                                style: 'bulletPoints'
                            }
                        ],
                        margin: [0, 10, 0, 10]
                    }
                ].filter(Boolean),
                styles: {
                    header: { 
                        fontSize: 22, 
                        bold: true, 
                        alignment: 'left', 
                        color: '#333333',
                        font: 'Roboto',
                        margin: [0, 0, 0, 5]
                    },
                    contactInfo: { 
                        fontSize: 9, 
                        alignment: 'left', 
                        color: '#666666',
                        font: 'Roboto'
                    },
                    sectionHeader: { 
                        fontSize: 12, 
                        bold: true, 
                        color: '#333333', 
                        margin: [0, 10, 0, 5],
                        font: 'Roboto'
                    },
                    subheader: { 
                        fontSize: 11, 
                        bold: true, 
                        color: '#333333', 
                        margin: [0, 5, 0, 2],
                        font: 'Roboto'
                    },
                    body: { 
                        fontSize: 9, 
                        lineHeight: 1.3, 
                        color: '#4A4A4A',
                        font: 'Roboto'
                    },
                    date: { 
                        fontSize: 9, 
                        italics: true, 
                        color: '#666666', 
                        margin: [0, 2, 0, 4],
                        font: 'Roboto'
                    },
                    bulletPoints: { 
                        fontSize: 9, 
                        margin: [10, 2, 0, 4], 
                        color: '#4A4A4A',
                        font: 'Roboto'
                    }
                },
                defaultStyle: { 
                    font: 'Roboto', 
                    fontSize: 9, 
                    color: '#4A4A4A'
                }
            };
        } else if(template == "executive") {
            documentDefinition = {
                pageSize: 'A4',
                pageMargins: [40, 50, 40, 50],
                background: [
                {
                    canvas: [
                    {
                        type: 'rect',
                        x: 0,
                        y: 0,
                        w: 595.28,
                        h: 841.89,
                        color: '#F5F6F5' // Subtle off-white for elegance
                    }
                    ]
                }
                ],
                content: [
                // Header
                {
                    stack: [
                    {
                        text: validatedBasic.name,
                        style: 'header',
                        decoration: 'underline',
                        decorationStyle: 'solid',
                        decorationColor: '#1B263B'
                    },
                    {
                        text: [
                        validatedBasic.email,
                        validatedBasic.phone,
                        validatedBasic.location
                        ].filter(val => val !== 'Not Provided').join(' | ') || 'Contact Information Not Provided',
                        style: 'contactInfo',
                        margin: [0, 5, 0, 10]
                    }
                    ],
                    margin: [0, 10, 0, 15]
                },
                // Professional Summary
                {
                    table: {
                    widths: ['*'],
                    body: [
                        [
                        {
                            stack: [
                            { text: 'Summary', style: 'sectionHeader' },
                            { text: validatedBasic.bio, style: 'body', margin: [0, 5, 0, 5] }
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
                    hLineColor: () => '#1B263B',
                    vLineColor: () => '#1B263B',
                    paddingTop: () => 5,
                    paddingBottom: () => 5
                    },
                    margin: [0, 10, 0, 10]
                },
                // Work Experience
                {
                    table: {
                    widths: ['*'],
                    body: [
                        [
                        {
                            stack: [
                            { text: 'Experience', style: 'sectionHeader' },
                            ...experience.map(exp => [
                                { 
                                text: `${exp.position || 'Not Provided'} - ${exp.company || 'Not Provided'}`, 
                                style: 'subheader' 
                                },
                                { 
                                text: `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`, 
                                style: 'date' 
                                },
                                exp.highlights && exp.highlights.length > 0 ? {
                                ul: exp.highlights.slice(0, 3).map(highlight => highlight || 'Not Provided'),
                                style: 'bulletPoints'
                                } : { text: 'Not Provided', style: 'body' }
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
                    hLineColor: () => '#1B263B',
                    vLineColor: () => '#1B263B',
                    paddingTop: () => 5,
                    paddingBottom: () => 5
                    },
                    margin: [0, 10, 0, 10]
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
                                { 
                                text: `${edu.degree || 'Not Provided'}, ${edu.institution || 'Not Provided'}`, 
                                style: 'subheader' 
                                },
                                { 
                                text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, 
                                style: 'date' 
                                }
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
                    hLineColor: () => '#1B263B',
                    vLineColor: () => '#1B263B',
                    paddingTop: () => 5,
                    paddingBottom: () => 5
                    },
                    margin: [0, 10, 0, 10]
                },
                // Skills
                {
                    table: {
                    widths: ['*'],
                    body: [
                        [
                        {
                            stack: [
                            { text: 'Skills', style: 'sectionHeader' },
                            {
                                columns: [
                                { ul: validatedSkills.technical.slice(0, 4).map(skill => skill || 'Not Provided'), style: 'bulletPoints' },
                                { ul: validatedSkills.soft.slice(0, 4).map(skill => skill || 'Not Provided'), style: 'bulletPoints' },
                                { ul: validatedSkills.languages.slice(0, 4).map(lang => lang || 'Not Provided'), style: 'bulletPoints' }
                                ],
                                columnGap: 10
                            }
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
                    hLineColor: () => '#1B263B',
                    vLineColor: () => '#1B263B',
                    paddingTop: () => 5,
                    paddingBottom: () => 5
                    },
                    margin: [0, 10, 0, 10]
                }
                ].filter(Boolean),
                styles: {
                header: { 
                    fontSize: 24, 
                    bold: true, 
                    alignment: 'center', 
                    color: '#1B263B',
                    font: 'Roboto',
                    margin: [0, 0, 0, 5]
                },
                contactInfo: { 
                    fontSize: 10, 
                    alignment: 'center', 
                    color: '#415A77',
                    font: 'Roboto'
                },
                sectionHeader: { 
                    fontSize: 14, 
                    bold: true, 
                    color: '#1B263B', 
                    margin: [0, 5, 0, 5],
                    font: 'Roboto'
                },
                subheader: { 
                    fontSize: 12, 
                    bold: true, 
                    color: '#1B263B', 
                    margin: [0, 5, 0, 3],
                    font: 'Roboto'
                },
                body: { 
                    fontSize: 10, 
                    lineHeight: 1.4, 
                    color: '#2A2A2A',
                    font: 'Roboto'
                },
                date: { 
                    fontSize: 10, 
                    italics: true, 
                    color: '#415A77', 
                    margin: [0, 2, 0, 5],
                    font: 'Roboto'
                },
                bulletPoints: { 
                    fontSize: 10, 
                    margin: [10, 2, 0, 5], 
                    color: '#2A2A2A',
                    font: 'Roboto'
                }
                },
                defaultStyle: { 
                font: 'Roboto', 
                fontSize: 10, 
                color: '#2A2A2A'
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
                                color: '#1E3A8A' // Blue background
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