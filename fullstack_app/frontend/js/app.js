document.addEventListener("DOMContentLoaded", () => {
  // UI State
  let currentUser = null;
  let allTasks = [];
  let isRegistering = false;

  // DOM Elements
  const themeToggle = document.getElementById("themeToggle");
  const loginModalBtn = document.getElementById("loginModalBtn");
  const userProfile = document.getElementById("userProfile");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.getElementById("userName");
  const userEmailEl = document.getElementById("userEmail");
  const userAvatarEl = document.getElementById("userAvatar");
  const apiStatusText = document.getElementById("apiStatusText");

  // Modals
  const authModal = document.getElementById("authModal");
  const closeAuthModal = document.getElementById("closeAuthModal");
  const authForm = document.getElementById("authForm");
  const authModalTitle = document.getElementById("authModalTitle");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  const toggleAuthModeBtn = document.getElementById("toggleAuthModeBtn");
  const authToggleText = document.getElementById("authToggleText");
  const fullNameGroup = document.getElementById("fullNameGroup");
  const emailGroup = document.getElementById("emailGroup");

  const taskModal = document.getElementById("taskModal");
  const closeTaskModal = document.getElementById("closeTaskModal");
  const taskForm = document.getElementById("taskForm");
  const openTaskModalBtn = document.getElementById("openTaskModalBtn");
  const quickCreateBtn = document.getElementById("quickCreateBtn");
  const taskModalTitle = document.getElementById("taskModalTitle");

  // Tabs & Views
  const menuItems = document.querySelectorAll(".menu-item");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const taskGrid = document.getElementById("taskGrid");
  const recentTaskList = document.getElementById("recentTaskList");

  // Stats
  const statTotal = document.getElementById("statTotal");
  const statCompleted = document.getElementById("statCompleted");
  const statInProgress = document.getElementById("statInProgress");
  const statRate = document.getElementById("statRate");

  // Search & Filter
  const searchInput = document.getElementById("searchInput");
  const filterStatus = document.getElementById("filterStatus");
  const filterPriority = document.getElementById("filterPriority");

  // Init Application
  initApp();

  async function initApp() {
    setupEventListeners();
    checkHealth();
    await checkAuth();
  }

  function setupEventListeners() {
    // Theme Toggle
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      themeToggle.querySelector("i").className = newTheme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    });

    // Tab Navigation
    menuItems.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        switchTab(targetTab);
      });
    });

    document.querySelectorAll(".view-all-tasks").forEach((btn) => {
      btn.addEventListener("click", () => switchTab("tasks"));
    });

    // Auth Modals
    loginModalBtn.addEventListener("click", () => showAuthModal(false));
    closeAuthModal.addEventListener("click", () => hideModal(authModal));
    toggleAuthModeBtn.addEventListener("click", toggleAuthMode);
    authForm.addEventListener("submit", handleAuthSubmit);
    logoutBtn.addEventListener("click", handleLogout);

    // Task Modals
    openTaskModalBtn.addEventListener("click", () => openTaskModal());
    quickCreateBtn.addEventListener("click", () => openTaskModal());
    closeTaskModal.addEventListener("click", () => hideModal(taskModal));
    taskForm.addEventListener("submit", handleTaskSubmit);

    // Filters & Search
    if (searchInput) searchInput.addEventListener("input", renderTasks);
    if (filterStatus) filterStatus.addEventListener("change", renderTasks);
    if (filterPriority) filterPriority.addEventListener("change", renderTasks);
  }

  function switchTab(tabId) {
    menuItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("data-tab") === tabId);
    });
    tabPanes.forEach((pane) => {
      pane.classList.toggle("active", pane.id === `tab-${tabId}`);
    });
  }

  async function checkHealth() {
    try {
      const res = await fetch("http://localhost:8000/health");
      if (res.ok) {
        apiStatusText.textContent = "Online";
        apiStatusText.style.color = "var(--accent-green)";
      }
    } catch {
      apiStatusText.textContent = "Offline (Demo Mode)";
      apiStatusText.style.color = "var(--accent-red)";
    }
  }

  async function checkAuth() {
    try {
      currentUser = await api.getCurrentUser();
      if (currentUser) {
        updateUserUI();
        await loadDashboardData();
      } else {
        // Auto demo login if available
        try {
          await api.login("demo", "password123");
          currentUser = await api.getCurrentUser();
          updateUserUI();
          await loadDashboardData();
        } catch {
          loginModalBtn.classList.remove("hidden");
          userProfile.classList.add("hidden");
        }
      }
    } catch (err) {
      console.warn("Auth check error", err);
    }
  }

  function updateUserUI() {
    if (currentUser) {
      userNameEl.textContent = currentUser.full_name || currentUser.username;
      userEmailEl.textContent = currentUser.email;
      userAvatarEl.textContent = (currentUser.username || "D").charAt(0).toUpperCase();
      userProfile.classList.remove("hidden");
      loginModalBtn.classList.add("hidden");
    } else {
      userProfile.classList.add("hidden");
      loginModalBtn.classList.remove("hidden");
    }
  }

  async function loadDashboardData() {
    try {
      const [tasks, stats] = await Promise.all([
        api.getTasks(),
        api.getAnalytics()
      ]);

      allTasks = tasks;

      // Update Metric Cards
      statTotal.textContent = stats.total_tasks;
      statCompleted.textContent = stats.completed_tasks;
      statInProgress.textContent = stats.in_progress_tasks;
      statRate.textContent = `${stats.completion_rate}%`;

      renderRecentTasks();
      renderTasks();
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  }

  function renderRecentTasks() {
    if (!recentTaskList) return;
    recentTaskList.innerHTML = "";

    const recent = allTasks.slice(0, 4);
    if (recent.length === 0) {
      recentTaskList.innerHTML = `<p style="color:var(--text-muted); padding:1rem 0;">No tasks found. Click 'New Task' to get started!</p>`;
      return;
    }

    recent.forEach((t) => {
      const item = document.createElement("div");
      item.className = "stack-item";
      item.innerHTML = `
        <div style="flex:1;">
          <strong>${escapeHtml(t.title)}</strong>
          <p style="font-size:0.75rem; color:var(--text-muted);">${t.category || 'General'} • Priority: ${t.priority}</p>
        </div>
        <span class="badge badge-${t.status.toLowerCase().replace(' ', '')}">${t.status}</span>
      `;
      recentTaskList.appendChild(item);
    });
  }

  function renderTasks() {
    if (!taskGrid) return;

    const query = searchInput ? searchInput.value.toLowerCase() : "";
    const statusVal = filterStatus ? filterStatus.value : "";
    const priorityVal = filterPriority ? filterPriority.value : "";

    const filtered = allTasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(query) || (t.category && t.category.toLowerCase().includes(query));
      const matchesStatus = !statusVal || t.status === statusVal;
      const matchesPriority = !priorityVal || t.priority === priorityVal;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    taskGrid.innerHTML = "";
    if (filtered.length === 0) {
      taskGrid.innerHTML = `<div class="glass" style="grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--text-muted);">No matching tasks found.</div>`;
      return;
    }

    filtered.forEach((task) => {
      const card = document.createElement("div");
      card.className = "task-card glass";
      card.innerHTML = `
        <div>
          <div class="task-card-header">
            <span class="task-card-title">${escapeHtml(task.title)}</span>
            <span class="badge badge-${task.status.toLowerCase().replace(' ', '')}">${task.status}</span>
          </div>
          <p class="task-desc">${escapeHtml(task.description || "No description provided.")}</p>
        </div>
        <div class="task-meta">
          <span><i class="fa-solid fa-tag"></i> ${task.category || 'General'} • <strong class="badge-${task.priority.toLowerCase()}">${task.priority} Priority</strong></span>
          <div>
            <button class="icon-btn edit-task-btn" data-id="${task.id}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="icon-btn delete-task-btn" data-id="${task.id}" title="Delete" style="color:var(--accent-red);"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;

      card.querySelector(".edit-task-btn").addEventListener("click", () => openTaskModal(task));
      card.querySelector(".delete-task-btn").addEventListener("click", () => deleteTask(task.id));
      taskGrid.appendChild(card);
    });
  }

  // Auth Operations
  function showAuthModal(registerMode = false) {
    isRegistering = registerMode;
    updateAuthModalState();
    authModal.classList.remove("hidden");
  }

  function toggleAuthMode() {
    isRegistering = !isRegistering;
    updateAuthModalState();
  }

  function updateAuthModalState() {
    if (isRegistering) {
      authModalTitle.textContent = "Create Account";
      authSubmitBtn.textContent = "Register Account";
      fullNameGroup.classList.remove("hidden");
      emailGroup.classList.remove("hidden");
      authToggleText.textContent = "Already have an account?";
      toggleAuthModeBtn.textContent = "Sign In Instead";
    } else {
      authModalTitle.textContent = "Sign In";
      authSubmitBtn.textContent = "Sign In";
      fullNameGroup.classList.add("hidden");
      emailGroup.classList.add("hidden");
      authToggleText.textContent = "Don't have an account?";
      toggleAuthModeBtn.textContent = "Register New Account";
    }
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    const username = document.getElementById("authUsername").value;
    const password = document.getElementById("authPassword").value;

    try {
      if (isRegistering) {
        const email = document.getElementById("regEmail").value;
        const fullName = document.getElementById("regFullName").value;
        await api.register(username, email, password, fullName);
      }
      await api.login(username, password);
      currentUser = await api.getCurrentUser();
      updateUserUI();
      hideModal(authModal);
      await loadDashboardData();
    } catch (err) {
      alert(`Authentication Error: ${err.message}`);
    }
  }

  function handleLogout() {
    api.setToken(null);
    currentUser = null;
    updateUserUI();
    allTasks = [];
    renderRecentTasks();
    renderTasks();
  }

  // Task Operations
  function openTaskModal(task = null) {
    if (task) {
      taskModalTitle.textContent = "Edit Task";
      document.getElementById("taskIdInput").value = task.id;
      document.getElementById("taskTitle").value = task.title;
      document.getElementById("taskDescription").value = task.description || "";
      document.getElementById("taskCategory").value = task.category || "General";
      document.getElementById("taskPriority").value = task.priority || "Medium";
      document.getElementById("taskStatus").value = task.status || "Pending";
    } else {
      taskModalTitle.textContent = "Create New Task";
      taskForm.reset();
      document.getElementById("taskIdInput").value = "";
    }
    taskModal.classList.remove("hidden");
  }

  async function handleTaskSubmit(e) {
    e.preventDefault();
    const taskId = document.getElementById("taskIdInput").value;
    const taskData = {
      title: document.getElementById("taskTitle").value,
      description: document.getElementById("taskDescription").value,
      category: document.getElementById("taskCategory").value,
      priority: document.getElementById("taskPriority").value,
      status: document.getElementById("taskStatus").value
    };

    try {
      if (taskId) {
        await api.updateTask(taskId, taskData);
      } else {
        await api.createTask(taskData);
      }
      hideModal(taskModal);
      await loadDashboardData();
    } catch (err) {
      alert(`Task Error: ${err.message}`);
    }
  }

  async function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await api.deleteTask(id);
        await loadDashboardData();
      } catch (err) {
        alert(`Delete Error: ${err.message}`);
      }
    }
  }

  function hideModal(modal) {
    modal.classList.add("hidden");
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
});
