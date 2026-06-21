import { NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, package_id } = body;

    if (!email || !package_id) {
      return NextResponse.json(
        { message: "Email and package ID are required" },
        { status: 400 }
      );
    }

    // Call backend to create Stripe checkout session
    const res = await fetch(`${API_URL}/api/payments/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        package_id,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/premium`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create checkout session");
    }

    return NextResponse.json({
      checkout_url: data.checkout_url,
      session_id: data.session_id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create checkout session" },
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
      `${API_URL}/api/payments/info?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch payment info");
    }

    return NextResponse.json({
      current_package: data.current_package,
      opportunities_posted: data.opportunities_posted || 0,
      opportunities_allowed: data.opportunities_allowed || 3,
      upgrade_required: (data.opportunities_posted || 0) >= (data.opportunities_allowed || 3),
    });
  } catch (error) {
    console.error("Error fetching payment info:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch payment info" },
      { status: 500 }
    );
  }
}
