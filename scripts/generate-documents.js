const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ExternalHyperlink } = require('docx');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Resume content
const resumeData = {
    name: 'JOSHUA AKINLEYE',
    title: 'Full-Stack Developer',
    contact: {
        email: 'akinleyejoshua.dev@gmail.com',
        phone: '+234 08131519518',
        location: 'Available Worldwide (Remote)',
        linkedin: 'linkedin.com/in/joshua-a-9895b61ab',
        linkedinUrl: 'https://www.linkedin.com/in/joshua-a-9895b61ab/',
        github: 'github.com/Akinleyejoshua',
        githubUrl: 'https://github.com/Akinleyejoshua',
        portfolio: 'joshuaakinleye.vercel.app',
        portfolioUrl: 'https://joshuaakinleye.vercel.app'
    },
    summary: 'Innovative Full-Stack Developer with 5+ years of professional experience building innovative digital solutions across web development, machine learning, and Web3 technologies. Successfully delivered 50+ projects for 30+ satisfied clients. Passionate about creating cutting-edge applications using modern technologies including Next.js, Node.js, TypeScript, and cloud databases.',
    skills: {
        technical: [
            'Frontend: Next.js, React.js, TypeScript, JavaScript, HTML5, CSS3',
            'Backend: Node.js, Express.js, REST APIs',
            'Databases: MySQL, MongoDB',
            'Version Control: Git, GitHub',
            'AI & Automation: Machine Learning Applications, AI Solutions',
            'Web3: Blockchain Technologies, Decentralized Applications'
        ],
        soft: [
            'Problem-solving and analytical thinking',
            'Cross-functional collaboration',
            'Remote work proficiency',
            'Client communication and project management',
            'Agile development methodologies'
        ]
    },
    experience: [
        {
            role: 'Full-Stack Developer',
            company: 'Freelance/Independent Contractor',
            period: '2019 - Present',
            achievements: [
                'Delivered 50+ successful projects across web, machine learning, and Web3 domains for diverse client base',
                'Developed and maintained full-stack web applications using Next.js, Node.js, TypeScript, MySQL, and MongoDB',
                'Implemented AI and automation solutions to enhance business processes',
                'Collaborated with 30+ clients worldwide to translate requirements into functional, user-centric applications',
                'Applied modern development practices including responsive design, performance optimization, and accessibility standards'
            ]
        }
    ],
    projects: [
        { category: 'Web Development', description: 'Built responsive, full-stack web applications with modern frameworks' },
        { category: 'Machine Learning', description: 'Developed ML-powered applications and automation tools' },
        { category: 'Web3', description: 'Built decentralized applications (dApps) and blockchain-based solutions' }
    ]
};

// Cover letter content
const coverLetterData = {
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    content: [
        'Dear Hiring Manager,',
        '',
        'I am writing to express my strong interest in the Software Developer role at your company. As a Full-Stack Developer with 5+ years of experience building innovative digital solutions and a proven track record of delivering 50+ successful projects, I am confident in my ability to contribute meaningfully to your team.',
        '',
        'Throughout my career, I have developed expertise in creating cutting-edge applications using modern technologies including Next.js, Node.js, TypeScript, MySQL, and MongoDB. My experience spans web development, machine learning, and Web3 technologies, allowing me to bring a diverse skill set and fresh perspectives to complex technical challenges.',
        '',
        'Key highlights of my qualifications include:',
        '• Successfully delivered 50+ projects across multiple technology domains, serving 30+ satisfied clients with excellent retention rates',
        '• Deep expertise in full-stack development with React/Next.js frontend and Node.js backend architectures',
        '• Experience implementing AI and automation solutions that enhance business processes and user experiences',
        '• Strong problem-solving abilities and a passion for staying current with emerging technologies and industry best practices',
        '• Proven ability to work effectively in remote environments while maintaining clear communication with stakeholders',
        '',
        'I am eager to bring my technical skills, collaborative mindset, and dedication to excellence to your team. I would welcome the opportunity to discuss how my experience aligns with your needs and how I can contribute to your company\'s continued success.',
        '',
        'Thank you for considering my application. I look forward to the possibility of speaking with you soon.',
        '',
        'Sincerely,',
        'Joshua Akinleye'
    ]
};

