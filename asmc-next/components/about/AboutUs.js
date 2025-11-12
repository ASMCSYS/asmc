import { useGetAboutPageCmsQuery } from "@/redux/common/commonApis";
import { Fragment } from "react";

export const AboutUs = () => {
    const { data } = useGetAboutPageCmsQuery();
    return (
        <Fragment>
            <section className="section about about--alt" data-aos="fade-up" data-aos-delay="50">
                <div className="container">
                    <div className="row section__row align-items-center">
                        <div className="col-lg-6 col-xl-6 section__col">
                            <div className="section__content">
                                <h5 className="section__content-sub-title">{data?.json?.title}</h5>
                                <h2 className="section__content-title">{data?.json?.subtitle}</h2>
                                <p
                                    className="section__content-text"
                                    dangerouslySetInnerHTML={{ __html: data?.json?.text_content_left }}
                                ></p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-5 offset-xl-1 section__col">
                            <div className="about__thumb">
                                <img src={data?.json?.right_image} alt="Image" className="unset" />
                            </div>
                        </div>
                    </div>
                    <div className="row section__row align-items-center pt-5">
                        <div className="col-lg-12 col-xl-12 section__col">
                            <div className="section__content">
                                <p
                                    className="section__content-text"
                                    dangerouslySetInnerHTML={{ __html: data?.json?.text_content_center }}
                                ></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <section className="section sports" data-aos="fade-up" data-aos-delay="50">
                <div className="container">
                    <div className="row section__row">
                        <div className="col-lg-12">
                            <div className="section__content">
                                <h5 className="section__content-sub-title">Sports View</h5>
                                <h2 className="section__content-title">
                                    Play and enjoy our sports
                                </h2>
                                <p>The sports activities of New Community Centre (NCC), previously managed by the NCC Managing Committee, Physical Training Athletic and Aquatic Facility (PTAAF) activities, formerly under the jurisdiction of DCSEM, and various other sports activities conducted in Anusaktinagar and previously overseen by the BARC Staff Club, have all come under the purview of <strong>'Anushaktinagar Sports Management Committee (ASMC)’</strong>.</p>
                                <p>All members who participate in indoor and outdoor sports activities or taking coaching in any sport like Aerobics, Athletics, Badminton, Ball-badminton, Basketball, Bridge, Carrom, Chess, Cricket, Dance Fitness, Football, Gym (for gents, ladies, and unisex), Hockey, Jiu-Jutsu, Karate, Kabaddi, Lawn Tennis, Snooker & Billiards, Swimming, Table Tennis, Volleyball, and Yoga at the NCC Complex, the PTAAF Complex, Lawn Tennis courts and open grounds within Anushaktinagar, are kindly requested to renew their membership and game fees for the period of October 1, 2023, to March 31, 2024.</p>
                                <p>ASMC is an association under Mumbai Sports & Cultural Management Committee (MS&CMC)/DAE Township Advisory Committee (DTAC), Department of Atomic Energy (DAE), Govt. of India, Mumbai for carrying out Sports activities among the employees and ex- employees of DAE and their family members, stationed in Mumbai. It also organizes functions in the buildings constructed and maintained by DCSEM, Government of India, Anushaktinagar, Mumbai- 400 094.</p>
                                <p>ASMC is ASSOCIATION OF PERSONS (AOP) w.e.f. ___st day of _________2023 to encourage, monitor and manage sports activities among employees and ex-employees of DAE and their family members, stationed in Mumbai.</p>

                                <ul style={{ listStyleType: "number", marginTop: 20 }}>
                                    <li>Objectives of the ASMC are:</li>
                                    <ol style={{ listStyleType: "lower-alpha", marginLeft: 20 }}>
                                        <li>To encourage sports activities among the employees and ex- employees of DAE and their family members, stationed in Mumbai. </li>
                                        <li>Support Sports activities for students at Schools/Colleges in Anushaktinagar.</li>
                                        <li>Help the talented candidates in sports activities, but financially weak for developing their sports career.</li>
                                        <li>To operate and manage all the sports facilities.</li>
                                        <li>Carrying out all such other lawful activities as are incidental to the attainment of the above-mentioned objectives provided, they are neither political nor religious in nature.</li>
                                        <li>To foster friendship and co-operation among members and with other 	associations /organizations/clubs of common interest.</li>
                                        <li>To propose various committees and sub-committees to achieve the aims & 	objectives of the association.</li>
                                        <li>To acquire, purchase, sell, reading & exhibit material for library, sports goods for conduct of sports & games.</li>
                                        <li>To affiliate, if necessary, the ASMC to local authorized bodies, to encourage the members of the association to participate in sports activities.</li>
                                    </ol>

                                    <li>Membership & Subscription for ASMC Sports Activities:</li>

                                    <ol style={{ listStyleType: "lower-alpha", marginLeft: 20 }}>
                                        <li>The membership of the ASMC shall be open to all officials working in any of the DAE units located in Mumbai, ex-employees of any DAE units. Any family members of employees/ex-employees of any DAE units can enroll themselves as members.</li>
                                        <li>A members must pay the Annual membership fees at the beginning of the year payable in full as prescribed by the Managing Committee from time to time and the same shall not be refunded under any circumstances. A member must pay the concern game fees also as prescribed by the Managing Committee from time to time to avail the concerned facility or facilities. The game fees can be paid as decided by ASMC.</li>
                                        <li>A person willing to join ASMC shall submit his / her full contact details at ASMC office. Only on submission of full contact details and after being selected in the preliminary scrutiny process by ASMC, the person can become the member.</li>
                                        <li>The person shall be admitted as Primary / Secondary / Associate / Temporary Member of the organization and shall have to pay the stipulated annual membership fees as prescribed by the Managing Committee from time to time.</li>
                                        <li>All the membership of ASMC is restricted to annual membership only and are valid for the financial year ending 31st March.</li>
                                        <li>A record of members with all contact details shall be maintained at ASMC office.</li>
                                        <li>Membership fees is subject to revision from time to time with due notice to members.</li>
                                    </ol>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
        </Fragment>
    );
};
