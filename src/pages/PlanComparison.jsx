import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import useAuthStore from "../stores/authStore.js";

const PlanComparison = () => {
    const navigate = useNavigate();

    // ============================================================
    // ZUSTAND
    // ============================================================

    const initializePremiumPayment = useAuthStore(
        (state) => state.initializePremiumPayment
    );

    const isPaymentLoading = useAuthStore(
        (state) => state.isPaymentLoading
    );

    const usage = useAuthStore(
        (state) => state.usage
    );

    // ============================================================
    // FEATURES
    // ============================================================

    const freeFeatures = [
        "Basic voice options & standard narrators",
        "3 PDF document uploads per day limit",
        "Automatic line-by-line word highlighting",
    ];

    const premiumFeatures = [
        "Up to 10 PDF document uploads per day",
        "Generate and download offline audio MP3s",
    ];

    // ============================================================
    // SAFE USAGE VALUES
    // ============================================================

    const currentPlan = usage?.plan || "free";

    // ============================================================
    // HANDLE UPGRADE
    // ============================================================

    const handleUpgrade = async () => {
        if (isPaymentLoading || currentPlan === "premium") {
            return;
        }

        const result = await initializePremiumPayment();

        if (!result.success) {
            console.error("Premium payment initialization failed:", result.message);
            return;
        }

        // Paystack checkout URL returned by backend
        const authorizationUrl =
            result.authorization_url ||
            result.authorizationUrl ||
            result.data?.authorization_url;

        if (!authorizationUrl) {
            console.error(
                "Paystack authorization URL was not returned by the backend."
            );
            return;
        }

        // Redirect user to Paystack checkout
        window.location.href = authorizationUrl;
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#000000] text-white">

            {/* ====================================================
                NAVBAR
            ==================================================== */}

            <nav className="flex w-full items-center justify-between px-5 pt-6 sm:px-8 lg:px-16">

                {/* Logo */}
                <div className="shrink-0">
                    <img
                        src={assets.brandLogo2}
                        alt="Sonar"
                        className="h-auto w-auto max-w-[110px]"
                    />
                </div>

                {/* Back to App */}
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="shrink-0 cursor-pointer text-[13px] font-[400] text-[#94A3B8] transition-colors hover:text-white sm:text-[14px]"
                >
                    Back to app
                </button>
            </nav>

            {/* ====================================================
                HEADER
            ==================================================== */}

            <section className="mx-auto flex w-full max-w-[700px] flex-col items-center px-5 pt-12 text-center sm:px-8 sm:pt-16 lg:pt-20">

                <h1
                    className="
                        w-full
                        font-[700]
                        font-libre
                        text-[26px]
                        leading-[1.2]
                        text-[#F8FAFC]
                        sm:text-[30px]
                        lg:text-[32px]
                    "
                >
                    Upgrade Your Reading Experience
                </h1>

                <h3
                    className="
                        mt-3
                        w-full
                        max-w-[600px]
                        text-[14px]
                        font-[400]
                        leading-6
                        text-[#94A3B8]
                        sm:text-[15px]
                        lg:text-[16px]
                    "
                >
                    Ditch the screen. Turn your reading list into an immersive
                    podcast feeds natively.
                </h3>

                <p className="mt-7 text-center text-[12px] font-[400] leading-5 text-[#475569] sm:text-[13px]">
                    Powered by Paystack. Secure processing guaranteed.
                </p>

                <p className="mt-2 text-center text-[11px] font-[400] leading-5 text-[#475569] underline sm:text-[12px]">
                    Cancel subscription anytime in settings
                </p>
            </section>

            {/* ====================================================
                SUBSCRIPTION CARDS
            ==================================================== */}

            <section
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-[1100px]
                    flex-col
                    items-stretch
                    gap-6
                    px-5
                    pb-12
                    pt-10
                    sm:px-8
                    lg:flex-row
                    lg:items-stretch
                    lg:justify-center
                    lg:gap-8
                    lg:px-10
                "
            >

                {/* ==================================================
                    FREE PLAN
                ================================================== */}

                <div
                    className="
                        box-border
                        w-full
                        min-w-0
                        max-w-[420px]
                        self-center
                        rounded-2xl
                        border
                        border-[#FFFFFF14]
                        bg-[#0D0D12]
                    "
                >
                    <div className="flex items-center justify-between px-6 pt-7 sm:px-8">

                        <h2 className="text-[16px] font-[600] text-[#F8FAFC]">
                            Free
                        </h2>

                        <span
                            className="
                                flex
                                h-[21px]
                                w-[70px]
                                shrink-0
                                items-center
                                justify-center
                                rounded-[4px]
                                bg-[#FFFFFF08]
                                text-[9px]
                                font-[600]
                                text-[#F8FAFC]
                            "
                        >
                            {currentPlan === "premium"
                                ? "AVAILABLE"
                                : "YOUR PLAN"}
                        </span>
                    </div>

                    {/* Price */}

                    <div className="flex items-baseline px-6 pt-5 sm:px-8">

                        <span className="text-[30px] font-[700] leading-none text-[#F8FAFC]">
                            ₦0.00
                        </span>

                        <span className="ml-1 text-[12px] font-[400] text-[#94A3B8]">
                            / month
                        </span>
                    </div>

                    {/* Description */}

                    <p className="px-6 pt-3 text-[14px] font-[400] leading-6 text-[#94A3B8] sm:px-8">
                        Standard document scanning and basic narration settings.
                    </p>

                    <div className="mx-6 mt-6 h-px bg-[#FFFFFF14] sm:mx-8" />

                    {/* Features */}

                    <div className="flex flex-col gap-4 px-6 pb-7 pt-6 sm:px-8">

                        {freeFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className="flex min-w-0 items-start gap-4"
                            >
                                <img
                                    src={assets.checkmark}
                                    alt=""
                                    className="mt-1 h-4 w-4 shrink-0"
                                />

                                <p className="min-w-0 text-[14px] font-[400] leading-5 text-[#94A3B8]">
                                    {feature}
                                </p>
                            </div>
                        ))}

                        <div className="pt-2">

                            <button
                                type="button"
                                disabled
                                className="
                                    h-[42px]
                                    w-full
                                    rounded-lg
                                    border
                                    border-[#FFFFFF14]
                                    text-[14px]
                                    font-[600]
                                    text-[#94A3B8]
                                    disabled:cursor-default
                                "
                            >
                                {currentPlan === "premium"
                                    ? "Free Tier"
                                    : "Current Tier Active"}
                            </button>

                        </div>
                    </div>
                </div>

                {/* ==================================================
                    PREMIUM PLAN
                ================================================== */}

                <div
                    className="
                        box-border
                        w-full
                        min-w-0
                        max-w-[420px]
                        self-center
                        rounded-2xl
                        border-[1.5px]
                        border-[#A855F7]
                        bg-[#11111C]
                    "
                >

                    {/* Plan Header */}

                    <div className="flex items-center justify-between px-6 pt-7 sm:px-8">

                        <h2 className="text-[20px] font-[600] text-[#F8FAFC]">
                            Premium
                        </h2>

                        <span
                            className="
                                flex
                                h-[21px]
                                w-[82px]
                                shrink-0
                                items-center
                                justify-center
                                rounded-[4px]
                                bg-[#A855F726]
                                text-[8px]
                                font-[600]
                                text-[#C084FC]
                            "
                        >
                            RECOMMENDED
                        </span>

                    </div>

                    {/* Price */}

                    <div className="flex items-baseline px-6 pt-5 sm:px-8">

                        <span className="text-[30px] font-[700] leading-none text-[#F8FAFC]">
                            ₦4,500
                        </span>

                        <span className="ml-1 text-[12px] font-[400] text-[#94A3B8]">
                            / month
                        </span>

                    </div>

                    {/* Description */}

                    <p className="px-6 pt-3 text-[14px] font-[400] leading-6 text-[#94A3B8] sm:px-8">
                        Unlock high fidelity voices with ultra-customizable controls.
                    </p>

                    <div className="mx-6 mt-6 h-px bg-[#9333EA33] sm:mx-8" />

                    {/* Features */}

                    <div className="flex flex-col gap-4 px-6 pb-7 pt-6 sm:px-8">

                        {premiumFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className="flex min-w-0 items-start gap-4"
                            >

                                <img
                                    src={assets.sparkle}
                                    alt=""
                                    className="mt-1 h-4 w-4 shrink-0"
                                />

                                <p className="min-w-0 text-[14px] font-[400] leading-5 text-[#F8FAFC]">
                                    {feature}
                                </p>

                            </div>
                        ))}

                        {/* ==================================================
                            UPGRADE BUTTON
                        ================================================== */}

                        <div className="pt-2">

                            <button
                                type="button"
                                onClick={handleUpgrade}
                                disabled={
                                    isPaymentLoading ||
                                    currentPlan === "premium"
                                }
                                className="
                                    h-[42px]
                                    w-full
                                    rounded-lg
                                    bg-gradient-to-r
                                    from-[#3B82F6]
                                    to-[#9333EA]
                                    text-[14px]
                                    font-[600]
                                    text-[#000000]
                                    transition-opacity
                                    hover:opacity-90
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {isPaymentLoading
                                    ? "Starting payment..."
                                    : currentPlan === "premium"
                                        ? "Premium Active"
                                        : "Upgrade to Premium"}
                            </button>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PlanComparison;