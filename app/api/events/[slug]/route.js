import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { NextResponse } from "next/server";

/**
 * GET /api/events/[slug]
 * Returns a single event document matching the provided `slug` route parameter.
 *
 * Error handling:
 *  - 400 Bad Request: missing or invalid slug
 *  - 404 Not Found: no event matches the slug
 *  - 500 Internal Server Error: unexpected errors (DB, other)
 */

//Next.js injects params. You don’t create it in your app code — the framework passes it into the route handler as the second argument.
export async function GET(req, { params }) {
  try {
    // In Next.js 15+, params is a Promise and must be awaited

    //The keys of the resolved object match the dynamic segment names in the path:
    // app/api/events/[slug]/route.js -> params resolves to { slug: "some-string" }
    // app/api/posts/[...slug]/route.js -> params resolves to { slug: ["a","b","c"] } (catch‑all array)
    // app/api/docs/[[...slug]]/route.js -> params resolves to { slug: undefined | ["a","b"] } (optional catch‑all)
    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { message: "Missing or invalid 'slug' route parameter" },
        { status: 400 }
      );
    }

    // Slug format guard: allow lowercase letters, numbers and hyphens only
    // This prevents accidental injection of unexpected characters and narrows down queries
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          message:
            "Invalid 'slug' format. Use lowercase letters, numbers and hyphens only.",
        },
        { status: 400 }
      );
    }

    // Ensure DB connection is established before querying
    await connectDB();

    // Query the Event model. Use lean() to return a plain JS object and exclude __v
    const event = await Event.findOne({ slug }).select("-__v").lean();

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event fetched successfully", data: event },
      { status: 200 }
    );
  } catch (error) {
    // Log server-side error for diagnosis, but don't leak internals to the client
    // (keep message concise and safe)
    // eslint-disable-next-line no-console
    console.error("GET /api/events/[slug] error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
