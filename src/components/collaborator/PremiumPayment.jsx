"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const packages = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    opportunities: 3,
    features: [
      "Post up to 3 opportunities",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: 79,
    opportunities: 15,
    features: [
      "Post up to 15 opportunities",
      "Advanced analytics",
      "Priority support",
      "Featured listings",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    opportunities: "Unlimited",
    features: [
      "Unlimited opportunities",
      "Advanced analytics",
      "24/7 support",
      "Featured listings",
      "Custom branding",
    ],
  },
];

export default function PremiumPayment() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchPaymentInfo();
    }
  }, [user]);

  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      setError("");
      const email = encodeURIComponent(user?.email);
      const res = await fetch(`${API_URL}/api/payments/info?email=${email}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to fetch payment info:", data);
      } else {
        setPaymentInfo(data);
      }
    } catch (err) {
      console.error("Error fetching payment info:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (packageId) => {
    setError("");
    setSuccess("");
    setSelectedPackage(packageId);

    if (!user?.email) {
      setError("Please sign in to continue");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_URL}/api/payments/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          package_id: packageId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to initiate checkout");
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError("Failed to get checkout URL");
      }
    } catch (err) {
      setError(err.message);
      setSelectedPackage(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Status */}
      {paymentInfo?.current_package && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">
                Active: {paymentInfo.current_package}
              </h3>
              <p className="mt-1 text-sm text-green-700">
                {paymentInfo.opportunities_posted}/{paymentInfo.opportunities_allowed} opportunities posted
              </p>
              {paymentInfo.upgrade_required && (
                <p className="mt-2 text-xs font-medium text-orange-600">
                  ⚠️ Upgrade required to post more opportunities
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative flex flex-col rounded-lg border p-6 transition ${
              pkg.popular
                ? "border-indigo-500 bg-indigo-50 shadow-lg"
                : "border-gray-200 bg-white"
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-6 mt-2">
              <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  ${pkg.price}
                </span>
                <span className="text-sm text-gray-600">/month</span>
              </div>
            </div>

            <div className="mb-6 flex-1 space-y-3">
              <div className="rounded-lg bg-white bg-opacity-60 p-3">
                <p className="text-sm font-semibold text-gray-900">
                  {pkg.opportunities === "Unlimited"
                    ? "Unlimited"
                    : `Up to ${pkg.opportunities}`}{" "}
                  Opportunities
                </p>
              </div>

              <div className="space-y-2">
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleCheckout(pkg.id)}
              disabled={submitting && selectedPackage === pkg.id}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                pkg.popular
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
              } disabled:bg-gray-400`}
            >
              {submitting && selectedPackage === pkg.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Upgrade to {pkg.name}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-12 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-lg font-semibold text-gray-900">FAQ</h3>

        <div>
          <h4 className="font-medium text-gray-900">Can I cancel anytime?</h4>
          <p className="mt-1 text-sm text-gray-600">
            Yes, you can cancel your subscription anytime from your account settings.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900">
            What happens to my opportunities if I cancel?
          </h4>
          <p className="mt-1 text-sm text-gray-600">
            Your opportunities remain visible but you won't be able to add new ones.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900">
            Do you offer refunds?
          </h4>
          <p className="mt-1 text-sm text-gray-600">
            We offer refunds within 30 days of purchase if you're not satisfied.
          </p>
        </div>
      </div>
    </div>
  );
}
