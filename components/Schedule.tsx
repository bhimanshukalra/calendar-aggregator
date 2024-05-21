"use client";

import { getFormattedTime } from "@/app/utils/format";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export type Event = {
  summary: string;
  id: string;
  conferenceData: { entryPoints: [{ uri: string; entryPointType: string }] };
  start: { dateTime: string };
  end: { dateTime: string };
  location?: string;
  attendees: [{ responseStatus: "accepted" | "declined"; self: boolean }];
};

type CalendarData = {
  code: number;
  items: Event[];
};

const Schedule = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarData>();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        if (data.code !== 200) {
          throw "Error";
        }
        setEvents(data);
      } catch (error) {}
    };

    if (session?.user?.email) {
      getEvents();
    }
  }, [session?.user?.email]);

  if (events?.code === undefined) {
    return <div>Loading!!!</div>;
  }

  if (events?.code !== 200) {
    return <div>An Error occured</div>;
  }

  if (events?.items.length === 0) {
    return <div>No events</div>;
  }

  return (
    <div className="bg-red-50 rounded-xl">
      {events?.items?.map(
        (
          { conferenceData, id, start, summary, end, location, attendees },
          index
        ) => {
          const entryPoint = conferenceData?.entryPoints.find(
            ({ entryPointType }) => entryPointType === "video"
          )?.uri;
          const meetingUrl = entryPoint || location;
          const startTime = getFormattedTime(start.dateTime);
          const endTime = getFormattedTime(end.dateTime);
          const isLast = index === events?.items.length - 1;
          const currentAttende = attendees?.find((item) => item.self);

          if (
            currentAttende?.responseStatus === "declined" ||
            meetingUrl === undefined ||
            meetingUrl?.length === 0
          ) {
            return null;
          }

          return (
            <p
              key={id}
              className={`flex border-pink-600 border-x-2 ${
                isLast ? "border-y-2" : "border-t-2"
              }`}
            >
              <span className="flex-[2] text-center">{`${summary}`}</span>
              <span className="flex-1 bg-blue-300 text-center">
                {startTime} - {endTime}
              </span>
              {meetingUrl ? (
                <Link
                  href={meetingUrl}
                  className="flex-1 text-center text-blue-400"
                >
                  Meeting URL
                </Link>
              ) : (
                <span className="flex-1 text-center">No URL found</span>
              )}
            </p>
          );
        }
      )}
    </div>
  );
};

export default Schedule;
