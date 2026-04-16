// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { supabase } from "@/lib/supabase";

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const passportNumber = formData.get("passportNumber") as string;
//     const file = formData.get("file") as File;

//     if (!passportNumber || !file) {
//       return NextResponse.json({ error: "Passport number and file are required." }, { status: 400 });
//     }

//     // Convert file to buffer for Supabase
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Create a unique file path
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${passportNumber}-${Date.now()}.${fileExt}`;
//     const filePath = `${passportNumber}/${fileName}`;

//     // Upload to Supabase Storage Bucket 'documents'
//     const { data: uploadData, error: uploadError } = await supabase
//       .storage
//       .from('documents')
//       .upload(filePath, buffer, {
//         contentType: file.type,
//         upsert: false
//       });

//     if (uploadError) {
//       console.error("Supabase Upload Error:", uploadError);
//       return NextResponse.json({ error: "Failed to upload file to storage." }, { status: 500 });
//     }

//     // Get public URL
//     const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);

//     // Save metadata in Prisma DB
//     const document = await prisma.document.create({
//       data: {
//         passportNumber,
//         fileName: file.name,
//         fileUrl: publicUrl,
//       }
//     });

//     return NextResponse.json({ success: true, document });
//   } catch (error: any) {
//     console.error("Upload Route Error:", error);
//     return NextResponse.json({ error: "Internal Server Error during upload." }, { status: 500 });
//   }
// }
