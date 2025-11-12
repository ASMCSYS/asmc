import React, { useState, Fragment } from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Chip, IconButton, TableCell, TableRow, Typography } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import { OfflinePaymentModal } from "../../Common/OfflinePaymentModal";
import TableCommon from "../../Common/Table";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useDeleteMembersMutation } from "../../../store/members/membersApis";
import { handleDateTimeDefault, parseStringDate } from "../../../helpers/utils";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { MemberHistoryModal } from "../../Common/MemberHistoryModal";
import { isAuth } from "../../../helpers/cookies";
import { parseISO } from "date-fns";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import HasPermission from "../../Common/HasPermission";
import { PERMISSIONS } from "../../../helpers/constants";

const MembersTableComponent = ({
    loading,
    fetching = false,
    count,
    data,
    edit,
    convert,
    pagination,
    handlePagination,
    generateCard,
    getActivityList,
    getMembersList,
}) => {
    const [handleDelete] = useDeleteMembersMutation();
    const [showPayment, setShowPayment] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [paymentInitialValue, setPaymentInitialValue] = useState({});

    let columns = [
        {
            title: "",
        },
        {
            title: "Sr. No.",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Photo",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Member Id",
            field: "member_id",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Personal Details",
            sort: false,
            minWidth: 170,
        },
        {
            title: "CHSS",
            sort: false,
            minWidth: 170,
        },
        {
            title: "Plan",
            sort: true,
            field: "current_plan.plan_name",
            minWidth: 170,
        },
        ...(isAuth()?.roles === "super"
            ? [
                  {
                      title: "Last Payment Date",
                      sort: false,
                      minWidth: 120,
                  },
              ]
            : []),
        {
            title: "Created At",
            field: "createdAt",
            sort: true,
            minWidth: 90,
        },
        {
            title: "Action",
            name: "",
            sort: false,
            minWidth: 200,
        },
    ];

    const deleteManage = (_id, converted) => {
        if (window.confirm("Are you sure you want to delete?")) {
            if (converted) {
                alert("This member is converted to user, kindly delete the user first and then member.");
                return false;
            }
            handleDelete({ _id });
        }
    };

    const handlePaymentModal = (row) => {
        setShowPayment(true);

        setPaymentInitialValue({
            member_id: row._id,
            payment_file: "",
            amount_paid: row?.current_plan?.final_amount,
            plan_id: row.current_plan?.plan_id,
            payment_status: "Success",
            payment_verified: true,
            remarks: "",
            payment_mode: "Cheque",
            createdAt: "",
        });
    };

    const renderTableData =
        !loading && data && data.length > 0 ? (
            data.map(function (row, index) {
                const endDate = parseStringDate(row?.current_plan?.end_date);
                const planExpired = endDate ? endDate < new Date() : true;

                return (
                    <ExpandableTableRow
                        key={row._id}
                        expandComponent={<ExtraComponent data={row} />}
                        sx={{
                            "td, th": {
                                borderBottom: 1,
                                borderBottomColor: "divider",
                                padding: "10px",
                                cursor: "pointer",
                            },
                        }}
                    >
                        <TableCell align="center">{index + 1 + pagination.pageNo * pagination.limit}</TableCell>
                        <TableCell align="center">
                            <img src={row.profile} alt="Profile" width={50} style={{ borderRadius: "50%" }} />
                        </TableCell>
                        <TableCell align="center">
                            <Button variant="outlined" onClick={() => setShowHistory(row.member_id)}>
                                {row.member_id}
                            </Button>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">{row.name}</Typography>
                            <Typography variant="subtitle2">{row.email}</Typography>
                            <Typography variant="subtitle2">{row.mobile}</Typography>
                            <Typography variant="subtitle2">Gender: {row.gender}</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">{row?.chss_number}</Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">{row?.current_plan?.plan_name || "-"}</Typography>
                            <Chip
                                color={!planExpired && row?.fees_paid ? "success" : "error"}
                                label={!planExpired && row?.fees_paid ? "Active & Paid" : "Expired / Not Paid"}
                            />
                        </TableCell>
                        {isAuth()?.roles === "super" && (
                            <TableCell align="center">
                                <Typography variant="subtitle2">
                                    {row?.last_payment_date ? handleDateTimeDefault(row?.last_payment_date) : "-"}
                                </Typography>
                            </TableCell>
                        )}
                        <TableCell align="center">
                            <Typography variant="subtitle2">{handleDateTimeDefault(row?.createdAt)}</Typography>
                            <Typography variant="subtitle2">{handleDateTimeDefault(row?.convertedAt)}</Typography>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                            <HasPermission permission={PERMISSIONS.MEMBERS.UPDATE} fallback={null}>
                                <IconButtonIcons
                                    title="Edit"
                                    IconComponent={EditIcon}
                                    color="warning"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        edit(row, "Edit");
                                    }}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.MEMBERS.READ} fallback={null}>
                                <IconButtonIcons
                                    title="View"
                                    IconComponent={EyeIcon}
                                    color="info"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        edit(row, "View");
                                    }}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.MEMBERS.CONVERT_TO_USER} fallback={null}>
                                {!row.converted && (
                                    <IconButtonIcons
                                        title="Convert to User"
                                        IconComponent={AutorenewIcon}
                                        color="success"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            convert(row._id);
                                        }}
                                    />
                                )}
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.MEMBERS.GENERATE_CARD} fallback={null}>
                                <IconButtonIcons
                                    title="Generate Card"
                                    IconComponent={NoteAddIcon}
                                    color="success"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        generateCard(row);
                                    }}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.MEMBERS.UPDATE} fallback={null}>
                                {!row.fees_paid && (
                                    <IconButtonIcons
                                        title="Pay Fees"
                                        IconComponent={CurrencyRupeeIcon}
                                        color="success"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePaymentModal(row);
                                        }}
                                    />
                                )}
                            </HasPermission>
                        </TableCell>
                    </ExpandableTableRow>
                );
            })
        ) : (
            <TableRow sx={{ "td, th": { border: 0, padding: "10px" } }}>
                <TableCell colSpan={10} align="center">
                    Data not found
                </TableCell>
            </TableRow>
        );

    return (
        <Fragment>
            <TableCommon
                columns={columns}
                tableData={renderTableData}
                count={count}
                loading={loading || fetching}
                pagination={pagination}
                handlePagination={handlePagination}
            />
            <OfflinePaymentModal show={showPayment} close={() => setShowPayment(false)} data={paymentInitialValue} />
            <MemberHistoryModal
                show={showHistory}
                close={() => setShowHistory(false)}
                getActivityList={getActivityList}
                getMembersList={getMembersList}
            />
        </Fragment>
    );
};

