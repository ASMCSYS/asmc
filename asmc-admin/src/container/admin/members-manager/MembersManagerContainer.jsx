import React, { useCallback, useEffect, useRef } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Grid,
    Paper,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import MembersTableComponent from "../../../components/admin/members-manager/MembersTable";
import { MembersAddDrawer } from "../../../components/admin/members-manager/MembersAddDrawer";
import { useGetMembersListQuery, useConvertToUserMutation } from "../../../store/members/membersApis";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useDispatch } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BulkImportMembers } from "../../../components/admin/members-manager/BulkImportMembers";
import domToImage from "dom-to-image";
import { SearchRecords } from "../../../components/Common/SearchRecords";
import { defaultPaginate, MemberPermission, PERMISSIONS } from "../../../helpers/constants";
import { MemberCard } from "../../../components/admin/members-manager/MemberCard";
import ExportData from "../../../components/Common/ExportData";
import HasPermission from "../../../components/Common/HasPermission";

const MembersManagerContainer = (props) => {
    const dispatch = useDispatch();
    const { showDrawer, formType, initialValues, pagination } = props;

    const [paymentFilter, setPaymentFilter] = React.useState(null);
    const [activeFilter, setActiveFilter] = React.useState("true");
    const [convertToUser, { isLoading: convertUserLoading }] = useConvertToUserMutation();
    const {
        isLoading,
        data: members,
        refetch,
        isFetching,
    } = useGetMembersListQuery({ ...pagination, fees_paid: paymentFilter, active: activeFilter });
    const [generateCard, setGenerateCard] = React.useState(false);

    useEffect(() => {
        props.handlePaginationState(defaultPaginate);
    }, []);

    const handleAddMembers = () => {
        props.changeMembersInitialState({
            showDrawer: true,
            formType: "Add",
        });
    };

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    };

    const handleDrawerClose = () => {
        props.changeMembersInitialState({ showDrawer: false, formType: "", initialValues: null });
    };

    const handleMembersEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeMembersInitialState({ showDrawer: true, formType: type, initialValues: payload });
    };

    const handleMemberToUserConvert = async (id) => {
        try {
            let payload = {
                _id: id,
            };
            if (window.confirm("Are you sure you want to convert this member to user?")) {
                await convertToUser(payload).unwrap();
                refetch();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "User converted successfully",
                        severity: "success",
                    }),
                );
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error?.data?.message || error.message,
                    severity: "error",
                }),
            );
        }
    };

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Members</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        sx={{ alignSelf: "center" }}
                        display={"flex"}
                        flexDirection={"row"}
                        justifyContent={"flex-end"}
                    >
                        <HasPermission permission={PERMISSIONS.MEMBERS.EXPORT_DATA} fallback={null}>
                            <ExportData type="members" />
                        </HasPermission>
                        <SearchRecords handlePagination={handlePagination} pagination={pagination} />
                        <HasPermission permission={PERMISSIONS.MEMBERS.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddMembers()}
                            >
                                Add new Member
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>
            {/* <Paper sx={{ marginBottom: "24px !important", padding: 1.5, mb: 0 }}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ minHeight: "fit-content", pl: 0, margin: 0 }}
                    >
                        <Typography variant="h6">Import Bulk Members</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <BulkImportMembers />
                    </AccordionDetails>
                </Accordion>
            </Paper> */}

            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container direction="column" gap={2}>
                    <Typography variant="subtitle1" color="textPrimary">
                        Filters
                    </Typography>

                    <Grid container spacing={4}>
                        {/* Payment Filter */}
                        <Grid item display="flex" alignItems="center" gap={2}>
                            <Typography variant="subtitle2" color="textSecondary" minWidth={100}>
                                Payment Filter:
                            </Typography>
                            <ToggleButtonGroup
                                color="primary"
                                value={paymentFilter}
                                exclusive
                                onChange={(e, val) => setPaymentFilter(val ? val : null)}
                                aria-label="payment filter"
                                size="small"
                            >
                                <ToggleButton value="true" aria-label="paid">
                                    Paid
                                </ToggleButton>
                                <ToggleButton value="false" aria-label="not paid">
                                    Not Paid
                                </ToggleButton>
                                <ToggleButton value="expired" aria-label="plan expired">
                                    Plan Expired
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>

                        {/* Active Filter */}
                        <Grid item display="flex" alignItems="center" gap={2}>
                            <Typography variant="subtitle2" color="textSecondary" minWidth={100}>
                                Active Filter:
                            </Typography>
                            <ToggleButtonGroup
                                color="primary"
                                value={activeFilter}
                                exclusive
                                onChange={(e, val) => setActiveFilter(val ? val : null)}
                                aria-label="active filter"
                                size="small"
                            >
                                <ToggleButton value="true" aria-label="active">
                                    Active
                                </ToggleButton>
                                <ToggleButton value="false" aria-label="not active">
                                    Not Active
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <MembersTableComponent
                            generateCard={(data) => setGenerateCard(data)}
                            edit={(val, type) => handleMembersEdit(val, type)}
                            convert={(id) => handleMemberToUserConvert(id)}
                            loading={isLoading || convertUserLoading}
                            fetching={isFetching}
                            count={members?.count || 0}
                            data={members?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                            getActivityList={props.getActivityList}
                            getMembersList={props.getMembersList}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <MembersAddDrawer
                show={showDrawer}
                close={handleDrawerClose}
                formType={formType}
                initialValues={initialValues}
            />

            <MemberCard show={Boolean(generateCard)} data={generateCard} close={() => setGenerateCard(false)} />
        </Stack>
    );
};

export default MembersManagerContainer;
