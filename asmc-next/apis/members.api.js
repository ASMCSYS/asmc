import { BaseUrl } from '@/utils/constants';
import { server } from './axios-config';

export const fetchSingleMember = async (id) => {
    const res = await server.get(`${BaseUrl}/members`, { params: { _id: id } });
    return res.data;
};

export const fetchTeamMember = async () => {
    const res = await server.get(`${BaseUrl}/members/team`);
    return res.data;
};

export const verifyMember = async (member_id) => {
    const res = await server.get(`${BaseUrl}/members/verify?member_id=${member_id}`);
    return res.data;
};
