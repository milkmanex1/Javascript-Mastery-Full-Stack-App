import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";

//nested try catch block to handle diff type of errors differently. Outer block: DB connection errors Cloudinary upload fails, these are server errros, so we return 500. Inner block: form data parsing and event creation errors, client side errors, so return error 400.

//we use req.formData() to handle multipart/form-data requests, which is suitable for file uploads and complex form submissions, instead of req.json() which is for application/json content type.

//so the client is expected to send the event data as multipart/form-data, NOT json
export async function POST(req) {
  try {
    await connectDB();

    //this block of code checks the content type of the incoming request to ensure it is 'multipart/form-data', which is necessary for handling file uploads and complex form submissions. If the content type does not match, it returns a 400 Bad Request response with an appropriate error message.
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          message:
            "Invalid content type. Expected multipart/form-data, not JSON.",
        },
        { status: 400 }
      );
    }

    let formData;
    formData = await req.formData();

    let event;
    try {
      //this line below converts formData to a regular object so we can save to mongodb
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid form data" },
        { status: 400 }
      );
    }

    //get the image file from the form data
    const file = formData.get("image");
    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }
    //this returns the Blob data of the uploaded file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    //now we can upload this buffer to cloudinary. The uploadResult contains the URL of the uploaded image on cloudinary servers
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvents" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    event.image = uploadResult.secure_url;

    if (event.agenda && typeof event.agenda === "string") {
      try {
        event.agenda = JSON.parse(event.agenda);
      } catch (err) {
        console.log("Failed to parse agenda:", err);
      }
    }

    //This line saves the event data into MongoDB using the Mongoose Event model
    const createdEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Event Created Successfully", data: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      message: "Event Creation Failed",
      error: e instanceof Error ? e.message : "Unknown Error",
    });
  }
}

//?Why do we need to upload image to Cloudinary?
//If image already comes from URL, then no need. It's already hosted somewhere.
//But if image is uploaded as a file from client, we need to host it somewhere accessible via URL so that we can display it in our app later.

export async function GET(req) {
  try {
    await connectDB();
    //createdAt: -1 means new events at the top
    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Events fetched successfully", data: events },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Failed to fetch events",
        error: e instanceof Error ? e.message : "Unknown Error",
      },
      { status: 500 }
    );
  }
}
