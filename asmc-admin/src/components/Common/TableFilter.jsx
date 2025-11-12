import { Grid, Paper, Typography } from "@mui/material"
import { SearchRecords } from "./SearchRecords"

export const TableFilter = ({ handlePagination, pagination }) => {
    return (
        <Paper sx={{ padding: 1.5 }}>
            <Grid container justifyContent={"space-between"}>
                <Grid item sx={{ alignSelf: "center" }}>
                    <Typography variant="h6">Filter</Typography>
                    
                    
                </Grid>
                <SearchRecords handlePagination={handlePagination} pagination={pagination} />
            </Grid>
        </Paper>
    )
}