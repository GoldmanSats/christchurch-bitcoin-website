import { Router, type IRouter } from "express";
import { db, rsvpsTable } from "@workspace/db";
import { sql, inArray } from "drizzle-orm";
import { getUpcomingMeetupDateStrings, getBaselineAttendance } from "../utils/meetup-dates.js";

const router: IRouter = Router();

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidCalendarDate(dateStr: string): boolean {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

router.post("/rsvps", async (req, res) => {
  try {
    const { name, meetupDate } = req.body ?? {};

    if (typeof name !== "string" || name.trim().length === 0 || name.trim().length > 100) {
      res.status(400).json({ message: "Please provide a name or nym." });
      return;
    }
    if (typeof meetupDate !== "string" || !DATE_RE.test(meetupDate) || !isValidCalendarDate(meetupDate)) {
      res.status(400).json({ message: "Please provide a valid meetup date." });
      return;
    }

    const allowedDates = getUpcomingMeetupDateStrings(6);
    if (!allowedDates.includes(meetupDate)) {
      res.status(400).json({ message: "RSVPs are only accepted for upcoming meetup dates." });
      return;
    }

    const trimmedName = name.trim();

    await db.insert(rsvpsTable).values({
      name: trimmedName,
      meetupDate,
    });

    res.status(201).json({
      message: "You're in! See you at the meetup.",
      meetupDate,
    });
  } catch (err: unknown) {
    const error = err as Record<string, unknown>;
    const pgCode = error?.code ?? (error?.cause as Record<string, unknown>)?.code;
    if (pgCode === "23505") {
      res.status(409).json({ message: "You've already RSVPed for this meetup. See you there!" });
      return;
    }
    console.error("Error creating RSVP:", err instanceof Error ? err.message : String(err));
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/rsvps/counts", async (_req, res) => {
  try {
    const upcomingDates = getUpcomingMeetupDateStrings(6);

    const counts = await db
      .select({
        meetupDate: rsvpsTable.meetupDate,
        count: sql<number>`count(*)::int`,
      })
      .from(rsvpsTable)
      .where(inArray(rsvpsTable.meetupDate, upcomingDates))
      .groupBy(rsvpsTable.meetupDate);

    const countMap = new Map(counts.map((c) => [c.meetupDate, c.count]));

    res.json(
      upcomingDates.map((date) => ({
        meetupDate: date,
        count: (countMap.get(date) ?? 0) + getBaselineAttendance(date),
      }))
    );
  } catch (err) {
    console.error("Error getting RSVP counts:", String(err));
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
