import { readInFile } from "@/app/utils/file-system";
import { Event } from "@/components/Schedule";

export const GET = async () => {
  try {
    const baseUrl =
      "https://content.googleapis.com/calendar/v3/calendars/primary/events";

    const orderBy = "startTime";
    const singleEvents = "true";
    const date = new Date();
    const currentData = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const timeMin = currentData.toISOString();
    currentData.setDate(currentData.getDate() + 1);
    const timeMax = currentData.toISOString();
    const apiKey = process.env.API_KEY;
    const url = `${baseUrl}?orderBy=${orderBy}&singleEvents=${singleEvents}&timeMax=${timeMax}&timeMin=${timeMin}&key=${apiKey}`;
    const token = await readInFile();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
    });
    const data = await response.json();

    if (data.error) {
      throw "Error";
    }

    const items: Event[] = data.items;

    items.sort((primary, secondary) => {
      const firstDate = primary.start.dateTime.split("T")[1];
      const secondDate = secondary.start.dateTime.split("T")[1];

      if (firstDate < secondDate) {
        return -1;
      } else if (firstDate > secondDate) {
        return 1;
      }
      return 0;
    });

    return new Response(JSON.stringify({ items: items, code: 200 }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ code: 500, message: "Failed to fetch events" }),
      { status: 500 }
    );
  }
};
