import React from "react";
import Link from "next/link";
import Image from "next/image";

const EventCard = ({ title, image, slug, location, date, time }) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        src={image || "/images/event-placeholder.png"}
        alt={title || "Event Image"}
        width={410}
        height={300}
        className="poster"
      ></Image>
      <p className="title">{title}</p>
      <div className="flex flex-row gap-2">
        <Image
          src="/icons/pin.svg"
          alt="location"
          width={14}
          height={14}
        ></Image>
        <span className="text-light-200 text-sm font-light">{location}</span>
      </div>

      <div className="datetime">
        <div>
          <Image
            src="/icons/calendar.svg"
            alt="date"
            width={14}
            height={14}
          ></Image>
          <span>{date}</span>
        </div>
        <div>
          <Image
            src="/icons/clock.svg"
            alt="time"
            width={14}
            height={14}
          ></Image>
          <span>{time}</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
