/**
 * Database Seed Script
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed.ts
 * Or add to package.json: "seed": "tsx scripts/seed.ts"
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

// Schema definitions (inline for standalone script)
const HeroSchema = new mongoose.Schema({
    headline: String,
    subtext: String,
    primaryCtaText: String,
    primaryCtaLink: String,
    secondaryCtaText: String,
    secondaryCtaLink: String,
    heroImage: String,
}, { timestamps: true });

const SocialLinkSchema = new mongoose.Schema({
    platform: String,
    url: String,
    icon: String,
}, { _id: false });

const AboutSchema = new mongoose.Schema({
    bio: String,
    socialLinks: [SocialLinkSchema],
}, { timestamps: true });

const ExperienceSchema = new mongoose.Schema({
    role: String,
    company: String,
    startDate: Date,
    endDate: Date,
    isCurrent: Boolean,
    description: [String],
    order: Number,
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    mediaType: String,
    mediaUrl: String,
    technologies: [String],
    githubUrl: String,
    liveUrl: String,
    featured: Boolean,
    order: Number,
}, { timestamps: true });

const ContactSchema = new mongoose.Schema({
    email: String,
    phone: String,
}, { timestamps: true });

// Seed Data from akinleyejoshua.vercel.app
const heroData = {
    headline: 'Joshua Akinleye',
    subtext: "I'm a Full Stack Developer & Machine Learning Engineer. As a Lead full-stack developer and ML Engineer, I possess a diverse skill set, proficient in both front-end and back-end and data-science technologies.",
    primaryCtaText: 'View Projects',
    primaryCtaLink: '#projects',
    secondaryCtaText: 'Get In Touch',
    secondaryCtaLink: '#contact',
    heroImage: '/hero-image.jpg',
};

const aboutData = {
    bio: `As a Lead full-stack developer and ML Engineer, I possess a diverse skill set, proficient in both front-end and back-end and data-science technologies.

My expertise includes designing user interfaces, implementing server-side logic, managing databases, building and deploying ML models. With a solid understanding of web development frameworks and languages, I contribute to creating seamless and efficient applications.

My problem-solving abilities and adaptability make me a valuable asset in the ever-evolving landscape of software development.`,
    socialLinks: [
        { platform: 'github', url: 'http://github.com/Akinleyejoshua', icon: 'github' },
        { platform: 'turing', url: 'https://matching.turing.com/developer-resume-preview/94fcd098ef28063a611a36b6c211b83394302204b3221e', icon: 'linkedin' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/joshua-a-9895b61ab', icon: 'linkedin' },
        { platform: 'website', url: 'https://akinleyejoshua.vercel.app', icon: 'globe' },
    ],
};

const experienceData = [
    {
        role: 'Web Developer',
        company: 'C.A.C',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-12-31'),
        isCurrent: false,
        description: [
            'Designed and developed responsive web applications',
            'Collaborated with teams to deliver client solutions',
            'Implemented front-end interfaces using modern frameworks',
        ],
        order: 0,
    },
    {
        role: 'Full Stack Developer',
        company: 'Gtext',
        startDate: new Date('2021-01-01'),
        endDate: new Date('2022-12-31'),
        isCurrent: false,
        description: [
            'Developed end-to-end web applications',
            'Built RESTful APIs and managed databases',
            'Deployed production-ready applications',
        ],
        order: 1,
    },
    {
        role: 'Conversational A.I Scientist (Data Science)',
        company: 'Smartecniqs',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2023-12-31'),
        isCurrent: false,
        description: [
            'Developed conversational AI systems',
            'Built and trained machine learning models',
            'Implemented NLP solutions for business applications',
        ],
        order: 2,
    },
    {
        role: 'Senior Backend Developer',
        company: 'BLNR (Open Source)',
        startDate: new Date('2024-01-01'),
        endDate: null,
        isCurrent: true,
        description: [
            'Leading backend architecture and development',
            'Contributing to open source projects',
            'Designing scalable server-side solutions',
            'Collaborating with IT teams to meet client expectations',
        ],
        order: 3,
    },
];

const projectsData = [
    // Full Stack Projects
    {
        title: 'Blogrr - Social Media App',
        description: 'A full-featured social media application with user authentication, posts, comments, likes, and real-time notifications.',
        category: 'web',
        mediaType: 'video',
        mediaUrl: 'https://www.youtube.com/watch?v=Gs067U0rISs',
        technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
        githubUrl: 'https://github.com/Akinleyejoshua',
        liveUrl: 'https://blogrpro.vercel.app/home',
        featured: true,
        order: 0,
    },
    {
        title: 'Ultra Share Pro (WebRTC)',
        description: 'Real-time file sharing application using WebRTC for peer-to-peer connections, enabling fast and secure file transfers.',
        category: 'web',
        mediaType: 'video',
        mediaUrl: 'https://youtu.be/mGwZ0N2ZCKo?si=l1IdUNk7_pgtLCJp',
        technologies: ['WebRTC', 'Next.js', 'Node.js', 'Socket.io'],
        githubUrl: 'https://github.com/Akinleyejoshua/webRTC-Nextjs/tree/main',
        liveUrl: 'https://ultrasharepro.vercel.app/',
        featured: true,
        order: 1,
    },
    {
        title: 'BLNR Backend (Open Source)',
        description: 'Open source backend project with robust API architecture, authentication, and database management.',
        category: 'web',
        mediaType: 'image',
        mediaUrl: 'https://akinleyejoshua.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbrnl.423b0243.png&w=3840&q=75',
        technologies: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
        githubUrl: 'https://github.com/Akinleyejoshua',
        liveUrl: 'https://blnr-dashboard-jet.vercel.app/',
        featured: true,
        order: 2,
    },
    {
        title: 'Twitter/X Clone',
        description: 'Full-stack Twitter clone with tweet functionality, user profiles, follow system, and real-time updates.',
        category: 'web',
        mediaType: 'image',
        mediaUrl: 'https://akinleyejoshua.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftwitter.456ccd83.png&w=3840&q=75',
        technologies: ['React', 'Next.js', 'Prisma', 'PostgreSQL'],
        githubUrl: 'https://github.com/Akinleyejoshua/twitter-clone-client',
        liveUrl: 'http://x-clone-client.vercel.app/',
        featured: true,
        order: 3,
    },
    {
        title: 'WooCommerce Dropshipping Web App',
        description: 'E-commerce dropshipping platform integrated with WooCommerce for seamless product management and order fulfillment.',
        category: 'web',
        mediaType: 'image',
        mediaUrl: 'https://akinleyejoshua.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fstore.2ab06f1a.png&w=3840&q=75',
        technologies: ['React', 'WooCommerce', 'PHP', 'MySQL'],
        githubUrl: 'https://github.com/Akinleyejoshua/uni-store',
        liveUrl: 'http://uni-store.vercel.app/',
        featured: false,
        order: 4,
    },
    {
        title: 'SaaS Screen Sharing',
        description: 'Software-as-a-Service application for screen sharing and remote collaboration with real-time communication.',
        category: 'web',
        mediaType: 'video',
        mediaUrl: 'https://www.youtube.com/watch?v=Uhv6u8UYnxA&t=9s',
        technologies: ['React', 'WebRTC', 'Node.js', 'Redis'],
        githubUrl: 'https://github.com/Akinleyejoshua',
        liveUrl: 'http://screen-view.vercel.app/',
        featured: false,
        order: 5,
    },
    // Machine Learning Projects
    {
        title: 'Ultra GPT - Virtual HR',
        description: 'AI-powered virtual HR assistant using large language models for employee queries, onboarding, and HR processes.',
        category: 'ml',
        mediaType: 'video',
        mediaUrl: 'https://youtu.be/nMqEkBG3qpw',
        technologies: ['Python', 'OpenAI', 'LangChain', 'FastAPI'],
        githubUrl: 'https://github.com/Akinleyejoshua',
        liveUrl: 'https://ultragpt-pro.vercel.app/',
        featured: true,
        order: 6,
    },
    {
        title: 'Covid-19 Diagnostics',
        description: 'Machine learning model for COVID-19 diagnosis using medical imaging and patient data analysis.',
        category: 'ml',
        mediaType: 'image',
        mediaUrl: 'https://akinleyejoshua.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcovid.a0f92eff.png&w=3840&q=75',
        technologies: ['Python', 'TensorFlow', 'Keras', 'OpenCV'],
        githubUrl: 'https://github.com/Akinleyejoshua',
        liveUrl: 'https://j-covidtest.netlify.app/',
        featured: true,
        order: 7,
    },
    {
        title: 'Facial Expression Detector V2',
        description: 'Deep learning model for real-time facial expression recognition with emotion classification.',
        category: 'ml',
        mediaType: 'image',
        mediaUrl: 'https://akinleyejoshua.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fface.98e75544.jpg&w=3840&q=75',
        technologies: ['Python', 'PyTorch', 'OpenCV', 'CNN'],
        githubUrl: 'https://github.com/Akinleyejoshua/facial-expression-v1',
        liveUrl: 'https://facialanalysis.netlify.app/',
        featured: true,
        order: 8,
    },
    {
        title: 'ChatBot Assistant',
        description: 'GPT-powered chatbot for HR assistance, web scraping, and code fetching with natural language understanding.',
        category: 'ml',
        mediaType: 'image',
        mediaUrl: 'https://akinleyejoshua.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbot.7a12738c.png&w=3840&q=75',
        technologies: ['Python', 'GPT-4', 'LangChain', 'Selenium'],
        githubUrl: 'https://github.com/Akinleyejoshua/-chatbot/tree/main',
        liveUrl: '',
        featured: false,
        order: 9,
    },
    {
        title: 'LLM GPT Web Application',
        description: 'Full-stack web application integrating large language models for intelligent text generation and analysis.',
        category: 'ml',
        mediaType: 'image',
        mediaUrl: 'https://akinleyejoshua.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fllm.99ecff4e.png&w=3840&q=75',
        technologies: ['React', 'Python', 'OpenAI', 'FastAPI'],
        githubUrl: 'https://github.com/Akinleyejoshua/llm',
        liveUrl: 'https://ultra-gpt-llm.vercel.app/',
        featured: false,
        order: 10,
    },
];

const contactData = {
    email: 'akinleyejoshua@gmail.com',
    phone: '',
};

async function seed() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create models
        const Hero = mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
        const About = mongoose.models.About || mongoose.model('About', AboutSchema);
        const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
        const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
        const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Hero.deleteMany({});
        await About.deleteMany({});
        await Experience.deleteMany({});
        await Project.deleteMany({});
        await Contact.deleteMany({});

        // Seed data
        console.log('📝 Seeding Hero...');
        await Hero.create(heroData);

        console.log('📝 Seeding About...');
        await About.create(aboutData);

        console.log('📝 Seeding Experiences...');
        await Experience.insertMany(experienceData);

        console.log('📝 Seeding Projects...');
        await Project.insertMany(projectsData);

        console.log('📝 Seeding Contact...');
        await Contact.create(contactData);

        console.log('✅ Database seeded successfully!');
        console.log(`
    Summary:
    - 1 Hero entry
    - 1 About entry with ${aboutData.socialLinks.length} social links
    - ${experienceData.length} Experience entries
    - ${projectsData.length} Project entries
    - 1 Contact entry
    `);

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
