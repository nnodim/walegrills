import { NextRequest } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = "SE28 8LL, Thamesmead";
  const destination = searchParams.get("destination");

  if (!origin || !destination) {
    return new Response(
      JSON.stringify({ error: "Missing origin or destination" }),
      {
        status: 400,
      }
    );
  }

  try {
    const googleRes = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: origin,
          destinations: destination,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    const element = googleRes.data.rows[0].elements[0];

    if (element.status !== "OK") {
      return new Response(
        JSON.stringify({
          error: "Could not retrieve distance/duration from Google",
        }),
        { status: 400 }
      );
    }

    const distanceInMiles = element.distance.value / 1609.34;
    const durationInHours = element.duration.value / 3600;

    return new Response(
      JSON.stringify({ distance: distanceInMiles, duration: durationInHours }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Type guard for Error instance
    if (error instanceof Error) {
      console.error("Error calculating distance:", error.message);
    } else {
      console.error("Error calculating distance:", error);
    }

    return new Response(
      JSON.stringify({ error: "Error calculating distance" }),
      { status: 500 }
    );
  }
}
