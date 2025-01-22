export type Study = {
  id: string
  title: string
  purpose?: string
  explanation: string
  location: string
  startDate: Date
  endDate?: Date
  totalSpots?: number
  availableSpots?: number
  status: 'recruiting' | 'running' | 'completed'
  progress?: number
  participants?: number
  hasApplied?: boolean
  matches?: boolean
  enrolled?: boolean
}

export const studies: Study[] = [
  {
    id: "TARGET-2024",
    title: "TaRGETed Therapy with Glycogen Synthase Kinase-3 Inhibition for Arrhythmogenic Cardiomyopathy",
    purpose: "To evaluate the therapeutic efficacy of tideglusib, a GSK3β inhibitor, in genotype positive arrhythmogenic cardiomyopathy (ACM)",
    explanation: "A multi-centre, prospective, randomized, double-blind, placebo-controlled trial studying the effects of tideglusib in ACM patients. The study aims to assess changes in PVC count and ventricular strain, among other cardiac outcomes.",
    location: "Multiple locations across Canada (20 sites)",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2026-12-31"),
    totalSpots: 120,
    availableSpots: 0,
    progress: 50,
    participants: 120,
    status: "running",
    matches: false,
    enrolled: true
  },
  {
    id: "NCT06275893",
    title: "Arrhythmogenic Right Ventricular Cardiomyopathy Biomarker Study",
    purpose: "To identify novel biomarkers for early detection and monitoring of ARVC progression",
    explanation: "A prospective study collecting blood samples from ARVC patients to identify potential biomarkers that could help in early disease detection and monitoring of disease progression",
    location: "Johns Hopkins Hospital, Baltimore, Maryland, United States",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2025-12-01"),
    totalSpots: 100,
    availableSpots: 0,
    progress: 42,
    participants: 100,
    status: "running",
    matches: false
  },
  {
    id: "NCT00083395",
    title: "Isoproterenol Challenge to Detect Arrhythmogenic Right Ventricular Cardiomyopathy",
    explanation: "Study to evaluate the effectiveness of Isoproterenol challenge in ARVC detection",
    location: "Bethesda, Maryland, United States",
    startDate: new Date("2022-06-01"),
    endDate: new Date("2023-09-30"),
    participants: 50,
    status: "completed",
    progress: 100,
    matches: true
  },
  {
    id: "NCT02291393",
    title: "The Role of High Density Surface ECG in the Diagnosis of Arrhythmogenic Right Ventricular Cardiomyopathy",
    explanation: "Investigation of advanced ECG techniques in ARVC diagnosis",
    location: "Location not provided",
    startDate: new Date("2022-07-15"),
    endDate: new Date("2023-10-15"),
    participants: 75,
    status: "completed",
    progress: 100,
    matches: false
  },
  {
    id: "NCT02302274",
    title: "Diagnostic Value and Safety of Flecainide Infusion Test in Brugada Syndrome",
    explanation: "Evaluation of Flecainide testing in patients with Brugada Syndrome",
    location: "New York, New York, United States",
    startDate: new Date("2022-08-01"),
    endDate: new Date("2023-11-30"),
    participants: 40,
    status: "completed",
    progress: 100,
    matches: true
  },
  {
    id: "NCT00083395",
    title: "Isoproterenol Challenge to Detect Arrhythmogenic Right Ventricular Cardiomyopathy",
    explanation: "Study to evaluate the effectiveness of Isoproterenol challenge in ARVC detection",
    location: "Bethesda, Maryland, United States",
    startDate: new Date("2023-06-01"),
    totalSpots: 50,
    availableSpots: 8,
    status: "recruiting",
    matches: true
  },
  {
    id: "NCT02291393",
    title: "The Role of High Density Surface ECG in the Diagnosis of Arrhythmogenic Right Ventricular Cardiomyopathy",
    explanation: "Investigation of advanced ECG techniques in ARVC diagnosis",
    location: "Location not provided",
    startDate: new Date("2023-07-15"),
    totalSpots: 75,
    availableSpots: 15,
    status: "recruiting",
    matches: false
  },
  {
    id: "NCT02302274",
    title: "Diagnostic Value and Safety of Flecainide Infusion Test in Brugada Syndrome",
    explanation: "Evaluation of Flecainide testing in patients with Brugada Syndrome",
    location: "New York, New York, United States",
    startDate: new Date("2023-08-01"),
    totalSpots: 40,
    availableSpots: 5,
    status: "recruiting",
    matches: true
  },
  {
    id: "NCT01678040",
    title: "Ventricular Volume as Assessed by Cardiac Magnetic Resonance",
    explanation: "Study assessing ventricular volumes using cardiac MRI in ARVC patients",
    location: "Toronto, Ontario, Canada",
    startDate: new Date("2022-05-01"),
    endDate: new Date("2023-08-15"),
    participants: 60,
    status: "completed",
    progress: 100,
    matches: false
  },
  {
    id: "NCT03900208",
    title: "The Arrhythmogenic Right Ventricular Cardiomyopathy/Dysplasia",
    explanation: "Comprehensive study of right ventricle abnormalities in ARVC/D",
    location: "Location not provided",
    startDate: new Date("2022-04-01"),
    endDate: new Date("2023-07-30"),
    participants: 85,
    status: "completed",
    progress: 100,
    matches: true
  }
];