/**
 * Seed script for OpportunityHub.
 * Run with:  pnpm --filter @workspace/api-server run seed
 *
 * - Creates an admin user (admin@opportunityhub.com / admin123)
 * - Creates a demo student (student@opportunityhub.com / student123)
 * - Inserts 30+ realistic opportunities with quizzes, syllabus, resources, PYQs
 */
import mongoose from "mongoose";
import { Opportunity } from "./models/Opportunity";
import { User } from "./models/User";
import { hashPassword } from "./lib/auth";

const MONGODB_URI = process.env["MONGODB_URI"];
if (!MONGODB_URI) throw new Error("MONGODB_URI required");

function daysFromNow(d: number): Date {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt;
}

const opportunities = [
  // ---------------- SCHOOL LEVEL ----------------
  {
    title: "NTSE - National Talent Search Examination",
    category: "School Olympiad",
    level: "School",
    description:
      "A national-level scholarship program by NCERT to identify and nurture talented students. Conducted in two stages - State and National.",
    eligibility: "Students of Class 10 studying in any recognized school in India.",
    deadline: daysFromNow(45),
    officialLink: "https://ncert.nic.in/national-talent-examination.php",
    syllabus: ["Mental Ability Test (MAT)", "Scholastic Aptitude Test (SAT)", "Mathematics", "Science", "Social Science"],
    resources: [
      { title: "NCERT Class 9 & 10 Books", url: "https://ncert.nic.in/textbook.php" },
      { title: "NTSE Previous Papers", url: "https://ncert.nic.in/national-talent-examination.php" },
    ],
    pyqs: [
      { title: "NTSE Stage 1 - 2023", url: "https://ncert.nic.in/" },
      { title: "NTSE Stage 2 - 2023", url: "https://ncert.nic.in/" },
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
    title: "NMMS - National Means cum Merit Scholarship",
    category: "Scholarship",
    level: "School",
    description:
      "Centrally Sponsored Scheme to award scholarships to meritorious students of economically weaker sections to arrest their drop-out at class VIII.",
    eligibility: "Class 8 students; family income less than Rs 3,50,000 per annum.",
    deadline: daysFromNow(30),
    officialLink: "https://scholarships.gov.in/",
    syllabus: ["Mental Ability Test", "Scholastic Aptitude Test", "Maths", "Science", "Social Science"],
    resources: [
      { title: "NMMS Official Guide", url: "https://scholarships.gov.in/" },
    ],
    pyqs: [{ title: "NMMS Sample Paper", url: "https://scholarships.gov.in/" }],
    quiz: [
      { question: "NMMS scholarship amount per year?", options: ["Rs 6000", "Rs 12000", "Rs 24000", "Rs 36000"], answer: 1 },
      { question: "Eligibility class for NMMS?", options: ["7th", "8th", "9th", "10th"], answer: 1 },
      { question: "Maximum family income for NMMS?", options: ["1.5L", "3.5L", "5L", "8L"], answer: 1 },
    ],
  },
  {
    title: "IMO - International Mathematics Olympiad",
    category: "School Olympiad",
    level: "School",
    description:
      "Conducted by SOF, IMO is one of the most popular Olympiad exams held at the national and international level.",
    eligibility: "Students of class 1 to 12.",
    deadline: daysFromNow(25),
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
    title: "NSO - National Science Olympiad",
    category: "School Olympiad",
    level: "School",
    description: "Annual competitive science exam by SOF for school students at national and international levels.",
    eligibility: "Students of class 1 to 12.",
    deadline: daysFromNow(28),
    officialLink: "https://www.sofworld.org/nso",
    syllabus: ["Science", "Logical Reasoning", "Achievers Section"],
    resources: [{ title: "NSO Workbook", url: "https://www.sofworld.org/" }],
    pyqs: [{ title: "NSO Past Papers", url: "https://www.sofworld.org/" }],
    quiz: [
      { question: "NSO is which type of olympiad?", options: ["Maths", "Science", "English", "GK"], answer: 1 },
      { question: "Conducted by?", options: ["SOF", "NCERT", "CBSE", "ISRO"], answer: 0 },
    ],
  },
  {
    title: "IEO - International English Olympiad",
    category: "School Olympiad",
    level: "School",
    description: "An annual school-level English Olympiad by SOF testing English language proficiency.",
    eligibility: "Class 1 to 12.",
    deadline: daysFromNow(35),
    officialLink: "https://www.sofworld.org/ieo",
    syllabus: ["Word and Structure Knowledge", "Reading", "Spoken and Written Expression", "Achievers Section"],
    resources: [{ title: "IEO Reference", url: "https://www.sofworld.org/" }],
    pyqs: [{ title: "IEO Sample Papers", url: "https://www.sofworld.org/" }],
    quiz: [
      { question: "Which olympiad tests English skills?", options: ["IMO", "IEO", "NSO", "NCO"], answer: 1 },
    ],
  },
  {
    title: "NSTSE - National Level Science Talent Search Exam",
    category: "School Olympiad",
    level: "School",
    description: "A diagnostic test by Unified Council, helping students improve overall learning ability.",
    eligibility: "Class 1 to 12.",
    deadline: daysFromNow(40),
    officialLink: "https://www.unifiedcouncil.com/",
    syllabus: ["Mathematics", "Physics", "Chemistry", "Biology", "General Questions"],
    resources: [{ title: "NSTSE Workbook", url: "https://www.unifiedcouncil.com/" }],
    pyqs: [{ title: "NSTSE Past Papers", url: "https://www.unifiedcouncil.com/" }],
    quiz: [
      { question: "NSTSE is conducted by?", options: ["SOF", "Unified Council", "NCERT", "CBSE"], answer: 1 },
    ],
  },
  {
    title: "IOQM - Indian Olympiad Qualifier in Mathematics",
    category: "School Olympiad",
    level: "Class 11-12",
    description: "First stage of the Mathematics Olympiad program in India leading to IMO international team.",
    eligibility: "Indian students up to class 12.",
    deadline: daysFromNow(50),
    officialLink: "https://olympiads.hbcse.tifr.res.in/",
    syllabus: ["Algebra", "Geometry", "Number Theory", "Combinatorics"],
    resources: [{ title: "HBCSE Resources", url: "https://olympiads.hbcse.tifr.res.in/" }],
    pyqs: [{ title: "IOQM Previous Papers", url: "https://olympiads.hbcse.tifr.res.in/" }],
    quiz: [
      { question: "IOQM is the first stage of?", options: ["IPhO", "IMO", "IOI", "IBO"], answer: 1 },
      { question: "Organized by?", options: ["HBCSE", "NCERT", "ISI", "IISc"], answer: 0 },
    ],
  },
  {
    title: "SOF - Science Olympiad Foundation Olympiads",
    category: "School Olympiad",
    level: "School",
    description: "Annual umbrella of olympiads conducted by Science Olympiad Foundation across subjects.",
    eligibility: "Students of class 1 to 12.",
    deadline: daysFromNow(33),
    officialLink: "https://www.sofworld.org/",
    syllabus: ["Multiple Subjects across IMO/NSO/IEO/NCO"],
    resources: [{ title: "SOF Catalogue", url: "https://www.sofworld.org/" }],
    pyqs: [{ title: "SOF Sample Papers", url: "https://www.sofworld.org/" }],
    quiz: [
      { question: "SOF stands for?", options: ["Student Olympiad Forum", "Science Olympiad Foundation", "School Olympiad Federation", "State Olympiad Forum"], answer: 1 },
    ],
  },

  // ---------------- UG ENTRANCE ----------------
  {
    title: "JEE Main",
    category: "UG Entrance",
    level: "Class 11-12",
    description:
      "Joint Entrance Examination Main is the gateway for admission to NITs, IIITs, GFTIs and a qualifying exam for JEE Advanced.",
    eligibility: "Class 12 pass with Physics, Chemistry, Mathematics.",
    deadline: daysFromNow(60),
    officialLink: "https://jeemain.nta.nic.in/",
    syllabus: ["Physics (Class 11 & 12)", "Chemistry (Class 11 & 12)", "Mathematics (Class 11 & 12)"],
    resources: [
      { title: "NCERT Textbooks", url: "https://ncert.nic.in/textbook.php" },
      { title: "NTA Practice Centre", url: "https://www.nta.ac.in/" },
    ],
    pyqs: [
      { title: "JEE Main 2024 Papers", url: "https://jeemain.nta.nic.in/" },
      { title: "JEE Main 2023 Papers", url: "https://jeemain.nta.nic.in/" },
    ],
    quiz: [
      { question: "JEE Main is conducted by?", options: ["CBSE", "NTA", "UGC", "AICTE"], answer: 1 },
      { question: "JEE Main qualifies for which advanced exam?", options: ["JEE Advanced", "GATE", "NEET", "CUET"], answer: 0 },
      { question: "How many subjects in JEE Main paper 1?", options: ["2", "3", "4", "5"], answer: 1 },
      { question: "JEE Main is held how many times a year?", options: ["1", "2", "3", "4"], answer: 1 },
      { question: "Maximum attempts allowed?", options: ["2", "3", "Unlimited", "Based on age"], answer: 1 },
    ],
  },
  {
    title: "JEE Advanced",
    category: "UG Entrance",
    level: "Class 11-12",
    description:
      "Conducted by IITs for admission to undergraduate programs at the IITs. Candidates must qualify JEE Main first.",
    eligibility: "Top 2,50,000 candidates from JEE Main.",
    deadline: daysFromNow(90),
    officialLink: "https://jeeadv.ac.in/",
    syllabus: ["Physics", "Chemistry", "Mathematics - Advanced level"],
    resources: [{ title: "IIT JEE Past Papers", url: "https://jeeadv.ac.in/past_qps.html" }],
    pyqs: [{ title: "JEE Advanced 2024", url: "https://jeeadv.ac.in/" }],
    quiz: [
      { question: "JEE Advanced is conducted by?", options: ["NTA", "CBSE", "Rotating IITs", "MHRD"], answer: 2 },
      { question: "Maximum attempts for JEE Advanced?", options: ["1", "2", "3", "Unlimited"], answer: 1 },
    ],
  },
  {
    title: "NEET UG",
    category: "UG Entrance",
    level: "Class 11-12",
    description:
      "National Eligibility cum Entrance Test for admission to MBBS, BDS and other undergraduate medical courses.",
    eligibility: "Class 12 with Physics, Chemistry, Biology and English.",
    deadline: daysFromNow(75),
    officialLink: "https://neet.nta.nic.in/",
    syllabus: ["Physics", "Chemistry", "Botany", "Zoology"],
    resources: [{ title: "NCERT Biology Class 11 & 12", url: "https://ncert.nic.in/textbook.php" }],
    pyqs: [{ title: "NEET 2024 Question Paper", url: "https://neet.nta.nic.in/" }],
    quiz: [
      { question: "NEET is for admission to?", options: ["Engineering", "Medical", "Law", "Architecture"], answer: 1 },
      { question: "Which subject is NOT in NEET?", options: ["Physics", "Chemistry", "Biology", "Mathematics"], answer: 3 },
      { question: "NEET is conducted by?", options: ["NTA", "AIIMS", "MCI", "CBSE"], answer: 0 },
    ],
  },
  {
    title: "CUET UG",
    category: "UG Entrance",
    level: "Class 11-12",
    description:
      "Common University Entrance Test for admission to undergraduate programs in Central Universities.",
    eligibility: "Class 12 pass.",
    deadline: daysFromNow(65),
    officialLink: "https://cuet.samarth.ac.in/",
    syllabus: ["Language", "Domain Subjects", "General Test"],
    resources: [{ title: "NCERT Class 12", url: "https://ncert.nic.in/" }],
    pyqs: [{ title: "CUET Sample Papers", url: "https://cuet.samarth.ac.in/" }],
    quiz: [
      { question: "CUET is for admission to?", options: ["IITs", "NITs", "Central Universities", "AIIMS"], answer: 2 },
    ],
  },
  {
    title: "IAT - IISER Aptitude Test",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Common entrance for admission to BS-MS programs at IISERs (Berhampur, Bhopal, Kolkata, Mohali, Pune, Thiruvananthapuram, Tirupati).",
    eligibility: "Class 12 with PCMB.",
    deadline: daysFromNow(85),
    officialLink: "https://www.iiseradmission.in/",
    syllabus: ["Physics", "Chemistry", "Biology", "Mathematics"],
    resources: [{ title: "NCERT Books", url: "https://ncert.nic.in/" }],
    pyqs: [{ title: "IAT Past Papers", url: "https://www.iiseradmission.in/" }],
    quiz: [
      { question: "IAT is for admission to?", options: ["IITs", "IISERs", "NITs", "AIIMS"], answer: 1 },
    ],
  },
  {
    title: "NEST - National Entrance Screening Test",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Mandatory test for admission to integrated MSc program at NISER Bhubaneswar and UM-DAE CEBS Mumbai.",
    eligibility: "Class 12 in science.",
    deadline: daysFromNow(70),
    officialLink: "https://www.nestexam.in/",
    syllabus: ["General Section", "Biology", "Chemistry", "Mathematics", "Physics"],
    resources: [{ title: "NEST Information", url: "https://www.nestexam.in/" }],
    pyqs: [{ title: "NEST Past Papers", url: "https://www.nestexam.in/" }],
    quiz: [
      { question: "NEST is for admission to?", options: ["IITs", "NISER", "IIITs", "BITS"], answer: 1 },
    ],
  },
  {
    title: "ISI Admission Test",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Indian Statistical Institute admission test for B.Stat and B.Math programs.",
    eligibility: "Class 12 with Mathematics.",
    deadline: daysFromNow(55),
    officialLink: "https://www.isical.ac.in/admission",
    syllabus: ["Mathematics (Algebra, Geometry, Calculus)", "Logical Reasoning"],
    resources: [{ title: "ISI Reference", url: "https://www.isical.ac.in/" }],
    pyqs: [{ title: "ISI Past Papers", url: "https://www.isical.ac.in/" }],
    quiz: [
      { question: "ISI offers which UG programs?", options: ["B.Tech", "B.Stat & B.Math", "B.Sc Physics", "BBA"], answer: 1 },
    ],
  },
  {
    title: "BITSAT",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Online entrance exam for admission to BITS Pilani, Goa and Hyderabad campuses.",
    eligibility: "Class 12 with PCM/PCB and English.",
    deadline: daysFromNow(80),
    officialLink: "https://www.bitsadmission.com/",
    syllabus: ["Physics", "Chemistry", "Math/Bio", "English Proficiency", "Logical Reasoning"],
    resources: [{ title: "BITSAT Sample Tests", url: "https://www.bitsadmission.com/" }],
    pyqs: [{ title: "BITSAT Past Papers", url: "https://www.bitsadmission.com/" }],
    quiz: [
      { question: "BITSAT is for admission to?", options: ["IITs", "NITs", "BITS Campuses", "IIITs"], answer: 2 },
    ],
  },
  {
    title: "VITEEE",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Engineering entrance exam for VIT University Vellore, Chennai, Bhopal, Amaravati and AP campuses.",
    eligibility: "Class 12 with PCM.",
    deadline: daysFromNow(95),
    officialLink: "https://viteee.vit.ac.in/",
    syllabus: ["Physics", "Chemistry", "Maths", "English", "Aptitude"],
    resources: [{ title: "VITEEE Mock Tests", url: "https://viteee.vit.ac.in/" }],
    pyqs: [{ title: "VITEEE Practice Papers", url: "https://viteee.vit.ac.in/" }],
    quiz: [
      { question: "VITEEE is conducted by?", options: ["NTA", "VIT University", "AICTE", "UGC"], answer: 1 },
    ],
  },
  {
    title: "CLAT",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Common Law Admission Test for admission to undergraduate law programs at NLUs.",
    eligibility: "Class 12 with minimum 45% (40% for SC/ST).",
    deadline: daysFromNow(72),
    officialLink: "https://consortiumofnlus.ac.in/",
    syllabus: ["English", "Current Affairs & GK", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
    resources: [{ title: "CLAT Reference Books", url: "https://consortiumofnlus.ac.in/" }],
    pyqs: [{ title: "CLAT Past Papers", url: "https://consortiumofnlus.ac.in/" }],
    quiz: [
      { question: "CLAT is for admission to?", options: ["IITs", "NITs", "NLUs", "AIIMS"], answer: 2 },
      { question: "CLAT is conducted by?", options: ["NTA", "BCI", "Consortium of NLUs", "MHRD"], answer: 2 },
    ],
  },
  {
    title: "NDA - National Defence Academy",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Entrance exam by UPSC for admission to the Indian Army, Navy and Air Force wings of NDA.",
    eligibility: "Unmarried male/female, age 16.5-19.5 years, Class 12 pass.",
    deadline: daysFromNow(40),
    officialLink: "https://upsc.gov.in/",
    syllabus: ["Mathematics", "General Ability Test (English & GK)"],
    resources: [{ title: "NDA Reference Books", url: "https://upsc.gov.in/" }],
    pyqs: [{ title: "NDA Previous Year Papers", url: "https://upsc.gov.in/" }],
    quiz: [
      { question: "NDA is conducted by?", options: ["UPSC", "SSC", "NTA", "Indian Army"], answer: 0 },
      { question: "How many times a year is NDA held?", options: ["1", "2", "3", "4"], answer: 1 },
    ],
  },

  // ---------------- SCHOLARSHIPS ----------------
  {
    title: "NSP - National Scholarship Portal",
    category: "Scholarship",
    level: "All",
    description: "One-stop solution for end-to-end scholarship process - submission, verification, sanction, and disbursal.",
    eligibility: "Varies by sub-scheme; school, college, minority, etc.",
    deadline: daysFromNow(20),
    officialLink: "https://scholarships.gov.in/",
    syllabus: [],
    resources: [{ title: "NSP User Manual", url: "https://scholarships.gov.in/" }],
    pyqs: [],
    quiz: [
      { question: "NSP stands for?", options: ["National Student Programme", "National Scholarship Portal", "New Scholarship Plan", "National Skill Plan"], answer: 1 },
    ],
  },
  {
    title: "INSPIRE Scholarship",
    category: "Scholarship",
    level: "UG Aspirant",
    description: "Scholarship for Higher Education (SHE) under INSPIRE by DST for top science students pursuing BSc/Integrated MSc.",
    eligibility: "Top 1% in Class 12 board OR top ranks in JEE/NEET; pursuing natural sciences.",
    deadline: daysFromNow(48),
    officialLink: "https://online-inspire.gov.in/",
    syllabus: [],
    resources: [{ title: "INSPIRE Guidelines", url: "https://online-inspire.gov.in/" }],
    pyqs: [],
    quiz: [
      { question: "INSPIRE scholarship value per year?", options: ["Rs 40,000", "Rs 60,000", "Rs 80,000", "Rs 1,00,000"], answer: 2 },
      { question: "INSPIRE is by which department?", options: ["UGC", "DST", "MHRD", "AICTE"], answer: 1 },
    ],
  },
  {
    title: "HDFC ECSS Scholarship",
    category: "Scholarship",
    level: "All",
    description: "HDFC Bank's Educational Crisis Scholarship Support for students whose family has faced personal/financial crises.",
    eligibility: "Class 1 to PG; family income < 2.5 LPA; faced personal/financial crisis in last 3 years.",
    deadline: daysFromNow(38),
    officialLink: "https://www.hdfcbank.com/personal/about-us/csr/parivartan",
    syllabus: [],
    resources: [{ title: "HDFC Parivartan", url: "https://www.hdfcbank.com/" }],
    pyqs: [],
    quiz: [
      { question: "HDFC ECSS is by which company?", options: ["HDFC Life", "HDFC Bank", "HDFC AMC", "HDFC ERGO"], answer: 1 },
    ],
  },
  {
    title: "Vidyasaarthi Scholarship",
    category: "Scholarship",
    level: "All",
    description: "Common platform for various corporate scholarships managed by NSDL.",
    eligibility: "Varies per scholarship.",
    deadline: daysFromNow(42),
    officialLink: "https://www.vidyasaarthi.co.in/",
    syllabus: [],
    resources: [{ title: "Vidyasaarthi Schemes", url: "https://www.vidyasaarthi.co.in/" }],
    pyqs: [],
    quiz: [
      { question: "Vidyasaarthi is managed by?", options: ["UGC", "AICTE", "NSDL", "SBI"], answer: 2 },
    ],
  },
  {
    title: "Sitaram Jindal Foundation Scholarship",
    category: "Scholarship",
    level: "All",
    description: "Merit-cum-means scholarship for students from school to PG and professional courses.",
    eligibility: "Indian nationals; income criteria as per category.",
    deadline: daysFromNow(60),
    officialLink: "https://www.sitaramjindalfoundation.org/",
    syllabus: [],
    resources: [{ title: "SJF Application Form", url: "https://www.sitaramjindalfoundation.org/" }],
    pyqs: [],
    quiz: [
      { question: "SJF is which type of scholarship?", options: ["Merit Only", "Means Only", "Merit-cum-Means", "Sports"], answer: 2 },
    ],
  },
  {
    title: "Reliance Foundation Scholarship",
    category: "Scholarship",
    level: "All",
    description: "UG and PG scholarships supporting India's brightest minds across science, technology, and humanities.",
    eligibility: "Indian nationals enrolled in UG/PG programs; income < 15 LPA.",
    deadline: daysFromNow(55),
    officialLink: "https://www.scholarships.reliancefoundation.org/",
    syllabus: [],
    resources: [{ title: "Reliance Foundation", url: "https://www.scholarships.reliancefoundation.org/" }],
    pyqs: [],
    quiz: [
      { question: "Reliance Foundation Scholarship covers?", options: ["UG only", "PG only", "Both UG & PG", "School only"], answer: 2 },
    ],
  },
  {
    title: "Tata Scholarship for Cornell University",
    category: "Scholarship",
    level: "College Student",
    description: "Funded by Tata Education and Development Trust for Indian students at Cornell University.",
    eligibility: "Admitted Indian students at Cornell; demonstrated financial need.",
    deadline: daysFromNow(110),
    officialLink: "https://finaid.cornell.edu/types-aid/external-scholarships/tata-scholarship",
    syllabus: [],
    resources: [{ title: "Cornell Finaid", url: "https://finaid.cornell.edu/" }],
    pyqs: [],
    quiz: [
      { question: "Tata Scholarship at Cornell is for?", options: ["Indian students", "All Asian students", "All international students", "Tata employees"], answer: 0 },
    ],
  },

  // ---------------- COLLEGE / SKILL ----------------
  {
    title: "Smart India Hackathon (SIH)",
    category: "College/Skill",
    level: "College Student",
    description: "Nationwide initiative by MoE to provide students a platform to solve government and industry problems.",
    eligibility: "Students of higher education institutions.",
    deadline: daysFromNow(50),
    officialLink: "https://sih.gov.in/",
    syllabus: ["Software Edition", "Hardware Edition - 36hr / 5-day hackathon"],
    resources: [{ title: "SIH Problem Statements", url: "https://sih.gov.in/" }],
    pyqs: [],
    quiz: [
      { question: "SIH is conducted by?", options: ["AICTE", "MoE Innovation Cell", "UGC", "MeitY"], answer: 1 },
      { question: "SIH duration for software edition?", options: ["12hrs", "24hrs", "36hrs", "48hrs"], answer: 2 },
    ],
  },
  {
    title: "Google Summer of Code (GSoC)",
    category: "College/Skill",
    level: "College Student",
    description: "Global, online program focused on bringing new contributors into open source software development.",
    eligibility: "18+; new and experienced open source contributors.",
    deadline: daysFromNow(95),
    officialLink: "https://summerofcode.withgoogle.com/",
    syllabus: ["Open Source contribution", "Project proposal writing"],
    resources: [
      { title: "GSoC Student Guide", url: "https://google.github.io/gsocguides/student/" },
      { title: "GSoC Organisations List", url: "https://summerofcode.withgoogle.com/programs/2024/organizations" },
    ],
    pyqs: [],
    quiz: [
      { question: "GSoC is conducted by?", options: ["Microsoft", "Meta", "Google", "GitHub"], answer: 2 },
      { question: "GSoC focuses on?", options: ["Game Dev", "Open Source", "AI Research", "Hardware"], answer: 1 },
      { question: "Minimum age for GSoC?", options: ["16", "17", "18", "21"], answer: 2 },
    ],
  },
  {
    title: "Codeforces Educational Rounds",
    category: "College/Skill",
    level: "College Student",
    description: "Regular competitive programming contests on Codeforces for skill building and ranking.",
    eligibility: "Anyone with a Codeforces account.",
    deadline: daysFromNow(7),
    officialLink: "https://codeforces.com/",
    syllabus: ["Algorithms", "Data Structures", "Math"],
    resources: [{ title: "CP Algorithms", url: "https://cp-algorithms.com/" }],
    pyqs: [{ title: "Past Codeforces Rounds", url: "https://codeforces.com/contests" }],
    quiz: [
      { question: "Codeforces is a platform for?", options: ["Web design", "Competitive programming", "Trading", "ML"], answer: 1 },
    ],
  },
  {
    title: "IIT Research Internships (Summer)",
    category: "Internship",
    level: "College Student",
    description: "Summer research internships at IITs across departments — IITB SoP, IITM Summer Fellowship, IITK SURGE, IITGn etc.",
    eligibility: "UG students of recognized institutes; CGPA criteria vary.",
    deadline: daysFromNow(90),
    officialLink: "https://www.iitb.ac.in/",
    syllabus: ["Specific to research area"],
    resources: [{ title: "IITB SoP", url: "https://www.iitb.ac.in/" }],
    pyqs: [],
    quiz: [
      { question: "IITM summer fellowship is for?", options: ["School", "Class 12", "UG students", "PG only"], answer: 2 },
    ],
  },
  {
    title: "Microsoft Engage / Learn Internships",
    category: "Internship",
    level: "College Student",
    description: "Microsoft mentorship and internship programs aimed at student developers in India.",
    eligibility: "Pre-final and final year engineering students.",
    deadline: daysFromNow(78),
    officialLink: "https://careers.microsoft.com/students/",
    syllabus: ["Programming", "Problem solving", "System design basics"],
    resources: [{ title: "Microsoft Learn", url: "https://learn.microsoft.com/" }],
    pyqs: [],
    quiz: [
      { question: "Microsoft Engage is targeted at?", options: ["School students", "All employees", "College students", "Senior engineers"], answer: 2 },
    ],
  },
  {
    title: "ICPC - International Collegiate Programming Contest",
    category: "College/Skill",
    level: "College Student",
    description: "World's most prestigious programming contest for university students - Regionals, then World Finals.",
    eligibility: "Teams of 3 from any university; age and study limits apply.",
    deadline: daysFromNow(100),
    officialLink: "https://icpc.global/",
    syllabus: ["Advanced Algorithms", "Data Structures", "Math", "Graph Theory"],
    resources: [{ title: "ICPC Resources", url: "https://icpc.global/community/resources" }],
    pyqs: [{ title: "ICPC Past Problems", url: "https://icpc.global/" }],
    quiz: [
      { question: "ICPC team size?", options: ["1", "2", "3", "4"], answer: 2 },
    ],
  },
  {
    title: "GATE - Graduate Aptitude Test in Engineering",
    category: "UG Entrance",
    level: "College Student",
    description: "National exam for admission to PG programs at IITs/IISc and PSU recruitment.",
    eligibility: "Final year UG or holders of UG/PG degree in engineering/science/arts/commerce.",
    deadline: daysFromNow(120),
    officialLink: "https://gate.iitb.ac.in/",
    syllabus: ["General Aptitude", "Engineering Mathematics", "Subject specific (CS/EC/EE/ME etc.)"],
    resources: [{ title: "GATE Overflow", url: "https://gateoverflow.in/" }],
    pyqs: [{ title: "GATE Past Papers", url: "https://gate.iitb.ac.in/" }],
    quiz: [
      { question: "GATE is conducted by?", options: ["NTA", "IISc & IITs (rotating)", "UGC", "AICTE"], answer: 1 },
    ],
  },

  // A few past-deadline opportunities (so the "Past" tab is not empty)
  {
    title: "JEE Main 2025 January Session (Past)",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "January session of JEE Main 2025 - kept here for reference, syllabus and PYQs.",
    eligibility: "Class 12 with PCM.",
    deadline: daysFromNow(-30),
    officialLink: "https://jeemain.nta.nic.in/",
    syllabus: ["Physics", "Chemistry", "Mathematics"],
    resources: [{ title: "JEE Main Resources", url: "https://jeemain.nta.nic.in/" }],
    pyqs: [{ title: "JEE Main Jan 2025", url: "https://jeemain.nta.nic.in/" }],
    quiz: [
      { question: "JEE Main 2025 January session conducted by?", options: ["NTA", "IIT", "NCERT", "CBSE"], answer: 0 },
    ],
  },
  {
    title: "NEET UG 2024 (Past)",
    category: "UG Entrance",
    level: "Class 11-12",
    description: "Past edition of NEET UG kept for syllabus, resources and PYQ access.",
    eligibility: "Class 12 with PCB.",
    deadline: daysFromNow(-90),
    officialLink: "https://neet.nta.nic.in/",
    syllabus: ["Physics", "Chemistry", "Biology"],
    resources: [{ title: "NEET Resources", url: "https://neet.nta.nic.in/" }],
    pyqs: [{ title: "NEET 2024 Question Paper", url: "https://neet.nta.nic.in/" }],
    quiz: [
      { question: "NEET 2024 had how many questions?", options: ["180", "200", "220", "150"], answer: 1 },
    ],
  },
];

async function run(): Promise<void> {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  // Wipe existing data
  await Opportunity.deleteMany({});
  await User.deleteMany({});
  console.log("Cleared existing collections");

  // Insert opportunities
  const inserted = await Opportunity.insertMany(opportunities);
  console.log(`Inserted ${inserted.length} opportunities`);

  // Create admin and demo student
  const adminPwd = await hashPassword("admin123");
  const studentPwd = await hashPassword("student123");

  await User.create({
    name: "Admin",
    email: "admin@opportunityhub.com",
    password: adminPwd,
    role: "admin",
    educationLevel: "College Student",
  });

  await User.create({
    name: "Demo Student",
    email: "student@opportunityhub.com",
    password: studentPwd,
    role: "student",
    educationLevel: "Class 11-12",
    savedOpportunities: inserted.slice(0, 3).map((o) => o._id),
    progress: 25,
  });

  console.log("Seed complete:");
  console.log("  Admin:   admin@opportunityhub.com / admin123");
  console.log("  Student: student@opportunityhub.com / student123");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
