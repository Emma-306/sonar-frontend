import React from 'react';
import SonarOrb from '../components/SonarOrb';
import { assets } from '../assets/assets';

const PlanComparison = () => {
    return (
        
        <div className="
            min-h-screen
            bg-[#000000]
            text-white
        ">
            
            <nav className="
                flex
                items-center
                justify-between
                px-[20px]
                sm:px-[32px]
                lg:px-[64px]
                pt-[24px]
            ">

                {/* Logo */}
                <div>
                    <img
                        src={assets.brandLogo2}
                        alt="Sonar"
                    />
                </div>

                {/* Back to App */}
                <button className="
                    w-[100px]
                    h-[18px]
                    text-[#94A3B8]
                    font-[400]
                    text-[14px]
                ">
                    Back to app
                </button>
            </nav>

            {/* Header */}
            <section className="
                flex
                flex-col
                items-center
                text-center
                mt-[50px]
                sm:mt-[60px]
                lg:mt-[80px]
            ">

                {/* Main Heading */}
                <h1 className="
                    w-full
                    max-w-[600px]
                    px-[20px]
                    font-[700]
                    text-[26px]
                    sm:text-[30px]
                    lg:text-[32px]
                    text-[#F8FAFC]
                    font-libre
                ">
                    Upgrade Your Reading Experience
                </h1>

                {/* Subtitle */}
                <h3 className="
                    mt-[10px]
                    w-full
                    max-w-[600px]
                    px-[20px]
                    font-[400]
                    text-[14px]
                    sm:text-[15px]
                    lg:text-[16px]
                    text-[#94A3B8]
                ">
                    Ditch the screen. Turn your reading list into an immersive podcast feeds natively.
                </h3>

                {/* Payment Information */}
                <p className="
                    mt-[30px]
                    h-[17px]
                    text-[13px]
                    font-[400]
                    text-[#475569]
                ">
                    Powered by Paystack. Secure processing guaranteed. 
                </p>

                <p className="
                    mt-[10px]
                    h-[16px]
                    font-[400]
                    text-[12px]
                    text-[#475569]
                    underline
                ">
                    Cancel subscription anytime in settings
                </p>
            </section>

            {/* Subscription Cards */}
            <section className="
                flex
                flex-col
                lg:flex-row
                justify-center
                items-center
                gap-[24px]
                lg:gap-[32px]
                mt-[40px]
                px-[20px]
                pb-[40px]
            ">
                
                {/* Free Plan */}
                <div className="
                    w-full
                    max-w-[420px]
                    h-[471px]
                    rounded-[16px]
                    bg-[#0D0D12]
                    border-[1px]
                    border-[#FFFFFF14]
                ">

                    {/* Free Plan Header */}
                    <div className="
                    flex
                    items-center
                    justify-between
                    px-[24px]
                    lg:px-[32px]
                    pt-[28px]
                    ">

                        <h2 className="
                            text-[16px]
                            font-[600]
                            text-[#F8FAFC]
                        ">
                            Free
                        </h2>

                        <span className="
                            flex
                            items-center
                            justify-center
                            rounded-[4px]
                            w-[70px]
                            h-[21px]
                            bg-[#FFFFFF08]
                            text-[10px]
                            font-[600]
                        ">
                            YOUR PLAN
                        </span>
                    </div>

                    {/* Free Price */}
                    <div className="
                        flex
                        items-baseline
                        px-[32px]
                        mt-[18px]
                    ">
                        <span className="
                            text-[30px]
                            font-[700]
                            text-[#F8FAFC]
                        ">
                            ₦0.00
                        </span>

                        <span className="
                            ml-[5px]
                            text-[12px]
                            font-[400]
                            text-[#94A3B8]
                        ">
                            / month
                        </span>
                    </div>

                    {/* Plan Info */}
                    <div className="
                        w-full
                        max-w-[340px]
                        h-auto
                        px-[32px]
                        mt-[10px]
                        font-[400]
                        text-[14px]
                        text-[#94A3B8]
                    ">
                        Standard document scanning and basic narration settings.
                    </div>

                    {/* Divider */}
                    <div className="
                        w-full
                        max-w-[340px]
                        mx-[32px]
                        mt-[24px]
                        h-[1px]
                        bg-[#FFFFFF14]
                    " />

                    {/* Free Feature List */}
                    <div className="
                        flex
                        flex-col
                        gap-[16px]
                        px-[32px]
                        mt-[24px]
                    ">

                        {/* Feature 1 */}
                        <div className="
                            flex
                            items-center
                            gap-[16px]
                        ">
                            <img
                                src={assets.checkmark}
                                alt=" "
                                className="
                                    w-[16px]
                                    h-[16px]
                                    shrink-0
                                "
                            />

                            <p className="
                                text-[14px]
                                font-[400]
                                text-[#94A3B8]
                            ">
                                Basic voice options & standard narrators
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="
                            flex
                            items-center
                            gap-[16px]
                        ">
                            <img
                                src={assets.checkmark}
                                alt=" "
                                className="
                                    w-[16px]
                                    h-[16px]
                                    shrink-0
                                "
                            />

                            <p className="
                                text-[14px]
                                font-[400]
                                text-[#94A3B8]
                            ">
                                3 PDF document uploads per day limit
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="
                            flex
                            items-center
                            gap-[16px]
                        ">
                            <img
                                src={assets.checkmark}
                                alt=" "
                                className="
                                    w-[16px]
                                    h-[16px]
                                    shrink-0
                                "
                            />

                            <p className="
                                text-[14px]
                                font-[400]
                                text-[#94A3B8]
                            ">
                                Standard speeds (0.75x to 1.5x only)
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="
                            flex
                            items-center
                            gap-[16px]
                        ">
                            <img
                                src={assets.checkmark}
                                alt=" "
                                className="
                                    w-[16px]
                                    h-[16px]
                                    shrink-0
                                "
                            />

                            <p className="
                                text-[14px]
                                font-[400]
                                text-[#94A3B8]
                            ">
                                Automatic line-by-line word highlighting
                            </p>
                        </div>

                        {/* Free Subscription Button */}
                        <div className="
                            pt-[12px]
                        ">
                            <button className="
                                w-full
                                h-[42px]
                                rounded-[8px]
                                border-[1px]
                                border-[#FFFFFF14]
                                text-[14px]
                                font-[600]
                                text-[#94A3B8]
                            ">
                                Current Tier Active
                            </button>
                        </div>

                    </div>

                </div>

                {/* Pro Plan */}
                <div className="
                    w-full
                    max-w-[420px]
                    sm:h-auto
                    rounded-[16px]
                    bg-[#11111C]
                    border-[1.5px]
                    border-[#A855F7]
                ">
                    {/* Pro Plan Header */}
                    <div className="
                    flex
                    items-center
                    justify-between
                    px-[24px]
                    lg:px-[32px]
                    pt-[28px]
                    ">

                        <h2 className="
                            text-[20px]
                            font-[600]
                            text-[#F8FAFC]
                        ">
                            Pro
                        </h2>

                        <span className="
                            flex
                            items-center
                            justify-center
                            rounded-[4px]
                            w-[82px]
                            h-[21px]
                            bg-[#A855F726]
                            text-[8px]
                            text-[#C084FC]
                            font-[600]
                        ">
                            RECOMMENDED
                        </span>
                    </div>

                    {/* Price */}
                    <div className="
                        flex
                        items-baseline
                        px-[32px]
                        mt-[18px]
                    ">
                        <span className="
                            text-[30px]
                            font-[700]
                            text-[#F8FAFC]
                        ">
                            ₦4,500
                        </span>

                        <span className="
                            ml-[5px]
                            text-[12px]
                            font-[400]
                            text-[#94A3B8]
                        ">
                            / month
                        </span>
                    </div>

                    {/* Pro Plan Info */}
                    <div className="
                        w-full
                        max-w-[340px]
                        h-auto
                        px-[32px]
                        mt-[10px]
                        font-[400]
                        text-[14px]
                        text-[#94A3B8]
                    ">
                        Unlock high fidelity voices with ultra-customizable controls.
                    </div>

                    {/* Divider */}
                    <div className="
                        w-full
                        max-w-[340px]
                        mx-[32px]
                        mt-[24px]
                        h-[1px]
                        bg-[#9333EA33]
                    " />

                    {/* Pro Feature List */}
                    <div className="
                        flex
                        flex-col
                        gap-[16px]
                        px-[32px]
                        mt-[24px]
                    ">

                        {/* Feature 1 */}
                        <div className="
                            flex
                            items-center
                            gap-[16px]
                        ">
                            <img
                                src={assets.sparkle}
                                alt=" "
                                className="
                                    w-[16px]
                                    h-[16px]
                                    shrink-0
                                "
                            />

                            <p className="
                                text-[14px]
                                font-[400]
                                text-[#F8FAFC]
                            ">
                                Premium natural human-like voice options
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="
                            flex
                            items-center
                            gap-[16px]
                        ">
                            <img
                                src={assets.sparkle}
                                alt=" "
                                className="
                                    w-[16px]
                                    h-[16px]
                                    shrink-0
                                "
                            />

                            <p className="
                                text-[14px]
                                font-[400]
                                text-[#F8FAFC]
                            ">
                                Up to 10 PDF document uploads per day
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="
                            flex
                            items-center
                            gap-[16px]
                        ">
                            <img
                                src={assets.sparkle}
                                alt=" "
                                className="
                                    w-[16px]
                                    h-[16px]
                                    shrink-0
                                "
                            />

                            <p className="
                                text-[14px]
                                font-[400]
                                text-[#F8FAFC]
                            ">
                                Generate and download offline audio MP3s
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="
                            flex
                            items-center
                            gap-[16px]
                        ">
                            <img
                                src={assets.sparkle}
                                alt=" "
                                className="
                                    w-[16px]
                                    h-[16px]
                                    shrink-0
                                "
                            />

                            <p className="
                                text-[14px]
                                font-[400]
                                text-[#F8FAFC]
                            ">
                                Wider playback speeds (0.5x to 2x granular)
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="
                            flex
                            items-center
                            gap-[16px]
                        ">
                            <img
                                src={assets.sparkle}
                                alt=" "
                                className="
                                    w-[16px]
                                    h-[16px]
                                    shrink-0
                                "
                            />

                            <p className="
                                text-[14px]
                                font-[400]
                                text-[#F8FAFC]
                            ">
                                24/7 Priority support and custom voice models
                            </p>
                        </div>

                        {/* Pro Subscription Button */}
                        <div className="
                            pt-[12px]
                            pb-[60px]
                        ">
                            <button className="
                                w-full
                                max-w-[340px]
                                h-[42px]
                                rounded-[8px]
                                bg-gradient-to-r from-[#3B82F6] to-[#9333EA]
                                text-[14px]
                                font-[600]
                                text-[#000000]
                            ">
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PlanComparison;