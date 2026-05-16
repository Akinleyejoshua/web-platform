import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    accentColor: string;
}

const SettingsSchema = new Schema<ISettings>(
    {
        fontFamily: {
            type: String,
            default: 'Bricolage Grotesque',
            enum: ['Poppins', 'Bricolage Grotesque', 'Raleway'],
        },
        fontSize: {
            type: Number,
            default: 16,
            min: 14,
            max: 18,
        },
        fontWeight: {
            type: Number,
            default: 400,
            enum: [300, 400, 500, 600, 700],
        },
        accentColor: {
            type: String,
            default: '#3b6ef0',
        },
    },
    { timestamps: true }
);

export default mongoose.models.Settings ||
    mongoose.model<ISettings>('Settings', SettingsSchema);
