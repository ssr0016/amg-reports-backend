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

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Report", ReportSchema);
