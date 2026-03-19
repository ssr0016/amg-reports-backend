// /backend/seed.js
// Run: node seed.js

require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Report = require("./models/Report");

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ─── DUMMY WORKERS — 15 workers ───────────────────────────────────────────────
const SEED_WORKERS = [
  {
    name: "Juan dela Cruz",
    username: "juan",
    email: "juan@amg.com",
    password: "password123",
    areaAssignment: "Metro Manila",
    churchName: "AMGC Manila Church",
  },
  {
    name: "Maria Santos",
    username: "maria",
    email: "maria@amg.com",
    password: "password123",
    areaAssignment: "Cavite",
    churchName: "AMGC Cavite Church",
  },
  {
    name: "Pedro Reyes",
    username: "pedro",
    email: "pedro@amg.com",
    password: "password123",
    areaAssignment: "Laguna",
    churchName: "AMGC Laguna Church",
  },
  {
    name: "Ana Garcia",
    username: "ana",
    email: "ana@amg.com",
    password: "password123",
    areaAssignment: "Bulacan",
    churchName: "AMGC Bulacan Church",
  },
  {
    name: "Jose Rizal",
    username: "jose",
    email: "jose@amg.com",
    password: "password123",
    areaAssignment: "Batangas",
    churchName: "AMGC Batangas Church",
  },
  {
    name: "Luisa Fernandez",
    username: "luisa",
    email: "luisa@amg.com",
    password: "password123",
    areaAssignment: "Pampanga",
    churchName: "AMGC Pampanga Church",
  },
  {
    name: "Ramon Valdez",
    username: "ramon",
    email: "ramon@amg.com",
    password: "password123",
    areaAssignment: "Rizal",
    churchName: "AMGC Rizal Church",
  },
  {
    name: "Teresa Cruz",
    username: "teresa",
    email: "teresa@amg.com",
    password: "password123",
    areaAssignment: "Quezon City",
    churchName: "AMGC QC Church",
  },
  {
    name: "Andres Bonifacio",
    username: "andres",
    email: "andres@amg.com",
    password: "password123",
    areaAssignment: "Pasig",
    churchName: "AMGC Pasig Church",
  },
  {
    name: "Luz Villanueva",
    username: "luz",
    email: "luz@amg.com",
    password: "password123",
    areaAssignment: "Taguig",
    churchName: "AMGC Taguig Church",
  },
  {
    name: "Carlos Mendoza",
    username: "carlos",
    email: "carlos@amg.com",
    password: "password123",
    areaAssignment: "Parañaque",
    churchName: "AMGC Paranaque Church",
  },
  {
    name: "Elena Ramos",
    username: "elena",
    email: "elena@amg.com",
    password: "password123",
    areaAssignment: "Marikina",
    churchName: "AMGC Marikina Church",
  },
  {
    name: "Domingo Lim",
    username: "domingo",
    email: "domingo@amg.com",
    password: "password123",
    areaAssignment: "Antipolo",
    churchName: "AMGC Antipolo Church",
  },
  {
    name: "Rosa Aquino",
    username: "rosa",
    email: "rosa@amg.com",
    password: "password123",
    areaAssignment: "Caloocan",
    churchName: "AMGC Caloocan Church",
  },
  {
    name: "Fernando Torres",
    username: "fernando",
    email: "fernando@amg.com",
    password: "password123",
    areaAssignment: "Valenzuela",
    churchName: "AMGC Valenzuela Church",
  },
].map((w) => ({ ...w, role: "user" }));

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function randWeeks(min = 5, max = 40) {
  return {
    week1: Math.floor(Math.random() * (max - min + 1)) + min,
    week2: Math.floor(Math.random() * (max - min + 1)) + min,
    week3: Math.floor(Math.random() * (max - min + 1)) + min,
    week4: Math.floor(Math.random() * (max - min + 1)) + min,
    week5: Math.floor(Math.random() * (max - min + 1)) + min,
  };
}

function randSmall() {
  return randWeeks(0, 10);
}

