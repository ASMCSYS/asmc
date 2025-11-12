import { CloseOutlined, DownloadOutlined } from "@mui/icons-material";
import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    Radio,
    RadioGroup,
    Typography,
    Chip,
    Tooltip,
} from "@mui/material";
import { format, isValid, parseISO } from "date-fns";
import { toPng } from "html-to-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { CardContent } from "./CardContent";
import { useGetSingleMembersQuery } from "../../../store/members/membersApis";
import CreditCardIcon from "@mui/icons-material/CreditCard";
// import "./member-card.css";

export const MemberCard = ({ data, show, close }) => {
    const { data: memberData } = useGetSingleMembersQuery({ _id: data?._id }, { skip: !data?._id });
    // const [memberData, setMemberData] = useState();
    const [cardData, setCardData] = useState(null);
    const [prePrint, setPrePrint] = useState(true);
    const [brokenImages, setBrokenImages] = useState(new Set());
    const frontRef = useRef(null);
    const backRef = useRef(null);

    // Function to validate image URLs
    const validateImage = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl, { method: "HEAD" });
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    // Function to preload and validate all images
    const preloadAndValidateImages = async (containerRef) => {
        if (!containerRef.current) return;

        const images = containerRef.current.querySelectorAll("img");
        const imagePromises = Array.from(images).map(async (img) => {
            return new Promise((resolve) => {
                if (img.complete && img.naturalWidth > 0) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    img.onerror = async () => {
                        // Validate the image URL
                        const isValid = await validateImage(img.src);
                        if (!isValid) {
                            // Mark as broken and hide
                            setBrokenImages((prev) => new Set(prev).add(img.src));
                            img.style.display = "none";
                        }
                        resolve();
                    };
                }
            });
        });

        await Promise.all(imagePromises);
    };

    const handleCardGenerate = (type) => {
        if (type === "primary") {
            let payload = {
                name: data?.name,
                profile: data?.profile,
                mobile: data?.mobile,
                email: data?.email,
                chss_number: data?.chss_number,
                dob: data?.dob,

                membership_no: `P-${data?.member_id}`,
                membership_type: "Primary",
                membership_plan: data?.current_plan?.plan_name,
                relation_with_primary: "Self",
            };

            let bookingData = [];
            memberData?.bookings &&
                memberData?.bookings.map((obj, index) => {
                    if (obj?.primary_eligible) {
                        const [day, month, year] = obj?.fees_breakup?.end_date
                            ? obj?.fees_breakup?.end_date.split("/").map(Number)
                            : [];
                        const expirePlanDate = new Date(year, month - 1, day);
                        bookingData.push({
                            id: index + 1,
                            activity: obj?.activity_id?.name,
                            location: obj?.batch?.location_id?.title,
                            sublocation: obj?.batch?.sublocation_id?.title,
                            category: obj?.batch?.category_id?.title,
                            sub_category: obj?.batch?.subcategory_name,
                            valid_upto: isValid(expirePlanDate) ? format(expirePlanDate, "MMM, yyyy") : "-",
                            batch_name: obj?.batch?.batch_name,
                            is_non_dependent: obj.chss_number,
                        });
                    }
                });

            payload.bookings = bookingData;

            setCardData(payload);
        } else {
            let familyData = data?.family_details.find((obj) => obj._id === type);
            let index = data?.family_details.findIndex((obj) => obj._id === type);
            let payload = {
                name: familyData?.name,
                profile: familyData?.profile,
                mobile: familyData?.mobile || data?.mobile || "-",
                email: familyData?.email || data?.email || "-",
                chss_number: familyData?.card_number || "-",
                dob: familyData?.dob || "-",
                is_dependent: familyData?.is_dependent,

                membership_no: familyData?.id,
                membership_type: "Secondary",
                membership_plan: data?.current_plan?.plan_name,
                relation_with_primary: familyData?.relation || "-",
            };

            let bookingData = [];
            memberData?.bookings &&
                memberData?.bookings.map((obj, index) => {
                    if (!obj?.primary_eligible) {
                        if (
                            obj?.family_member &&
                            obj?.family_member.length > 0 &&
                            obj?.family_member[0]?._id === familyData?._id
                        ) {
                            const [day, month, year] = obj?.fees_breakup?.end_date.split("/").map(Number);
                            const expirePlanDate = new Date(year, month - 1, day);
                            bookingData.push({
                                id: index + 1,
                                activity: obj?.activity_id?.name,
                                location: obj?.batch?.location_id?.title,
                                sublocation: obj?.batch?.sublocation_id?.title,
                                category: obj?.batch?.category_id?.title,
                                sub_category: obj?.batch?.subcategory_name,
                                valid_upto: isValid(expirePlanDate) ? format(expirePlanDate, "MMM, yyyy") : "-",
                                batch_name: obj?.batch?.batch_name,
                            });
                        }
                    }
                });

            payload.bookings = bookingData;

            setCardData(payload);
        }
    };

    const onButtonClickFront = useCallback(() => {
        if (frontRef.current === null) {
            return;
        }

        // Pre-load and handle images before generating PNG
        const preloadImages = async () => {
            const images = frontRef.current.querySelectorAll("img");
            const imagePromises = Array.from(images).map((img) => {
                return new Promise((resolve) => {
                    if (img.complete && img.naturalWidth > 0) {
                        resolve();
                    } else {
                        img.onload = () => resolve();
                        img.onerror = () => {
                            // Mark image as broken and hide it
                            const imgSrc = img.src;
                            setBrokenImages((prev) => new Set(prev).add(imgSrc));
                            // Hide the broken image
                            img.style.display = "none";
                            resolve();
                        };
                    }
                });
            });
            await Promise.all(imagePromises);
        };

        const toPngOptions = {
            width: 1247,
            height: 1748,
            skipFonts: true,
            style: {
                fontFamily: "'Metropolis', sans-serif",
            },
            // Add image handling options
            imagePlaceholder:
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg==",
            // Skip problematic images
            skipImages: false,
            // Add timeout for image loading
            imageTimeout: 5000,
        };

        preloadImages()
            .then(() => {
                // Wait a bit more to ensure all images are processed
                return new Promise((resolve) => setTimeout(resolve, 100));
            })
            .then(() => {
                return toPng(frontRef.current, toPngOptions);
            })
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = cardData?.membership_no + "-front-card.png";
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error("Error generating front card image:", err);
                // Show user-friendly error message
                alert("Error generating card. Please try again or contact support if the issue persists.");
            });
    }, [frontRef, cardData]);

    const onButtonClickBack = useCallback(() => {
        if (backRef.current === null) {
            return;
        }

        // Pre-load and handle images before generating PNG
        const preloadImages = async () => {
            const images = backRef.current.querySelectorAll("img");
            const imagePromises = Array.from(images).map((img) => {
                return new Promise((resolve) => {
                    if (img.complete && img.naturalWidth > 0) {
                        resolve();
                    } else {
                        img.onload = () => resolve();
                        img.onerror = () => {
                            // Mark image as broken and hide it
                            const imgSrc = img.src;
                            setBrokenImages((prev) => new Set(prev).add(imgSrc));
                            // Hide the broken image
                            img.style.display = "none";
                            resolve();
                        };
                    }
                });
            });
            await Promise.all(imagePromises);
        };

        const toPngOptions = {
            width: 1247,
            height: 1748,
            skipFonts: true,
            style: {
                fontFamily: "'Metropolis', sans-serif",
            },
            // Add image handling options
            imagePlaceholder:
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg==",
            // Skip problematic images
            skipImages: false,
            // Add timeout for image loading
            imageTimeout: 5000,
        };

        preloadImages()
            .then(() => {
                // Wait a bit more to ensure all images are processed
                return new Promise((resolve) => setTimeout(resolve, 100));
            })
            .then(() => {
                return toPng(backRef.current, toPngOptions);
            })
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = cardData?.membership_no + "-back-card.png";
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error("Error generating back card image:", err);
                // Show user-friendly error message
                alert("Error generating card. Please try again or contact support if the issue persists.");
            });
    }, [backRef, cardData]);

    return (
        <Dialog
            open={show}
            onClose={() => {
                setCardData(null);
                setBrokenImages(new Set());
                close();
            }}
            maxWidth="sm"
        >
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" style={{ display: "flex", justifyContent: "space-between" }}>
                    Member Card
                </Typography>
                <IconButton onClick={() => [close(), setCardData(null), setBrokenImages(new Set())]}>
                    <CloseOutlined />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Generate Card For</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        onChange={(e) => handleCardGenerate(e.target.value)}
                    >
                        <FormControlLabel
                            value={"primary"}
                            control={<Radio />}
                            label={
                                <span>
                                    {`${data?.name} (Primary) ${data?.member_id} `}
                                    <Tooltip title={`Number of cards generated: ${data?.no_of_card_issued || 0}`}>
                                        <Chip
                                            label={data?.no_of_card_issued || 0}
                                            color="primary"
                                            size="small"
                                            sx={{ ml: 1, fontWeight: 600 }}
                                        />
                                    </Tooltip>
                                </span>
                            }
                        />
                        {data?.family_details?.map((item, index) => (
                            <FormControlLabel
                                key={item?._id || index}
                                value={`${item?._id}`}
                                control={<Radio />}
                                label={
                                    <span>
                                        {`${item?.name} (Secondary) ${item?.id} `}
                                        <Tooltip title={`Number of cards generated: ${item?.no_of_card_issued || 0}`}>
                                            <Chip
                                                label={item?.no_of_card_issued || 0}
                                                color="primary"
                                                size="small"
                                                sx={{ ml: 1, fontWeight: 600 }}
                                            />
                                        </Tooltip>
                                    </span>
                                }
                            />
                        ))}
                    </RadioGroup>
                    <FormLabel id="demo-radio-buttons-group-label">Printing Type</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="normal"
                        name="radio-buttons-group"
                        onChange={(e) => setPrePrint(e.target.value === "preprint")}
                        value={prePrint ? "preprint" : "normal"}
                    >
                        {/* <FormControlLabel value={"normal"} control={<Radio />} label={`Normal Print`} /> */}
                        <FormControlLabel value={"preprint"} control={<Radio />} label={`Pre-Print`} />
                    </RadioGroup>
                </FormControl>
                <div className="card-wrapper-container">
                    <div className="card-wrapper">
                        <CardContent cardData={cardData} prePrint={prePrint} />
                    </div>
                </div>
                <div style={{ opacity: 0, height: 0, overflow: "hidden" }}>
                    <div
                        className="main"
                        ref={frontRef}
                        style={{ backgroundColor: prePrint ? "transparent" : "#e5f4fd" }}
                    >
                        <div className="card">
                            <div className="header" style={{ opacity: prePrint ? 0 : 1 }}>
                                <img src="/assets/images/logo-icon.png" alt="logo" width="70" />
                                <h1>ANUSHAKTINAGAR SPORTS MANAGEMENT COMMITTEE (ASMC)</h1>
                            </div>
                            <div className="profile">
                                <h2 style={{ opacity: prePrint ? 0 : 1 }}>Member Profile</h2>
                                <div className="profile-details">
                                    <table>
                                        <tr>
                                            <td
                                                style={{
                                                    width: "260px",
                                                    height: "10rem",
                                                    border: "2px solid",
                                                    borderColor: prePrint ? "transparent" : "#4e889b",
                                                    color: prePrint ? "transparent" : "#000",
                                                    backgroundColor: prePrint ? "transparent" : "",
                                                }}
                                            >
                                                Name
                                            </td>
                                            <td
                                                style={{
                                                    height: "10rem",
                                                    lineBreak: "anywhere",
                                                    border: "2px solid",
                                                    borderColor: prePrint ? "transparent" : "#4e889b",
                                                }}
                                            >
                                                {cardData?.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: "260px",
                                                    border: "2px solid",
                                                    borderColor: prePrint ? "transparent" : "#4e889b",
                                                    color: prePrint ? "transparent" : "#000",
                                                    backgroundColor: prePrint ? "transparent" : "",
                                                    height: "7.2rem",
                                                }}
                                            >
                                                Mobile No.
                                            </td>
                                            <td
                                                style={{
                                                    lineBreak: "anywhere",
                                                    border: "2px solid",
                                                    borderColor: prePrint ? "transparent" : "#4e889b",
                                                }}
                                            >
                                                {cardData?.mobile}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: "260px",
                                                    border: "2px solid",
                                                    borderColor: prePrint ? "transparent" : "#4e889b",
                                                    backgroundColor: prePrint ? "transparent" : "",
                                                    height: "7.2rem",
                                                    color: prePrint ? "transparent" : "#000",
                                                }}
                                            >
                                                Email ID
                                            </td>
                                            <td
                                                style={{
                                                    lineBreak: "anywhere",
                                                    border: "2px solid",
                                                    borderColor: prePrint ? "transparent" : "#4e889b",
                                                }}
                                            >
                                                {cardData?.email}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: "260px",
                                                    border: "2px solid",
                                                    borderColor: prePrint ? "transparent" : "#4e889b",
                                                    backgroundColor: prePrint ? "transparent" : "",
                                                    height: "7.2rem",
                                                    color: prePrint ? "transparent" : "#000",
                                                }}
                                            >
                                                CHSS / ID
                                            </td>
                                            <td
                                                style={{
                                                    lineBreak: "anywhere",
                                                    border: "2px solid",
                                                    borderColor: prePrint ? "transparent" : "#4e889b",
                                                }}
                                            >
                                                {cardData?.chss_number}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    width: "260px",
                                                    border: "2px solid",
                                                    borderColor: prePrint ? "transparent" : "#4e889b",
                                                    backgroundColor: prePrint ? "transparent" : "",
                                                    height: "7.2rem",
                                                    color: prePrint ? "transparent" : "#000",
                                                }}
                                            >
                                                DOB
                                            </td>
                                            <td
                                                style={{
                                                    lineBreak: "anywhere",
                                                    border: "2px solid",
                                                    borderColor: prePrint ? "transparent" : "#4e889b",
                                                }}
                                            >
                                                {cardData?.dob
                                                    ? handleDateTimeDefault(cardData?.dob, "dd/MM/yyyy")
                                                    : "-"}
                                            </td>
                                        </tr>
                                    </table>
                                    <div
                                        className="profile-photo"
                                        style={{
                                            opacity: prePrint && !cardData?.profile ? 0 : 1,
                                            border: prePrint && !cardData?.profile ? "none" : "2px solid #4e889b",
                                        }}
                                    >
                                        {cardData?.profile && !brokenImages.has(cardData?.profile) ? (
                                            <img
                                                src={cardData?.profile}
                                                className="photo"
                                                alt="profile"
                                                onError={(e) => {
                                                    setBrokenImages((prev) => new Set(prev).add(cardData?.profile));
                                                    // Hide the broken image immediately
                                                    e.target.style.display = "none";
                                                }}
                                                style={{
                                                    display: brokenImages.has(cardData?.profile) ? "none" : "block",
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className="photo"
                                            style={{
                                                display:
                                                    !cardData?.profile || brokenImages.has(cardData?.profile)
                                                        ? "block"
                                                        : "none",
                                                backgroundColor: "#f0f0f0",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                                width: "100%",
                                                height: "100%",
                                                minHeight: "120px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "12px",
                                                color: "#666",
                                            }}
                                        >
                                            {!cardData?.profile ? "No Photo" : "Photo Unavailable"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="membership-details">
                            <h2 style={{ opacity: prePrint ? 0 : 1 }}>Membership Details</h2>
                            <div className="membership-table">
                                <table>
                                    <tr>
                                        <td
                                            style={{
                                                border: "2px solid",
                                                borderColor: prePrint ? "transparent" : "#4e889b",
                                                backgroundColor: prePrint ? "transparent" : "",
                                                color: prePrint ? "transparent" : "#000",
                                            }}
                                        >
                                            Membership No.
                                        </td>
                                        <td
                                            style={{
                                                minWidth: "700px",
                                                border: "2px solid",
                                                borderColor: prePrint ? "transparent" : "#4e889b",
                                            }}
                                        >
                                            {cardData?.membership_no}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                border: "2px solid",
                                                borderColor: prePrint ? "transparent" : "#4e889b",
                                                backgroundColor: prePrint ? "transparent" : "",
                                                color: prePrint ? "transparent" : "#000",
                                            }}
                                        >
                                            Membership Type
                                        </td>
                                        <td
                                            style={{
                                                minWidth: "700px",
                                                border: "2px solid",
                                                borderColor: prePrint ? "transparent" : "#4e889b",
                                            }}
                                        >
                                            {cardData?.membership_type}{" "}
                                            <span style={{ color: "red", fontWeight: "bold" }}>
                                                {cardData?.chss_number === "NON CHSS" ? "(Non Dependent)" : null}
                                            </span>
                                            {cardData?.membership_type === "Secondary" && (
                                                <span style={{ color: "red", fontWeight: "bold" }}>
                                                    {cardData?.is_dependent ? null : "(Non Dependent)"}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                opacity: prePrint ? 0 : 1,
                                                border: prePrint ? "none" : "2px solid #4e889b",
                                                padding: prePrint ? "16px" : "15px",
                                                color: prePrint ? "transparent" : "#000",
                                            }}
                                        >
                                            Membership Plan
                                        </td>
                                        <td
                                            style={{
                                                minWidth: "700px",
                                                border: prePrint ? "none" : "2px solid #4e889b",
                                                padding: prePrint ? "16px" : "15px",
                                            }}
                                        >
                                            {cardData?.membership_plan}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                opacity: prePrint ? 0 : 1,
                                                border: prePrint ? "none" : "2px solid #4e889b",
                                                padding: prePrint ? "16px" : "15px",
                                                color: prePrint ? "transparent" : "#000",
                                            }}
                                        >
                                            Relation With Primary
                                        </td>
                                        <td
                                            style={{
                                                minWidth: "700px",
                                                border: prePrint ? "none" : "2px solid #4e889b",
                                                padding: prePrint ? "16px" : "15px",
                                            }}
                                        >
                                            {cardData?.relation_with_primary}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div className="footer" style={{ opacity: prePrint ? 0 : 1 }}>
                            Office: NCC Complex, Opposite Post Office, Anushaktinagar
                            <br />
                            Email: asmc.dae@gmail.com; Phone: 2558 0497
                        </div>
                    </div>
                    <div
                        className="back-main"
                        ref={backRef}
                        style={{ backgroundColor: prePrint ? "transparent" : "#e5f4fd" }}
                    >
                        <div class="table-container">
                            <table>
                                <tr
                                    style={{
                                        opacity: prePrint ? 0 : 1,
                                        border: prePrint ? "none" : "2px solid #4e889b",
                                    }}
                                >
                                    <th
                                        style={{
                                            opacity: prePrint ? 0 : 1,
                                            border: prePrint ? "none" : "2px solid #4e889b",
                                            padding: prePrint ? "2px" : "0px",
                                            width: "6.6%",
                                        }}
                                    >
                                        Sr. No.
                                    </th>
                                    <th
                                        style={{
                                            opacity: prePrint ? 0 : 1,
                                            border: prePrint ? "none" : "2px solid #4e889b",
                                            padding: prePrint ? "2px" : "0px",
                                            width: "25.5%",
                                        }}
                                    >
                                        Sports Activities
                                    </th>
                                    <th
                                        style={{
                                            opacity: prePrint ? 0 : 1,
                                            border: prePrint ? "none" : "2px solid #4e889b",
                                            padding: prePrint ? "2px" : "0px",
                                            width: "20.8%",
                                        }}
                                    >
                                        Category Main / Sub
                                    </th>
                                    <th
                                        style={{
                                            opacity: prePrint ? 0 : 1,
                                            border: prePrint ? "none" : "2px solid #4e889b",
                                            padding: prePrint ? "2px" : "0px",
                                            width: "10.4%",
                                        }}
                                    >
                                        Valid Upto
                                    </th>
                                    <th
                                        style={{
                                            opacity: prePrint ? 0 : 1,
                                            border: prePrint ? "none" : "2px solid #4e889b",
                                            padding: prePrint ? "2px" : "0px",
                                            width: "23.6%",
                                        }}
                                    >
                                        Batch Name
                                    </th>
                                    <th
                                        style={{
                                            opacity: prePrint ? 0 : 1,
                                            border: prePrint ? "none" : "2px solid #4e889b",
                                            padding: prePrint ? "2px" : "0px",
                                            width: "13.2%",
                                        }}
                                    >
                                        Sign
                                    </th>
                                </tr>
                                {cardData?.bookings &&
                                    cardData?.bookings.map((obj, index) => {
                                        return (
                                            <tr>
                                                <td
                                                    style={{
                                                        border: "2px solid #4e889b",
                                                    }}
                                                >
                                                    {index + 1}
                                                </td>
                                                <td
                                                    style={{
                                                        border: "2px solid #4e889b",
                                                    }}
                                                >
                                                    <span>{obj?.activity}</span>
                                                    <span style={{ display: "block", fontSize: 35 }}>
                                                        {obj?.location ? `${obj?.location}` : ""}{" "}
                                                        {obj?.sublocation ? `(${obj?.sublocation})` : ""}
                                                    </span>
                                                </td>
                                                <td
                                                    style={{
                                                        border: "2px solid #4e889b",
                                                    }}
                                                >
                                                    <span>{obj?.category}</span>
                                                    <span style={{ display: "block", fontSize: 35 }}>
                                                        {obj?.sub_category ? `(${obj?.sub_category})` : ""}
                                                    </span>
                                                </td>
                                                <td
                                                    style={{
                                                        border: "2px solid #4e889b",
                                                    }}
                                                >
                                                    {obj?.valid_upto}
                                                </td>
                                                <td
                                                    style={{
                                                        border: "2px solid #4e889b",
                                                    }}
                                                >
                                                    {obj?.batch_name}
                                                </td>
                                                <td
                                                    style={{
                                                        border: "2px solid #4e889b",
                                                    }}
                                                ></td>
                                            </tr>
                                        );
                                    })}
                            </table>
                        </div>
                    </div>
                </div>
            </DialogContent>
            {/* {cardData && ( */}
            <DialogActions>
                <Button onClick={close}>Close</Button>
                <Button onClick={onButtonClickFront}>Front Download</Button>
                <Button onClick={onButtonClickBack}>Back Download</Button>
            </DialogActions>
            {/* )} */}
        </Dialog>
    );
};