// Generate DOCX Resume with clickable links
async function generateResumeDocx() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Name
                new Paragraph({
                    children: [new TextRun({ text: resumeData.name, bold: true, size: 32 })],
                    alignment: AlignmentType.CENTER,
                }),
                // Title
                new Paragraph({
                    children: [new TextRun({ text: resumeData.title, size: 24 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                }),
                // Contact Info with clickable links
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: 'Email: ', size: 20 }),
                        new ExternalHyperlink({
                            children: [new TextRun({ text: resumeData.contact.email, size: 20, color: '0563C1', underline: {} })],
                            link: `mailto:${resumeData.contact.email}`,
                        }),
                        new TextRun({ text: ' | Phone: ', size: 20 }),
                        new ExternalHyperlink({
                            children: [new TextRun({ text: resumeData.contact.phone, size: 20, color: '0563C1', underline: {} })],
                            link: `tel:${resumeData.contact.phone.replace(/\s/g, '')}`,
                        }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: 'LinkedIn: ', size: 20 }),
                        new ExternalHyperlink({
                            children: [new TextRun({ text: resumeData.contact.linkedin, size: 20, color: '0563C1', underline: {} })],
                            link: resumeData.contact.linkedinUrl,
                        }),
                        new TextRun({ text: ' | GitHub: ', size: 20 }),
                        new ExternalHyperlink({
                            children: [new TextRun({ text: resumeData.contact.github, size: 20, color: '0563C1', underline: {} })],
                            link: resumeData.contact.githubUrl,
                        }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                    children: [
                        new TextRun({ text: 'Portfolio: ', size: 20 }),
                        new ExternalHyperlink({
                            children: [new TextRun({ text: resumeData.contact.portfolio, size: 20, color: '0563C1', underline: {} })],
                            link: resumeData.contact.portfolioUrl,
                        }),
                        new TextRun({ text: ` | ${resumeData.contact.location}`, size: 20 }),
                    ],
                }),
                
                // Professional Summary
                new Paragraph({
                    text: 'PROFESSIONAL SUMMARY',
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: '000000', space: 1, size: 6, style: BorderStyle.SINGLE } },
                }),
                new Paragraph({
                    text: resumeData.summary,
                    spacing: { after: 300 },
                }),
                
                // Core Competencies
                new Paragraph({
                    text: 'CORE COMPETENCIES',
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: '000000', space: 1, size: 6, style: BorderStyle.SINGLE } },
                }),
                new Paragraph({ children: [new TextRun({ text: 'Technical Skills:', bold: true })] }),
                ...resumeData.skills.technical.map(skill => new Paragraph({ text: `• ${skill}`, spacing: { before: 100 } })),
                new Paragraph({ text: '', spacing: { after: 100 } }),
                new Paragraph({ children: [new TextRun({ text: 'Soft Skills:', bold: true })] }),
                ...resumeData.skills.soft.map(skill => new Paragraph({ text: `• ${skill}`, spacing: { before: 100 } })),
                new Paragraph({ text: '', spacing: { after: 300 } }),
                
                // Professional Experience
                new Paragraph({
                    text: 'PROFESSIONAL EXPERIENCE',
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: '000000', space: 1, size: 6, style: BorderStyle.SINGLE } },
                }),
                ...resumeData.experience.flatMap(exp => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.role, bold: true }),
                            new TextRun({ text: ` | ${exp.company}` })
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: exp.period, italics: true })],
                        spacing: { after: 100 },
                    }),
                    ...exp.achievements.map(achievement => new Paragraph({ text: `• ${achievement}`, spacing: { before: 50 } }))
                ]),
                new Paragraph({ text: '', spacing: { after: 300 } }),
                
                // Technical Projects
                new Paragraph({
                    text: 'TECHNICAL PROJECTS',
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: '000000', space: 1, size: 6, style: BorderStyle.SINGLE } },
                }),
                ...resumeData.projects.map(proj => new Paragraph({
                    children: [
                        new TextRun({ text: `${proj.category}: `, bold: true }),
                        new TextRun({ text: proj.description })
                    ],
                    spacing: { before: 100 },
                })),
            ],
        }],
    });
    
    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(__dirname, '..', 'Joshua_Akinleye_Resume.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Resume DOCX saved to: ${outputPath}`);
}

