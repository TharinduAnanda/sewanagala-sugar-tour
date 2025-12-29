import { gapi } from "gapi-script";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "654025756080-p8gkdm9l16sigg3hsov6abr8ti66v8p2.apps.googleusercontent.com";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

// Sri Lankan public holidays calendar
const SRI_LANKAN_HOLIDAYS_CALENDAR_ID = "en.lk#holiday@group.v.calendar.google.com";

export const initClient = () => {
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
        })
        .then(() => {
          resolve(gapi);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  });
};

export const signIn = async () => {
  try {
    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    return true;
  } catch (error) {
    console.error("Error signing in:", error);
    return false;
  }
};

export const signOut = async () => {
  try {
    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    return false;
  }
};

export const isSignedIn = () => {
  try {
    const authInstance = gapi.auth2.getAuthInstance();
    return authInstance?.isSignedIn.get() || false;
  } catch (error) {
    return false;
  }
};

export const fetchEvents = async (calendarId: string = "primary", maxResults: number = 50) => {
  try {
    const response = await gapi.client.calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: maxResults,
      orderBy: "startTime",
    });

    return response.result.items || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const fetchSriLankanHolidays = async (year?: number) => {
  try {
    const startDate = new Date(year || new Date().getFullYear(), 0, 1);
    const endDate = new Date((year || new Date().getFullYear()) + 1, 0, 1);

    const response = await gapi.client.calendar.events.list({
      calendarId: SRI_LANKAN_HOLIDAYS_CALENDAR_ID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.result.items || [];
  } catch (error) {
    console.error("Error fetching Sri Lankan holidays:", error);
    return [];
  }
};

export const fetchEventsInRange = async (
  startDate: Date,
  endDate: Date,
  calendarId: string = "primary"
) => {
  try {
    const response = await gapi.client.calendar.events.list({
      calendarId: calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.result.items || [];
  } catch (error) {
    console.error("Error fetching events in range:", error);
    return [];
  }
};
