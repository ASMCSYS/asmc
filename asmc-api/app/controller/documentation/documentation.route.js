import express from 'express';
import {
    getDocumentationList,
    getDocumentationFile,
    downloadDocumentation,
    getDocumentationComponent,
    searchDocumentation,
} from './documentation.controller.js';
import { authenticateUser } from '../../middlewares/authentication.js';
import { checkPermission } from '../../middlewares/permission.js';

const router = express.Router();

router.get(
    '/',
    authenticateUser,
    checkPermission('documentation:read'),
    getDocumentationList,
);

router.get(
    '/search',
    authenticateUser,
    checkPermission('documentation:read'),
    searchDocumentation,
);

router.get(
    '/:component',
    authenticateUser,
    checkPermission('documentation:read'),
    getDocumentationComponent,
);

router.get(
    '/:component/:filename',
    authenticateUser,
    checkPermission('documentation:read'),
    getDocumentationFile,
);

router.get(
    '/:component/:filename/download',
    authenticateUser,
    checkPermission('documentation:read'),
    downloadDocumentation,
);

export default router;
