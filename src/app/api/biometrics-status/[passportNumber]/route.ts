import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ passportNumber: string }> }
) {
  try {
    const { passportNumber } = await params;
    const decodedPassport = decodeURIComponent(passportNumber);

    // Mock data for biometrics status
    const mockBiometrics: Record<string, any> = {
      "A1234567": {
        passportNumber: "A1234567",
        fullName: "John Doe",
        status: "Approved",
        biometrics: {
          verified: true,
          capturedAt: "2026-01-15T10:00:00Z",
          fingerprints: [
            { side: "Left", finger: "Thumb", imageUrl: "https://via.placeholder.com/150?text=L+Thumb" },
            { side: "Left", finger: "Index", imageUrl: "https://via.placeholder.com/150?text=L+Index" },
            { side: "Left", finger: "Middle", imageUrl: "https://via.placeholder.com/150?text=L+Middle" },
            { side: "Left", finger: "Ring", imageUrl: "https://via.placeholder.com/150?text=L+Ring" },
            { side: "Left", finger: "Little", imageUrl: "https://via.placeholder.com/150?text=L+Little" },
            { side: "Right", finger: "Thumb", imageUrl: "https://via.placeholder.com/150?text=R+Thumb" },
            { side: "Right", finger: "Index", imageUrl: "https://via.placeholder.com/150?text=R+Index" },
            { side: "Right", finger: "Middle", imageUrl: "https://via.placeholder.com/150?text=R+Middle" },
            { side: "Right", finger: "Ring", imageUrl: "https://via.placeholder.com/150?text=R+Ring" },
            { side: "Right", finger: "Little", imageUrl: "https://via.placeholder.com/150?text=R+Little" },
          ],
        },
      },
      "B9876543": {
        passportNumber: "B9876543",
        fullName: "Jane Smith",
        status: "Pending",
        biometrics: {
          verified: false,
          capturedAt: null,
          fingerprints: [],
        },
      },
    };

    const record = mockBiometrics[decodedPassport.toUpperCase()];

    if (!record) {
      return NextResponse.json(
        { error: 'No biometrics record found for the provided passport number' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      record: record,
    });
  } catch (error) {
    console.error('Biometrics API Error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
