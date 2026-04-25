import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ passportNumber: string }> }
) {
  try {
    const { passportNumber } = await params;
    const decodedPassport = decodeURIComponent(passportNumber);

    // Mock data for demonstration purposes
    const mockApplications: Record<string, any> = {
      "A1234567": {
        passportNumber: "A1234567",
        fullName: "John Doe",
        status: "Approved",
        documents: [
          {
            id: "doc1",
            fileName: "eVisa_JohnDoe.pdf",
            fileUrl: "https://example.com/visa.pdf",
            uploadedAt: new Date().toISOString(),
          },
        ],
      },
      "B9876543": {
        passportNumber: "B9876543",
        fullName: "Jane Smith",
        status: "Biometrics Pending",
        documents: [],
      },
    };

    const application = mockApplications[decodedPassport.toUpperCase()];

    if (!application) {
      return NextResponse.json(
        { error: 'No record found for the provided passport number' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      application: application,
    });
  } catch (error) {
    console.error('Status API Error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
