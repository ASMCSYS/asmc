import React, { useEffect, useState } from "react";
import { Grid, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import UserTableComponent from "../../../components/admin/user-manager/UserTable";
import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetUserListQuery } from "../../../store/members/membersApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../../components/Common/HasPermission";

const UserManagerContainer = (props) => {
    const { pagination } = props;
    const [activeFilter, setActiveFilter] = useState("true");
    const [roles, setRoles] = useState("users");
    const {
        isLoading,
        data: users,
        isFetching,
    } = useGetUserListQuery({ ...pagination, active: activeFilter, roles: roles });

    const handlePagination = (setting) => {
        props.handleUserPaginationState(setting);
    };

    useEffect(() => {
        props.handleUserPaginationState(defaultPaginate);
    }, []);

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Users</Typography>
                    </Grid>
                    <Grid item sx={{ alignSelf: "center" }}>
                        <SearchRecords
                            handlePagination={handlePagination}
                            pagination={pagination}
                            // type="filter_by_with"
                            // filterOptions={[
                            //     { label: "Any Word", value: "any_word" },
                            //     { label: "Member Id", value: "member_id" },
                            //     { label: "Staff Id", value: "staff_id" },
                            // ]}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container direction="column" gap={2}>
                    <Typography variant="subtitle1" color="textPrimary">
                        Filters
                    </Typography>

                    <Grid container spacing={4}>
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
                        <Grid item display="flex" alignItems="center" gap={2}>
                            <Typography variant="subtitle2" color="textSecondary" minWidth={100}>
                                User Type:
                            </Typography>
                            <ToggleButtonGroup
                                color="primary"
                                value={roles}
                                exclusive
                                onChange={(e, val) => {
                                    if (val !== null) setRoles(val);
                                }}
                                aria-label="user type"
                                size="small"
                            >
                                <ToggleButton value="users" aria-label="users">
                                    Members
                                </ToggleButton>
                                <ToggleButton value="staff" aria-label="staff">
                                    Staffs
                                </ToggleButton>
                                <ToggleButton value="admin" aria-label="admin">
                                    Admins
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <UserTableComponent
                            fetching={isFetching}
                            loading={isLoading}
                            count={users?.count || 0}
                            data={users?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                            roles={roles}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default UserManagerContainer;
