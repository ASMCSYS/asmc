import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { addMonths, subMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import Button from './Button';
import { axios } from '../../helpers/axios';

const ExportData = ({ type }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [exporting, setExporting] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = async (range) => {
        try {
            let start_date, end_date;

            const currentDate = new Date();

            switch (range) {
                case 'currentMonth':
                    start_date = startOfMonth(currentDate);
                    end_date = endOfMonth(currentDate);
                    break;
                case 'previousMonth':
                    start_date = startOfMonth(subMonths(currentDate, 1));
                    end_date = endOfMonth(subMonths(currentDate, 1));
                    break;
                case 'last3Months':
                    start_date = startOfMonth(subMonths(currentDate, 3));
                    end_date = endOfMonth(currentDate);
                    break;
                case 'last6Months':
                    start_date = startOfMonth(subMonths(currentDate, 6));
                    end_date = endOfMonth(currentDate);
                    break;
                case '1Year':
                    start_date = startOfMonth(subMonths(currentDate, 12));
                    end_date = endOfMonth(currentDate);
                    break;
                case 'all':
                    // You can set a very old start date for "all"
                    start_date = new Date('1900-01-01');
                    end_date = currentDate;
                    break;
                default:
                    break;
            }

            console.log(`Exporting from ${start_date} to ${end_date}`);
            // Handle the export logic based on selected date range

            setExporting(true);

            const hitUrl = `/reports/${type}?start_date=${format(start_date, "yyyy-MM-dd")}&end_date=${format(end_date, "yyyy-MM-dd")}`;

            let response = await axios.get(hitUrl, { responseType: "blob" });

            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_${format(start_date, "yyyy-MM-dd")}_to_${format(end_date, "yyyy-MM-dd")}.csv`); // Filename
            document.body.appendChild(link);
            link.click();

            setExporting(false);

            handleClose();
        } catch (e) {
            setExporting(false);
        }
    };

    return (
        <div style={{ marginRight: 10 }}>
            <Button
                disableElevation
                variant="contained"
                sx={{ borderRadius: "50px" }}
                onClick={handleClick}
                color="secondary"
                loading={exporting}
            >
                Export Data
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleExport('currentMonth')}>Current Month</MenuItem>
                <MenuItem onClick={() => handleExport('previousMonth')}>Previous Month</MenuItem>
                <MenuItem onClick={() => handleExport('last3Months')}>Last 3 Months</MenuItem>
                <MenuItem onClick={() => handleExport('last6Months')}>Last 6 Months</MenuItem>
                <MenuItem onClick={() => handleExport('1Year')}>1 Year</MenuItem>
                <MenuItem onClick={() => handleExport('all')}>All</MenuItem>
            </Menu>
        </div>
    );
};

export default ExportData;
