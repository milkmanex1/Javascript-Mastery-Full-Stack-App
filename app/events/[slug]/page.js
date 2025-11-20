export const dynamic = "force-dynamic";
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import { getSimilarEventsBySlug } from "@/lib/actions/event.action";
import EventCard from "@/components/EventCard";

const EventDetailItem = ({ icon, alt, label }) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17}></Image>
      <p>{label}</p>
    </div>
  );
};

const EventAgenda = ({ agendaItems }) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag, i) => (
        <div className="pill" key={i}>
          {tag}
        </div>
      ))}
    </div>
  );
};

const EventDetailsPage = async ({ params }) => {
  const { slug } = await params;
  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  if (!response.ok) {
    console.error(`Failed to fetch event: ${response.status}`);
    return notFound();
  }
  const { data } = await response.json();

  if (!data) return notFound();
  const {
    description,
    image,
    title,
    overview,
    date,
    time,
    location,
    mode,
    audience,
    agenda,
    organizer,
    tags,
  } = data;

  const bookings = 10;

  const similarEvents = await getSimilarEventsBySlug(slug);
  console.log(similarEvents);

  return (
    <div id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>

      <div className="details">
        {/* left side  - Event content */}
        <div className="content">
          <Image
            src={image}
            alt={title}
            width={800}
            height={800}
            className="banner"
          ></Image>
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="time" label={time} />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="location"
              label={location}
            />
            <EventDetailItem
              icon="/icons/mode.svg"
              alt="audience"
              label={mode}
            />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>
          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={JSON.parse(tags[0])} />
        </div>
        {/* right side - Booking form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">Join {bookings} others</p>
            ) : (
              <p className="text-sm">Be the first to book your spot</p>
            )}
            <BookEvent></BookEvent>
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent) => {
              console.log(similarEvent.title);
              return (
                <EventCard key={similarEvent._id} {...similarEvent}></EventCard>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
