import { NextResponse } from "next/server";

const API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { message: "Session ID is required" },
        { status: 400 }
      );
    }

    // Call backend to confirm payment with Stripe
    const res = await fetch(`${API_URL}/api/payments/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to confirm payment");
    }

    return NextResponse.json({
      transaction_id: data.transaction_id,
      package_name: data.package_name,
      amount: data.amount,
      opportunities_allowed: data.opportunities_allowed,
      created_at: data.created_at,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { message: error.message || "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
