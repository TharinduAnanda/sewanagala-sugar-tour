import { gapi } from "gapi-script";

// Sri Lankan public holidays calendar ID
const SRI_LANKAN_HOLIDAYS_CALENDAR_ID = "en.lk#holiday@group.v.calendar.google.com";

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  description?: string;
}

/**
 * Fetch Sri Lankan holidays for a specific year or date range
 * This works without authentication as it's a public calendar
 */
export const fetchSriLankanHolidays = async (
  year?: number,
  startDate?: Date,
  endDate?: Date
): Promise<Holiday[]> => {
  try {
    // Determine date range
    let timeMin: string;
    let timeMax: string;

    if (startDate && endDate) {
      timeMin = startDate.toISOString();
      timeMax = endDate.toISOString();
    } else {
      const currentYear = year || new Date().getFullYear();
      timeMin = new Date(currentYear, 0, 1).toISOString();
      timeMax = new Date(currentYear + 1, 0, 1).toISOString();
    }

    // Initialize gapi if not already done
    if (!gapi.client.calendar) {
      await new Promise((resolve, reject) => {
        gapi.load("client", async () => {
          try {
            await gapi.client.init({
              apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
              discoveryDocs: [
                "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
              ],
            });
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    const response = await gapi.client.calendar.events.list({
      calendarId: SRI_LANKAN_HOLIDAYS_CALENDAR_ID,
      timeMin: timeMin,
      timeMax: timeMax,
      showDeleted: false,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.result.items || [];
    
    return events.map((event: any) => ({
      date: event.start.date || event.start.dateTime.split('T')[0],
      name: event.summary || "Holiday",
      description: event.description || "",
    }));
  } catch (error) {
    console.error("Error fetching Sri Lankan holidays:", error);
    return [];
  }
};

/**
 * Check if a specific date is a Sri Lankan holiday
 */
export const isHoliday = async (date: string): Promise<boolean> => {
  const checkDate = new Date(date);
  const startDate = new Date(checkDate);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(checkDate);
  endDate.setHours(23, 59, 59, 999);

  const holidays = await fetchSriLankanHolidays(undefined, startDate, endDate);
  return holidays.length > 0;
};

/**
 * Get holiday name for a specific date
 */
export const getHolidayName = async (date: string): Promise<string | null> => {
  const checkDate = new Date(date);
  const startDate = new Date(checkDate);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(checkDate);
  endDate.setHours(23, 59, 59, 999);

  const holidays = await fetchSriLankanHolidays(undefined, startDate, endDate);
  return holidays.length > 0 ? holidays[0].name : null;
};

/**
 * Fetch holidays for a specific month
 */
export const fetchHolidaysForMonth = async (
  year: number,
  month: number
): Promise<Holiday[]> => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  return fetchSriLankanHolidays(undefined, startDate, endDate);
};
