import api from './api'

export const registerAPI = async (data) => {
    return await api.post('/register', data)
}

export const loginAPI = async (data) =>{
    return await api.post('/login',data)
}

export const getProfileAPI = async(token)=>{
    return await api.get('/profile',{
        headers:{
            Authorization:`Bearer ${token}`
        }

    })
}
export const updateProfileAPI = async(data,token)=>{
    return await api.put('/profile',data,{
        headers:{
            Authorization:`Bearer ${token}`
        }

    })
}

export const getAllUsersAPI = async (token) => {
    return await api.get('/admin/users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const deleteUserAPI = async (id, token) => {
    return await api.delete(`/admin/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getExercisesAPI = async (token) => {
    return await api.get("/admin/exercises", {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const addExerciseAPI = async (data, token) => {
    return await api.post("/admin/exercises", data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateExerciseAPI = async (id, data, token) => {
    return await api.put(`/admin/exercises/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteExerciseAPI = async (id, token) => {
    return await api.delete(`/admin/exercises/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getWorkoutsAPI = async (token) => {
    return await api.get("/admin/workouts", {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const addWorkoutAPI = async (data, token) => {
    return await api.post("/admin/workouts", data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateWorkoutAPI = async (id, data, token) => {
    return await api.put(`/admin/workouts/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteWorkoutAPI = async (id, token) => {
    return await api.delete(`/admin/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getDietAPI = async (token) => {
    return await api.get('/admin/diet', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const createDietAPI = async (data, token) => {
    return await api.post('/admin/diet', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateDietAPI = async (id, data, token) => {
    return await api.put(`/admin/diet/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const deleteDietAPI = async (id, token) => {
    return await api.delete(`/admin/diet/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export const getFoodsAPI = async (token) => {
    return await api.get('/admin/foods', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const createFoodAPI = async (data, token) => {
    return await api.post('/admin/foods', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const updateFoodAPI = async (id, data, token) => {
    return await api.put(`/admin/foods/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const deleteFoodAPI = async (id, token) => {
    return await api.delete(`/admin/foods/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
export const getUserWorkoutsAPI = async (token) => {
    return await api.get("/workouts", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};