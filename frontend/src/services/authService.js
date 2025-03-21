import { jwtDecode } from "jwt-decode";
const API_URL = 'http://localhost:3000'; 

export async function registerUser(email, password, name, role = 'student') {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                name: name,
                role: role
            })
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            return data.token;
        } else {
            throw new Error(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            return data.token;
        } else {
            throw new Error(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const getRole = async () => {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return 'default';
        }
        const response = await fetch(`${API_URL}/role`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        const result = await response.json();
        return result.role;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

export const getId = async () => {
try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        return 'default';
    }
    const response = await fetch(`${API_URL}/role`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result = await response.json();
    return result.userId;
} catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
}
};

export function isTokenValid() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return false;
        }
        let decodedToken = jwtDecode(token);
        let currentDate = new Date();
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            return false;
        } else {
          return true;
        }

    } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('authToken');
        return false;
    }
}
