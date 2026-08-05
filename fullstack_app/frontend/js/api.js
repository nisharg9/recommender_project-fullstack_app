const API_BASE_URL = "http://localhost:8000/api/v1";

class ApiService {
  constructor() {
    this.token = localStorage.getItem("nexustask_token") || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("nexustask_token", token);
    } else {
      localStorage.removeItem("nexustask_token");
    }
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json"
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      if (response.status === 204) return true;

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "API Request Failed");
      }
      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Auth Endpoints
  async register(username, email, password, fullName) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password, full_name: fullName })
    });
  }

  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Invalid login credentials");
    }
    this.setToken(data.access_token);
    return data;
  }

  async getCurrentUser() {
    if (!this.token) return null;
    return this.request("/auth/me");
  }

  // Task Endpoints
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/tasks?${query}` : "/tasks";
    return this.request(endpoint);
  }

  async createTask(taskData) {
    return this.request("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData)
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskData)
    });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: "DELETE"
    });
  }

  // Analytics Endpoint
  async getAnalytics() {
    return this.request("/analytics/summary");
  }
}

const api = new ApiService();
