import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import useAuthStore from "../stores/authStore.js";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const verifyPremiumPayment = useAuthStore(
        (state) => state.verifyPremiumPayment
    );

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState(
        "Verifying your premium subscription..."
    );

    useEffect(() => {
        const verifyPayment = async () => {
            // Paystack normally returns the reference
            // as a query parameter.
            const reference =
                searchParams.get("reference") ||
                searchParams.get("trxref");

            if (!reference) {
                setStatus("error");
                setMessage(
                    "Payment reference was not found."
                );
                return;
            }

            const result =
                await verifyPremiumPayment(reference);

            if (result.success) {
                setStatus("success");
                setMessage(
                    "Payment successful! Your Premium plan is now active."
                );

                // Give Zustand/backend state a moment to update,
                // then return to the plan page.
                setTimeout(() => {
                    navigate("/plan-comparison", {
                        replace: true,
                    });
                }, 1500);
            } else {
                setStatus("error");
                setMessage(
                    result.message ||
                    "Payment verification failed."
                );
            }
        };

        verifyPayment();
    }, [
        searchParams,
        verifyPremiumPayment,
        navigate,
    ]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
            <div className="w-full max-w-md rounded-2xl border border-[#FFFFFF14] bg-[#0D0D12] p-8 text-center">

                {status === "verifying" && (
                    <>
                        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-[#FFFFFF14] border-t-[#A855F7]" />

                        <h1 className="text-xl font-semibold">
                            Verifying Payment
                        </h1>

                        <p className="mt-3 text-sm text-[#94A3B8]">
                            {message}
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-2xl text-green-400">
                            ✓
                        </div>

                        <h1 className="text-xl font-semibold">
                            Payment Successful
                        </h1>

                        <p className="mt-3 text-sm text-[#94A3B8]">
                            {message}
                        </p>

                        <p className="mt-4 text-xs text-[#64748B]">
                            Redirecting you back...
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-400">
                            !
                        </div>

                        <h1 className="text-xl font-semibold">
                            Payment Verification Failed
                        </h1>

                        <p className="mt-3 text-sm text-[#94A3B8]">
                            {message}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/plan-comparison")
                            }
                            className="mt-6 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#9333EA] px-6 py-3 text-sm font-semibold text-black"
                        >
                            Back to Plans
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;