// Generate Cover Letter DOCX with clickable links
async function generateCoverLetterDocx() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Header
                new Paragraph({
                    children: [new TextRun({ text: resumeData.name, bold: true, size: 28 })],
                    alignment: AlignmentType.LEFT,
                }),
                new Paragraph({
                    children: [new TextRun({ text: resumeData.title, size: 22 })],
                    alignment: AlignmentType.LEFT,
                }),
                new Paragraph({
                    spacing: { after: 400 },
                    children: [
                        new ExternalHyperlink({
                            children: [new TextRun({ text: resumeData.contact.email, size: 20, color: '0563C1', underline: {} })],
                            link: `mailto:${resumeData.contact.email}`,
                        }),
                        new TextRun({ text: ' | ', size: 20 }),
                        new ExternalHyperlink({
                            children: [new TextRun({ text: resumeData.contact.phone, size: 20, color: '0563C1', underline: {} })],
                            link: `tel:${resumeData.contact.phone.replace(/\s/g, '')}`,
                        }),
                    ],
                }),
                
                // Date
                new Paragraph({
                    text: coverLetterData.date,
                    spacing: { after: 400 },
                }),
                
                // Content
                ...coverLetterData.content.map(line => new Paragraph({
                    text: line,
                    spacing: { after: line === '' ? 200 : 100 },
                })),
            ],
        }],
    });
    
    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(__dirname, '..', 'Joshua_Akinleye_Cover_Letter.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Cover Letter DOCX saved to: ${outputPath}`);
}

