import Link from "next/link";
import { useState } from "react";

export const Subscription = () => {
    const [activePlan, setActivePlan] = useState("monthly");

    const handlePlanToggle = (event, planId) => {
        event.preventDefault();

        document.querySelectorAll('.plan-toggle').forEach((element) => {
            element.classList.remove('plan-active');
        });

        event.target.classList.add('plan-active');

        document.querySelectorAll('.plan-table').forEach((element) => {
            element.style.opacity = 0;
            element.style.display = 'none';
        });

        document.getElementById(planId).style.display = 'block';

        // Use a setTimeout to ensure the fade-in effect
        setTimeout(() => {
            document.getElementById(planId).style.opacity = 1;
        }, 10);

        setActivePlan(planId);
    };

    return (
        <section className="section pricing pricing--secondary" data-aos="fade-up" data-aos-delay="50">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="section__header">
                            <h5 className="section__header-sub-title">Pricing Plan</h5>
                            <h2 className="section__header-title">Our exclusive offer</h2>
                            <p>The sports activities of New Community Centre (NCC), previously managed by the NCC Managing Committee.</p>
                            <div className="toggle-plan toggle-plan-alt">
                                <a href="#monthly" className={`plan-toggle ${activePlan === 'monthly' ? 'plan-active' : ''}`} onClick={(e) => handlePlanToggle(e, 'monthly')}>Per Month</a>
                                <a href="#yearly" className={`plan-toggle ${activePlan === 'yearly' ? 'plan-active' : ''}`} onClick={(e) => handlePlanToggle(e, 'yearly')}>Per Year</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="plan-table" id="monthly" style={{ display: activePlan === 'monthly' ? 'block' : 'none', opacity: activePlan === 'monthly' ? '1' : '0' }}>
                            <div className="row justify-content-center section__row">
                                <div className="col-sm-10 col-md-6 col-lg-4 section__col">
                                    <div className="pricing__card">
                                        <div className="pricing__card-head">
                                            <div className="pricing__card-head__thumb">
                                                <i className="asmc-shot-down"></i>
                                            </div>
                                            <h2><span className="primary-text">₹</span>500<span className="primary-text"></span>
                                            </h2>
                                            <h5>6 Months</h5>
                                            <p className="secondary-text">Persons aged 18 and under.</p>
                                            <hr />
                                        </div>
                                        <div className="pricing__card-body">
                                            <ul>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>Weekday</li>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>9 hole course
                                                </li>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>10% Discount
                                                </li>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>One-time free training
                                                </li>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>100 free balls per day
                                                </li>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>Course and facility access
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="pricing__card-cta">
                                            <Link href="/coming-soon" className="cmn-button">Get Membership</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="plan-table" id="yearly" style={{ display: activePlan === 'yearly' ? 'block' : 'none' }}>
                            <div className="row justify-content-center section__row">
                                <div className="col-sm-10 col-md-6 col-lg-4 section__col">
                                    <div className="pricing__card">
                                        <div className="pricing__card-head">
                                            <div className="pricing__card-head__thumb">
                                                <i className="asmc-shot-ground"></i>
                                            </div>
                                            <h2><span className="primary-text">₹</span>1000<span className="primary-text"></span>
                                            </h2>
                                            <h5>1 Year</h5>
                                            <p className="secondary-text">For adults over 30+ years.</p>
                                            <hr />
                                        </div>
                                        <div className="pricing__card-body">
                                            <ul>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>Weekday</li>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>30 hole course
                                                </li>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>30% Discount
                                                </li>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>5+ free training
                                                </li>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>500 free balls per day
                                                </li>
                                                <li className="secondary-text"><i className="asmc-pin-checked"></i>Course and facility access
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="pricing__card-cta">
                                        <Link href="/coming-soon" className="cmn-button">Get Membership</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}