import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISocialLink {
    platform: string;
    url: string;
    icon: string;
}

export interface IAbout extends Document {
    bio: string;
    socialLinks: ISocialLink[];
    updatedAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>(
    {
        platform: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String, required: true },
    },
    { _id: false }
);

const AboutSchema = new Schema<IAbout>(
    {
        bio: {
            type: String,
            required: true,
            default: 'A passionate developer creating innovative solutions.',
        },
        socialLinks: { type: [SocialLinkSchema], default: [] },
    },
    { timestamps: true }
);

const About: Model<IAbout> = mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema);

export default About;
