import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { file, filename, type } = data;

        if (!file || !filename) {
            return NextResponse.json(
                { error: 'File and filename are required' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
        if (type && !allowedTypes.includes(type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, MP4, WebM' },
                { status: 400 }
            );
        }

        // Check if it's a base64 string
        let base64Data = file;
        if (file.includes(',')) {
            base64Data = file.split(',')[1];
        }

        // Validate size (approximate - base64 is ~33% larger than binary)
        const approximateSize = (base64Data.length * 3) / 4;
        if (approximateSize > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10MB' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const finalFilename = `${timestamp}-${sanitizedFilename}`;

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Write file
        const filePath = path.join(uploadsDir, finalFilename);
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(filePath, buffer);

        // Return the public URL
        const publicUrl = `/uploads/${finalFilename}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: finalFilename,
        }, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json(
                { error: 'Filename is required' },
                { status: 400 }
            );
        }

        const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return NextResponse.json({ success: true, message: 'File deleted' }, { status: 200 });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}
