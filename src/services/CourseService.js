import axios from "axios";
import { getToken } from "../utils/auth";

const API_BASE="http://localhost:8080/api/courses";

export const createCourse=(course){
    const token=getToken();
    return axios.post(`${API_BASE}/create`,course,{
        headers:{Authorization:`Bearer ${token}`

        },
    });
};

export const fetchStudentCourses=()=>{
    return axios.get(`${API_BASE}/student`);
}

export const fetchInstructorCourses=()=>{
    const token=getToken();
    return axios.get(`${API_BASE}/instructor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
}