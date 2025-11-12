import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import WelcomeImage from "../../components/public/WelcomeImage.jsx";
import LoginFormComponent from "../../components/public/login/LoginForm.jsx";
import { axios } from "../../helpers/axios";
import { authenticate } from "../../helpers/cookies";
import withNavigate from "../../routes/withNavigate";
import { loginUrl } from "../../helpers/constants.js";

class LoginContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: false,
        };
    }

    handleSignIn = async (data) => {
        try {
            this.setState({
                loading: true,
            });
            const login_response = await axios.post(loginUrl, data);
            if (login_response?.success) {
                authenticate(login_response.result, (res) => {
                    if (res) {
                        window.location.reload()
                    } else {

                    }
                });
            }
            this.setState({
                loading: false,
            });
        } catch (error) {
            this.setState({
                loading: false,
            });
        }
    };

    render() {
        const { loading } = this.state;

        return (
            <Box>
                <Grid sx={{ height: "100vh" }} container spacing={0}>
                    <Grid item xs={12} md={7} sm={12} lg={7}>
                        <WelcomeImage />
                    </Grid>
                    <Grid item xs={12} md={5} sm={12} lg={5}>
                        <LoginFormComponent
                            loading={loading}
                            submit={this.handleSignIn}
                        />
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default withNavigate(LoginContainer);
