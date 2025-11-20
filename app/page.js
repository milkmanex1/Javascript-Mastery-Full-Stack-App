import React from "react";
import ExploreBtn from "../components/ExploreBtn";
import EventCard from "../components/EventCard";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  //the backend API endpoint name is automcatically created based on the file structure inside the "<root>/api/events/route.js"
  //   const response = await fetch(`${BASE_URL}/api/events`);

  //instead of fetching from our own API, we are fetching from the database directly
  //this is to avoid error in vercel during build time data fetching
  //
  await connectDB();
  const unserializedEvents = await Event.find().sort({ createdAt: -1 }).lean();

  // Convert MongoDB _id to string for serialization
  const events = unserializedEvents.map((event) => ({
    ...event,
    _id: event._id.toString(),
  }));

  return (
    <section className="text-center">
      <h1> The Hub for Every Dev</h1>
      <br />
      <h1>Event You Can't Miss</h1>
      <p className="text-center mt-5">
        Hackatons, Meetups, and Conferences All in One Place
      </p>
      <ExploreBtn></ExploreBtn>
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event, i) => (
              <EventCard key={i} {...event}></EventCard>
            ))}
        </ul>
      </div>
    </section>
  );
};
export default Page;
