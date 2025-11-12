import { useState } from "react";

export const MissionVision = () => {
    const [activeTab, setActiveTab] = useState("mission");

    return (
        <section class="section about--tertiary">
            <div class="container">
                <div class="row section__row align-items-center">
                    <div class="col-lg-6 col-xl-6 col-xxl-5 section__col">
                        <div class="about--tertiary__thumb">
                            <img src="images/about-three-thumb.png" alt="Image" />
                        </div>
                    </div>
                    <div class="col-lg-6 col-xl-6 col-xxl-6 offset-xxl-1 section__col">
                        <div class="section__content">
                            <h5 class="section__content-sub-title">Our Mission & Vision</h5>
                            <h2 class="section__content-title">We are here to bring golf closer to you.</h2>
                            <div class="about--secondary__tabs">
                                <div class="about--secondary__tabs-btn-wrapper">
                                    <p
                                        onClick={() => setActiveTab("mission")}
                                        className={
                                            "about--secondary__tabs-btn " +
                                            (activeTab === "mission" ? "about--secondary__tabs-btn-active" : "")
                                        }
                                    >
                                        Our Mission
                                    </p>
                                    <p
                                        onClick={() => setActiveTab("vision")}
                                        className={
                                            "about--secondary__tabs-btn " +
                                            (activeTab === "vision" ? "about--secondary__tabs-btn-active" : "") +
                                            " "
                                        }
                                    >
                                        Our Vision
                                    </p>
                                    <p
                                        onClick={() => setActiveTab("goal")}
                                        className={
                                            "about--secondary__tabs-btn " +
                                            (activeTab === "goal" ? "about--secondary__tabs-btn-active" : "")
                                        }
                                    >
                                        Our Goal
                                    </p>
                                </div>
                                <hr />
                                <div class="about--secondary__tabs-content-wrapper">
                                    <div
                                        class="about--secondary__tabs-content"
                                        id="mission"
                                        style={{ display: activeTab === "mission" ? "block" : "none" }}
                                    >
                                        <p>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            Lorem Ipsum has been the industry's standard dummy text ever since the
                                            1500s, when an unknown printer took a galley of type and scrambled it to
                                            make a type specimen book. It has survived not only five centuries, but also
                                            the leap into electronic...
                                        </p>
                                    </div>
                                    <div
                                        class="about--secondary__tabs-content"
                                        id="vision"
                                        style={{ display: activeTab === "vision" ? "block" : "none" }}
                                        onClick={() => setActiveTab("vision")}
                                    >
                                        <p>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            Lorem Ipsum has been the industry's standard dummy text ever since the
                                            1500s, when an unknown printer took a galley of type and scrambled it to
                                            make a type specimen book. It has survived not only five centuries, but also
                                            the leap into electronic...
                                        </p>
                                    </div>
                                    <div
                                        class="about--secondary__tabs-content"
                                        id="goal"
                                        style={{ display: activeTab === "goal" ? "block" : "none" }}
                                        onClick={() => setActiveTab("goal")}
                                    >
                                        <p>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            Lorem Ipsum has been the industry's standard dummy text ever since the
                                            1500s, when an unknown printer took a galley of type and scrambled it to
                                            make a type specimen book. It has survived not only five centuries, but also
                                            the leap into electronic...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
