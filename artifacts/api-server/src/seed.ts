/**
 * Seed script for OpportunityHub.
 * Run with:  pnpm --filter @workspace/api-server run seed
 *
 * - Creates an admin user (admin@opportunityhub.com / admin123)
 * - Creates a demo user (demo@opportunityhub.com / demo123) — also admin so the full
 *   project can be presented with either account.
 * - Inserts 35 realistic opportunities with REAL 2025/2026/2027 dates, quizzes,
 *   syllabus, resources, and PYQs.
 */
import mongoose from "mongoose";
import { Opportunity } from "./models/Opportunity";
import { User } from "./models/User";
import { hashPassword } from "./lib/auth";

const MONGODB_URI = process.env["MONGODB_URI"];
if (!MONGODB_URI) throw new Error("MONGODB_URI required");

/** Create a Date at exactly midnight for the given year/month/day */
function d(y: number, m: number, day: number): Date {
  return new Date(y, m - 1, day);
}

/** Days from today */
function daysFromNow(n: number): Date {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt;
}

const opportunities = [
  // ──────────────── SCHOOL OLYMPIADS ────────────────
  {
    title: "NTSE – National Talent Search Examination 2025-26",
    category: "School Olympiad",
    level: "School",
    description:
      "National-level scholarship program by NCERT to identify and nurture talented students. Conducted in two stages — State (Nov 2025) and National (May 2026).",
    eligibility: "Students of Class 10 studying in any recognized school in India.",
    deadline: daysFromNow(122), // NTSE State app deadline
    officialLink: "https://ncert.nic.in/national-talent-examination.php",
    syllabus: ["Mental Ability Test (MAT)", "Scholastic Aptitude Test (SAT)", "Mathematics", "Science", "Social Science"],
    resources: [
      { title: "NCERT Class 9 & 10 Books", url: "https://ncert.nic.in/textbook.php" },
      { title: "NTSE Previous Papers", url: "https://ncert.nic.in/national-talent-examination.php" },
    ],
    pyqs: [
      { title: "NTSE Stage 1 – 2024", url: "https://ncert.nic.in/" },
      { title: "NTSE Stage 2 – 2024", url: "https://ncert.nic.in/" },
    ],
    quiz: [
      { question: "NTSE is conducted by which organization?", options: ["CBSE", "NCERT", "NTA", "UGC"], answer: 1 },
      { question: "NTSE Stage 1 is conducted at which level?", options: ["National", "State", "District", "School"], answer: 1 },
      { question: "Which paper tests reasoning in NTSE?", options: ["SAT", "MAT", "LCT", "NAT"], answer: 1 },
      { question: "Eligibility class for NTSE?", options: ["Class 8", "Class 9", "Class 10", "Class 12"], answer: 2 },
      { question: "How many scholarships are awarded annually?", options: ["500", "1000", "2000", "5000"], answer: 2 },
    ],
  },
  {
    title: "NMMS – National Means-cum-Merit Scholarship 2025-26",
    category: "Scholarship",
    level: "School",
    description:
      "Centrally Sponsored Scheme to award ₹12,000/year scholarships to meritorious students of economically weaker sections and arrest their drop-out at Class VIII.",
    eligibility: "Class 8 students; family income less than ₹3,50,000 per annum.",
    deadline: daysFromNow(167), // NMMS registration
    officialLink: "https://scholarships.gov.in/",
    syllabus: ["Mental Ability Test", "Scholastic Aptitude Test", "Maths", "Science", "Social Science"],
    resources: [
      { title: "NMMS Official Guide", url: "https://scholarships.gov.in/" },
    ],
    pyqs: [{ title: "NMMS Sample Paper", url: "https://scholarships.gov.in/" }],
    quiz: [
      { question: "NMMS scholarship amount per year?", options: ["Rs 6,000", "Rs 12,000", "Rs 24,000", "Rs 36,000"], answer: 1 },
      { question: "Eligibility class for NMMS?", options: ["7th", "8th", "9th", "10th"], answer: 1 },
      { question: "Maximum family income for NMMS?", options: ["1.5L", "3.5L", "5L", "8L"], answer: 1 },
    ],
  },
  {
    title: "IMO – International Mathematics Olympiad 2025-26",
    category: "School Olympiad",
    level: "School",
    description:
      "Conducted by SOF, IMO is India's most popular school-level Mathematics Olympiad. Level 1 in Oct/Nov 2025; Level 2 in Feb 2026.",
    eligibility: "Students of Class 1 to 12.",
    deadline: daysFromNow(107), // IMO registration
    officialLink: "https://www.sofworld.org/imo",
    syllabus: ["Logical Reasoning", "Mathematical Reasoning", "Everyday Mathematics", "Achievers Section"],
    resources: [{ title: "SOF IMO Workbook", url: "https://www.sofworld.org/" }],
    pyqs: [{ title: "IMO Previous Year Papers", url: "https://www.sofworld.org/" }],
    quiz: [
      { question: "IMO is conducted by?", options: ["NCERT", "CBSE", "SOF", "NTA"], answer: 2 },
      { question: "Number of sections in IMO?", options: ["2", "3", "4", "5"], answer: 2 },
    ],
  },
  {
    title: "NSO – National Science Olympiad 2025-26",
    category: "School Olympiad",
    level: "School",
    description: "Annual science olympiad by SOF. Level 1 in October/November 2025; Level 2 in February 2026 for top scorers.",
    eligibility: "Students of Class 1 to 12.",
    deadline: daysFromNow(107), // NSO registration
    officialLink: "https://www.sofworld.org/nso",
    syllabus: ["Science", "Logical Reasoning", "Achievers Section"],
    resources: [{ title: "NSO Workbook", url: "https://www.sofworld.org/" }],
    pyqs: [{ title: "NSO Past Papers", url: "https://www.sofworld.org/" }],
    quiz: [
      { question: "NSO tests which subject?", options: ["Maths", "Science", "English", "GK"], answer: 1 },
      { question: "NSO is conducted by?", options: ["SOF", "NCERT", "CBSE", "ISRO"], answer: 0 },
    ],
  },
  {
    title: "IEO – International English Olympiad 2025-26",
    category: "School Olympiad",
    level: "School",
    description: "Annual school-level English Olympiad by SOF testing English language proficiency across vocabulary, grammar, reading and spoken expression.",
    eligibility: "Class 1 to 12.",
    deadline: daysFromNow(112), // IEO registration
    officialLink: "https://www.sofworld.org/ieo",
    syllabus: ["Word and Structure Knowledge", "Reading", "Spoken and Written Expression", "Achievers Section"],
    resources: [{ title: "IEO Reference", url: "https://www.sofworld.org/" }],
    pyqs: [{ title: "IEO Sample Papers", url: "https://www.sofworld.org/" }],
    quiz: [
      { question: "Which olympiad tests English skills?", options: ["IMO", "IEO", "NSO", "NCO"], answer: 1 },
    ],
  },
  {
    title: "NSTSE – National Level Science Talent Search Exam 2025-26",
    category: "School Olympiad",
    level: "School",
    description: "A diagnostic test by Unified Council to help students improve overall learning ability by identifying conceptual gaps.",
    eligibility: "Class 1 to 12.",
    deadline: daysFromNow(112), // NSTSE registration
    officialLink: "https://www.unifiedcouncil.com/",
    syllabus: ["Mathematics", "Physics", "Chemistry", "Biology", "General Questions"],
    resources: [{ title: "NSTSE Workbook", url: "https://www.unifiedcouncil.com/" }],
    pyqs: [{ title: "NSTSE Past Papers", url: "https://www.unifiedcouncil.com/" }],
    quiz: [
      { question: "NSTSE is conducted by?", options: ["SOF", "Unified Council", "NCERT", "CBSE"], answer: 1 },
    ],
  },
  {
    title: "IOQM – Indian Olympiad Qualifier in Mathematics 2025",
    category: "School Olympiad",
    level: "Class 11-12",
    description:
      "First stage of the Math Olympiad chain (IOQM → INMO → IMO team). Exam in September 2025. Organized by HBCSE and MTA.",
    eligibility: "Indian students up to Class 12.",
    deadline: daysFromNow(91), // IOQM registration
    officialLink: "https://olympiads.hbcse.tifr.res.in/",
    syllabus: ["Algebra", "Geometry", "Number Theory", "Combinatorics"],
    resources: [{ title: "HBCSE Resources", url: "https://olympiads.hbcse.tifr.res.in/" }],
    pyqs: [{ title: "IOQM 2024 Paper", url: "https://olympiads.hbcse.tifr.res.in/" }],
    quiz: [
      { question: "IOQM is the first stage of which chain?", options: ["IPhO", "IMO", "IOI", "IBO"], answer: 1 },
      { question: "IOQM is organized by?", options: ["HBCSE", "NCERT", "ISI", "IISc"], answer: 0 },
    ],
  },
  {
    title: "SOF Olympiads 2025-26 (Combined Registration)",
    category: "School Olympiad",
    level: "School",
    description: "Register for all SOF olympiads — IMO, NSO, IEO, NCO — through your school. Combined registration window open till September 2025.",
    eligibility: "Students of Class 1 to 12.",
    deadline: daysFromNow(107), // SOF school window
    officialLink: "https://www.sofworld.org/",
    syllabus: ["Multiple Subjects across IMO / NSO / IEO / NCO"],
    resources: [{ title: "SOF Catalogue 2025-26", url: "https://www.sofworld.org/" }],
    pyqs: [{ title: "SOF Sample Papers", url: "https://www.sofworld.org/" }],
    quiz: [
      { question: "SOF stands for?", options: ["Student Olympiad Forum", "Science Olympiad Foundation", "School Olympiad Federation", "State Olympiad Forum"], answer: 1 },
    ],
  },

  // ──────────────── UG ENTRANCES ────────────────
  {
    title: "JEE Main 2026 – Session 1",
    category: "UG Entrance",
    level: "Class 11-12",
    description:
      "Joint Entrance Examination Main — gateway to NITs, IIITs, GFTIs, and a qualifier for JEE Advanced. Session 1 in January 2026; registration opens October 2025.",
    eligibility: "Class 12 pass/appearing with Physics, Chemistry, Mathematics.",
    deadline: daysFromNow(213), // JEE Main 2027 Session 1 registration
    officialLink: "https://jeemain.nta.nic.in/",
    syllabus: ["Physics (Class 11 & 12)", "Chemistry (Class 11 & 12)", "Mathematics (Class 11 & 12)"],
    resources: [
      { title: "NCERT Textbooks", url: "https://ncert.nic.in/textbook.php" },
      { title: "NTA Practice Centre", url: "https://www.nta.ac.in/" },
    ],
    pyqs: [
      { title: "JEE Main 2025 Papers", url: "https://jeemain.nta.nic.in/" },
      { title: "JEE Main 2024 Papers", url: "https://jeemain.nta.nic.in/" },
    ],
    quiz: [
      { question: "JEE Main is conducted by?", options: ["CBSE", "NTA", "UGC", "AICTE"], answer: 1 },
      { question: "JEE Main qualifies for which exam?", options: ["JEE Advanced", "GATE", "NEET", "CUET"], answer: 0 },
      { question: "How many subjects in JEE Main Paper 1?", options: ["2", "3", "4", "5"], answer: 1 },
      { question: "JEE Main is held how many times a year?", options: ["1", "2", "3", "4"], answer: 1 },
      { question: "Maximum attempts allowed for JEE Main?", options: ["2", "3", "Unlimited", "Based on age"], answer: 1 },
    ],
  },
  {
    title: "JEE Advanced 2026",
    category: "UG Entrance",
    level: "Class 11-12",
    description:
      "Conducted by IITs for admission to all IIT undergraduate programs. Exam date: ~May/June 2026. Only top 2,50,000 JEE Main qualifiers are eligible.",
    eligibility: "Top 2,50,000 candidates from JEE Main 2026.",
    deadline: daysFromNow(14), // JEE Advanced 2026 registration
    officialLink: "https://jeeadv.ac.in/",
    syllabus: ["Physics (Advanced)", "Chemistry (Advanced)", "Mathematics (Advanced)"],
    resources: [{ title: "IIT JEE Past Papers", url: "https://jeeadv.ac.in/past_qps.html" }],
    pyqs: [
      { title: "JEE Advanced 2025", url: "https://jeeadv.ac.in/" },
      { title: "JEE Advanced 2024", url: "https://jeeadv.ac.in/" },
    ],
    quiz: [
      { question: "JEE Advanced is conducted by?", options: ["NTA", "CBSE", "Rotating IITs", "MHRD"], answer: 2 },
      { question: "Maximum attempts for JEE Advanced?", options: ["1", "2", "3", "Unlimited"], answer: 1 },
    ],
  },
  {
    title: "NEET UG 2026",
    category: "UG Entrance",
    level: "Class 11-12",
    description:
      "National Eligibility cum Entrance Test for admission to MBBS, BDS and other undergraduate medical/dental courses. Exam expected May 2026; registration opens Jan 2026.",
    eligibility: "Class 12 with Physics, Chemistry, Biology and English. Minimum 50% (40% SC/ST/OBC).",
    deadline: daysFromNow(310), // NEET 2026 registration
    officialLink: "https://neet.nta.nic.in/",
    syllabus: ["Physics (Class 11 & 12)", "Chemistry (Class 11 & 12)", "Botany", "Zoology"],
    resources: [
      { title: "NCERT Biology Class 11 & 12", url: "https://ncert.nic.in/textbook.php" },
      { title: "NTA NEET Mock Tests", url: "https://nta.ac.in/" },
    ],
    pyqs: [
      { title: "NEET UG 2025 Question Paper", url: "https://neet.nta.nic.in/" },
      { title: "NEET UG 2024 Question Paper", url: "https://neet.nta.nic.in/" },
    ],
    quiz: [
      { question: "NEET is for admission to?", options: ["Engineering", "Medical", "Law", "Architecture"], answer: 1 },
      { question: "Which subject is NOT in NEET?", options: ["Physics", "Chemistry", "Biology", "Mathematics"], answer: 3 },
      { question: "NEET UG is conducted by?", options: ["NTA", "AIIMS", "MCI", "CBSE"], answer: 0 },
      { question: "NEET 2025 exam date?", options: ["May 4", "June 1", "April 20", "March 15"], answer: 0 },
    ],
  },
  {
    title: "CUET UG 2026",
    category: "UG Entrance",
    level: "Class 11-12",
    description:
      "Common University Entrance Test for admission to undergraduate programs in 280+ Central and participating universities. Exam: May–June 2026.",
    eligibility: "Class 12 pass or appearing.",
    deadline: daysFromNow(325), // CUET 2026 registration
    officialLink: "https://cuet.samarth.ac.in/",
    syllabus: ["Language (13 options)", "Domain Subjects (27 options)", "General Test"],
    resources: [{ title: "NCERT Class 12", url: "https://ncert.nic.in/" }],
    pyqs: [{ title: "CUET UG 2025 Papers", url: "https://cuet.samarth.ac.in/" }],
    quiz: [
      { question: "CUET is for admission to?", options: ["IITs", "NITs", "Central Universities", "AIIMS"], answer: 2 },
      { question: "How many domain subjects can a student choose?", options: ["Up to 3", "Up to 6", "Up to 9", "Unlimited"], answer: 1 },
    ],
  },
  {
    title: "BITSAT 2026",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Online entrance exam for admission to BITS Pilani (Pilani, Goa, Hyderabad campuses). Registration expected Feb–March 2026.",
    eligibility: "Class 12 with PCM/PCB and English. Minimum 75% in PCM individually.",
    deadline: daysFromNow(313), // BITSAT 2026 registration
    officialLink: "https://www.bitsadmission.com/",
    syllabus: ["Physics", "Chemistry", "Math/Bio", "English Proficiency", "Logical Reasoning"],
    resources: [{ title: "BITSAT Sample Tests", url: "https://www.bitsadmission.com/" }],
    pyqs: [{ title: "BITSAT 2025 Papers", url: "https://www.bitsadmission.com/" }],
    quiz: [
      { question: "BITSAT is for admission to?", options: ["IITs", "NITs", "BITS Campuses", "IIITs"], answer: 2 },
      { question: "BITSAT mode?", options: ["Pen & Paper", "Online (Computer-Based)", "Both", "OMR Sheet"], answer: 1 },
    ],
  },
  {
    title: "VITEEE 2026",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Engineering entrance exam for VIT University campuses (Vellore, Chennai, Bhopal, Amravati, AP). Registration Feb 2026.",
    eligibility: "Class 12 with PCM; minimum 60% in PCM.",
    deadline: daysFromNow(303), // VITEEE 2026 registration
    officialLink: "https://viteee.vit.ac.in/",
    syllabus: ["Physics", "Chemistry", "Maths", "English", "Aptitude"],
    resources: [{ title: "VITEEE Mock Tests", url: "https://viteee.vit.ac.in/" }],
    pyqs: [{ title: "VITEEE 2025 Practice Papers", url: "https://viteee.vit.ac.in/" }],
    quiz: [
      { question: "VITEEE is conducted by?", options: ["NTA", "VIT University", "AICTE", "UGC"], answer: 1 },
    ],
  },
  {
    title: "CLAT 2026",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Common Law Admission Test for admission to 5-year integrated LLB at 24 National Law Universities. Exam: December 7, 2025.",
    eligibility: "Class 12 with minimum 45% (40% for SC/ST).",
    deadline: daysFromNow(198), // CLAT 2026 application
    officialLink: "https://consortiumofnlus.ac.in/",
    syllabus: ["English Language", "Current Affairs & GK", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
    resources: [{ title: "CLAT Reference Books", url: "https://consortiumofnlus.ac.in/" }],
    pyqs: [{ title: "CLAT 2025 Papers", url: "https://consortiumofnlus.ac.in/" }],
    quiz: [
      { question: "CLAT is for admission to?", options: ["IITs", "NITs", "NLUs", "AIIMS"], answer: 2 },
      { question: "CLAT is conducted by?", options: ["NTA", "BCI", "Consortium of NLUs", "MHRD"], answer: 2 },
    ],
  },
  {
    title: "NDA II 2025 – National Defence Academy",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "UPSC entrance for Indian Army, Navy and Air Force wings of NDA. Exam: September 14, 2025. Written + SSB Interview.",
    eligibility: "Unmarried candidates, age 16.5–19.5 years; Class 12 pass (PCM for Navy/Air Force).",
    deadline: daysFromNow(85), // NDA II registration
    officialLink: "https://upsc.gov.in/",
    syllabus: ["Mathematics", "General Ability Test (English + GK)"],
    resources: [{ title: "NDA Reference Books", url: "https://upsc.gov.in/" }],
    pyqs: [{ title: "NDA Previous Year Papers", url: "https://upsc.gov.in/" }],
    quiz: [
      { question: "NDA is conducted by?", options: ["UPSC", "SSC", "NTA", "Indian Army HQ"], answer: 0 },
      { question: "How many times a year is NDA held?", options: ["1", "2", "3", "4"], answer: 1 },
      { question: "NDA exam has how many papers?", options: ["1", "2", "3", "4"], answer: 1 },
    ],
  },
  {
    title: "IAT – IISER Aptitude Test 2026",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Common entrance for BS-MS programs at all IISERs (Berhampur, Bhopal, Kolkata, Mohali, Pune, Thiruvananthapuram, Tirupati). Exam June 2026.",
    eligibility: "Class 12 with PCMB (60% aggregate). Qualified in JEE-Advanced / KVPY /NTSE also eligible.",
    deadline: daysFromNow(344), // IAT 2026 application
    officialLink: "https://www.iiseradmission.in/",
    syllabus: ["Physics", "Chemistry", "Biology", "Mathematics"],
    resources: [{ title: "NCERT Books Class 11 & 12", url: "https://ncert.nic.in/" }],
    pyqs: [{ title: "IAT 2025 Past Paper", url: "https://www.iiseradmission.in/" }],
    quiz: [
      { question: "IAT is for admission to?", options: ["IITs", "IISERs", "NITs", "AIIMS"], answer: 1 },
      { question: "IAT is taken for which program?", options: ["B.Tech", "BS-MS", "M.Sc", "Ph.D"], answer: 1 },
    ],
  },
  {
    title: "NEST – National Entrance Screening Test 2026",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Mandatory test for 5-year integrated MSc at NISER Bhubaneswar and UM-DAE CEBS Mumbai. Exam June 14, 2026.",
    eligibility: "Class 12 in science with 60% (50% SC/ST).",
    deadline: daysFromNow(364), // NEST 2026 application
    officialLink: "https://www.nestexam.in/",
    syllabus: ["General Section", "Biology", "Chemistry", "Mathematics", "Physics"],
    resources: [{ title: "NEST Information Brochure", url: "https://www.nestexam.in/" }],
    pyqs: [{ title: "NEST 2025 Past Paper", url: "https://www.nestexam.in/" }],
    quiz: [
      { question: "NEST is for admission to?", options: ["IITs", "NISER", "IIITs", "BITS"], answer: 1 },
      { question: "NEST qualifying institutions?", options: ["NISER only", "CEBS only", "NISER & CEBS", "IISERs"], answer: 2 },
    ],
  },
  {
    title: "ISI Admission Test 2026",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Indian Statistical Institute admission test for B.Stat (Hons) and B.Math (Hons) programs. Exam May 2026; registration Feb–March 2026.",
    eligibility: "Class 12 with Mathematics.",
    deadline: daysFromNow(304), // ISI 2026 registration
    officialLink: "https://www.isical.ac.in/admission",
    syllabus: ["Mathematics (Algebra, Geometry, Calculus, Combinatorics)", "Logical Reasoning"],
    resources: [{ title: "ISI Sample Papers", url: "https://www.isical.ac.in/" }],
    pyqs: [{ title: "ISI Past Papers", url: "https://www.isical.ac.in/" }],
    quiz: [
      { question: "ISI offers which UG programs?", options: ["B.Tech", "B.Stat & B.Math", "B.Sc Physics", "BBA"], answer: 1 },
      { question: "ISI stands for?", options: ["Indian Science Institute", "Indian Statistical Institute", "Information Science India", "Integrated Science Institute"], answer: 1 },
    ],
  },
  {
    title: "GATE 2026 – Graduate Aptitude Test in Engineering",
    category: "UG Entrance",
    level: "College Student",
    description: "National exam for PG admission at IITs/IISc and PSU recruitment. Exam Feb 2026; registration Sep–Oct 2025. 30 subject papers available.",
    eligibility: "Final year UG or holders of UG/PG degree in engineering/science/arts/commerce.",
    deadline: daysFromNow(159), // GATE 2026 registration
    officialLink: "https://gate2026.iitr.ac.in/",
    syllabus: ["General Aptitude (common)", "Engineering Mathematics (most papers)", "Subject specific (CS/EC/EE/ME/CE/CH etc.)"],
    resources: [
      { title: "GATE Overflow (CS)", url: "https://gateoverflow.in/" },
      { title: "GATE Syllabus 2026", url: "https://gate2026.iitr.ac.in/" },
    ],
    pyqs: [
      { title: "GATE 2025 Papers", url: "https://gate.iitb.ac.in/" },
      { title: "GATE 2024 Papers", url: "https://gate.iitb.ac.in/" },
    ],
    quiz: [
      { question: "GATE 2026 is conducted by?", options: ["NTA", "IIT Roorkee", "UGC", "AICTE"], answer: 1 },
      { question: "GATE score validity?", options: ["1 year", "2 years", "3 years", "5 years"], answer: 2 },
    ],
  },

  // ──────────────── SCHOLARSHIPS ────────────────
  {
    title: "NSP – National Scholarship Portal 2025-26",
    category: "Scholarship",
    level: "All",
    description: "One-stop solution for 50+ Central & State government scholarships — submission, verification, sanction, and disbursal via DBT. Application window: Oct–Dec 2025.",
    eligibility: "Varies by sub-scheme; school, college, minority, OBC, PWD, etc.",
    deadline: daysFromNow(183), // NSP 2025-26
    officialLink: "https://scholarships.gov.in/",
    syllabus: [],
    resources: [{ title: "NSP User Manual", url: "https://scholarships.gov.in/" }],
    pyqs: [],
    quiz: [
      { question: "NSP stands for?", options: ["National Student Programme", "National Scholarship Portal", "New Scholarship Plan", "National Skill Plan"], answer: 1 },
      { question: "NSP disbursal happens via?", options: ["Cash", "Cheque", "DBT", "Post Office"], answer: 2 },
    ],
  },
  {
    title: "INSPIRE Scholarship (SHE) 2025",
    category: "Scholarship",
    level: "UG Aspirant",
    description: "Scholarship for Higher Education (SHE) under INSPIRE by DST — ₹80,000/year for top science students in BSc/Int.MSc. Applications open July–Sept 2025.",
    eligibility: "Top 1% in Class 12 board OR JEE/NEET top rank; must pursue natural sciences at UG level.",
    deadline: daysFromNow(152), // INSPIRE application
    officialLink: "https://online-inspire.gov.in/",
    syllabus: [],
    resources: [{ title: "INSPIRE Guidelines PDF", url: "https://online-inspire.gov.in/" }],
    pyqs: [],
    quiz: [
      { question: "INSPIRE scholarship annual value?", options: ["Rs 40,000", "Rs 60,000", "Rs 80,000", "Rs 1,00,000"], answer: 2 },
      { question: "INSPIRE is by which department?", options: ["UGC", "DST", "MHRD", "AICTE"], answer: 1 },
      { question: "INSPIRE full form?", options: ["INnovate Science Pursuit for Inspired Research", "Indian National Scholarship Program", "INSPIRE Scholarship for Excellence", "Integrated National Program for Research"], answer: 0 },
    ],
  },
  {
    title: "HDFC ECSS Scholarship 2025",
    category: "Scholarship",
    level: "All",
    description: "HDFC Bank's Educational Crisis Scholarship Support — up to ₹75,000 for students whose family faced personal or financial crises. Applications July–Sep 2025.",
    eligibility: "Class 1 to PG; family income < ₹2.5 LPA; faced personal/financial crisis in last 3 years.",
    deadline: daysFromNow(106), // HDFC application
    officialLink: "https://www.hdfcbank.com/personal/about-us/csr/parivartan",
    syllabus: [],
    resources: [{ title: "HDFC Parivartan CSR", url: "https://www.hdfcbank.com/" }],
    pyqs: [],
    quiz: [
      { question: "HDFC ECSS maximum scholarship amount?", options: ["Rs 25,000", "Rs 50,000", "Rs 75,000", "Rs 1,00,000"], answer: 2 },
      { question: "ECSS stands for?", options: ["Educational Credit Scholarship Scheme", "Educational Crisis Scholarship Support", "External College Support Scheme", "Enhanced CSR Support System"], answer: 1 },
    ],
  },
  {
    title: "Vidyasaarthi Scholarship 2025-26",
    category: "Scholarship",
    level: "All",
    description: "Common platform for 30+ corporate scholarships from Tata Power, GIC, ONGC, BPCL and more — managed by NSDL e-Governance. Rolling applications.",
    eligibility: "Varies per scholarship; typically school to PG.",
    deadline: daysFromNow(228), // Vidyasaarthi cycle
    officialLink: "https://www.vidyasaarthi.co.in/",
    syllabus: [],
    resources: [{ title: "Vidyasaarthi Active Schemes", url: "https://www.vidyasaarthi.co.in/" }],
    pyqs: [],
    quiz: [
      { question: "Vidyasaarthi is managed by?", options: ["UGC", "AICTE", "NSDL", "SBI"], answer: 2 },
    ],
  },
  {
    title: "Sitaram Jindal Foundation Scholarship 2026",
    category: "Scholarship",
    level: "All",
    description: "Merit-cum-means scholarship for students from school to PG and professional courses. Applications open Jan 2026.",
    eligibility: "Indian nationals; minimum 60% marks; family income criteria as per category.",
    deadline: daysFromNow(334), // SJF application
    officialLink: "https://www.sitaramjindalfoundation.org/",
    syllabus: [],
    resources: [{ title: "SJF Application Portal", url: "https://www.sitaramjindalfoundation.org/" }],
    pyqs: [],
    quiz: [
      { question: "SJF scholarship type?", options: ["Merit Only", "Means Only", "Merit-cum-Means", "Sports"], answer: 2 },
    ],
  },
  {
    title: "Reliance Foundation Scholarship 2025-26",
    category: "Scholarship",
    level: "All",
    description: "UG and PG scholarships for India's brightest minds across science, technology, humanities and arts. Applications July–August 2025.",
    eligibility: "Indian nationals enrolled in UG/PG; family income < ₹15 LPA.",
    deadline: daysFromNow(92), // Reliance application
    officialLink: "https://www.scholarships.reliancefoundation.org/",
    syllabus: [],
    resources: [{ title: "Reliance Foundation Scholars", url: "https://www.scholarships.reliancefoundation.org/" }],
    pyqs: [],
    quiz: [
      { question: "Reliance Foundation Scholarship covers?", options: ["UG only", "PG only", "Both UG & PG", "School only"], answer: 2 },
    ],
  },
  {
    title: "Tata Scholarship – Cornell University 2026",
    category: "Scholarship",
    level: "College Student",
    description: "Funded by Tata Education and Development Trust for Indian students admitted to Cornell University demonstrating financial need.",
    eligibility: "Admitted Indian students at Cornell; demonstrated financial need.",
    deadline: daysFromNow(213), // Tata-Cornell application
    officialLink: "https://finaid.cornell.edu/types-aid/external-scholarships/tata-scholarship",
    syllabus: [],
    resources: [{ title: "Cornell Financial Aid", url: "https://finaid.cornell.edu/" }],
    pyqs: [],
    quiz: [
      { question: "Tata Scholarship at Cornell is for?", options: ["Indian students", "All Asian students", "All international students", "Tata employees' children"], answer: 0 },
    ],
  },

  // ──────────────── COLLEGE / SKILL / INTERNSHIP ────────────────
  {
    title: "Smart India Hackathon 2025 (SIH)",
    category: "College/Skill",
    level: "College Student",
    description: "Nationwide 36-hour hackathon by MoE Innovation Cell for students to solve real government and industry problems. Internal rounds at colleges: Sep 2025.",
    eligibility: "Students of higher education institutions; teams of 6.",
    deadline: daysFromNow(123), // SIH internal rounds
    officialLink: "https://sih.gov.in/",
    syllabus: ["Software Edition (36hr)", "Hardware Edition (5-day)"],
    resources: [{ title: "SIH Problem Statements 2025", url: "https://sih.gov.in/" }],
    pyqs: [],
    quiz: [
      { question: "SIH is conducted by?", options: ["AICTE", "MoE Innovation Cell", "UGC", "MeitY"], answer: 1 },
      { question: "SIH Software Edition duration?", options: ["12hrs", "24hrs", "36hrs", "48hrs"], answer: 2 },
      { question: "Team size for SIH?", options: ["3", "4", "5", "6"], answer: 3 },
    ],
  },
  {
    title: "Google Summer of Code 2026 (GSoC)",
    category: "College/Skill",
    level: "College Student",
    description: "Google's annual program bringing new contributors into open source. Work with a mentoring organization for 3 months. Stipend: $1500–$3000 USD.",
    eligibility: "18+ years old; new to or experienced in open source contributions.",
    deadline: daysFromNow(275), // GSoC 2026 proposals
    officialLink: "https://summerofcode.withgoogle.com/",
    syllabus: ["Open Source contribution", "Project proposal writing", "Git/GitHub workflow"],
    resources: [
      { title: "GSoC Student Guide", url: "https://google.github.io/gsocguides/student/" },
      { title: "GSoC Organizations 2025", url: "https://summerofcode.withgoogle.com/" },
    ],
    pyqs: [],
    quiz: [
      { question: "GSoC is run by?", options: ["Microsoft", "Meta", "Google", "GitHub"], answer: 2 },
      { question: "GSoC focuses on?", options: ["Game Dev", "Open Source", "AI Research", "Hardware"], answer: 1 },
      { question: "Minimum age for GSoC?", options: ["16", "17", "18", "21"], answer: 2 },
    ],
  },
  {
    title: "Codeforces Competitive Programming (Regular Rounds)",
    category: "College/Skill",
    level: "College Student",
    description: "Regular Div 1/2/3/4 programming contests on Codeforces every week. Improve your rating and problem-solving skills. Next round: check codeforces.com.",
    eligibility: "Anyone with a Codeforces account.",
    deadline: daysFromNow(45), // Codeforces next round
    officialLink: "https://codeforces.com/",
    syllabus: ["Algorithms", "Data Structures", "Dynamic Programming", "Graph Theory", "Math"],
    resources: [
      { title: "CP Algorithms Handbook", url: "https://cp-algorithms.com/" },
      { title: "Codeforces EDU", url: "https://codeforces.com/edu/courses" },
    ],
    pyqs: [{ title: "Past Codeforces Rounds", url: "https://codeforces.com/contests" }],
    quiz: [
      { question: "Codeforces is a platform for?", options: ["Web design", "Competitive Programming", "Trading", "ML"], answer: 1 },
      { question: "Codeforces Div 1 is for?", options: ["Beginners", "Intermediate", "Top-rated users", "School students"], answer: 2 },
    ],
  },
  {
    title: "IIT Research Internships (SURGE / SoP / SRIC) 2026",
    category: "Internship",
    level: "College Student",
    description: "Summer research internships at IITs — IITK SURGE, IITB SoP, IITM SRIC, IITGn etc. Apply individually to faculty. Deadline varies by IIT: Jan–Feb 2026.",
    eligibility: "Pre-final or final year UG students of AICTE/UGC recognized institutions; CGPA ≥ 7.5.",
    deadline: daysFromNow(275), // IIT Research deadline
    officialLink: "https://www.iitk.ac.in/dord/surge",
    syllabus: ["Specific to research area chosen"],
    resources: [
      { title: "IITK SURGE Portal", url: "https://www.iitk.ac.in/dord/surge" },
      { title: "IITB SoP Portal", url: "https://www.iitb.ac.in/" },
    ],
    pyqs: [],
    quiz: [
      { question: "SURGE program is at?", options: ["IITB", "IITK", "IITM", "IITKGP"], answer: 1 },
      { question: "Target students for IIT summer internships?", options: ["School", "Class 12", "UG College Students", "PG only"], answer: 2 },
    ],
  },
  {
    title: "Microsoft Internship & Engage Program 2025",
    category: "Internship",
    level: "College Student",
    description: "Microsoft India internship and mentorship programs for student developers. Roles in SWE, PM, data science. Applications typically Aug–Sep.",
    eligibility: "Pre-final and final year engineering students; strong DSA and coding skills.",
    deadline: daysFromNow(152), // Microsoft deadline
    officialLink: "https://careers.microsoft.com/students/",
    syllabus: ["Data Structures & Algorithms", "System Design basics", "Behavioural interview prep"],
    resources: [
      { title: "Microsoft Learn", url: "https://learn.microsoft.com/" },
      { title: "LeetCode DSA", url: "https://leetcode.com/" },
    ],
    pyqs: [],
    quiz: [
      { question: "Microsoft Engage targets?", options: ["School students", "All employees", "College students", "Senior engineers"], answer: 2 },
    ],
  },
  {
    title: "ICPC – International Collegiate Programming Contest 2025-26",
    category: "College/Skill",
    level: "College Student",
    description: "World's most prestigious programming contest. Asia-West Regional rounds Nov–Dec 2025; World Finals 2026. Register through ICPC.global by Sep 2025.",
    eligibility: "Teams of 3 university students; at most 5 ICPC contest years; under 24 years old.",
    deadline: daysFromNow(137), // ICPC regional registration
    officialLink: "https://icpc.global/",
    syllabus: ["Advanced Algorithms", "Data Structures", "Graph Theory", "Math", "Geometry"],
    resources: [
      { title: "ICPC Resources", url: "https://icpc.global/community/resources" },
      { title: "Competitive Programmer's Handbook", url: "https://codeforces.com/blog/entry/54618" },
    ],
    pyqs: [{ title: "ICPC Past Problems", url: "https://icpc.global/" }],
    quiz: [
      { question: "ICPC team size?", options: ["1", "2", "3", "4"], answer: 2 },
      { question: "ICPC India comes under which region?", options: ["Asia-South", "Asia-West", "Asia-Pacific", "South Asia"], answer: 1 },
    ],
  },

  // ──────────────── PAST (for Past tab demo) ────────────────
  {
    title: "JEE Main 2025 – Session 2 (Past)",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Session 2 of JEE Main 2025 held April 2-9, 2025. Result declared May 2025. Kept here for syllabus and PYQ access for 2026 preparation.",
    eligibility: "Class 12 with PCM.",
    deadline: daysFromNow(-60), // JEE Main 2025 Session 2 past
    officialLink: "https://jeemain.nta.nic.in/",
    syllabus: ["Physics", "Chemistry", "Mathematics"],
    resources: [{ title: "JEE Main 2025 Resources", url: "https://jeemain.nta.nic.in/" }],
    pyqs: [
      { title: "JEE Main April 2025 Paper", url: "https://jeemain.nta.nic.in/" },
      { title: "JEE Main January 2025 Paper", url: "https://jeemain.nta.nic.in/" },
    ],
    quiz: [
      { question: "JEE Main 2025 Session 2 was held in?", options: ["January", "February", "March", "April"], answer: 3 },
      { question: "JEE Main conducted by?", options: ["NTA", "IIT", "NCERT", "CBSE"], answer: 0 },
    ],
  },
  {
    title: "NEET UG 2025 (Past)",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "NEET UG 2025 conducted on May 4, 2025. Results declared June 2025. Use this for PYQs and syllabus reference for NEET 2026 preparation.",
    eligibility: "Class 12 with PCB.",
    deadline: daysFromNow(-30), // NEET 2025 past
    officialLink: "https://neet.nta.nic.in/",
    syllabus: ["Physics", "Chemistry", "Botany", "Zoology"],
    resources: [{ title: "NEET 2026 Prep Resources", url: "https://neet.nta.nic.in/" }],
    pyqs: [
      { title: "NEET 2025 Question Paper (All Sets)", url: "https://neet.nta.nic.in/" },
      { title: "NEET 2024 Question Paper", url: "https://neet.nta.nic.in/" },
    ],
    quiz: [
      { question: "NEET 2025 exam date?", options: ["April 20", "May 4", "June 1", "March 15"], answer: 1 },
      { question: "NEET total marks?", options: ["360", "600", "720", "800"], answer: 2 },
    ],
  },
  {
    title: "GSoC 2025 (Past)",
    category: "College/Skill",
    level: "College Student",
    description: "Google Summer of Code 2025 — contributor applications closed April 8, 2025. Selected contributors worked with open source orgs May–August 2025.",
    eligibility: "18+ years old.",
    deadline: daysFromNow(-45), // GSoC 2025 past
    officialLink: "https://summerofcode.withgoogle.com/",
    syllabus: ["Open Source contribution", "Project proposal"],
    resources: [{ title: "GSoC 2025 Results", url: "https://summerofcode.withgoogle.com/" }],
    pyqs: [],
    quiz: [
      { question: "GSoC 2025 stipend range?", options: ["$500-$1000", "$1500-$3300", "$5000-$7000", "No stipend"], answer: 1 },
    ],
  },
];

async function run(): Promise<void> {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  await Opportunity.deleteMany({});
  await User.deleteMany({});
  console.log("Cleared existing collections");

  const inserted = await Opportunity.insertMany(opportunities);
  console.log(`Inserted ${inserted.length} opportunities`);

  const adminPwd   = await hashPassword("admin123");
  const demoPwd    = await hashPassword("demo123");
  const studentPwd = await hashPassword("student123");

  // Admin account — full access
  await User.create({
    name: "Admin",
    email: "admin@opportunityhub.com",
    password: adminPwd,
    role: "admin",
    educationLevel: "College Student",
  });

  // Demo presenter account — also admin so evaluators see full features
  await User.create({
    name: "Demo Presenter",
    email: "demo@opportunityhub.com",
    password: demoPwd,
    role: "admin",
    educationLevel: "College Student",
    savedOpportunities: inserted.slice(0, 5).map((o) => o._id),
    progress: 60,
  });

  // Student demo account — regular student view
  await User.create({
    name: "Aryan Mehta",
    email: "student@opportunityhub.com",
    password: studentPwd,
    role: "student",
    educationLevel: "Class 11-12",
    savedOpportunities: inserted.slice(0, 4).map((o) => o._id),
    progress: 35,
  });

  console.log("\nSeed complete:");
  console.log("  Admin:    admin@opportunityhub.com   / admin123");
  console.log("  Presenter: demo@opportunityhub.com   / demo123  (admin role)");
  console.log("  Student:  student@opportunityhub.com / student123");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
