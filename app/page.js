import React from "react";
import ExploreBtn from "../components/ExploreBtn";
import EventCard from "../components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  //the backend API endpoint name is automcatically created based on the file structure inside the "<root>/api/events/route.js"
  const response = await fetch(`${BASE_URL}/api/events`);
  const { data } = await response.json();
  const events = data;
  console.log(data);

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
