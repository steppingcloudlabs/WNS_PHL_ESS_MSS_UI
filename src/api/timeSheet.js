import axios from 'axios';
import constant from "../store/constanrSys"
import c2 from "../constant"
import { useUserStore } from '../store/userStore';


export const getTimesheetData = async (USERId = null, startDate = null, endDate = null) => {

    const userStore = useUserStore();
    let userid = userStore.userId;

    console.log("user id fro timesheet dropdown: ", USERId);
    console.log("user user id store :: ", userid);

    console.log("startdate and enddate: ",startDate, endDate);

    try {
        const response = await axios({
            method: 'GET',
            url: `${constant.endpoint}/rest/catalog-service-rest/employeeTimeSheet`,
            params: {
                USERID: c2.isLocal?"395234":USERId?USERId:userid,
                STARTDATE: startDate?startDate: "2025-02-09",
                ENDDATE: endDate?endDate : "2025-02-16"
            },
            
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return {
            success: true,
            data: response.data,
            message: 'Timesheet data fetched successfully'
        };
    } catch (error) {
        
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || 'Failed to fetch timesheet data',
            error: error.response?.data || error.message
        };
    
    }
};

export const updateTimesheetData = async (id, data) => {
    try {
        const response = await axios({
            method: 'PUT',
            url: `${BASE_URL}/timesheet/${id}`,
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return {
            success: true,
            data: response.data,
            message: 'Timesheet updated successfully'
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || 'Failed to update timesheet',
            error: error.response?.data || error.message
        };
    }
};

export const approveTimesheet = async (id) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${BASE_URL}/timesheet/${id}/approve`,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return {
            success: true,
            data: response.data,
            message: 'Timesheet approved successfully'
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || 'Failed to approve timesheet',
            error: error.response?.data || error.message
        };
    }
};

export const rejectTimesheet = async (id) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${BASE_URL}/timesheet/${id}/reject`,
            data: null,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return {
            success: true,
            data: response.data,
            message: 'Timesheet rejected successfully'
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || 'Failed to reject timesheet',
            error: error.response?.data || error.message
        };
    }
};