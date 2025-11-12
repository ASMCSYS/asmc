'use strict';

import { responseSend } from '../../../helpers/responseSend.js';
import { httpCodes } from '../../../utils/httpcodes.js';
import BiometricMachine from '../../../models/biometric_machine.js';
import Staff from '../../../models/staff.js';
import BiometricAttendanceLog from '../../../models/biometric_attendance_log.js';
import axios from 'axios';
import ZKLib from 'node-zklib';

// Get all biometric machines
export const getAllMachines = async (req, res) => {
    try {
        const { search } = req.query;

        let filter = { is_active: true };

        // Add search functionality
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { machine_id: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { ip_address: { $regex: search, $options: 'i' } },
            ];
        }

        const machines = await BiometricMachine.find(filter).sort({
            createdAt: -1,
        });

        // Get live status and counts for each machine with timeout
        const machinesWithStatus = await Promise.allSettled(
            machines.map(async (machine) => {
                // Use 2-second timeout for status check
                const status = await checkMachineStatus(machine.ip_address, machine.port);
                const staffCount = await Staff.countDocuments({
                    'biometric.deviceId': machine.machine_id,
                    status: true,
                });
                const logCount = await BiometricAttendanceLog.countDocuments({
                    machine_id: machine.machine_id,
                });

                return {
                    ...machine.toObject(),
                    status,
                    total_users: staffCount,
                    total_logs: logCount,
                };
            }),
        );

        // Process results and handle any failures gracefully
        const processedMachines = machinesWithStatus.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                // If status check failed, return machine with 'unknown' status
                const machine = machines[index];
                return {
                    ...machine.toObject(),
                    status: 'unknown',
                    total_users: 0,
                    total_logs: 0,
                };
            }
        });

        return responseSend(res, httpCodes.OK, 'Machines fetched successfully', {
            data: processedMachines,
            count: processedMachines.length,
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get single machine by ID
export const getMachineById = async (req, res) => {
    try {
        const machine = await BiometricMachine.findOne({
            machine_id: req.params.id,
            is_active: true,
        });

        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Machine not found');
        }

        const status = await checkMachineStatus(machine.ip_address, machine.port);
        const staffCount = await Staff.countDocuments({
            'biometric.deviceId': machine.machine_id,
            status: true,
        });
        const logCount = await BiometricAttendanceLog.countDocuments({
            machine_id: machine.machine_id,
        });

        return responseSend(res, httpCodes.OK, 'Machine fetched successfully', {
            ...machine.toObject(),
            status,
            total_users: staffCount,
            total_logs: logCount,
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Create new machine
export const createMachine = async (req, res) => {
    try {
        const {
            machine_id,
            name,
            ip_address,
            port,
            location,
            description,
            firmware_version,
            serial_number,
        } = req.body;

        // Check if machine already exists
        const existingMachine = await BiometricMachine.findOne({ machine_id });
        if (existingMachine) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Machine with this ID already exists',
            );
        }

        const machine = new BiometricMachine({
            machine_id,
            name,
            ip_address,
            port: port || 4370,
            location,
            description,
            firmware_version,
            serial_number,
            added_by: req.user || {},
        });

        await machine.save();

        return responseSend(
            res,
            httpCodes.CREATED,
            'Machine created successfully',
            machine,
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Update machine
export const updateMachine = async (req, res) => {
    try {
        const {
            name,
            ip_address,
            port,
            location,
            description,
            firmware_version,
            serial_number,
        } = req.body;

        const machine = await BiometricMachine.findOneAndUpdate(
            { machine_id: req.params.id },
            {
                name,
                ip_address,
                port,
                location,
                description,
                firmware_version,
                serial_number,
            },
            { new: true, runValidators: true },
        );

        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Machine not found');
        }

        return responseSend(res, httpCodes.OK, 'Machine updated successfully', machine);
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Delete machine (soft delete)
export const deleteMachine = async (req, res) => {
    try {
        const machine = await BiometricMachine.findOneAndUpdate(
            { machine_id: req.params.id },
            { is_active: false },
            { new: true },
        );

        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Machine not found');
        }

        return responseSend(res, httpCodes.OK, 'Machine deleted successfully');
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Check machine status
export const checkMachineStatus = async (ipAddress, port = 4370) => {
    try {
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Connection timeout')), 2000);
        });

        // Create connection promise
        const connectionPromise = (async () => {
            const zkInstance = await connectToESSLDevice(ipAddress, port);
            await zkInstance.getInfo();
            await zkInstance.disconnect();
            return 'online';
        })();

        // Race between connection and timeout
        const result = await Promise.race([connectionPromise, timeoutPromise]);
        return result;
    } catch (error) {
        return 'offline';
    }
};

// Quick update machine IP address (for network changes)
export const quickUpdateMachineIP = async (req, res) => {
    try {
        const { machine_id, new_ip_address } = req.body;

        if (!machine_id || !new_ip_address) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Machine ID and new IP address are required',
            );
        }

        // Check if machine exists
        const machine = await BiometricMachine.findOne({ machine_id, is_active: true });
        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Machine not found');
        }

        // Test new IP address quickly
        const newStatus = await checkMachineStatus(new_ip_address, machine.port, 1500);

        // Update machine IP
        const updatedMachine = await BiometricMachine.findOneAndUpdate(
            { machine_id },
            {
                ip_address: new_ip_address,
                status: newStatus,
                last_updated: new Date(),
            },
            { new: true },
        );

        return responseSend(res, httpCodes.OK, 'Machine IP updated successfully', {
            machine: updatedMachine,
            new_status: newStatus,
            message: `IP updated from ${machine.ip_address} to ${new_ip_address}. Status: ${newStatus}`,
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get current network information
export const getCurrentNetworkInfo = async (req, res) => {
    try {
        const { exec } = await import('child_process');

        return new Promise((resolve) => {
            // Get network interfaces information - try multiple approaches
            exec('ifconfig', (error, stdout, stderr) => {
                if (error) {
                    resolve({
                        success: false,
                        error: error.message,
                        networkInfo: null,
                    });
                    return;
                }

                // Parse network interfaces - improved parsing
                const interfaces = [];
                const lines = stdout.split('\n');
                let currentInterface = null;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();

                    // Check for interface name
                    if (line.match(/^[a-zA-Z0-9]+:/)) {
                        currentInterface = line.split(':')[0];
                    }

                    // Check for inet line
                    if (line.includes('inet ') && currentInterface) {
                        const ipMatch = line.match(/inet (\d+\.\d+\.\d+\.\d+)/);
                        const netmaskMatch = line.match(/netmask (0x[a-fA-F0-9]+)/);

                        if (ipMatch) {
                            const ip = ipMatch[1];

                            // Skip localhost and link-local
                            if (!ip.startsWith('127.') && !ip.startsWith('169.254.')) {
                                interfaces.push({
                                    interface: currentInterface,
                                    ip: ip,
                                    netmask: netmaskMatch ? netmaskMatch[1] : 'unknown',
                                    network: getNetworkFromIP(ip),
                                });
                            }
                        }
                    }
                }

                resolve({
                    success: true,
                    error: null,
                    networkInfo: {
                        interfaces: interfaces,
                        primaryNetwork:
                            interfaces.length > 0 ? interfaces[0].network : null,
                        timestamp: new Date(),
                    },
                });
            });
        }).then((result) => {
            if (result.success) {
                return responseSend(
                    res,
                    httpCodes.OK,
                    'Network information retrieved successfully',
                    result.networkInfo,
                );
            } else {
                return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, result.error);
            }
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Helper function to get network segment from IP
const getNetworkFromIP = (ip) => {
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.${parts[2]}.x`;
};

// Fast network scan for biometric devices
export const scanNetworkForDevices = async (req, res) => {
    try {
        const { exec } = await import('child_process');

        return new Promise((resolve) => {
            // Get current network info first
            exec('ifconfig', (error, stdout, stderr) => {
                if (error) {
                    resolve({
                        success: false,
                        error: error.message,
                        devices: [],
                    });
                    return;
                }

                // Parse network interfaces to get the network range
                const interfaces = [];
                const lines = stdout.split('\n');
                let currentInterface = null;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();

                    if (line.match(/^[a-zA-Z0-9]+:/)) {
                        currentInterface = line.split(':')[0];
                    }

                    if (line.includes('inet ') && currentInterface) {
                        const ipMatch = line.match(/inet (\d+\.\d+\.\d+\.\d+)/);

                        if (ipMatch) {
                            const ip = ipMatch[1];

                            if (!ip.startsWith('127.') && !ip.startsWith('169.254.')) {
                                interfaces.push({
                                    interface: currentInterface,
                                    ip: ip,
                                    network: getNetworkFromIP(ip),
                                });
                            }
                        }
                    }
                }

                if (interfaces.length === 0) {
                    resolve({
                        success: false,
                        error: 'No network interfaces found',
                        devices: [],
                    });
                    return;
                }

                // Get the primary network
                const primaryNetwork = interfaces[0];
                const networkParts = primaryNetwork.ip.split('.');
                const networkBase = `${networkParts[0]}.${networkParts[1]}.${networkParts[2]}`;

                console.log(
                    `Fast scanning network ${networkBase}.0/24 for biometric devices...`,
                );

                // Use parallel ping to find active hosts first
                const pingPromises = [];
                const activeHosts = [];

                // Ping IPs 1-50 in parallel (faster than scanning all 254)
                for (let i = 1; i <= 50; i++) {
                    const testIP = `${networkBase}.${i}`;
                    if (testIP === primaryNetwork.ip) continue;

                    pingPromises.push(
                        new Promise((resolvePing) => {
                            exec(
                                `ping -c 1 -W 1000 ${testIP}`,
                                (error, stdout, stderr) => {
                                    if (!error && stdout.includes('64 bytes')) {
                                        activeHosts.push(testIP);
                                    }
                                    resolvePing();
                                },
                            );
                        }),
                    );
                }

                // Wait for all pings to complete
                Promise.all(pingPromises).then(() => {
                    console.log(`Found ${activeHosts.length} active hosts:`, activeHosts);

                    // Now test biometric ports on active hosts
                    const portTestPromises = [];
                    const foundDevices = [];

                    // Common biometric device ports
                    const biometricPorts = [4370, 8080, 80, 443, 23, 21, 22];

                    activeHosts.forEach((host) => {
                        biometricPorts.forEach((port) => {
                            portTestPromises.push(
                                new Promise((resolvePort) => {
                                    exec(
                                        `nc -z -v ${host} ${port}`,
                                        (error, stdout, stderr) => {
                                            if (!error || stdout.includes('succeeded')) {
                                                foundDevices.push({
                                                    ip: host,
                                                    port: port,
                                                    status: 'online',
                                                    responseTime: 'unknown',
                                                });
                                            }
                                            resolvePort();
                                        },
                                    );
                                }),
                            );
                        });
                    });

                    // Wait for all port tests to complete
                    Promise.all(portTestPromises).then(() => {
                        resolve({
                            success: true,
                            error: null,
                            devices: foundDevices,
                            networkScanned: `${networkBase}.0/24`,
                            activeHosts: activeHosts,
                            portsScanned: biometricPorts,
                        });
                    });
                });
            });
        }).then((result) => {
            if (result.success) {
                return responseSend(res, httpCodes.OK, 'Network scan completed', result);
            } else {
                return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, result.error);
            }
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Test specific IP and port combination
export const testSpecificPort = async (req, res) => {
    try {
        const { ip_address, port } = req.body;

        if (!ip_address || !port) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'IP address and port are required',
            );
        }

        // First test if IP is reachable
        const pingResult = await testPing(ip_address);

        if (!pingResult.reachable) {
            return responseSend(res, httpCodes.OK, 'IP not reachable', {
                ip_address,
                port,
                reachable: false,
                error: pingResult.error,
                timestamp: new Date(),
            });
        }

        // Test the specific port
        const portResult = await testPort(ip_address, port);

        return responseSend(res, httpCodes.OK, 'Port test completed', {
            ip_address,
            port,
            reachable: pingResult.reachable,
            port_open: portResult.open,
            error: portResult.open ? null : portResult.error,
            response_time: portResult.responseTime || 'unknown',
            timestamp: new Date(),
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Test network connectivity to any IP
export const testNetworkConnectivity = async (req, res) => {
    try {
        const { ip_address } = req.body;

        if (!ip_address) {
            return responseSend(res, httpCodes.BAD_REQUEST, 'IP address is required');
        }

        const pingResult = await testPing(ip_address);

        return responseSend(res, httpCodes.OK, 'Network test completed', {
            ip_address,
            reachable: pingResult.reachable,
            error: pingResult.error,
            details: pingResult.details,
            timestamp: new Date(),
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// ESSL Device Communication Functions
export const connectToESSLDevice = async (ipAddress, port = 4370) => {
    return new Promise(async (resolve, reject) => {
        try {
            const zkInstance = new ZKLib(ipAddress, port, 10000, 5200);

            await zkInstance.createSocket();
            resolve(zkInstance);
        } catch (error) {
            reject(new Error(`ESSL connection failed: ${error.message}`));
        }
    });
};

// Get ESSL device information
export const getESSLDeviceInfo = async (req, res) => {
    try {
        const { id: machine_id } = req.params;

        const machine = await BiometricMachine.findOne({
            machine_id,
            is_active: true,
        });

        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Machine not found');
        }

        const zkInstance = await connectToESSLDevice(machine.ip_address, machine.port);

        // Get device information
        const deviceInfo = await zkInstance.getInfo();

        await zkInstance.disconnect();

        return responseSend(
            res,
            httpCodes.OK,
            'ESSL device info retrieved successfully',
            {
                machine_id,
                ip_address: machine.ip_address,
                device_info: deviceInfo,
                timestamp: new Date(),
            },
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get ESSL attendance logs
export const getESSLAttendanceLogs = async (req, res) => {
    try {
        const { id: machine_id } = req.params;

        const machine = await BiometricMachine.findOne({
            machine_id,
            is_active: true,
        });

        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Machine not found');
        }

        const zkInstance = await connectToESSLDevice(machine.ip_address, machine.port);

        // Get attendance logs
        const attendanceLogs = await zkInstance.getAttendances();

        await zkInstance.disconnect();

        return responseSend(
            res,
            httpCodes.OK,
            'ESSL attendance logs retrieved successfully',
            {
                machine_id,
                ip_address: machine.ip_address,
                logs: attendanceLogs,
                count: attendanceLogs ? attendanceLogs.length : 0,
                timestamp: new Date(),
            },
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get ESSL users
export const getESSLUsers = async (req, res) => {
    try {
        const { id: machine_id } = req.params;

        const machine = await BiometricMachine.findOne({
            machine_id,
            is_active: true,
        });

        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Machine not found');
        }

        const zkInstance = await connectToESSLDevice(machine.ip_address, machine.port);

        // Get users
        const users = await zkInstance.getUsers();

        await zkInstance.disconnect();

        return responseSend(res, httpCodes.OK, 'ESSL users retrieved successfully', {
            machine_id,
            ip_address: machine.ip_address,
            users: users,
            count: users ? users.length : 0,
            timestamp: new Date(),
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Test connection to a specific machine
export const testMachineConnection = async (req, res) => {
    try {
        const { id: machine_id } = req.params;

        const machine = await BiometricMachine.findOne({
            machine_id,
            is_active: true,
        });

        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Machine not found');
        }

        // Test connection using ESSL protocol for more accurate status
        let connectionResult;
        try {
            const zkInstance = await connectToESSLDevice(
                machine.ip_address,
                machine.port,
            );
            await zkInstance.getInfo(); // Test if we can get device info
            await zkInstance.disconnect();

            connectionResult = {
                status: 'online',
                responseTime: '100ms',
                error: null,
                method: 'essl_protocol',
            };
        } catch (error) {
            // Fallback to basic connection test
            connectionResult = await testConnection(machine.ip_address, machine.port);
        }

        // Update machine status in database
        await BiometricMachine.findOneAndUpdate(
            { machine_id },
            {
                status: connectionResult.status,
                last_seen: new Date(),
            },
        );

        return responseSend(res, httpCodes.OK, 'Connection test completed', {
            machine_id: machine.machine_id,
            ip_address: machine.ip_address,
            port: machine.port,
            status: connectionResult.status,
            response_time: connectionResult.responseTime,
            error: connectionResult.error,
            timestamp: new Date(),
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Enhanced connection test function with network diagnostics
export const testConnection = async (ipAddress, port = 4370) => {
    const startTime = Date.now();
    const diagnostics = {
        pingTest: null,
        networkReachability: null,
        portTest: null,
        httpTest: null,
    };

    try {
        // Step 1: Test basic network reachability (ping simulation)
        try {
            const pingResult = await testPing(ipAddress);
            diagnostics.pingTest = pingResult;

            if (!pingResult.reachable) {
                const responseTime = Date.now() - startTime;
                return {
                    status: 'offline',
                    responseTime: `${responseTime}ms`,
                    error: `Network unreachable: ${pingResult.error}`,
                    method: 'ping',
                    diagnostics,
                    networkIssue: true,
                };
            }
        } catch (pingError) {
            diagnostics.pingTest = { reachable: false, error: pingError.message };
        }

        // Step 2: Test port connectivity
        try {
            const portResult = await testPort(ipAddress, port);
            diagnostics.portTest = portResult;

            if (!portResult.open) {
                const responseTime = Date.now() - startTime;
                return {
                    status: 'offline',
                    responseTime: `${responseTime}ms`,
                    error: `Port ${port} not accessible: ${portResult.error}`,
                    method: 'port',
                    diagnostics,
                    networkIssue: false,
                };
            }
        } catch (portError) {
            diagnostics.portTest = { open: false, error: portError.message };
        }

        // Step 3: Try HTTP endpoints (if port is open)
        const connectionMethods = [
            // Method 1: HTTP status check
            () => axios.get(`http://${ipAddress}:${port}/status`, { timeout: 5000 }),
            // Method 2: TCP connection test
            () => axios.get(`http://${ipAddress}:${port}/ping`, { timeout: 5000 }),
            // Method 3: Device info endpoint
            () => axios.get(`http://${ipAddress}:${port}/device/info`, { timeout: 5000 }),
        ];

        let lastError = null;

        for (const method of connectionMethods) {
            try {
                const response = await method();
                const responseTime = Date.now() - startTime;
                diagnostics.httpTest = { success: true, status: response.status };

                return {
                    status: 'online',
                    responseTime: `${responseTime}ms`,
                    error: null,
                    method: 'http',
                    diagnostics,
                    networkIssue: false,
                };
            } catch (error) {
                lastError = error.message;
                continue;
            }
        }

        // If all HTTP methods fail, try TCP connection
        try {
            const tcpResult = await testTcpConnection(ipAddress, port);
            diagnostics.portTest = tcpResult;

            if (tcpResult.success) {
                const responseTime = Date.now() - startTime;
                return {
                    status: 'online',
                    responseTime: `${responseTime}ms`,
                    error: null,
                    method: 'tcp',
                    diagnostics,
                    networkIssue: false,
                };
            }
        } catch (tcpError) {
            diagnostics.portTest = { success: false, error: tcpError.message };
        }

        const responseTime = Date.now() - startTime;
        return {
            status: 'offline',
            responseTime: `${responseTime}ms`,
            error: lastError || 'All connection methods failed',
            method: 'all_failed',
            diagnostics,
            networkIssue: diagnostics.pingTest && !diagnostics.pingTest.reachable,
        };
    } catch (error) {
        const responseTime = Date.now() - startTime;
        return {
            status: 'offline',
            responseTime: `${responseTime}ms`,
            error: error.message,
            method: 'unknown',
            diagnostics,
            networkIssue: true,
        };
    }
};

// Test ping connectivity (simulated)
export const testPing = async (ipAddress) => {
    const { exec } = await import('child_process');

    return new Promise((resolve) => {
        // Use system ping command
        exec(`ping -c 1 -W 3000 ${ipAddress}`, (error, stdout, stderr) => {
            if (error) {
                resolve({
                    reachable: false,
                    error: error.message.includes('timeout')
                        ? 'Request timeout'
                        : error.message,
                    details: stderr,
                });
            } else {
                resolve({
                    reachable: true,
                    error: null,
                    details: stdout,
                });
            }
        });
    });
};

// Test port connectivity
export const testPort = async (ipAddress, port) => {
    const net = await import('net');

    return new Promise((resolve, reject) => {
        const socket = new net.Socket();

        socket.setTimeout(5000);

        socket.on('connect', () => {
            socket.destroy();
            resolve({
                open: true,
                error: null,
            });
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve({
                open: false,
                error: 'Connection timeout',
            });
        });

        socket.on('error', (err) => {
            resolve({
                open: false,
                error: err.message,
            });
        });

        socket.connect(port, ipAddress);
    });
};

// Test TCP connection
export const testTcpConnection = async (ipAddress, port) => {
    const net = await import('net');

    return new Promise((resolve, reject) => {
        const socket = new net.Socket();

        socket.setTimeout(5000);

        socket.on('connect', () => {
            socket.destroy();
            resolve({
                success: true,
                error: null,
            });
        });

        socket.on('timeout', () => {
            socket.destroy();
            reject(new Error('Connection timeout'));
        });

        socket.on('error', (err) => {
            reject(err);
        });

        socket.connect(port, ipAddress);
    });
};

// Get machine statistics
export const getMachineStats = async (req, res) => {
    try {
        const totalMachines = await BiometricMachine.countDocuments({ is_active: true });
        const onlineMachines = await BiometricMachine.countDocuments({
            is_active: true,
            status: 'online',
        });
        const totalStaff = await Staff.countDocuments({
            'biometric.deviceId': { $exists: true },
            status: true,
        });
        const totalLogs = await BiometricAttendanceLog.countDocuments();

        return responseSend(res, httpCodes.OK, 'Statistics fetched successfully', {
            total_machines: totalMachines,
            online_machines: onlineMachines,
            offline_machines: totalMachines - onlineMachines,
            total_staff: totalStaff,
            total_logs: totalLogs,
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get staff assigned to a specific machine
export const getMachineStaff = async (req, res) => {
    try {
        const machineId = req.params.id;

        const staff = await Staff.find({
            'biometric.deviceId': machineId,
            status: true,
        }).select('staff_id name designation department email phone biometric');

        return responseSend(res, httpCodes.OK, 'Staff fetched successfully', {
            data: staff,
            count: staff.length,
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};
