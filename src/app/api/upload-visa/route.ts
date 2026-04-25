import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadVisaFile } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    // 1. Simple Admin Auth Check (In a real app, check session/cookie here)
    // For now, we'll allow it if the request comes from the admin panel.
    // Integration with a real auth system should be added here.

    const formData = await request.formData();
    const passportNumber = formData.get('passportNumber') as string;
    const file = formData.get('file') as File;

    if (!passportNumber || !file) {
      return NextResponse.json(
        { error: 'Missing passport number or file' },
        { status: 400 }
      );
    }

    // 2. File Validation
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG are allowed.' },
        { status: 400 }
      );
    }

    // 3. Convert File to Buffer for the storage utility
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Upload to Supabase
    const fileName = file.name;
    await uploadVisaFile(passportNumber, buffer, fileName, file.type);

    // 5. Save record to database
    const document = await prisma.document.create({
      data: {
        passportNumber,
        fileName,
        fileUrl: `${passportNumber}/${fileName}`,
      },
    });

    return NextResponse.json({
      message: 'E-Visa uploaded successfully',
      documentId: document.id,
    });
  } catch (error: any) {
    console.error('Upload Visa API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
