import { NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      opportunity_id,
      applicant_email,
      portfolio_link,
      motivation_message,
      status = "Pending",
    } = body;

    if (!opportunity_id || !applicant_email || !portfolio_link || !motivation_message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/api/applications/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        opportunity_id,
        applicant_email,
        portfolio_link,
        motivation_message,
        status,
        applied_date: new Date().toISOString(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create application");
    }

    return NextResponse.json({
      message: "Application submitted successfully",
      application: data,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create application" },
      { status: 500 }
    );
  }
}

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
      `${API_URL}/api/applications?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch applications");
    }

    return NextResponse.json({
      applications: data.applications || [],
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
