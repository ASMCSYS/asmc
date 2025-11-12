import { Link } from 'react-router-dom';

import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { Grid, Typography } from '@mui/material';

const Breadcrumbs = ({ item }) => {
    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item>
                <MuiBreadcrumbs aria-label="breadcrumb">
                    <Typography component={Link} to="/" color="textSecondary" variant="subtitle2" sx={{ textDecoration: 'none' }}>
                        Home
                    </Typography>
                    {
                        item.map((obj, key) => {
                            return (
                                <Typography key={key} component={Link} to={item.link || "/"} variant="subtitle2" sx={{ textDecoration: 'none' }} color="textSecondary" >
                                    {obj.title}
                                </Typography>
                            )
                        })
                    }

                </MuiBreadcrumbs>
            </Grid>
        </Grid>
    );
};

export default Breadcrumbs;