import React, { Fragment } from 'react';
import EyeIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { FormControlLabel, Switch, TableCell, TableRow, Typography, Chip } from '@mui/material';
import IconButtonIcons from '../../Common/IconButtonIcons';
import TableCommon from '../../Common/Table';
import { handleDateTimeDefault } from '../../../helpers/utils';
import { useDispatch } from 'react-redux';
import { setSnackBar } from '../../../store/common/commonSlice';
import { useUpdateEventMutation } from '../../../store/events/eventsApis';
import { CurrencyRupeeOutlined } from '@mui/icons-material';
import {
    useDeleteFeesCategoriesMutation,
    useUpdateFeesCategoriesMutation,
} from '../../../store/masters/mastersApis';
import { isAuth } from '../../../helpers/cookies';
import { PERMISSIONS } from '../../../helpers/constants';
import HasPermission from '../../Common/HasPermission';
import { getStatusColor } from '../../../helpers/statusUtils';

const FeesCategoriesTableComponent = ({
    loading,
    fetching = false,
    count,
    data,
    edit,
    pagination,
    handlePagination,
}) => {
    const dispatch = useDispatch();
    const [handleDelete] = useDeleteFeesCategoriesMutation();
    const [updateFeesCategories] = useUpdateFeesCategoriesMutation();

    let columns = [
        {
            title: 'Sr. No.',
            sort: false,
            minWidth: 50,
        },
        {
            title: 'Event Details',
            field: 'event_id',
            sort: true,
            minWidth: 50,
        },
        {
            title: 'Category Name',
            field: 'category_name',
            sort: true,
            minWidth: 50,
        },
        {
            title: 'Member Type',
            field: 'members_type',
            sort: true,
            minWidth: 170,
        },
        {
            title: 'Event Type',
            field: 'event_type',
            sort: true,
            minWidth: 170,
        },
        {
            title: 'Status',
            field: 'status',
            sort: true,
            minWidth: 90,
        },
        {
            title: 'Action',
            name: '',
            sort: false,
            minWidth: 200,
        },
    ];

    const deleteManage = (_id, converted) => {
        if (window.confirm('Are you sure you want to delete?')) {
            handleDelete({ _id });
        }
    };

    const handleChangeStatus = async (value, row) => {
        try {
            let payload = {
                ...row,
                status: value,
            };
            await updateFeesCategories(payload).unwrap();
            dispatch(
                setSnackBar({
                    open: true,
                    message: `Fees Categories ${
                        value ? 'active' : 'in-active'
                    } successfully`,
                    severity: 'success',
                }),
            );
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error?.data?.message || error.message,
                    severity: 'error',
                }),
            );
        }
    };

    const renderTableData =
        !loading && data && data.length > 0 ? (
            data.map(function (row, index) {
                return (
                    <TableRow
                        key={index}
                        sx={{ 'td, th': { border: 0, padding: '10px' } }}
                    >
                        <TableCell align="center">
                            {index + 1 + pagination.pageNo * pagination.limit}
                        </TableCell>
                        <TableCell align="center">
                            {row?.event_data?.event_name}
                        </TableCell>
                        <TableCell align="center">{row?.category_name} </TableCell>
                        <TableCell align="center">{row?.members_type} </TableCell>
                        <TableCell align="center">{row?.event_type} </TableCell>
                        <TableCell align="center">
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.EVENT.UPDATE} fallback={
                                <Chip
                                    size="small"
                                    sx={{
                                        fontSize: "0.75rem",
                                        backgroundColor: getStatusColor(row?.status || false).background,
                                        color: getStatusColor(row?.status || false).text,
                                        borderRadius: 1,
                                        fontWeight: 500,
                                    }}
                                    label={row?.status ? "Active" : "Inactive"}
                                />
                            }>
                                <FormControlLabel
                                    control={<Switch checked={row?.status || false} />}
                                    label="Active"
                                    onChange={(e) =>
                                        handleChangeStatus(e.target.checked, row)
                                    }
                                />
                            </HasPermission>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                            <IconButtonIcons
                                title="Edit"
                                IconComponent={EditIcon}
                                color="warning"
                                onClick={() => edit(row, 'Edit')}
                            />
                            <IconButtonIcons
                                title="View"
                                IconComponent={EyeIcon}
                                color="info"
                                onClick={() => edit(row, 'View')}
                            />
                            {isAuth().roles === 'super' ? (
                                <IconButtonIcons
                                    title="Delete"
                                    IconComponent={DeleteIcon}
                                    color="error"
                                    onClick={() => deleteManage(row._id)}
                                />
                            ) : null}
                        </TableCell>
                    </TableRow>
                );
            })
        ) : (
            <TableRow sx={{ 'td, th': { border: 0, padding: '10px' } }}>
                <TableCell colSpan={7} align="center">
                    Data not found
                </TableCell>
            </TableRow>
        );

    return (
        <TableCommon
            columns={columns}
            tableData={renderTableData}
            count={count}
            loading={loading || fetching}
            pagination={pagination}
            handlePagination={handlePagination}
        />
    );
};

export default FeesCategoriesTableComponent;
