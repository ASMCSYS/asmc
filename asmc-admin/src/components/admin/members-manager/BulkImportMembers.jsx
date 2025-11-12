import React, { useState } from "react";
import { Grid, Input, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { convertCSVToJson } from "../../../helpers/utils";
import { useBulkAddNewMembersMutation } from "../../../store/members/membersApis";
import AutoCompleteServerSide from "../../Common/AutoCompleteServerSide";
import Button from "../../Common/Button";
import { baseUrl } from "../../../helpers/constants";

export const BulkImportMembers = ({ getSansthaList }) => {
    const dispatch = useDispatch();
    const [BulkAddMember, { isLoading: importLoading }] = useBulkAddNewMembersMutation();
    const [reportsData, setReportData] = useState(null);

    const handleFileReading = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const csvData = e.target.result;
                const jsonData = convertCSVToJson(csvData);

                if (jsonData && jsonData.length > 0) {
                    setReportData(jsonData);
                }
            };

            reader.readAsText(files[0]);
        }
    }

    const handleFileUpload = async () => {
        try {
            if (!reportsData)
                return false;

            let payload = reportsData.map((obj) => {
                return {
                    ...obj
                }
            })

            // console.log(payload, payload);
            // return false;

            await BulkAddMember(payload).unwrap();
            dispatch(setSnackBar({
                open: true,
                message: "Data imported successfully.",
                severity: "success",
            }))

            document.getElementById("importfile").value = "";
            setReportData(null);
        } catch (error) {
            dispatch(setSnackBar({
                open: true,
                message: error?.data?.message || error.message,
                severity: "error",
            }))
        }
    };

    return (
        <Grid container spacing={2} pt={2}>
            <Grid item xs={12} md={4} >
                <Input type="file" name="file" id="importfile" accept=".csv,.xlsx,.xls" onChange={(e) => handleFileReading(e)} />
                <Typography variant="caption" sx={{ display: "block", pt: 2, m: 0 }}>Download sample file <a rel="noreferrer" href={baseUrl + "/public/sample/member-import-sample.csv"} target="_blank">here</a></Typography>
                <Typography variant="caption" sx={{ display: "block", p: 0, m: 0 }}>Be carefull with the data you add in excel file.</Typography>
                <Typography variant="caption" sx={{ display: "block", p: 0, m: 0 }}>Try not to upload large amount of records at once.</Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Button size="large" type="submit" loading={importLoading} onClick={() => handleFileUpload()}>Save</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}