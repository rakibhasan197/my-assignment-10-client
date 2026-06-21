"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const confirmPayment = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setError("No payment session found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/payments/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to confirm payment");
        }

        setPaymentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {error ? (
          <>
            <div className="flex justify-center">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">
              Payment Failed
            </h1>
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 w-full rounded-lg bg-red-600 px-4 py-2 text-white font-medium transition hover:bg-red-700"
            >
              Back to Dashboard
            </button>
          </>
        ) : paymentData ? (
          <>
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">
              Payment Successful!
            </h1>

            <div className="mt-6 space-y-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <div>
                <p className="text-xs font-medium text-gray-600">
                  TRANSACTION ID
                </p>
                <p className="mt-1 break-all font-mono text-sm text-gray-900">
                  {paymentData.transaction_id}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-600">
                  PACKAGE
                </p>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {paymentData.package_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-600">
                  AMOUNT PAID
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  ${paymentData.amount}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-600">
                  DATE
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(paymentData.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              You can now post up to{" "}
              <span className="font-semibold">
                {paymentData.opportunities_allowed}
              </span>{" "}
              opportunities. Enjoy your premium features!
            </p>

            <button
              onClick={() => router.push("/dashboard/founder")}
              className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium transition hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
