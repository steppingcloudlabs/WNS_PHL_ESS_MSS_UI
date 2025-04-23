import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api'; // Replace with your actual API URL

export const getTimesheetData = async (params = {}) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `http://localhost:4004/rest/catalog-service-rest/employeeTimeSheet`,
            // params: params,
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