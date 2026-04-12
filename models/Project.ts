import mongoose, { Schema, model, models } from 'mongoose';

const projectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    image: { type: String },
    liveLink: { type: String },
    githubLink: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Project = models.Project || model('Project', projectSchema);

export default Project;
