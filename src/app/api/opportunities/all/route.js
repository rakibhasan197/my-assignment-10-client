import { NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${API_URL}/api/opportunities/all?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch opportunities");
    }

    return NextResponse.json({
      opportunities: data.opportunities || [],
    });
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}
