"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiGet, apiPost } from "@/lib/api";

const packages = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    opportunities: 3,
    features: ["Post up to 3 opportunities", "Basic analytics", "Email support"],
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
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    if (user?.email) fetchPaymentInfo();
  }, [user]);

  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet(`/api/payments/info?email=${encodeURIComponent(user.email)}`);
      setPaymentInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (packageId) => {
    setError("");
    setSelectedPackage(packageId);
    setSubmitting(true);

    try {
      const data = await apiPost("/api/payments/checkout", {
        email: user.email,
        package_id: packageId,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/collaborator`,
      });
      if (!data.checkout_url) throw new Error("Checkout URL missing");
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err.message);
      setSelectedPackage(null);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {paymentInfo?.current_package && (
        <div className="rounded-3xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">
                Active: {paymentInfo.current_package}
              </p>
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
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="inline mr-2 h-4 w-4 align-text-bottom" />
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-3xl border p-6 shadow-sm ${
              pkg.popular ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {pkg.opportunities === "Unlimited" ? pkg.opportunities : `${pkg.opportunities} opportunities`}
                </p>
              </div>
              {pkg.popular && (
                <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-4xl font-bold text-gray-900">${pkg.price}</p>
              {pkg.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  {feature}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleCheckout(pkg.id)}
              disabled={submitting && selectedPackage === pkg.id}
              className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white ${
                pkg.popular ? "bg-indigo-700 hover:bg-indigo-800" : "bg-indigo-600 hover:bg-indigo-700"
              } disabled:bg-gray-400`}
            >
              <Lock className="h-4 w-4" />
              {submitting && selectedPackage === pkg.id ? "Processing..." : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}