function randOffering() {
  return {
    week1: Math.floor(Math.random() * 5000) + 500,
    week2: Math.floor(Math.random() * 5000) + 500,
    week3: Math.floor(Math.random() * 5000) + 500,
    week4: Math.floor(Math.random() * 5000) + 500,
    week5: Math.floor(Math.random() * 5000) + 500,
  };
}

function buildReport(userId, worker, month, year) {
  const isCompleted = Math.random() > 0.3;
  return {
    month,
    year,
    worker: worker.name,
    areaAssignment: worker.areaAssignment,
    churchName: worker.churchName,
    worshipService: randWeeks(20, 80),
    sundaySchool: randWeeks(10, 40),
    prayerMeeting: randWeeks(5, 30),
    bibleStudies: randWeeks(5, 25),
    mensFellowship: randSmall(),
    womensFellowship: randSmall(),
    youthFellowship: randSmall(),
    childrenFellowship: randSmall(),
    tithesOffering: randOffering(),
    homeVisited: randSmall(),
    bibleStudyGroupLed: randSmall(),
    sermonPreached: randSmall(),
    personNewlyContacted: randSmall(),
    personFollowedUp: randSmall(),
    personEvangelized: randSmall(),
    outreach: randSmall(),
    training: randSmall(),
    leadership: randSmall(),
    baptism: {
      week1: 0,
      week2: 0,
      week3: Math.floor(Math.random() * 3),
      week4: 0,
      week5: 0,
    },
    other: randSmall(),
    familyDay: randSmall(),
    names: isCompleted ? "Sample Believer 1, Sample Believer 2" : "",
    narrativeReport: `This month of ${month} ${year}, the ministry in ${worker.areaAssignment} experienced growth. Several outreach activities were conducted and new believers were welcomed into the church.`,
    challenges:
      "Transportation difficulties and scheduling conflicts with some members.",
    prayerRequest:
      "Pray for the continued growth of the church and for more workers to join the ministry.",
    createdBy: userId,
    completed: isCompleted,
  };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await connectDB();

    // ── clear existing seed workers and their reports only
    const existingUsernames = SEED_WORKERS.map((w) => w.username);
    const existingUsers = await User.find({
      username: { $in: existingUsernames },
    });
    const existingIds = existingUsers.map((u) => u._id);

    if (existingIds.length > 0) {
      await Report.deleteMany({ createdBy: { $in: existingIds } });
      await User.deleteMany({ _id: { $in: existingIds } });
      console.log(
        `🗑️  Cleared ${existingIds.length} existing seed workers and their reports`,
      );
    }

    // ── create workers
    const createdWorkers = [];
    for (const w of SEED_WORKERS) {
      const hashed = await bcrypt.hash(w.password, 10);
      const user = await User.create({
        name: w.name,
        username: w.username,
        email: w.email,
        password: hashed,
        role: w.role,
      });
      createdWorkers.push({ _id: user._id, ...w });
      console.log(`👤 Created worker: ${w.username}`);
    }

    // ── report dates — 2024 (all months) + 2025 (all months) + 2026 (Jan-Feb)
    const reportDates = [];
    for (const month of MONTHS) reportDates.push({ month, year: 2024 });
    for (const month of MONTHS) reportDates.push({ month, year: 2025 });
    reportDates.push({ month: "January", year: 2026 });
    reportDates.push({ month: "February", year: 2026 });

    let reportCount = 0;
    for (const worker of createdWorkers) {
      for (const { month, year } of reportDates) {
        if (Math.random() < 0.05) continue; // 5% skip lang — mas maraming data
        await Report.create(buildReport(worker._id, worker, month, year));
        reportCount++;
      }
    }

    console.log(`📋 Created ${reportCount} reports`);
    console.log("\n🎉 Seed complete!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("WORKER TEST ACCOUNTS (password: password123):");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    SEED_WORKERS.forEach((w) => {
      console.log(`👤 ${w.username.padEnd(12)} | ${w.name}`);
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

seed();
