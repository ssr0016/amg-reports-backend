// /backend/models/Report.js
const mongoose = require("mongoose");

const weekSchema = {
  week1: Number,
  week2: Number,
  week3: Number,
  week4: Number,
  week5: Number,
};

const ReportSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear(),
    },

    worker: String,

    areaAssignment: String,

    churchName: String,

    worshipService: weekSchema,
    sundaySchool: weekSchema,
    prayerMeeting: weekSchema,
    bibleStudies: weekSchema,
    mensFellowship: weekSchema,
    womensFellowship: weekSchema,
    youthFellowship: weekSchema,
    childrenFellowship: weekSchema,
    tithesOffering: weekSchema,
    homeVisited: weekSchema,
    bibleStudyGroupLed: weekSchema,
    sermonPreached: weekSchema,
    personNewlyContacted: weekSchema,
    personFollowedUp: weekSchema,
    personEvangelized: weekSchema,
    outreach: weekSchema,
    training: weekSchema,
    leadership: weekSchema,
    baptism: weekSchema,
    other: weekSchema,
    familyDay: weekSchema,

    names: String,
    narrativeReport: String,
    challenges: String,
    prayerRequest: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// ✅ indexes — para hindi mag-full collection scan si MongoDB sa bawat query
// ginagamit sa filtering (getReports) at sa duplicate check (createReport)
ReportSchema.index({ month: 1 });
ReportSchema.index({ year: 1 });
ReportSchema.index({ worker: 1 });
ReportSchema.index({ areaAssignment: 1 });
ReportSchema.index({ churchName: 1 });
ReportSchema.index({ createdBy: 1 });
ReportSchema.index({ createdAt: -1 }); // ✅ para sa sort({ createdAt: -1 })

// ✅ compound index — para sa duplicate check sa createReport
// { createdBy, month, year } ang laging ginagamit na sabay sa findOne
ReportSchema.index({ createdBy: 1, month: 1, year: 1 });

module.exports = mongoose.model("Report", ReportSchema);
