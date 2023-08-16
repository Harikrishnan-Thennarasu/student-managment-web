import axios from "axios";

const APP_SERVICE_URL = 'http://localhost:3001/'

const onPostRequest = async (endpoint, data) => {
    endpoint = `${APP_SERVICE_URL}${endpoint}`
    const result = await axios.post(endpoint, data);
    return result;
}

const onPutRequest = async (endpoint, data) => {
    endpoint = `${APP_SERVICE_URL}${endpoint}`
    const result = await axios.put(endpoint, data);
    return result;
}

const onGetRequest = async (endpoint) => {
    endpoint = `${APP_SERVICE_URL}${endpoint}`
    const result = await axios.get(endpoint);
    return result;
}

export const toLogin = async (data) => {
    try {
        let endpoint = `user/login`;
        const result = await onPostRequest(endpoint, data);
        return result.data
    } catch (e) {
        console.error(e);
        return e.response.data;
    }
}

export const toSignUp = async (data) => {
    try {
        let endpoint = `user/signup`;
        const result = await onPostRequest(endpoint, data);
        return result.data
    } catch (e) {
        console.error(e);
        return e.response.data;
    }
}

export const toCreateStudentInfo = async (data) => {
    try {
        let endpoint = `student/create`;
        const result = await onPostRequest(endpoint, data);
        return result.data
    } catch (e) {
        console.error(e);
        return e.response.data;
    }
}

export const toUpdateStudentInfo = async (data, studentId) => {
    try {
        let endpoint = `student/${studentId}`;
        const result = await onPutRequest(endpoint, data);
        return result.data
    } catch (e) {
        console.error(e);
        return e.response.data;
    }
}

export const toGetAllStudentsByLoggedUserId = async (userId, skill) => {
    try {
        let endpoint = `student/list/${userId}?skill=${skill}`;
        const result = await onGetRequest(endpoint);
        return result.data
    } catch (e) {
        console.error(e);
        return e.response.data;
    }
}