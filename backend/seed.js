require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Project = require('./models/Project');
const Certificate = require('./models/Certificate');
const Message = require('./models/Message');
const connectDB = require('./config/db');

const seedData = async () => {
    await connectDB();

    // Clear existing data
    await Project.deleteMany({});
    await Certificate.deleteMany({});
    await Message.deleteMany({});

    // Seed Admin if doesn't exist
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
        await Admin.create({
            username: 'admin',
            password: 'S2World' 
        });
        console.log('✅ Admin user created (admin / S2World)');
    }

    // Seed 6 Projects
    const projects = [
        {
            title: "AI-Powered Analytics Dashboard",
            description: "A real-time data visualization platform using OpenAI for predictive insights.",
            techStack: ["React", "Next.js", "Python", "Tailwind"],
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Blockchain Supply Chain",
            description: "Decentralized tracking system for global logistics using Ethereum smart contracts.",
            techStack: ["Solidity", "Hardhat", "Ether.js", "React"],
            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=500",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Cloud-Native CRM System",
            description: "Enterprise-grade CRM with microservices architecture and Kubernetes deployment.",
            techStack: ["Node.js", "Docker", "AWS", "MongoDB"],
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Augmented Reality Furniture App",
            description: "Try furniture in your room virtually before buying using Three.js and WebXR.",
            techStack: ["Three.js", "React Native", "Firebase"],
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=500",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "Cybersecurity Threat Detector",
            description: "Machine learning tool to identify and block DDoS attacks in real-time.",
            techStack: ["Go", "TensorFlow", "Redis", "Grafana"],
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500",
            liveLink: "#",
            githubLink: "#"
        },
        {
            title: "SaaS Multi-tenant Platform",
            description: "Complete subscription-based platform with role-based access control.",
            techStack: ["PostgreSQL", "Next.js", "Prisma", "Stripe"],
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=500",
            liveLink: "#",
            githubLink: "#"
        }
    ];
    await Project.insertMany(projects);
    console.log('✅ 6 Projects seeded');

    // Seed 6 Certificates
    const certificates = [
        {
            title: "Full Stack Development Professional",
            issuer: "Google Career Certificates",
            date: "Jan 2026",
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=500"
        },
        {
            title: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "Nov 2025",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500"
        },
        {
            title: "Professional React Specialization",
            issuer: "Meta (Coursera)",
            date: "Aug 2025",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500"
        },
        {
            title: "Cloud Computing Expert",
            issuer: "Microsoft Azure",
            date: "May 2025",
            image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=500"
        },
        {
            title: "Advanced Data Science",
            issuer: "IBM Data Science",
            date: "Feb 2025",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500"
        },
        {
            title: "Certified Ethical Hacker (CEH)",
            issuer: "EC-Council",
            date: "Dec 2024",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500"
        }
    ];
    await Certificate.insertMany(certificates);
    console.log('✅ 6 Certificates seeded');

    // Seed initial messages
    const messages = [
        {
            name: "Vikas Sharma",
            email: "vikas@tech.com",
            subject: "New Project Proposal",
            message: "We want to hire you for our upcoming fintech app."
        }
    ];
    await Message.insertMany(messages);

    console.log('\n🚀 Database seeding with 6 items completed successfully!');
    process.exit();
};

seedData();