export default MembersTableComponent;

const ExpandableTableRow = ({ children, expandComponent, ...otherProps }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <>
            <TableRow {...otherProps} onClick={() => setIsExpanded(!isExpanded)}>
                <TableCell padding="checkbox">
                    <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                {children}
            </TableRow>
            {isExpanded && (
                <TableRow>
                    <TableCell padding="checkbox" />
                    {expandComponent}
                </TableRow>
            )}
        </>
    );
};

const ExtraComponent = ({ data }) => {
    return (
        <TableCell colSpan={10}>
            {data?.family_details?.length ? (
                <div>
                    <Typography variant="h6">Family Members</Typography>
                    {data.family_details.map((member, idx) => (
                        <div key={idx} style={{ marginBottom: "10px" }}>
                            <Typography variant="subtitle2">
                                <strong>Id:</strong> {member.id}
                            </Typography>
                            <Typography variant="subtitle2">
                                <strong>Name:</strong> {member.name}
                            </Typography>
                            <Typography variant="subtitle2">
                                <strong>Gender:</strong> {member.gender}
                            </Typography>
                            <Typography variant="subtitle2">
                                <strong>Relation:</strong> {member.relation}
                            </Typography>
                            <Typography variant="subtitle2">
                                <strong>DOB:</strong> {handleDateTimeDefault(member.dob)}
                            </Typography>
                            {member?.plans?.end_date && (
                                <Fragment>
                                    <Typography variant="subtitle2">
                                        <strong>Plan Name:</strong> {member?.plans?.plan_name}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        <strong>Plan Expire on:</strong> {member?.plans?.end_date}
                                    </Typography>
                                </Fragment>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <Typography variant="subtitle2">No family details</Typography>
            )}
        </TableCell>
    );
};
