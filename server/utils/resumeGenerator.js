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

const generateResume = (userData) => {
    try{
    const { basic, education, experience, skills, projects, certifications } = userData;

    const documentDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content: [
        // Header
        { text: basic.name, style: 'header' },
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
    } catch(error) {
        console.error("Error generating resume:", error);
    }
};

export default generateResume;