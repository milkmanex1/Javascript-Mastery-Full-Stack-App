"use server";

import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export const getSimilarEventsBySlug = async (slug) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });
    const similarEvents = await Event.find({
      //Find events whose ID is NOT equal to the current event
      _id: { $ne: event._id },
      //Find events whose tags array contains any tag from event.tags
      tags: { $in: event.tags },
    }).select("-__v") // Exclude the __v field
    .lean(); // Convert from Mongoose objects to plain JavaScript objects. By default, Mongoose returns Mongoose objects, which are not usable in the frontend.
    return similarEvents;
  } catch (error) {
    console.log(error);
    return { error: "Failed to fetch similar events" };
  }
};
