const API_URL = 'http://localhost:3000'; 

export async function chat(message) {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return "";
        }
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        return data.respons;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}