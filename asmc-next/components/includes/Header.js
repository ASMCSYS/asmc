import { useFetchFacilityListQuery } from "@/redux/masters/mastersApis";
import { faChevronDown, faL, faXmark, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const Header = ({ isAuth }) => {
    const { pathname } = useRouter();
    const [isNavActive, setNavActive] = useState(false);
    const [expandNav, setExpandNav] = useState(false);
    const [isHeaderActive, setHeaderActive] = useState(false);
    const authData = useSelector((state) => state.auth.authData);

    const { data: facility, isLoading } = useFetchFacilityListQuery({
        sortBy: 1,
        sortField: "createdAt",
        active: true,
    });

    const toggleNav = () => {
        setNavActive(!isNavActive);
    };

    const closeNav = () => {
        setNavActive(false);
    };

    const toggleExpand = (e, type) => {
        e.preventDefault();
        if (expandNav === type) setExpandNav(false);
        else setExpandNav(type);
    };

    useEffect(() => {
        const handleResize = () => {
            closeNav();
            // Additional cleanup for window resize if needed
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scroll = window.scrollY;

            // Adjust the value (100 in this case) according to when you want to toggle the class
            if (scroll < 100) {
                setHeaderActive(false);
            } else {
                setHeaderActive(true);
            }
        };

        // Attach the event listener when the component mounts
        window.addEventListener("scroll", handleScroll);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header className={`header ${isHeaderActive ? "header-active" : ""}`}>
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-lg-12">
                        <nav className="nav">
                            <div className="nav__content">
                                <div className="nav__logo">
                                    <Link href="/">
                                        <Image src={"/images/logo.png"} width={300} height={56} alt="Logo" />
                                    </Link>
                                </div>
                                <div className={`nav__menu ${isNavActive && "nav__menu-active"}`}>
                                    <div className="nav__menu-logo d-flex d-xl-none">
                                        <Link href="/" className="text-center hide-nav" onClick={() => closeNav()}>
                                            <Image src={"/images/logo.png"} width={200} height={56} alt="Logo" />
                                        </Link>
                                        <Link href="/" className="nav__menu-close" onClick={() => closeNav()}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </Link>
                                    </div>

                                    <ul className="nav__menu-items">
                                        <li className="nav__menu-item nav__menu-item--dropdown">
                                            <Link href="/" className={`nav__menu-link ${pathname === "/" && "active"}`}>
                                                Home
                                            </Link>
                                        </li>
                                        {/* <li className="nav__menu-item nav__menu-item--dropdown">
                                            <Link href="/about-us/overview" className={`nav__menu-link nav__menu-link--dropdown ${pathname.includes("about-us") && 'active'} ${expandNav === "about" && 'nav__menu-link--dropdown-active'} `}>
                                                About Us
                                            </Link>
                                        </li> */}
                                        <li className="nav__menu-item nav__menu-item--dropdown">
                                            <Link
                                                href=""
                                                className={`nav__menu-link nav__menu-link--dropdown ${
                                                    ["/about-us/overview", "/about-us/fees"].includes(pathname) &&
                                                    "active"
                                                } ${expandNav === "about" && "nav__menu-link--dropdown-active"} `}
                                                onClick={(e) => toggleExpand(e, "about")}
                                            >
                                                About Us
                                                <FontAwesomeIcon icon={faChevronDown} fontSize={15} />
                                            </Link>
                                            <ul
                                                className={`nav__dropdown ${
                                                    expandNav === "about" && "nav__dropdown-active"
                                                }`}
                                            >
                                                <li>
                                                    <Link
                                                        className="nav__dropdown-item hide-nav"
                                                        href={"/about-us/overview"}
                                                    >
                                                        About ASMC
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="nav__dropdown-item hide-nav"
                                                        href={"/about-us/fees"}
                                                    >
                                                        Fees Structure
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="nav__menu-item nav__menu-item--dropdown">
                                            <Link
                                                href="/"
                                                className={`nav__menu-link nav__menu-link--dropdown ${
                                                    pathname.includes("facilities") && "active"
                                                } ${expandNav === "facilities" && "nav__menu-link--dropdown-active"} `}
                                                onClick={(e) => toggleExpand(e, "facilities")}
                                            >
                                                Facilities
                                                <FontAwesomeIcon icon={faChevronDown} fontSize={15} />
                                            </Link>
                                            <ul
                                                className={`nav__dropdown ${
                                                    expandNav === "facilities" && "nav__dropdown-active"
                                                }`}
                                            >
                                                {facility && facility.length > 0
                                                    ? facility.map((obj, key) => {
                                                          return (
                                                              <li key={key}>
                                                                  <Link
                                                                      className="nav__dropdown-item hide-nav"
                                                                      href={`/facilities/${obj.permalink}`}
                                                                  >
                                                                      {obj.title}
                                                                  </Link>
                                                              </li>
                                                          );
                                                      })
                                                    : null}
                                            </ul>
                                        </li>
                                        <li className="nav__menu-item nav__menu-item--dropdown">
                                            <Link
                                                href=""
                                                className={`nav__menu-link nav__menu-link--dropdown ${
                                                    pathname.includes("gallery") && "active"
                                                }  ${expandNav === "gallery" && "nav__menu-link--dropdown-active"} `}
                                                onClick={(e) => toggleExpand(e, "gallery")}
                                            >
                                                Gallery
                                                <FontAwesomeIcon icon={faChevronDown} fontSize={15} />
                                            </Link>
                                            <ul
                                                className={`nav__dropdown ${
                                                    expandNav === "gallery" && "nav__dropdown-active"
                                                }`}
                                            >
                                                <li>
                                                    <Link
                                                        className="nav__dropdown-item hide-nav"
                                                        href={"/gallery?type=photos"}
                                                    >
                                                        Photos
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="nav__dropdown-item hide-nav"
                                                        href={"/gallery?type=videos"}
                                                    >
                                                        Videos
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="nav__menu-item nav__menu-item--dropdown">
                                            <Link
                                                href=""
                                                className={`nav__menu-link nav__menu-link--dropdown ${
                                                    ["/events", "/faqs"].includes(pathname) && "active"
                                                } ${expandNav === "activities" && "nav__menu-link--dropdown-active"} `}
                                                onClick={(e) => toggleExpand(e, "activities")}
                                            >
                                                Activities
                                                <FontAwesomeIcon icon={faChevronDown} fontSize={15} />
                                            </Link>
                                            <ul
                                                className={`nav__dropdown ${
                                                    expandNav === "activities" && "nav__dropdown-active"
                                                }`}
                                            >
                                                <li>
                                                    <Link className="nav__dropdown-item hide-nav" href={"/events"}>
                                                        Events
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="nav__dropdown-item hide-nav" href={"/faqs"}>
                                                        FAQ
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="nav__dropdown-item hide-nav" href={"/notices"}>
                                                        Notices
                                                    </Link>
                                                </li>
                                                {/* <li>
                                                    <Link className="nav__dropdown-item hide-nav" href={"/coming-soon"}>Live Stream</Link>
                                                </li> */}
                                            </ul>
                                        </li>
                                        <li className="nav__menu-item nav__menu-item--dropdown">
                                            <Link className="nav__menu-link" href={"/contact-us"}>
                                                Contact Us
                                            </Link>
                                        </li>
                                    </ul>
                                    <div
                                        className="social"
                                        style={{
                                            margin: 0,
                                            padding: 25,
                                        }}
                                    >
                                        {isAuth ? (
                                            <div className="nav__uncollapsed-item d-md-flex profile-section">
                                                <Link
                                                    href="/dashboard"
                                                    className="border-none w-full h-full"
                                                    style={{
                                                        border: "none",
                                                        minWidth: "100%",
                                                        width: "100%",
                                                        margin: 0,
                                                    }}
                                                >
                                                    {/* Display greeting and user's first name */}
                                                    <h6 className="profile-greeting">
                                                        Hi, {authData?.name.split(" ")[0]}
                                                    </h6>
                                                    {/* Display user's profile picture */}
                                                    <img
                                                        src={authData?.profile || "/default-avatar.png"}
                                                        alt="profile"
                                                        className="profile-image"
                                                    />
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="nav__uncollapsed-item w-100">
                                                <Link
                                                    href={"/sign-in"}
                                                    className="cmn-button w-100 cmn-button--secondary"
                                                >
                                                    Sign In
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <div className="social" style={{ marginTop: 0 }}>
                                        <a href="#">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 320 512"
                                                width={10}
                                                height={20}
                                                fill="#0e7a31"
                                            >
                                                <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                                            </svg>
                                        </a>
                                        <a href="#">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                                width={15}
                                                height={30}
                                                fill="#0e7a31"
                                            >
                                                <path d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z" />
                                            </svg>
                                        </a>
                                        <a href="#">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                                width={15}
                                                height={30}
                                                fill="#0e7a31"
                                            >
                                                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                            </svg>
                                        </a>
                                        <a href="#">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                                width={15}
                                                height={30}
                                                fill="#0e7a31"
                                            >
                                                <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="nav__uncollapsed">
                                    <button
                                        className={`nav__bar d-block d-xl-none ${isNavActive && "nav__bar-toggle"}`}
                                        onClick={() => toggleNav()}
                                    >
                                        <span className="icon-bar top-bar"></span>
                                        <span className="icon-bar middle-bar"></span>
                                        <span className="icon-bar bottom-bar"></span>
                                    </button>
                                    {/* <Link href={"/cart"} className="cart">
                                        <i className="asmc-cart"></i>
                                    </Link> */}
                                    {isAuth ? (
                                        <div className="nav__uncollapsed-item d-none d-md-flex profile-section">
                                            <Link href="/dashboard" className="profile-link">
                                                {/* Display greeting and user's first name */}
                                                <h6 className="profile-greeting">Hi, {authData?.name.split(" ")[0]}</h6>
                                                {/* Display user's profile picture */}
                                                <img
                                                    src={authData?.profile || "/default-avatar.png"}
                                                    alt="profile"
                                                    className="profile-image"
                                                />
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="nav__uncollapsed-item d-none d-md-flex">
                                            <Link href={"/sign-in"} className="cmn-button cmn-button--secondary">
                                                Sign In
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
            <div className={`backdrop ${isNavActive && "backdrop-active"}`} onClick={() => closeNav()}></div>
        </header>
    );
};
