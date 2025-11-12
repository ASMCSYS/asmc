import { Header } from '@/components/includes/Header';
import Head from "next/head";
import { Footer } from '@/components/includes/Footer';
import { Banner } from '@/components/common/Banner';
import ScrollProgressBar from '@/components/common/ScrollProgressBar';
import { ValidateAuth } from '@/components/auth/ValidateAuth';
import { useSelector } from 'react-redux';

const PrivacyPolicy = () => {
    const { isAuth } = useSelector((state) => state.auth);
    return (
        <>
            <Head>
                <title>Sign In | ASMC | Anushaktinagar Sports Management Committee</title>
                <meta name="description" content="Anushaktinagar Sports Management Committee" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <link rel="icon" href="/favicon.ico" />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>
            <main>
                <ValidateAuth redirect={false} />
                <Header isAuth={isAuth} />
                <ScrollProgressBar />
                <Banner title={"Privacy Policy"} breadcrumbs={[{ title: "Home", link: "/" }, { title: "Privacy Policy" }]} />
                <section class="section privacy-policy" data-aos="fade-up" data-aos-delay="50">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-10 col-xl-8">
                                <div class="privacy-policy__inner">
                                    <div class="privacy-policy__single">
                                        <h5>Rules Regulations & Privacy Policy</h5>
                                        <p class="secondary-text">
                                            ASMC is an association under Mumbai Sports & Cultural Management Committee (MS&CMC)/DAE Township Advisory Committee (DTAC), Department of Atomic Energy (DAE), Govt. of India, Mumbai for carrying out Sports activities among the employees and ex-employees of DAE and their family members, stationed in Mumbai.
                                        </p>
                                    </div>
                                    <hr />
                                    <div class="privacy-policy__single">
                                        <h5>Rules & Regulations</h5>
                                        <p class="secondary-text">
                                            Our Rules & Regulations policy is subject to change at any time without prior notice. To stay informed about any updates, we recommend reviewing this policy regularly. For detailed Rules & Regulations, please visit ASMC office.
                                        </p>
                                        <ol>
                                            <li>Membership is open to individuals associated with the Department of Atomic Energy (DAE) and their families.</li>
                                            <li>To become ASMC Member it is mandatory to pay membership fees.</li>
                                            <li>To participate in various coaching programs arranged by ASMC, it is not necessary to become ASMC member.</li>
                                            <li>In addition to the membership fee, it is required to pay applicable sport fee for participating in any of the ASMC activity.</li>
                                            <li>Membership fees and sport fees shall be determined by the ASMC and are subject to change with prior notice.</li>
                                            <li>Non-payment of membership fees and sport fees within the stipulated period may result in the suspension or termination of membership.</li>
                                            <li>ASMC facilities may be closed for up to two weeks each year, and sport fees have been calculated with this potential closure in mind.</li>
                                            <li>Membership fees are non-refundable/non-transferable under any circumstances. Refund for sport fees and coaching fees are decided by ASMC management committee following applicable policy.</li>
                                        </ol>
                                    </div>
                                    <hr />
                                    <div class="privacy-policy__single">
                                        <h5>General Conduct and Etiquette:</h5>
                                        <ol>
                                            <li>All members, staff and visitors are expected to conduct themselves in a respectful and courteous manner towards others within the premises of the ASMC facilities.</li>
                                            <li>Any behaviour that is deemed offensive, abusive, or discriminatory towards others will not be tolerated and may result in disciplinary action.</li>
                                            <li>Members shall adhere to the instructions and guidelines provided by the ASMC staff during activities and events.</li>
                                            <li>The use of foul language, harassment, or any form of intimidation is strictly prohibited.</li>
                                            <li>Members are responsible for the conduct and behaviour of their guests while within the ASMC premises.</li>
                                        </ol>
                                    </div>
                                    <hr />
                                    <div class="privacy-policy__single">
                                        <h5>Facility Usage and Safety:</h5>
                                        <ol>
                                            <li>Few of the premises of ASMC are under CCTV surveillance 24 X 7 for security purposes. Members should respect the privacy and safety of others.</li>
                                            <li>The use of any ASMC facility should be in accordance with the designated timings and rules established by the ASMC Managing Committee.</li>
                                            <li>Members should take care of the equipment and facilities provided and report any damages or malfunctions to the ASMC staff promptly.</li>
                                            <li>Smoking, consumption of alcohol, or use of any illegal/banned substances are strictly prohibited within the ASMC premises.</li>
                                            <li>Members are responsible for their personal belongings. The ASMC will not be liable for any loss, theft, or damage to personal property.</li>
                                        </ol>
                                    </div>
                                    <hr />
                                    <div class="privacy-policy__single">
                                        <h5>Photography or videography</h5>
                                        <p class="secondary-text">
                                            Photography or videography within the ASMC premises using electronic gadgets, for the purpose of publishing on social media or use as evidence, is prohibited without prior permission from the Managing Committee. Members must obtain explicit written consent. Requests for permission should be submitted to the ASMC office, stating the purpose, duration and intended use of the photographs or videos. Unauthorized photography or videography may result in disciplinary action.
                                        </p>
                                    </div>
                                    <hr />
                                    <div class="privacy-policy__single">
                                        <h5>Grievance and Disciplinary Actions:</h5>
                                        <ol>
                                            <li>Any grievances or complaints should be brought to the attention of the ASMC in writing or via email.</li>
                                            <li>The ASMC reserves the right to take disciplinary action, including warning, suspension, or termination of membership, in cases of violation of the rules and regulations or any misconduct that adversely affects the ASMC facilities or its eco-system.</li>
                                            <li>Members have the right to appeal against any disciplinary action imposed by the ASMC. The appeal should be submitted in writing within a specified period, as communicated by the ASMC to individual.</li>
                                        </ol>
                                    </div>
                                    <hr />
                                    <div class="privacy-policy__single">
                                        <h5>Member Responsibilities and Participation:</h5>
                                        <ol>
                                            <li>By agreeing to utilise ASMC sports facilities, members acknowledge and agree to abide by the rules and regulations set forth by the ASMC.</li>
                                            <li>Members confirm that they are physically fit and capable of participating in the particular ASMC activities. It is the responsibility of each member to assess their own physical condition and consult with a medical professional if necessary.</li>
                                            <li>Members shall adhere to the assigned batch timings for their activities. Any request for a change in batch timing must be made in writing to the ASMC office and changes will be subject to availability and management discretion. The ASMC reserves the right to change the batch of any participant to ensure smooth functioning of the activity and healthy atmosphere of its activities.</li>
                                            <li>Members are expected to conduct themselves in a manner that does not disturb or disrupt fellow participants during activities and events of the ASMC.</li>
                                            <li>Members understand and acknowledge that the ASMC will not be held responsible for any injuries or accidents that may occur during any activity. It is the sole responsibility of each member to exercise caution and follow safety guidelines while participating in ASMC activities.</li>
                                            <li>Members accept that the trainers/instructors provided by the ASMC for coaching programs and activities are acceptable.</li>
                                            <li>Members shall extend their full cooperation to the ASMC for the smooth functioning of activities, events and any administrative formalities.</li>
                                        </ol>
                                    </div>
                                    <hr />
                                    <div class="privacy-policy__single">
                                        <h5>Terms & Conditions:</h5>
                                        <ol>
                                            <li>Online payment is intended for members use only.</li>
                                            <li>Online payment transaction may take up to 24 Hours to reflect in system.</li>
                                            <li>ASMC will not be responsible if online transaction fails due to network /internet issues.</li>
                                            <li>By using ASMC Website you agree to be responsible for maintaining the confidentiality of member’s username and Password.</li>
                                        </ol>
                                    </div>
                                    <hr />
                                    <div class="privacy-policy__single">
                                        <h5>Privacy Policy:</h5>
                                        <ol>
                                            <li>We value the trust you place in us at ASMC. Please read the following statement to learn about our information gathering and dissemination practices.</li>
                                            <li>We view protection of your privacy as a very important principle and we understand clearly that You and Your Personal Information is one of our most important assets.</li>
                                            <li>Our privacy policy is subject to change without notice at any time, to make sure you are aware of any changes, please review this policy periodically.</li>
                                            <li>By using ASMC website you agree all the terms and conditions of AMSC.</li>
                                            <li>Credit Card / Debit Card / Net banking details are not stored on our website/servers.</li>
                                            <li>Only Online transaction records are stored on website for further accounting references.</li>
                                            <li>ASMC does not share member’s personal information with any other third party domain outside ASMC.</li>
                                            <li>It is important for you to protect yourself against unauthorised access to your password and to your computer during online transactions.</li>
                                            <li>Please make sure to sign off when you finish using a shared computer for online transaction.</li>
                                        </ol>
                                    </div>
                                    <hr />
                                    <div class="privacy-policy__single">
                                        <h5>Refund Policy:</h5>
                                        <p class="secondary-text">
                                            Refunds for memberships, sport fees, or facility bookings will only be issued under special circumstances, such as prolonged facility closure or service disruption, as determined by ASMC management. All refund requests must be submitted in writing and are subject to approval. Please note that partial refunds may be granted based on the specific situation, and processing times may vary.
                                        </p>
                                        <ol>
                                            <li>Payment made via online payment towards memberships, sport fees, or facility bookings cannot be refunded online.</li>
                                            <li>All refunds, after approval of managing committee, will be made through cheque/ NEFT only.</li>
                                            <li>Any discrepancy should be reported to ASMC office except Sundays & Holidays.</li>
                                            <li>While availing any of the payment method/s available on the Website/ App, we will not be responsible or assume any liability, whatsoever in respect of any loss or damage arising directly or indirectly to you due to:</li>
                                            <ol>
                                                <li>Lack of authorization for any transaction/s, or</li>
                                                <li>Exceeding the preset limit mutually agreed by You and between “Bank/s”, or</li>
                                                <li>Any payment issues arising out of the transaction, or</li>
                                                <li>Decline of transaction for any other reason/s</li>
                                            </ol>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </main>
        </>
    );
};

export default PrivacyPolicy;
