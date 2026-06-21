import { NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export async function POST(request) {
  try {
    const body = await request.json();

    const { email, name, image, skills, bio } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_URL}/api/collaborator/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        image,
        skills,
        bio,
        updated_at: new Date().toISOString(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: data,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update profile" },
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
      `${API_URL}/api/collaborator/profile?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok && res.status !== 404) {
      throw new Error(data.message || "Failed to fetch profile");
    }

    return NextResponse.json({
      profile: data.profile || null,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
