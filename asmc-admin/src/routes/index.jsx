import React from "react";
import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import PublicRoutes from "./PublicRoutes.jsx";
import LayoutPage from "../pages/admin/LayoutPage.jsx";
import { isAuth } from "../helpers/cookies.js";

function Index() {
    return (
        <>
            <Routes>
                {isAuth() ? (
                    <Route path='/*' element={<LayoutPage />} />
                ) : (
                    <Route path='/*' element={<PublicRoutes />} />
                )}

                <Route path='*' element={<Navigate replace to='/' />} />
            </Routes>
        </>
    );
}

export default Index;
