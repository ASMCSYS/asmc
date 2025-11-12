import { setCookie } from 'cookies-next';
import { format } from 'date-fns';
import { Fragment } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export const TermsConditionModal = ({ handleAgree }) => {

    return (
        <section class="privacy-policy pt-5 pb-5">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-12">
                        <div class="privacy-policy__inner" style={{ backgroundColor: "rgba(12, 169, 64, 0.05)" }}>
                            <div class="privacy-policy__single">
                                <h5>Terms and Conditions</h5>
                                <p class="secondary-text">
                                    Welcome to <a href='https://asmcdae.in/' target="_blank">https://asmcdae.in/</a>,  by accessing or using our website, you agree to be bound by the following terms and conditions. Please read them carefully before using the service.
                                </p>
                                <ol>
                                    <li>
                                        Acceptance of Terms
                                        <br />
                                        By accessing and using <a href="https://asmcdae.in/" target="_blank">https://asmcdae.in/</a>, you agree to comply with these Terms and Conditions. If you do not agree to these terms, you should not use the website.
                                    </li>
                                    <li>
                                        Use of the Website
                                        <br />
                                        You agree to use the website in compliance with all applicable regulations. You will not use the website for any unlawful purpose or to solicit others to perform or participate in any illegal activities.
                                    </li>
                                    <li>
                                        Intellectual Property
                                        <br />
                                        All content on this website, including text, graphics, logos, and images, is the property of <a href="https://asmcdae.in/" target="_blank">https://asmcdae.in/</a>. You may not use, reproduce, or distribute any content without our express permission.
                                    </li>
                                    <li>
                                        User Accounts
                                        <br />
                                        You are responsible for maintaining the confidentiality of your account information and password. You agree to notify us immediately of any unauthorized use of your account.
                                    </li>
                                    <li>
                                        Termination of Use
                                        <br />
                                        We reserve the right to suspend or terminate your access to the website at any time, without notice, for any reason, including if we believe you have violated these terms.
                                    </li>
                                    <li>
                                        Limitation of Liability
                                        <br />
                                        <a href="https://asmcdae.in/" target="_blank">https://asmcdae.in/</a> is not liable for any damages arising from your use of the website. This includes, but is not limited to, direct, indirect, incidental, or consequential damages.
                                    </li>
                                    <li>
                                        Privacy Policy
                                        <br />
                                        Your use of the website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. Please read the Privacy Policy carefully.
                                    </li>
                                    <li>
                                        Changes to the Terms
                                        <br />
                                        We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting. By continuing to use the website after such changes, you agree to be bound by the modified terms.
                                    </li>
                                    <li>
                                        Contact Us
                                        <br />
                                        If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:info@asmcdae.in">info@asmcdae.in</a> or <a href="mailto:asmc.dae@gmail.com">asmc.dae@gmail.com</a>.
                                    </li>
                                </ol>
                            </div>
                            <div className="d-flex justify-content-center pt-5">
                                <button className="cmn-button cmn-button--secondary" onClick={() => handleAgree()}>Agree and Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}