// Generate Resume PDF with clickable links
function generateResumePdf() {
    const doc = new PDFDocument({ margin: 50 });
    const outputPath = path.join(__dirname, '..', 'Joshua_Akinleye_Resume.pdf');
    doc.pipe(fs.createWriteStream(outputPath));
    
    // Name
    doc.fontSize(24).font('Helvetica-Bold').text(resumeData.name, { align: 'center' });
    doc.fontSize(14).font('Helvetica').text(resumeData.title, { align: 'center' });
    doc.moveDown(0.5);
    
    // Contact with clickable links - centered
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    
    // Email and Phone line
    doc.fontSize(10);
    const emailPhoneLine = `Email: ${resumeData.contact.email} | Phone: ${resumeData.contact.phone}`;
    const emailPhoneWidth = doc.widthOfString(emailPhoneLine);
    const emailPhoneX = doc.page.margins.left + (pageWidth - emailPhoneWidth) / 2;
    
    doc.text('Email: ', emailPhoneX, doc.y, { continued: true });
    doc.fillColor('#0563C1').text(resumeData.contact.email, { link: `mailto:${resumeData.contact.email}`, continued: true, underline: true });
    doc.fillColor('black').text(' | Phone: ', { continued: true, underline: false });
    doc.fillColor('#0563C1').text(resumeData.contact.phone, { link: `tel:${resumeData.contact.phone.replace(/\\s/g, '')}`, underline: true });
    doc.fillColor('black');
    
    // LinkedIn and GitHub line
    const linkedinGithubLine = `LinkedIn: ${resumeData.contact.linkedin} | GitHub: ${resumeData.contact.github}`;
    const linkedinGithubWidth = doc.widthOfString(linkedinGithubLine);
    const linkedinGithubX = doc.page.margins.left + (pageWidth - linkedinGithubWidth) / 2;
    
    doc.text('LinkedIn: ', linkedinGithubX, doc.y, { continued: true });
    doc.fillColor('#0563C1').text(resumeData.contact.linkedin, { link: resumeData.contact.linkedinUrl, continued: true, underline: true });
    doc.fillColor('black').text(' | GitHub: ', { continued: true, underline: false });
    doc.fillColor('#0563C1').text(resumeData.contact.github, { link: resumeData.contact.githubUrl, underline: true });
    doc.fillColor('black');
    
    // Portfolio and Location line
    const portfolioLine = `Portfolio: ${resumeData.contact.portfolio} | ${resumeData.contact.location}`;
    const portfolioWidth = doc.widthOfString(portfolioLine);
    const portfolioX = doc.page.margins.left + (pageWidth - portfolioWidth) / 2;
    
    doc.text('Portfolio: ', portfolioX, doc.y, { continued: true });
    doc.fillColor('#0563C1').text(resumeData.contact.portfolio, { link: resumeData.contact.portfolioUrl, continued: true, underline: true });
    doc.fillColor('black').text(` | ${resumeData.contact.location}`, { underline: false });
    
    doc.moveDown();
    
    // Separator
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    
    // Professional Summary
    doc.fontSize(12).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica').text(resumeData.summary);
    doc.moveDown();
    
    // Core Competencies
    doc.fontSize(12).font('Helvetica-Bold').text('CORE COMPETENCIES');
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica-Bold').text('Technical Skills:');
    resumeData.skills.technical.forEach(skill => {
        doc.fontSize(10).font('Helvetica').text(`• ${skill}`);
    });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica-Bold').text('Soft Skills:');
    resumeData.skills.soft.forEach(skill => {
        doc.fontSize(10).font('Helvetica').text(`• ${skill}`);
    });
    doc.moveDown();
    
    // Professional Experience
    doc.fontSize(12).font('Helvetica-Bold').text('PROFESSIONAL EXPERIENCE');
    doc.moveDown(0.3);
    resumeData.experience.forEach(exp => {
        doc.fontSize(10).font('Helvetica-Bold').text(`${exp.role} | ${exp.company}`);
        doc.fontSize(10).font('Helvetica-Oblique').text(exp.period);
        exp.achievements.forEach(achievement => {
            doc.fontSize(10).font('Helvetica').text(`• ${achievement}`);
        });
    });
    doc.moveDown();
    
    // Technical Projects
    doc.fontSize(12).font('Helvetica-Bold').text('TECHNICAL PROJECTS');
    doc.moveDown(0.3);
    resumeData.projects.forEach(proj => {
        doc.fontSize(10).font('Helvetica-Bold').text(proj.category + ': ', { continued: true });
        doc.font('Helvetica').text(proj.description);
    });
    
    doc.end();
    console.log(`Resume PDF saved to: ${outputPath}`);
}

// Generate Cover Letter PDF with clickable links
function generateCoverLetterPdf() {
    const doc = new PDFDocument({ margin: 50 });
    const outputPath = path.join(__dirname, '..', 'Joshua_Akinleye_Cover_Letter.pdf');
    doc.pipe(fs.createWriteStream(outputPath));
    
    // Header
    doc.fontSize(18).font('Helvetica-Bold').text(resumeData.name);
    doc.fontSize(12).font('Helvetica').text(resumeData.title);
    
    // Contact with clickable links
    doc.fontSize(10);
    doc.fillColor('#0563C1').text(resumeData.contact.email, { link: `mailto:${resumeData.contact.email}`, continued: true, underline: true });
    doc.fillColor('black').text(' | ', { continued: true, underline: false });
    doc.fillColor('#0563C1').text(resumeData.contact.phone, { link: `tel:${resumeData.contact.phone.replace(/\\s/g, '')}`, underline: true });
    doc.fillColor('black');
    
    doc.moveDown(2);
    
    // Date
    doc.text(coverLetterData.date);
    doc.moveDown(2);
    
    // Content
    coverLetterData.content.forEach(line => {
        if (line === '') {
            doc.moveDown(0.5);
        } else {
            doc.text(line);
        }
    });
    
    doc.end();
    console.log(`Cover Letter PDF saved to: ${outputPath}`);
}

// Run all generators
async function main() {
    try {
        await generateResumeDocx();
        await generateCoverLetterDocx();
        generateResumePdf();
        generateCoverLetterPdf();
        console.log('\n✅ All documents generated successfully with clickable links!');
    } catch (error) {
        console.error('Error generating documents:', error);
    }
}

main();
