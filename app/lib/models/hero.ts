import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHero extends Document {
    headline: string;
    subtext: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    heroImage: string;
    updatedAt: Date;
}

const HeroSchema = new Schema<IHero>(
    {
        headline: { type: String, required: true, default: 'Welcome to My Portfolio' },
        subtext: { type: String, required: true, default: 'Building digital experiences with passion' },
        primaryCtaText: { type: String, default: 'View Projects' },
        primaryCtaLink: { type: String, default: '#projects' },
        secondaryCtaText: { type: String, default: 'Contact Me' },
        secondaryCtaLink: { type: String, default: '#contact' },
        heroImage: { type: String, default: '/hero-image.jpg' },
    },
    { timestamps: true }
);

const Hero: Model<IHero> = mongoose.models.Hero || mongoose.model<IHero>('Hero', HeroSchema);

export default Hero;
