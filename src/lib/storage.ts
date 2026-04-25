import { supabase } from './supabase';

/**
 * Uploads a visa file to the 'visas' bucket in Supabase Storage.
 * Structure: visas/{passportNumber}/{fileName}
 */
export async function uploadVisaFile(passportNumber: string, fileBuffer: Buffer, fileName: string, mimeType: string) {
  const filePath = `${passportNumber}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('visas')
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase Upload Error: ${error.message}`);
  }

  return data;
}

/**
 * Generates a time-limited signed URL for a visa document.
 * @param filePath The relative path in the 'visas' bucket (e.g., 'A1234567/visa.pdf')
 * @param expires a number of seconds until the URL expires (default 1 hour)
 */
export async function getVisaSignedUrl(filePath: string, expires = 3600) {
  const { data, error } = await supabase.storage
    .from('visas')
    .createSignedUrl(filePath, expires);

  if (error) {
    throw new Error(`Supabase Signed URL Error: ${error.message}`);
  }

  return data?.signedUrl;
}
