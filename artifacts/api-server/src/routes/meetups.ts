import { Router, type IRouter } from "express";
import { db, rsvpsTable } from "@workspace/db";
import { sql, inArray } from "drizzle-orm";
import { getUpcomingFirstWednesdays, formatDateString, getBaselineAttendance } from "../utils/meetup-dates.js";

const router: IRouter = Router();

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

router.get("/meetups", async (_req, res) => {
  try {
    const upcomingDates = getUpcomingFirstWednesdays(6);
    const dateStrings = upcomingDates.map(formatDateString);

    const counts = await db
      .select({
        meetupDate: rsvpsTable.meetupDate,
        count: sql<number>`count(*)::int`,
      })
      .from(rsvpsTable)
      .where(inArray(rsvpsTable.meetupDate, dateStrings))
      .groupBy(rsvpsTable.meetupDate);

    const countMap = new Map(counts.map((c) => [c.meetupDate, c.count]));

    const meetups = upcomingDates.map((d) => ({
      date: formatDateString(d),
      dayOfWeek: DAYS[d.getDay()],
      month: MONTHS[d.getMonth()],
      dayOfMonth: d.getDate(),
      year: d.getFullYear(),
      rsvpCount: (countMap.get(formatDateString(d)) || 0) + getBaselineAttendance(formatDateString(d)),
    }));

    res.json(meetups);
  } catch (err) {
    console.error("Error listing meetups:", String(err));
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
