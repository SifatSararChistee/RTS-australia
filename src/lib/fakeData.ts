export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "under_review";

export type VisaApplication = {
  id: string;
  submittedAt: string;
  status: ApplicationStatus;
  visaType: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  dateOfBirth: string;
  purposeOfVisit: string;
  intendedArrival: string;
  intendedDeparture: string;
  address: string;
  occupation: string;
  employer: string;
  notes?: string;
};

export const fakeApplications: VisaApplication[] = [
  {
    id: "APP-2025-001",
    submittedAt: "2025-04-10T09:23:00Z",
    status: "pending",
    visaType: "Tourist Visa",
    fullName: "Arjun Sharma",
    email: "arjun.sharma@email.com",
    phone: "+91 98765 43210",
    nationality: "Indian",
    passportNumber: "J7823401",
    dateOfBirth: "1990-03-15",
    purposeOfVisit: "Tourism and sightseeing",
    intendedArrival: "2025-06-01",
    intendedDeparture: "2025-06-21",
    address: "42 MG Road, Bengaluru, Karnataka 560001",
    occupation: "Software Engineer",
    employer: "Infosys Ltd.",
    notes: "Has previous Australian visa from 2022.",
  },
  {
    id: "APP-2025-002",
    submittedAt: "2025-04-11T14:05:00Z",
    status: "under_review",
    visaType: "Student Visa",
    fullName: "Li Wei",
    email: "liwei.student@gmail.com",
    phone: "+86 138 0013 8000",
    nationality: "Chinese",
    passportNumber: "EA1234567",
    dateOfBirth: "2002-07-22",
    purposeOfVisit: "Enrolled at University of Sydney for Bachelor of Commerce",
    intendedArrival: "2025-07-20",
    intendedDeparture: "2028-11-30",
    address: "Room 5, Building 3, Tsinghua University, Beijing",
    occupation: "Student",
    employer: "N/A",
  },
  {
    id: "APP-2025-003",
    submittedAt: "2025-04-09T11:45:00Z",
    status: "approved",
    visaType: "Business Visa",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+1 415 555 0198",
    nationality: "American",
    passportNumber: "527834910",
    dateOfBirth: "1985-11-08",
    purposeOfVisit:
      "Attending business conference and client meetings in Sydney",
    intendedArrival: "2025-05-15",
    intendedDeparture: "2025-05-25",
    address: "123 Market Street, San Francisco, CA 94105",
    occupation: "Senior Product Manager",
    employer: "TechCorp Inc.",
    notes: "Conference: AusTech Summit 2025",
  },
  {
    id: "APP-2025-004",
    submittedAt: "2025-04-08T08:30:00Z",
    status: "rejected",
    visaType: "Tourist Visa",
    fullName: "Mohammed Al-Rashid",
    email: "m.alrashid@yahoo.com",
    phone: "+971 50 123 4567",
    nationality: "Emirati",
    passportNumber: "A09876543",
    dateOfBirth: "1978-05-30",
    purposeOfVisit: "Family tourism",
    intendedArrival: "2025-05-10",
    intendedDeparture: "2025-05-24",
    address: "Villa 12, Al Barsha, Dubai, UAE",
    occupation: "Business Owner",
    employer: "Al-Rashid Trading LLC",
    notes:
      "Missing financial documents. Passport expires within 6 months of travel.",
  },
  {
    id: "APP-2025-005",
    submittedAt: "2025-04-12T16:20:00Z",
    status: "pending",
    visaType: "Working Holiday Visa",
    fullName: "Emma Müller",
    email: "emma.mueller@web.de",
    phone: "+49 30 12345678",
    nationality: "German",
    passportNumber: "C01X00T47",
    dateOfBirth: "1998-09-14",
    purposeOfVisit:
      "Working holiday — exploring Australia while working part-time",
    intendedArrival: "2025-08-01",
    intendedDeparture: "2026-07-31",
    address: "Musterstraße 12, 10115 Berlin, Germany",
    occupation: "Graphic Designer (Freelance)",
    employer: "Self-employed",
  },
  {
    id: "APP-2025-006",
    submittedAt: "2025-04-13T10:00:00Z",
    status: "pending",
    visaType: "Skilled Worker Visa",
    fullName: "Priya Patel",
    email: "priya.patel@outlook.com",
    phone: "+44 7700 900123",
    nationality: "British",
    passportNumber: "123456789",
    dateOfBirth: "1992-02-18",
    purposeOfVisit:
      "Skilled migration — nursing position at Melbourne hospital",
    intendedArrival: "2025-09-01",
    intendedDeparture: "N/A (permanent)",
    address: "14 Baker Street, London, W1U 3BW",
    occupation: "Registered Nurse",
    employer: "NHS Royal London Hospital",
    notes: "Sponsorship letter attached from Melbourne General Hospital.",
  },
];
