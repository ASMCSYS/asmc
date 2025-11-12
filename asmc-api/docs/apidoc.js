import { auth } from './auth.js';
import { commonSwagger } from './common.js';
import { membersSwagger } from './members.js';
import { mastersSwagger } from './facility.js';
import { activitySwagger } from './activity.js';
import { staffSwagger } from './staff.js';
import { paymentSwagger } from './payment.js';
import { biometricSwagger } from './biometric.js';
import { hallsSwagger } from './halls.js';
import { eventsSwagger } from './events.js';
import { plansSwagger } from './plans.js';
import { reportsSwagger } from './reports.js';

const apiDocumentation = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'ASMC API Documentation',
        description: '',
        termsOfService: '',
    },
    servers: [
        {
            url: 'http://localhost:7055/',
            description: 'Local Server',
        },
        {
            url: 'https://api.asmcdae.in/',
            description: 'Live',
        },
    ],
    tags: [
        { name: 'Auth' },
        { name: 'Members' },
        { name: 'Staff' },
        { name: 'Masters' },
        { name: 'Activity' },
        { name: 'Payment' },
        { name: 'Biometric' },
        { name: 'Halls' },
        { name: 'Events' },
        { name: 'Plans' },
        { name: 'Reports' },
    ],
    paths: {
        ...auth,
        ...membersSwagger,
        ...staffSwagger,
        ...mastersSwagger,
        ...activitySwagger,
        ...paymentSwagger,
        ...biometricSwagger,
        ...hallsSwagger,
        ...eventsSwagger,
        ...plansSwagger,
        ...reportsSwagger,
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

export { apiDocumentation };
