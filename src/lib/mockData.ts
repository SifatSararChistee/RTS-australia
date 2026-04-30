// lib/mockData.ts
// Mock data matching the exact Supabase schema for applications + documents

export type ApplicationStatus = "pending" | "approved" | "rejected";
export type BiometricsStatus = "pending" | "completed";

export interface Document {
  id: string;
  application_id: string;
  title: string;
  link: string;
  uploaded_at: string;
}

export interface Application {
  id: string;
  full_name: string;
  father_name: string;
  mother_name: string;
  email: string;
  phone: string;
  nid: string;
  passport_number: string;
  passport_validity: string;
  visa_type: string;
  current_address: string;
  permanent_address: string;
  status: ApplicationStatus;
  evisa_link: string | null;
  visa_grant_number: string | null;
  biometrics_status: BiometricsStatus;
  created_at: string;
  updated_at: string;
  documents: Document[];
}

export const mockApplications: Application[] = [
  {
    id: "a1b2c3d4-0001-4e5f-8a9b-000000000001",
    full_name: "Rafiul Hasan",
    father_name: "Mokhlesur Rahman",
    mother_name: "Farida Begum",
    email: "rafiul.hasan@gmail.com",
    phone: "+880 1711 234567",
    nid: "1991234567890",
    passport_number: "A1234567",
    passport_validity: "2028-06-15",
    visa_type: "Tourist Visa",
    current_address: "House 12, Road 4, Dhanmondi, Dhaka-1205",
    permanent_address: "Village: Chandpur, PO: Matlab, District: Chandpur",
    status: "approved",
    evisa_link: "https://storage.example.com/evisas/A1234567.pdf",
    visa_grant_number: null,
    biometrics_status: "completed",
    created_at: "2025-03-10T08:24:00Z",
    updated_at: "2025-03-18T11:45:00Z",
    documents: [
      {
        id: "doc-0001-0001",
        application_id: "a1b2c3d4-0001-4e5f-8a9b-000000000001",
        title: "Passport Copy",
        link: "https://storage.example.com/docs/A1234567_passport.pdf",
        uploaded_at: "2025-03-12T09:00:00Z",
      },
      {
        id: "doc-0001-0002",
        application_id: "a1b2c3d4-0001-4e5f-8a9b-000000000001",
        title: "Bank Statement",
        link: "https://storage.example.com/docs/A1234567_bank.pdf",
        uploaded_at: "2025-03-12T09:15:00Z",
      },
      {
        id: "doc-0001-0003",
        application_id: "a1b2c3d4-0001-4e5f-8a9b-000000000001",
        title: "NID Copy",
        link: "https://storage.example.com/docs/A1234567_nid.pdf",
        uploaded_at: "2025-03-13T10:30:00Z",
      },
    ],
  },

  {
    id: "a1b2c3d4-0002-4e5f-8a9b-000000000002",
    full_name: "Nusrat Jahan",
    father_name: "Abdul Karim",
    mother_name: "Jahanara Begum",
    email: "nusrat.jahan@yahoo.com",
    phone: "+880 1821 345678",
    nid: "2994567890123",
    passport_number: "B9876543",
    passport_validity: "2027-11-30",
    visa_type: "Student Visa",
    current_address: "Flat 5B, Green Valley Apartments, Mirpur-10, Dhaka-1216",
    permanent_address: "House 3, Kotwali Road, Sylhet-3100",
    status: "pending",
    evisa_link: null,
    visa_grant_number: null,
    biometrics_status: "completed",
    created_at: "2025-03-22T14:10:00Z",
    updated_at: "2025-03-25T09:00:00Z",
    documents: [
      {
        id: "doc-0002-0001",
        application_id: "a1b2c3d4-0002-4e5f-8a9b-000000000002",
        title: "Passport Copy",
        link: "https://storage.example.com/docs/B9876543_passport.pdf",
        uploaded_at: "2025-03-23T08:00:00Z",
      },
      {
        id: "doc-0002-0002",
        application_id: "a1b2c3d4-0002-4e5f-8a9b-000000000002",
        title: "University Offer Letter",
        link: "https://storage.example.com/docs/B9876543_offer.pdf",
        uploaded_at: "2025-03-23T08:20:00Z",
      },
    ],
  },

  {
    id: "a1b2c3d4-0003-4e5f-8a9b-000000000003",
    full_name: "Tariqul Islam",
    father_name: "Sirajul Islam",
    mother_name: "Rahela Khatun",
    email: "tariq.islam@outlook.com",
    phone: "+880 1912 456789",
    nid: "3887654321098",
    passport_number: "C5544332",
    passport_validity: "2026-04-20",
    visa_type: "Business Visa",
    current_address: "Plot 22, Sector 11, Uttara, Dhaka-1230",
    permanent_address:
      "Village: Harinakunda, PO: Harinakunda, District: Jhenaidah",
    status: "pending",
    evisa_link: null,
    visa_grant_number: null,
    biometrics_status: "pending",
    created_at: "2025-04-01T10:55:00Z",
    updated_at: "2025-04-01T10:55:00Z",
    documents: [
      {
        id: "doc-0003-0001",
        application_id: "a1b2c3d4-0003-4e5f-8a9b-000000000003",
        title: "Passport Copy",
        link: "https://storage.example.com/docs/C5544332_passport.pdf",
        uploaded_at: "2025-04-01T11:10:00Z",
      },
    ],
  },

  {
    id: "a1b2c3d4-0004-4e5f-8a9b-000000000004",
    full_name: "Sumaiya Akter",
    father_name: "Nurul Amin",
    mother_name: "Morzina Begum",
    email: "sumaiya.akter@gmail.com",
    phone: "+880 1633 567890",
    nid: "4776543210987",
    passport_number: "D7788990",
    passport_validity: "2029-02-28",
    visa_type: "Job Visa",
    current_address: "House 8, Block C, Bashundhara R/A, Dhaka-1229",
    permanent_address: "Village: Betagi, PO: Betagi, District: Barguna",
    status: "rejected",
    evisa_link: null,
    visa_grant_number: null,
    biometrics_status: "pending",
    created_at: "2025-02-14T07:30:00Z",
    updated_at: "2025-02-20T16:00:00Z",
    documents: [
      {
        id: "doc-0004-0001",
        application_id: "a1b2c3d4-0004-4e5f-8a9b-000000000004",
        title: "Passport Copy",
        link: "https://storage.example.com/docs/D7788990_passport.pdf",
        uploaded_at: "2025-02-14T08:00:00Z",
      },
      {
        id: "doc-0004-0002",
        application_id: "a1b2c3d4-0004-4e5f-8a9b-000000000004",
        title: "Employment Contract",
        link: "https://storage.example.com/docs/D7788990_contract.pdf",
        uploaded_at: "2025-02-14T08:30:00Z",
      },
      {
        id: "doc-0004-0003",
        application_id: "a1b2c3d4-0004-4e5f-8a9b-000000000004",
        title: "Police Clearance",
        link: "https://storage.example.com/docs/D7788990_police.pdf",
        uploaded_at: "2025-02-15T09:00:00Z",
      },
    ],
  },

  {
    id: "a1b2c3d4-0005-4e5f-8a9b-000000000005",
    full_name: "Mahmudul Haque",
    father_name: "Aminul Haque",
    mother_name: "Bilkis Begum",
    email: "mahmudul.haque@protonmail.com",
    phone: "+880 1755 678901",
    nid: "5665432109876",
    passport_number: "E2211334",
    passport_validity: "2030-09-10",
    visa_type: "Residence Visa",
    current_address: "Apartment 12D, Navana Tower, Gulshan-2, Dhaka-1212",
    permanent_address: "House 14, Agrabad, Chattogram-4100",
    status: "pending",
    evisa_link: null,
    visa_grant_number: null,
    biometrics_status: "pending",
    created_at: "2025-04-10T13:20:00Z",
    updated_at: "2025-04-10T13:20:00Z",
    documents: [],
  },

  {
    id: "a1b2c3d4-0006-4e5f-8a9b-000000000006",
    full_name: "Farzana Khanam",
    father_name: "Rezaul Karim",
    mother_name: "Hasina Akter",
    email: "farzana.khanam@gmail.com",
    phone: "+880 1844 789012",
    nid: "6554321098765",
    passport_number: "F3344556",
    passport_validity: "2027-07-05",
    visa_type: "Diplomatic Visa",
    current_address: "House 2, Road 27, Banani, Dhaka-1213",
    permanent_address: "House 2, Road 27, Banani, Dhaka-1213",
    status: "approved",
    evisa_link: "https://storage.example.com/evisas/F3344556.pdf",
    visa_grant_number: null,
    biometrics_status: "completed",
    created_at: "2025-01-18T09:45:00Z",
    updated_at: "2025-01-30T14:20:00Z",
    documents: [
      {
        id: "doc-0006-0001",
        application_id: "a1b2c3d4-0006-4e5f-8a9b-000000000006",
        title: "Diplomatic Note",
        link: "https://storage.example.com/docs/F3344556_diploNote.pdf",
        uploaded_at: "2025-01-19T10:00:00Z",
      },
      {
        id: "doc-0006-0002",
        application_id: "a1b2c3d4-0006-4e5f-8a9b-000000000006",
        title: "Passport Copy",
        link: "https://storage.example.com/docs/F3344556_passport.pdf",
        uploaded_at: "2025-01-19T10:10:00Z",
      },
    ],
  },
];
