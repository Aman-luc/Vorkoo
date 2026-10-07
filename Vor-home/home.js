// ==================== VORKOO UNIFIED CONTROLLER & DATA STORE ====================
(function() {
  const SESSION_STORAGE_KEY = "vorkoo-current-user";
  const THEME_STORAGE_KEY = "vorkoo-theme";

  function normalizeEmail(email) {
    return String(email || "").toLowerCase().trim();
  }

  // Helper to get active user session
  function getCurrentUser() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Failed to parse current user session", err);
    }
    return null;
  }

  function getUserStorageKey(email) {
    return `vorkoo-work-items_${normalizeEmail(email)}`;
  }

  const DEMO_USER = {
    fullName: "Demo User",
    email: "demo@vorkoo.app",
    isDemo: true
  };

  let currentUser = getCurrentUser();

  // For the Public Demo / Investor Prototype:
  // If no session exists, automatically enter the Demo Workspace
  if (!currentUser) {
    currentUser = { ...DEMO_USER };
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (err) {
      console.warn("Failed to set demo user session in localStorage", err);
    }
  } else if (currentUser.email === "demo@vorkoo.app") {
    currentUser.isDemo = true;
  }

  const isDemoMode = Boolean(currentUser && (currentUser.isDemo || currentUser.email === "demo@vorkoo.app"));

  // Helper to dynamically calculate ISO date strings relative to today for demo consistency
  function getDemoDateStr(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Realistic sample demo dataset covering all requirements
  function getInitialDemoWorks() {
    const now = Date.now();
    const dayMs = 86400000;

    return [
      {
        id: 101,
        title: "Brand Identity & Design System",
        client: "Apex Studio",
        description: "Complete design token architecture, Figma component system, typography scale, and brand guidelines.",
        deadline: getDemoDateStr(2),
        priority: "High",
        status: "In Progress",
        totalAmount: 85000,
        payments: [
          {
            id: "pay_demo_101_1",
            amount: 35000,
            date: getDemoDateStr(-14),
            note: "Project kickoff advance (40%)"
          },
          {
            id: "pay_demo_101_2",
            amount: 15000,
            date: getDemoDateStr(-4),
            note: "Milestone 1 design sign-off"
          }
        ],
        receivedAmount: 50000,
        remainingAmount: 35000,
        attachment: {
          id: "att_demo_101",
          name: "Apex_Design_Brief_v2.pdf",
          type: "application/pdf",
          size: 2457600,
          lastModified: now - 14 * dayMs
        },
        updatedAt: now - 1 * dayMs
      },
      {
        id: 102,
        title: "Mobile App UI/UX Redesign",
        client: "Apex Studio",
        description: "User research, wireframing, and interactive prototype for client companion mobile applications.",
        deadline: getDemoDateStr(5),
        priority: "Medium",
        status: "Pending",
        totalAmount: 45000,
        payments: [],
        receivedAmount: 0,
        remainingAmount: 45000,
        updatedAt: now - 2 * dayMs
      },
      {
        id: 103,
        title: "Web App Dashboard Implementation",
        client: "Apex Studio",
        description: "Analytics screens, dark/light theme tokens, data tables, and client reporting module.",
        deadline: getDemoDateStr(5),
        priority: "High",
        status: "In Progress",
        totalAmount: 110000,
        payments: [
          {
            id: "pay_demo_103_1",
            amount: 60000,
            date: getDemoDateStr(-7),
            note: "Phase 1 frontend delivery"
          }
        ],
        receivedAmount: 60000,
        remainingAmount: 50000,
        updatedAt: now - 3 * dayMs
      },
      {
        id: 104,
        title: "Annual Brand Styleguide Update",
        client: "Apex Studio",
        description: "Vector export cleanup, iconography set revision, and digital asset pack preparation.",
        deadline: getDemoDateStr(-10),
        priority: "Low",
        status: "Completed",
        totalAmount: 25000,
        payments: [
          {
            id: "pay_demo_104_1",
            amount: 25000,
            date: getDemoDateStr(-10),
            note: "Final project settlement (100%)"
          }
        ],
        receivedAmount: 25000,
        remainingAmount: 0,
        updatedAt: now - 10 * dayMs
      },
      {
        id: 105,
        title: "E-Commerce Checkout Flow & UX",
        client: "Horizon Retail",
        description: "One-click checkout optimization, cart drawer UX, guest checkout, and payment options layout.",
        deadline: getDemoDateStr(12),
        priority: "Medium",
        status: "In Progress",
        totalAmount: 55000,
        payments: [
          {
            id: "pay_demo_105_1",
            amount: 25000,
            date: getDemoDateStr(-5),
            note: "Sprint 1 milestone payment"
          }
        ],
        receivedAmount: 25000,
        remainingAmount: 30000,
        updatedAt: now - 5 * dayMs
      },
      {
        id: 106,
        title: "Cloud Infrastructure Security Audit",
        client: "Nexus Cloud Systems",
        description: "Vulnerability analysis, IAM permission review, VPC peering audit, and compliance checklist.",
        deadline: getDemoDateStr(-3),
        priority: "High",
        status: "Completed",
        totalAmount: 60000,
        payments: [
          {
            id: "pay_demo_106_1",
            amount: 30000,
            date: getDemoDateStr(-12),
            note: "Security audit retainer"
          },
          {
            id: "pay_demo_106_2",
            amount: 30000,
            date: getDemoDateStr(-3),
            note: "Executive sign-off & report delivery"
          }
        ],
        receivedAmount: 60000,
        remainingAmount: 0,
        attachment: {
          id: "att_demo_106",
          name: "Security_Audit_Report_Signed.pdf",
          type: "application/pdf",
          size: 1843200,
          lastModified: now - 3 * dayMs
        },
        updatedAt: now - 3 * dayMs
      },
      {
        id: 107,
        title: "Custom Payment Gateway Integration",
        client: "Vanguard Tech",
        description: "Webhooks listener, automated invoice reconciliation, and sandbox testing environment.",
        deadline: getDemoDateStr(18),
        priority: "Low",
        status: "Pending",
        totalAmount: 30000,
        payments: [],
        receivedAmount: 0,
        remainingAmount: 30000,
        updatedAt: now - 6 * dayMs
      }
    ];
  }

  // --- Shared Data Store (Single Source of Truth per Account) ---
  const DataStore = {
    items: [],

    init() {
      if (!currentUser) return;

      const userKey = getUserStorageKey(currentUser.email);
      try {
        const raw = localStorage.getItem(userKey);
        if (raw !== null) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            this.items = parsed;

            // One-time Migration: Ensure every work item has a payments array
            let migrated = false;
            this.items.forEach(item => {
              if (!Array.isArray(item.payments)) {
                const prevReceived = Number(item.receivedAmount) || 0;
                if (prevReceived > 0) {
                  item.payments = [
                    {
                      id: "migrated_" + item.id,
                      amount: prevReceived,
                      date: "",
                      note: "Previously received"
                    }
                  ];
                } else {
                  item.payments = [];
                }
                item.receivedAmount = prevReceived;
                item.remainingAmount = Math.max(0, (Number(item.totalAmount) || 0) - prevReceived);
                migrated = true;
              }
            });
            if (migrated) {
              this.persist();
            }
            return;
          }
        }
      } catch (err) {
        console.warn("Invalid localStorage detected for user. Starting with clean state.", err);
      }

      // If in demo mode and no items exist, seed with realistic demo dataset
      if (isDemoMode) {
        this.items = getInitialDemoWorks();
      } else {
        // Real registered accounts start with clean state
        this.items = [];
      }
      this.persist();
    },

    persist() {
      if (!currentUser) return;
      try {
        const userKey = getUserStorageKey(currentUser.email);
        localStorage.setItem(userKey, JSON.stringify(this.items));
      } catch (err) {
        console.error("Failed to persist work items to localStorage:", err);
      }
    },

    getAll() {
      return this.items;
    },

    addItem(item) {
      if (!item.updatedAt) {
        item.updatedAt = Date.now();
      }
      if (!Array.isArray(item.payments)) item.payments = [];
      item.receivedAmount = getWorkTotalReceived(item);
      item.remainingAmount = getWorkRemainingAmount(item);
      this.items.unshift(item);
      this.persist();
    },

    updateItem(updatedItem) {
      const index = this.items.findIndex(item => String(item.id) === String(updatedItem.id));
      if (index !== -1) {
        updatedItem.updatedAt = Date.now();
        if (!Array.isArray(updatedItem.payments)) {
          updatedItem.payments = Array.isArray(this.items[index].payments) ? this.items[index].payments : [];
        }
        updatedItem.receivedAmount = getWorkTotalReceived(updatedItem);
        updatedItem.remainingAmount = getWorkRemainingAmount(updatedItem);
        this.items[index] = updatedItem;
        this.persist();
      }
    },

    deleteItem(id) {
      const existing = this.items.find(item => String(item.id) === String(id));
      if (existing && existing.attachment && existing.attachment.id) {
        if (typeof AttachmentStore !== "undefined" && AttachmentStore.deleteAttachment) {
          AttachmentStore.deleteAttachment(existing.attachment.id, existing.id).catch(err => {
            console.warn("Failed to delete attachment from IndexedDB on work delete:", err);
          });
        }
      }
      this.items = this.items.filter(item => String(item.id) !== String(id));
      this.persist();
    }
  };

  // --- Dedicated IndexedDB Attachment Store (Account-Isolated) ---
  const AttachmentStore = {
    DB_NAME: "vorkoo_attachments_db",
    DB_VERSION: 1,
    STORE_NAME: "work_attachments",
    _dbPromise: null,

    getDB() {
      if (this._dbPromise) return this._dbPromise;
      this._dbPromise = new Promise((resolve, reject) => {
        if (!window.indexedDB) {
          return reject(new Error("IndexedDB is not supported in this browser environment."));
        }
        const request = window.indexedDB.open(this.DB_NAME, this.DB_VERSION);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            const store = db.createObjectStore(this.STORE_NAME, { keyPath: "id" });
            store.createIndex("by_user", "userEmail", { unique: false });
            store.createIndex("by_user_work", ["userEmail", "workId"], { unique: false });
          }
        };
        request.onsuccess = (event) => {
          const db = event.target.result;
          resolve(db);
        };
        request.onerror = (event) => {
          this._dbPromise = null;
          reject(event.target.error || new Error("Failed to open attachments IndexedDB"));
        };
      });
      return this._dbPromise;
    },

    getUserEmail() {
      return currentUser && currentUser.email ? normalizeEmail(currentUser.email) : null;
    },

    async saveAttachment({ id, workId, file }) {
      const userEmail = this.getUserEmail();
      if (!userEmail) throw new Error("No active user session.");
      if (!id || !file) throw new Error("Invalid attachment data.");

      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, "readwrite");
        const store = tx.objectStore(this.STORE_NAME);
        const record = {
          id: String(id),
          userEmail: userEmail,
          workId: String(workId),
          file: file,
          name: file.name || "attachment",
          type: file.type || "application/octet-stream",
          size: file.size || 0,
          lastModified: file.lastModified || Date.now(),
          createdAt: Date.now()
        };
        const request = store.put(record);
        request.onsuccess = () => resolve(record);
        request.onerror = () => reject(request.error || new Error("Failed to store attachment in IndexedDB."));
      });
    },

    async getAttachment(attachmentId) {
      const userEmail = this.getUserEmail();
      if (!userEmail || !attachmentId) return null;

      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, "readonly");
        const store = tx.objectStore(this.STORE_NAME);
        const request = store.get(String(attachmentId));
        request.onsuccess = () => {
          const record = request.result;
          // Account isolation: return record only if it belongs to current active user
          if (record && record.userEmail === userEmail) {
            resolve(record);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error || new Error("Failed to get attachment from IndexedDB."));
      });
    },

    async deleteAttachment(attachmentId, workId) {
      const userEmail = this.getUserEmail();
      if (!userEmail || !attachmentId) return;

      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, "readwrite");
        const store = tx.objectStore(this.STORE_NAME);
        const request = store.get(String(attachmentId));
        request.onsuccess = () => {
          const record = request.result;
          if (record && record.userEmail === userEmail) {
            store.delete(String(attachmentId));
          }
          resolve();
        };
        request.onerror = () => reject(request.error || new Error("Failed to delete attachment from IndexedDB."));
        tx.oncomplete = () => resolve();
      });
    },

    async deleteForWork(workId) {
      const userEmail = this.getUserEmail();
      if (!userEmail || !workId) return;

      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, "readwrite");
        const store = tx.objectStore(this.STORE_NAME);
        const index = store.index("by_user_work");
        const request = index.getAllKeys([userEmail, String(workId)]);
        request.onsuccess = () => {
          const keys = request.result || [];
          keys.forEach(k => store.delete(k));
          resolve();
        };
        request.onerror = () => reject(request.error || new Error("Failed to clear work attachments from IndexedDB."));
        tx.oncomplete = () => resolve();
      });
    }
  };
  window.AttachmentStore = AttachmentStore;

  // --- Warning Dismiss Store (Persisted per Account) ---
  const DismissStore = {
    getKey() {
      return currentUser ? `vorkoo-dismissed-warnings_${normalizeEmail(currentUser.email)}` : null;
    },
    getAll() {
      const storageKey = this.getKey();
      if (!storageKey) return {};
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    },
    isDismissed(key) {
      if (!key) return false;
      const all = this.getAll();
      return !!all[key];
    },
    dismiss(key) {
      const storageKey = this.getKey();
      if (!storageKey || !key) return;
      try {
        const all = this.getAll();
        all[key] = true;
        localStorage.setItem(storageKey, JSON.stringify(all));
      } catch (e) {}
    }
  };

  // --- Modal Helpers ---
  function openModalElement(modal) {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModalElement(modal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  // --- Formatting & Math Helpers ---
  function formatFileSize(bytes) {
    if (typeof bytes !== "number" || isNaN(bytes) || bytes < 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    const mb = kb / 1024;
    return mb.toFixed(1) + " MB";
  }

  function formatINR(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN");
  }

  function formatDeadlineDisplay(dateStr) {
    if (!dateStr) return "";
    try {
      const parts = String(dateStr).split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        }
      }
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      }
    } catch (e) {}
    return dateStr;
  }

  function formatPaymentDate(dateStr) {
    if (!dateStr) return "Previously received";
    return formatDeadlineDisplay(dateStr) || dateStr;
  }

  function getWorkTotalReceived(item) {
    if (!item) return 0;
    if (Array.isArray(item.payments)) {
      return item.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    }
    return Number(item.receivedAmount) || 0;
  }

  function getWorkRemainingAmount(item) {
    if (!item) return 0;
    const total = Number(item.totalAmount) || 0;
    const received = getWorkTotalReceived(item);
    return Math.max(0, total - received);
  }

  function getWorkPaymentStatus(item) {
    if (!item) return "Unpaid";
    const total = Number(item.totalAmount) || 0;
    const received = getWorkTotalReceived(item);
    if (total <= 0 || received <= 0) return "Unpaid";
    if (received >= total) return "Paid";
    return "Partially Paid";
  }

  function getPaymentStatusInfo(item) {
    const status = getWorkPaymentStatus(item);
    let badgeClass = "badge-pay-unpaid";
    let key = "unpaid";
    if (status === "Paid") {
      badgeClass = "badge-pay-paid";
      key = "paid";
    } else if (status === "Partially Paid") {
      badgeClass = "badge-pay-partially-paid";
      key = "partial";
    }
    return { status, badgeClass, key };
  }

  function escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  let activeConfirmCancel = null;

  // Confirmation Modal Handler
  function showConfirmDialog({ title, message, okText, onConfirm, isAlert = false }) {
    const modal = document.getElementById("vorkoo-confirm-modal");
    const titleEl = document.getElementById("confirm-modal-title");
    const msgEl = document.getElementById("confirm-modal-msg");
    const okBtn = document.getElementById("confirm-modal-ok-btn");
    const cancelBtn = document.getElementById("confirm-modal-cancel-btn");

    titleEl.textContent = title || "Confirm Action";
    msgEl.textContent = message || "Are you sure?";
    okBtn.textContent = okText || "Confirm";

    if (isAlert) {
      if (cancelBtn) cancelBtn.style.display = "none";
      if (okBtn) okBtn.className = "btn btn-secondary";
    } else {
      if (cancelBtn) cancelBtn.style.display = "";
      if (okBtn) okBtn.className = "btn btn-danger";
    }

    const close = () => {
      closeModalElement(modal);
      cleanup();
    };

    const handleOk = () => {
      close();
      if (typeof onConfirm === "function") onConfirm();
    };

    const handleCancel = () => close();
    const handleBackdrop = (e) => {
      if (e.target === modal) close();
    };

    function cleanup() {
      activeConfirmCancel = null;
      if (cancelBtn) cancelBtn.style.display = "";
      if (okBtn) okBtn.className = "btn btn-danger";
      okBtn.removeEventListener("click", handleOk);
      cancelBtn.removeEventListener("click", handleCancel);
      modal.removeEventListener("click", handleBackdrop);
    }

    activeConfirmCancel = close;
    okBtn.addEventListener("click", handleOk);
    cancelBtn.addEventListener("click", handleCancel);
    modal.addEventListener("click", handleBackdrop);

    openModalElement(modal);
    okBtn.focus();
  }

  // --- Helper for Work updatedAt with legacy ID fallback ---
  function getWorkUpdatedAt(item) {
    if (!item) return 0;
    if (item.updatedAt !== undefined && item.updatedAt !== null) {
      const num = Number(item.updatedAt);
      if (!isNaN(num) && num > 0) return num;
      const parsed = new Date(item.updatedAt).getTime();
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    // Fallback to legacy id timestamp only
    const idNum = Number(item.id);
    return (!isNaN(idNum) && idNum > 0) ? idNum : 0;
  }

  function formatUpdateDateTime(timestamp) {
    if (!timestamp) return "Not recorded";
    try {
      const d = new Date(timestamp);
      if (!isNaN(d.getTime())) {
        const datePart = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        const timePart = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        return `${datePart}, ${timePart}`;
      }
    } catch (e) {}
    return String(timestamp);
  }

  // --- View 1: Live Dashboard ---
  function renderDashboard() {
    const items = DataStore.getAll();

    const totalWorkEl = document.getElementById("dash-total-work");
    const totalWorkValueEl = document.getElementById("dash-total-work-value");
    const inProgressEl = document.getElementById("dash-in-progress");
    const pendingEl = document.getElementById("dash-pending");
    const completedEl = document.getElementById("dash-completed");
    const receivedEl = document.getElementById("dash-received");
    const toReceiveEl = document.getElementById("dash-to-receive");
    const recentListEl = document.getElementById("dash-recent-works-list");
    const emptyStateEl = document.getElementById("dash-empty-state");

    const totalWork = items.length;
    let totalWorkValue = 0;
    let inProgress = 0;
    let pending = 0;
    let completed = 0;
    let totalReceived = 0;

    items.forEach(item => {
      totalWorkValue += (Number(item.totalAmount) || 0);
      if (item.status === "In Progress") inProgress++;
      else if (item.status === "Pending") pending++;
      else if (item.status === "Completed") completed++;

      totalReceived += getWorkTotalReceived(item);
    });

    const toReceive = Math.max(0, totalWorkValue - totalReceived);

    if (totalWorkEl) totalWorkEl.textContent = totalWork;
    if (totalWorkValueEl) totalWorkValueEl.textContent = formatINR(totalWorkValue);
    if (inProgressEl) inProgressEl.textContent = inProgress;
    if (pendingEl) pendingEl.textContent = pending;
    if (completedEl) completedEl.textContent = completed;
    if (receivedEl) receivedEl.textContent = formatINR(totalReceived);
    if (toReceiveEl) toReceiveEl.textContent = formatINR(toReceive);

    const progressFillEl = document.getElementById("dash-payment-progress-fill");
    if (progressFillEl) {
      const pct = totalWorkValue > 0 ? Math.min(100, Math.max(0, Math.round((totalReceived / totalWorkValue) * 100))) : 0;
      progressFillEl.style.width = pct + "%";
    }

    if (emptyStateEl) {
      emptyStateEl.style.display = "none";
    }

    renderRecentWorks(items, recentListEl);
  }

  function renderRecentWorks(items, container) {
    if (!container) return;

    if (!items || items.length === 0) {
      container.innerHTML = `
        <div class="empty-state recent-empty-state">
          <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          <h2 class="empty-title">No work added yet</h2>
          <p class="empty-desc">Add your first piece of work to start organizing everything in Vorkoo.</p>
          <button type="button" class="btn btn-primary dash-add-work-trigger">Add Work</button>
        </div>
      `;

      const addBtn = container.querySelector(".dash-add-work-trigger");
      if (addBtn) {
        addBtn.addEventListener("click", () => {
          const workBtn = document.getElementById("open-add-work-btn");
          if (workBtn) {
            workBtn.click();
          } else if (typeof openEditModal === "function") {
            window.location.hash = "#work";
          }
        });
      }
      return;
    }

    // Sort Recent Works by updatedAt descending (non-mutating copy) and take top 5
    const recentItems = [...items]
      .sort((a, b) => getWorkUpdatedAt(b) - getWorkUpdatedAt(a))
      .slice(0, 5);

    container.innerHTML = recentItems.map(item => {
      const statusClass = "badge-status-" + (item.status || "Pending").toLowerCase().replace(/\s+/g, "-");
      const priorityClass = "badge-priority-" + (item.priority || "Medium").toLowerCase();
      const remaining = getWorkRemainingAmount(item);
      const total = Number(item.totalAmount) || 0;
      const updatedAtTimestamp = getWorkUpdatedAt(item);
      const formattedUpdated = formatUpdateDateTime(updatedAtTimestamp);
      const deadlineFormatted = formatDeadlineDisplay(item.deadline) || item.deadline || "No deadline";

      return `
        <div class="recent-work-card" data-id="${item.id}" role="button" tabindex="0" title="Click to view or edit ${escapeHTML(item.title)}">
          <div class="recent-work-main">
            <div class="recent-work-title-row">
              <h3 class="recent-work-title">${escapeHTML(item.title)}</h3>
              <div class="recent-work-badges">
                <span class="work-badge ${statusClass}">${escapeHTML(item.status || "Pending")}</span>
                <span class="work-badge ${priorityClass}">${escapeHTML(item.priority || "Medium")}</span>
              </div>
            </div>
            <div class="recent-work-client">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>${escapeHTML(item.client || "Self / Unassigned")}</span>
            </div>
          </div>

          <div class="recent-work-details">
            <div class="recent-work-detail-item">
              <span class="detail-label">Deadline</span>
              <span class="detail-val">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${escapeHTML(deadlineFormatted)}
              </span>
            </div>

            <div class="recent-work-detail-item">
              <span class="detail-label">Payment</span>
              <span class="detail-val ${remaining > 0 ? 'text-cyan' : 'text-completed'}">
                ${remaining > 0 ? `${formatINR(remaining)} remaining` : `Fully Paid (${formatINR(total)})`}
              </span>
            </div>

            <div class="recent-work-detail-item recent-work-updated-col">
              <span class="detail-label">Last Updated</span>
              <span class="detail-val text-muted" title="${escapeHTML(formattedUpdated)}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${escapeHTML(formattedUpdated)}
              </span>
            </div>

            <div class="recent-work-arrow" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".recent-work-card").forEach(card => {
      const handleAction = () => {
        const id = card.getAttribute("data-id");
        const item = DataStore.getAll().find(i => String(i.id) === String(id));
        if (item && typeof openEditModal === "function") {
          openEditModal(item);
        }
      };

      card.addEventListener("click", handleAction);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleAction();
        }
      });
    });
  }

  // --- Dedicated Deadline Conflict Modal ---
  let activeConflictDeadline = null;

  function viewConflictingWorks(deadline) {
    if (!deadline) return;
    openConflictModal(deadline);
  }

  function openConflictModal(deadline) {
    if (!deadline) return;
    activeConflictDeadline = deadline;

    const modal = document.getElementById("deadline-conflict-modal");
    if (!modal) return;

    renderConflictModalContent(deadline);
    openModalElement(modal);

    const closeBtn = document.getElementById("close-conflict-modal-btn");
    if (closeBtn) closeBtn.focus();
  }

  function closeConflictModal() {
    const modal = document.getElementById("deadline-conflict-modal");
    closeModalElement(modal);
    activeConflictDeadline = null;
  }

  function renderConflictModalContent(deadline) {
    const bodyEl = document.getElementById("conflict-modal-body");
    if (!bodyEl) return;

    const targetDeadline = (deadline || "").trim();
    const allItems = DataStore.getAll();
    const conflicts = allItems.filter(item => (item.deadline || "").trim() === targetDeadline);
    const formattedDate = formatDeadlineDisplay(targetDeadline) || targetDeadline || "No deadline";

    if (conflicts.length < 2) {
      bodyEl.innerHTML = `
        <div class="conflict-modal-empty">
          <svg class="conflict-empty-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--status-completed)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <h3 class="conflict-empty-title">No Active Conflict</h3>
          <p class="conflict-empty-desc">
            There are no longer conflicting works for deadline <strong>${escapeHTML(formattedDate)}</strong> (${conflicts.length} work item${conflicts.length === 1 ? "" : "s"} scheduled).
          </p>
        </div>
      `;
      return;
    }

    const itemsHTML = conflicts.map(item => {
      const statusClass = "badge-status-" + (item.status || "Pending").toLowerCase().replace(/\s+/g, "-");
      const priorityClass = "badge-priority-" + (item.priority || "Medium").toLowerCase();
      const total = Number(item.totalAmount) || 0;
      const received = getWorkTotalReceived(item);
      const remaining = getWorkRemainingAmount(item);

      return `
        <div class="conflict-item-card">
          <div class="conflict-item-header">
            <div class="conflict-item-title-group">
              <h4 class="conflict-item-title">${escapeHTML(item.title)}</h4>
              <p class="conflict-item-client">${escapeHTML(item.client || "Self / Unassigned")}</p>
            </div>
            <button type="button" class="btn btn-secondary conflict-item-edit-btn" data-id="${item.id}" aria-label="Edit ${escapeHTML(item.title)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              <span>Edit</span>
            </button>
          </div>
          <div class="conflict-item-meta">
            <span class="conflict-meta-item">
              <span class="meta-label">Deadline:</span>
              <span class="meta-val">${escapeHTML(formatDeadlineDisplay(item.deadline) || item.deadline || "No deadline")}</span>
            </span>
            <span class="work-badge ${statusClass}">${escapeHTML(item.status || "Pending")}</span>
            <span class="work-badge ${priorityClass}">${escapeHTML(item.priority || "Medium")} Priority</span>
          </div>
          <div class="conflict-item-financials">
            <div class="conflict-finance-col">
              <span class="label">Total Amount</span>
              <span class="val">${formatINR(total)}</span>
            </div>
            <div class="conflict-finance-col">
              <span class="label">Received Amount</span>
              <span class="val received">${formatINR(received)}</span>
            </div>
            <div class="conflict-finance-col">
              <span class="label">Remaining Amount</span>
              <span class="val remaining">${formatINR(remaining)}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");

    bodyEl.innerHTML = `
      <div class="conflict-summary-banner">
        <div class="conflict-summary-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <div class="conflict-summary-info">
          <div class="conflict-summary-date"><strong>Deadline Date:</strong> ${escapeHTML(formattedDate)}${targetDeadline !== formattedDate ? ` (${escapeHTML(targetDeadline)})` : ""}</div>
          <div class="conflict-summary-count">${conflicts.length} works share this exact deadline</div>
        </div>
      </div>
      <div class="conflict-items-list">
        ${itemsHTML}
      </div>
    `;

    // Attach Edit listeners to conflicting work items
    bodyEl.querySelectorAll(".conflict-item-edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const item = DataStore.getAll().find(i => String(i.id) === String(id));
        if (item && typeof openEditModal === "function") {
          closeConflictModal();
          openEditModal(item);
        }
      });
    });
  }

  function initConflictModal() {
    const modal = document.getElementById("deadline-conflict-modal");
    if (!modal) return;

    const closeBtn = document.getElementById("close-conflict-modal-btn");
    const footerCloseBtn = document.getElementById("footer-close-conflict-btn");

    if (closeBtn) closeBtn.addEventListener("click", closeConflictModal);
    if (footerCloseBtn) footerCloseBtn.addEventListener("click", closeConflictModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeConflictModal();
    });
  }

  // --- Helpers for Work Cards (Shared between Work view and Client Details view) ---
  function getDeadlineCountdown(deadlineStr, status, nowInput) {
    if (!deadlineStr) return null;
    if (String(status || "").trim().toLowerCase() === "completed") return null;

    const parts = String(deadlineStr).trim().split("-");
    if (parts.length !== 3) return null;

    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);

    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;

    const targetDate = new Date(y, m, d);
    if (isNaN(targetDate.getTime())) return null;
    if (targetDate.getFullYear() !== y || targetDate.getMonth() !== m || targetDate.getDate() !== d) return null;

    const now = nowInput instanceof Date ? nowInput : new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffMs = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    let text = "";
    let urgencyClass = "";

    if (diffDays === 0) {
      text = "Due today";
      urgencyClass = "countdown-imminent";
    } else if (diffDays === 1) {
      text = "Due tomorrow";
      urgencyClass = "countdown-imminent";
    } else if (diffDays > 1) {
      text = `Due in ${diffDays} days`;
      urgencyClass = "countdown-future";
    } else if (diffDays === -1) {
      text = "Overdue by 1 day";
      urgencyClass = "countdown-overdue";
    } else {
      text = `Overdue by ${Math.abs(diffDays)} days`;
      urgencyClass = "countdown-overdue";
    }

    return {
      text,
      urgencyClass,
      diffDays
    };
  }
  window.getDeadlineCountdown = getDeadlineCountdown;

  function buildWorkCardHTML(item) {
    const statusClass = "badge-status-" + (item.status || "Pending").toLowerCase().replace(/\s+/g, "-");
    const priorityClass = "badge-priority-" + (item.priority || "Medium").toLowerCase();
    const received = getWorkTotalReceived(item);
    const remaining = getWorkRemainingAmount(item);
    const { status: payStatus, badgeClass: payBadgeClass } = getPaymentStatusInfo(item);

    // Work-level Deadline Conflict Warning
    let conflictWarningHTML = "";
    const deadlineStr = (item.deadline || "").trim();
    if (deadlineStr) {
      const allItems = DataStore.getAll();
      const conflictCount = allItems.filter(other => (other.deadline || "").trim() === deadlineStr).length;
      if (conflictCount >= 2) {
        const dismissKey = "work_card_" + item.id + "_" + deadlineStr + "_" + conflictCount;
        if (!DismissStore.isDismissed(dismissKey)) {
          conflictWarningHTML = `
            <div class="work-card-conflict-warning">
              <span class="conflict-warning-text">⚠ Deadline conflict — ${conflictCount} works share this deadline.</span>
              <div class="conflict-warning-actions">
                <button type="button" class="warning-action-btn view-conflict-btn" data-deadline="${escapeHTML(deadlineStr)}">View</button>
                <button type="button" class="warning-action-btn dismiss-btn" data-dismiss-key="${dismissKey}">Dismiss</button>
              </div>
            </div>
          `;
        }
      }
    }

    const countdown = getDeadlineCountdown(item.deadline, item.status);
    const countdownHTML = countdown ? `
      <span class="work-deadline-countdown ${countdown.urgencyClass}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path></svg>
        <span>${escapeHTML(countdown.text)}</span>
      </span>
    ` : "";

    let attachmentHTML = "";
    if (item.attachment && item.attachment.name) {
      const fileNameEscaped = escapeHTML(item.attachment.name);
      const fileSizeFormatted = formatFileSize(item.attachment.size);
      attachmentHTML = `
        <span class="work-card-attachment" title="${fileNameEscaped} (${fileSizeFormatted})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
          <span class="attachment-name">${fileNameEscaped}</span>
        </span>
      `;
    }

    return `
      <div class="work-card">
        <div class="work-card-info">
          <div class="work-card-header">
            <div>
              <h3 class="work-card-title">${escapeHTML(item.title)}</h3>
              <p class="work-card-client">${escapeHTML(item.client || "Self / Unassigned")}</p>
            </div>
            <div class="card-actions-group">
              <button type="button" class="card-action-btn view-history-btn" data-id="${item.id}" title="Payment History" aria-label="Payment History">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="₹"><path d="M6 3h12"></path><path d="M6 8h12"></path><path d="M6 13l8.5 8"></path><path d="M6 13h3"></path><path d="M9 13c6.667 0 6.667-10 0-10"></path></svg>
              </button>
              <button type="button" class="card-action-btn edit-work-btn" data-id="${item.id}" title="Edit Work" aria-label="Edit Work">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button type="button" class="card-action-btn delete-work-btn" data-id="${item.id}" title="Delete Work" aria-label="Delete Work">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
          ${item.description ? `<p class="work-card-desc">${escapeHTML(item.description)}</p>` : ""}
          <div class="work-card-meta">
            <span class="work-card-deadline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              ${escapeHTML(formatDeadlineDisplay(item.deadline) || item.deadline || "No deadline")}
            </span>
            ${countdownHTML}
            <span class="work-badge ${priorityClass}">${escapeHTML(item.priority || "Medium")} Priority</span>
            <span class="work-badge ${statusClass}">${escapeHTML(item.status || "Pending")}</span>
            <span class="work-badge ${payBadgeClass}">${escapeHTML(payStatus)}</span>
            ${attachmentHTML}
          </div>
          ${conflictWarningHTML}
        </div>

        <div class="work-card-financials">
          <div class="work-finance-row">
            <span class="label">Total:</span>
            <span class="val">${formatINR(item.totalAmount)}</span>
          </div>
          <div class="work-finance-row">
            <span class="label">Received:</span>
            <span class="val received">${formatINR(received)}</span>
          </div>
          <div class="work-finance-row total-row">
            <span class="label">Remaining:</span>
            <span class="val remaining">${formatINR(remaining)}</span>
          </div>
        </div>
      </div>
    `;
  }

  function attachWorkCardListeners(container) {
    if (!container) return;

    // Attach edit listeners
    container.querySelectorAll(".edit-work-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const item = DataStore.getAll().find(i => String(i.id) === String(id));
        if (item && typeof openEditModal === "function") {
          openEditModal(item);
        }
      });
    });

    // Attach payment history listeners
    container.querySelectorAll(".view-history-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        openPaymentHistoryModal(id);
      });
    });

    // Attach delete listeners
    container.querySelectorAll(".delete-work-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        showConfirmDialog({
          title: "Delete Work",
          message: "Delete this work item? This action cannot be undone.",
          okText: "Delete",
          onConfirm: () => {
            DataStore.deleteItem(id);
            renderAllViews();
          }
        });
      });
    });

    // Attach view conflict listeners
    container.querySelectorAll(".view-conflict-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const deadline = btn.getAttribute("data-deadline");
        viewConflictingWorks(deadline);
      });
    });

    // Attach dismiss conflict warning listeners
    container.querySelectorAll(".dismiss-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const dismissKey = btn.getAttribute("data-dismiss-key");
        if (dismissKey) {
          DismissStore.dismiss(dismissKey);
          renderAllViews();
        }
      });
    });
  }

  // --- Sorting Helper for Live Work Page ---
  function sortWorkItems(items, sortKey) {
    const list = items.slice();
    const parseDate = (d) => {
      const t = d ? Date.parse(d) : NaN;
      return Number.isNaN(t) ? null : t;
    };
    const priorityRank = { high: 3, medium: 2, low: 1 };
    const getRank = (p) => priorityRank[String(p || "").toLowerCase()] || 2;

    switch (sortKey) {
      case "oldest":
        return list.reverse();
      case "deadline-nearest":
        return list.sort((a, b) => {
          const tA = parseDate(a.deadline), tB = parseDate(b.deadline);
          if (tA === null && tB === null) return 0;
          if (tA === null) return 1;
          if (tB === null) return -1;
          return tA - tB;
        });
      case "deadline-furthest":
        return list.sort((a, b) => {
          const tA = parseDate(a.deadline), tB = parseDate(b.deadline);
          if (tA === null && tB === null) return 0;
          if (tA === null) return 1;
          if (tB === null) return -1;
          return tB - tA;
        });
      case "priority-desc":
        return list.sort((a, b) => getRank(b.priority) - getRank(a.priority));
      case "priority-asc":
        return list.sort((a, b) => getRank(a.priority) - getRank(b.priority));
      case "newest":
      default:
        return list;
    }
  }

  // --- View 2: Live Work Page ---
  function renderWork() {
    const cardsContainer = document.getElementById("work-cards-list");
    if (!cardsContainer) return;

    const searchInput = document.getElementById("work-search-input");
    const statusFilter = document.getElementById("work-status-filter");
    const priorityFilter = document.getElementById("work-priority-filter");
    const sortFilter = document.getElementById("work-sort-filter");

    const searchTerm = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const selectedStatus = statusFilter ? statusFilter.value : "All";
    const selectedPriority = priorityFilter ? priorityFilter.value : "All";
    const selectedSort = sortFilter ? sortFilter.value : "newest";

    const allItems = DataStore.getAll();

    if (allItems.length === 0) {
      cardsContainer.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          <h2 class="empty-title">No work yet.</h2>
          <p class="empty-desc">Create your first work item to manage deadlines and priorities.</p>
        </div>
      `;
      return;
    }

    const filtered = allItems.filter(item => {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm) ||
        (item.client && item.client.toLowerCase().includes(searchTerm)) ||
        (item.deadline && item.deadline.toLowerCase().includes(searchTerm)) ||
        (item.deadline && formatDeadlineDisplay(item.deadline).toLowerCase().includes(searchTerm));
      const matchStatus = selectedStatus === "All" || item.status === selectedStatus;
      const matchPriority = selectedPriority === "All" || item.priority === selectedPriority;
      return matchSearch && matchStatus && matchPriority;
    });

    if (filtered.length === 0) {
      cardsContainer.innerHTML = `
        <div class="empty-state" style="padding: 3rem 1.5rem;">
          <h3 class="empty-title">No matching work items</h3>
          <p class="empty-desc">Try clearing your search query or filter selections.</p>
        </div>
      `;
      return;
    }

    const sorted = sortWorkItems(filtered, selectedSort);

    cardsContainer.innerHTML = sorted.map(buildWorkCardHTML).join("");
    attachWorkCardListeners(cardsContainer);
  }

  // --- View 3: Live Payments Page ---
  function renderPayments() {
    const container = document.getElementById("payments-list-container");
    if (!container) return;

    const items = DataStore.getAll();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          <h2 class="empty-title">No payment records yet.</h2>
          <p class="empty-desc">When you record payments against work, they will automatically appear here.</p>
        </div>
      `;
      return;
    }

    let totalWorkValue = 0;
    let totalReceived = 0;
    let totalRemaining = 0;

    const rows = items.map(item => {
      const total = Number(item.totalAmount) || 0;
      const received = getWorkTotalReceived(item);
      const remaining = getWorkRemainingAmount(item);

      totalWorkValue += total;
      totalReceived += received;
      totalRemaining += remaining;

      const { status: stateText, badgeClass: stateBadgeClass, key: stateKey } = getPaymentStatusInfo(item);

      const pCount = Array.isArray(item.payments) ? item.payments.length : 0;

      return `
        <tr class="pay-row pay-row-${stateKey}">
          <td>
            <div class="table-main-cell pay-work-title">${escapeHTML(item.title)}</div>
          </td>
          <td>
            <span class="${item.client ? 'table-client-name' : 'table-sub-cell'}">${escapeHTML(item.client || "Self / Unassigned")}</span>
          </td>
          <td class="table-main-cell pay-col-amount">${formatINR(total)}</td>
          <td class="pay-col-amount pay-received-${stateKey}">${formatINR(received)}</td>
          <td class="pay-col-amount pay-remaining-${stateKey}">${formatINR(remaining)}</td>
          <td>
            <span class="work-badge ${stateBadgeClass} pay-status-badge">
              <span class="pay-status-dot ${stateKey}"></span>
              ${stateText}
            </span>
          </td>
          <td>
            <div class="pay-table-actions">
              <button type="button" class="btn btn-secondary pay-row-action-btn pay-btn-add add-payment-btn" data-id="${item.id}" ${remaining <= 0 ? 'disabled title="Fully Paid"' : 'title="Record Payment"'}>
                + Add
              </button>
              <button type="button" class="btn btn-secondary pay-row-action-btn view-history-btn" data-id="${item.id}" title="View Payment History">
                History${pCount > 0 ? ` (${pCount})` : ''}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    container.innerHTML = `
      <div class="stats-grid" style="margin-bottom: 1.5rem;">
        <div class="stat-card">
          <span class="stat-label">Total Work Value</span>
          <span class="stat-value">${formatINR(totalWorkValue)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total Received</span>
          <span class="stat-value" style="color: var(--status-completed);">${formatINR(totalReceived)}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total Remaining</span>
          <span class="stat-value" style="color: var(--status-pending);">${formatINR(totalRemaining)}</span>
        </div>
      </div>

      <div class="vorkoo-data-table-wrap">
        <table class="vorkoo-data-table">
          <thead>
            <tr>
              <th>Work Title</th>
              <th>Client Name</th>
              <th>Total Amount</th>
              <th>Received Amount</th>
              <th>Remaining Amount</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll(".add-payment-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        openAddPaymentModal(id);
      });
    });

    container.querySelectorAll(".view-history-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        openPaymentHistoryModal(id);
      });
    });
  }

  let selectedClientName = null;

  // --- View 4: Live Clients Page ---
  function renderClientDetails(clientName, items, container, pageClientsHeader) {
    if (pageClientsHeader) pageClientsHeader.style.display = "none";

    const clientWorks = items.filter(
      item => (item.client || "").trim().toLowerCase() === clientName.trim().toLowerCase()
    );

    let totalValue = 0;
    let totalReceived = 0;
    let totalRemaining = 0;
    let activeCount = 0;

    clientWorks.forEach(item => {
      if (String(item.status || "").trim().toLowerCase() !== "completed") {
        activeCount += 1;
      }
      totalValue += Number(item.totalAmount) || 0;
      totalReceived += getWorkTotalReceived(item);
      totalRemaining += getWorkRemainingAmount(item);
    });

    const detailsDismissKey = "client_details_" + clientName.toLowerCase().trim() + "_" + activeCount;
    let clientDetailsWarningHTML = "";
    if (activeCount >= 3 && !DismissStore.isDismissed(detailsDismissKey)) {
      clientDetailsWarningHTML = `
        <div class="client-details-warning-banner">
          <div class="warning-content">
            <span>⚠️</span>
            <span>High workload — ${activeCount} active works.</span>
          </div>
          <div class="conflict-warning-actions">
            <button type="button" class="warning-action-btn scroll-client-works-btn">View Works</button>
            <button type="button" class="warning-action-btn dismiss-client-details-btn" data-dismiss-key="${detailsDismissKey}">Dismiss</button>
          </div>
        </div>
      `;
    }

    const cardsHTML = clientWorks.length > 0
      ? `<div class="work-cards-list">
           ${clientWorks.map(buildWorkCardHTML).join("")}
         </div>`
      : `
        <div class="empty-state" style="padding: 3rem 1.5rem;">
          <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          <h2 class="empty-title">No work items found</h2>
          <p class="empty-desc">There are currently no work items linked to this client.</p>
          <button type="button" class="btn btn-secondary back-to-clients-btn-empty" style="margin-top: 1rem;">Back to Clients</button>
        </div>
      `;

    container.innerHTML = `
      <div class="client-details-view">
        <div style="margin-bottom: 1.5rem;">
          <button type="button" class="btn btn-secondary" id="back-to-clients-btn" style="display: inline-flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Clients
          </button>
        </div>

        <div style="margin-bottom: 2rem;">
          <div style="margin-bottom: 1.25rem;">
            <h1 class="page-title" style="margin: 0 0 6px;">${escapeHTML(clientName)}</h1>
            <p class="page-subtitle" style="margin: 0;">Detailed view and all linked work items for this client.</p>
          </div>

          ${clientDetailsWarningHTML}

          <div class="client-stats-grid">
            <div class="stat-card">
              <span class="stat-label">Total Work Items</span>
              <span class="stat-value">${clientWorks.length}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Total Work Value</span>
              <span class="stat-value">${formatINR(totalValue)}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Total Received</span>
              <span class="stat-value" style="color: var(--status-completed);">${formatINR(totalReceived)}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Total Remaining</span>
              <span class="stat-value" style="color: var(--accent-cyan);">${formatINR(totalRemaining)}</span>
            </div>
          </div>
        </div>

        <div class="client-works-section">
          <h2 style="font-size: 1.15rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1rem;">
            Work Items (${clientWorks.length})
          </h2>
          ${cardsHTML}
        </div>
      </div>
    `;

    // Attach Back button listener
    const backBtn = container.querySelector("#back-to-clients-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        selectedClientName = null;
        renderClients();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const emptyBackBtn = container.querySelector(".back-to-clients-btn-empty");
    if (emptyBackBtn) {
      emptyBackBtn.addEventListener("click", () => {
        selectedClientName = null;
        renderClients();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Attach View Works (scroll) listener
    const scrollBtn = container.querySelector(".scroll-client-works-btn");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", () => {
        const worksSec = container.querySelector(".client-works-section");
        if (worksSec) {
          worksSec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    // Attach Dismiss listener for Client Details warning
    const dismissDetailsBtn = container.querySelector(".dismiss-client-details-btn");
    if (dismissDetailsBtn) {
      dismissDetailsBtn.addEventListener("click", () => {
        const dismissKey = dismissDetailsBtn.getAttribute("data-dismiss-key");
        if (dismissKey) {
          DismissStore.dismiss(dismissKey);
          renderAllViews();
        }
      });
    }

    // Attach Work card Edit & Delete listeners
    attachWorkCardListeners(container);
  }

  function renderClientsList(items, container, pageClientsHeader) {
    if (pageClientsHeader) pageClientsHeader.style.display = "";

    const clientsMap = {};
    items.forEach(item => {
      const clientName = (item.client || "").trim();
      if (!clientName) return; // Ignore unassigned items

      const normKey = clientName.toLowerCase();
      if (!clientsMap[normKey]) {
        clientsMap[normKey] = {
          name: clientName,
          count: 0,
          activeCount: 0,
          totalValue: 0,
          received: 0,
          remaining: 0
        };
      }
      clientsMap[normKey].count += 1;
      if (String(item.status || "").trim().toLowerCase() !== "completed") {
        clientsMap[normKey].activeCount += 1;
      }
      clientsMap[normKey].totalValue += Number(item.totalAmount) || 0;
      clientsMap[normKey].received += getWorkTotalReceived(item);
      clientsMap[normKey].remaining += getWorkRemainingAmount(item);
    });

    const clientList = Object.values(clientsMap).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

    if (clientList.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
          <h2 class="empty-title">No clients yet.</h2>
          <p class="empty-desc">Clients will be discovered automatically whenever you assign them to a piece of work.</p>
        </div>
      `;
      return;
    }

    const rows = clientList.map(c => {
      const clientDismissKey = "client_row_" + c.name.toLowerCase().trim() + "_" + c.activeCount;
      let clientWarningHTML = "";
      if (c.activeCount >= 3 && !DismissStore.isDismissed(clientDismissKey)) {
        clientWarningHTML = `
          <div class="client-row-warning">
            <span class="client-warning-badge">⚠ High workload — ${c.activeCount} active works</span>
            <button type="button" class="warning-action-btn view-client-works-btn" data-client="${escapeHTML(c.name)}">View Works</button>
            <button type="button" class="warning-action-btn dismiss-client-btn" data-dismiss-key="${clientDismissKey}">Dismiss</button>
          </div>
        `;
      }

      return `
        <tr class="client-row" data-client="${escapeHTML(c.name)}" tabindex="0" role="button" aria-label="View details for ${escapeHTML(c.name)}">
          <td class="table-main-cell">
            <div style="font-weight: 600;">${escapeHTML(c.name)}</div>
            ${clientWarningHTML}
          </td>
          <td><span class="work-badge badge-priority-medium">${c.count} ${c.count === 1 ? 'Work item' : 'Work items'}</span></td>
          <td class="table-main-cell pay-col-amount">${formatINR(c.totalValue)}</td>
          <td class="pay-col-amount" style="color: var(--status-completed); font-weight: 600;">${formatINR(c.received)}</td>
          <td class="pay-col-amount" style="color: var(--accent-cyan); font-weight: 600;">${formatINR(c.remaining)}</td>
          <td style="text-align: right;">
            <button type="button" class="card-action-btn delete-client-btn" data-client="${escapeHTML(c.name)}" data-count="${c.count}" title="Delete Client" aria-label="Delete Client">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join("");

    container.innerHTML = `
      <div class="vorkoo-data-table-wrap">
        <table class="vorkoo-data-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Works</th>
              <th>Total Work Value</th>
              <th>Received</th>
              <th>Remaining</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;

    // Row click opens Client Details
    container.querySelectorAll(".client-row").forEach(row => {
      row.addEventListener("click", (e) => {
        if (e.target.closest(".card-action-btn") || e.target.closest(".warning-action-btn")) return;
        const clientName = row.getAttribute("data-client");
        if (clientName) {
          selectedClientName = clientName;
          renderClients();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });

      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (e.target.closest(".card-action-btn") || e.target.closest(".warning-action-btn")) return;
          e.preventDefault();
          const clientName = row.getAttribute("data-client");
          if (clientName) {
            selectedClientName = clientName;
            renderClients();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      });
    });

    // Client row "View Works" button handler
    container.querySelectorAll(".view-client-works-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const clientName = btn.getAttribute("data-client");
        if (clientName) {
          selectedClientName = clientName;
          renderClients();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });

    // Client row "Dismiss" button handler
    container.querySelectorAll(".dismiss-client-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const dismissKey = btn.getAttribute("data-dismiss-key");
        if (dismissKey) {
          DismissStore.dismiss(dismissKey);
          renderAllViews();
        }
      });
    });

    // Client deletion handler enforcing relationship safety
    container.querySelectorAll(".delete-client-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const count = parseInt(btn.getAttribute("data-count"), 10);
        if (count > 0) {
          showConfirmDialog({
            title: "Cannot Delete Client",
            message: "This client has linked work items. Delete the linked work first.",
            okText: "Understood",
            isAlert: true,
            onConfirm: () => {}
          });
        }
      });
    });
  }

  function renderClients() {
    const container = document.getElementById("clients-list-container");
    if (!container) return;

    const pageClientsHeader = document.querySelector("#page-clients .work-header");
    const items = DataStore.getAll();

    if (selectedClientName !== null) {
      renderClientDetails(selectedClientName, items, container, pageClientsHeader);
    } else {
      renderClientsList(items, container, pageClientsHeader);
    }
  }

  // --- Central Re-render Dispatcher ---
  function renderAllViews() {
    renderDashboard();
    renderWork();
    renderPayments();
    renderClients();
    if (activeConflictDeadline) {
      const modal = document.getElementById("deadline-conflict-modal");
      if (modal && modal.classList.contains("is-open")) {
        renderConflictModalContent(activeConflictDeadline);
      }
    }
    if (activeHistoryWorkId) {
      const modal = document.getElementById("payment-history-modal");
      if (modal && modal.classList.contains("is-open")) {
        renderPaymentHistoryModalContent(activeHistoryWorkId);
      }
    }
    if (typeof refreshWorkModalFinancials === "function") {
      refreshWorkModalFinancials();
    }
  }

  // --- Work Modal & Form Handling ---
  let openEditModal = null;
  let closeWorkModal = null;
  let refreshWorkModalFinancials = null;

  function initWorkModal() {
    const modal = document.getElementById("add-work-modal");
    const openBtn = document.getElementById("open-add-work-btn");
    const closeBtn = document.getElementById("close-add-work-btn");
    const cancelBtn = document.getElementById("cancel-add-work-btn");
    const form = document.getElementById("add-work-form");
    const modalTitle = document.getElementById("modal-work-title");
    const submitBtn = document.getElementById("submit-work-btn");

    let editingItemId = null;

    const titleInput = document.getElementById("work-form-title");
    const clientInput = document.getElementById("work-form-client");
    const descInput = document.getElementById("work-form-desc");
    const deadlineInput = document.getElementById("work-form-deadline");
    const priorityInput = document.getElementById("work-form-priority");
    const statusInput = document.getElementById("work-form-status");
    const totalInput = document.getElementById("work-form-total");
    const editPaymentSection = document.getElementById("work-edit-payment-section");
    const newPaymentSection = document.getElementById("work-new-payment-section");
    const receivedValDisplay = document.getElementById("work-form-received-val");
    const addPaymentBtn = document.getElementById("work-form-add-payment-btn");
    const initialPaymentInput = document.getElementById("work-form-initial-payment");
    const initialPaymentDetails = document.getElementById("work-initial-payment-details");
    const initialDateInput = document.getElementById("work-form-initial-date");
    const initialNoteInput = document.getElementById("work-form-initial-note");
    const remainingDisplay = document.getElementById("work-form-remaining-val");

    const errorTitle = document.getElementById("error-title");
    const errorTotal = document.getElementById("error-total");
    const errorReceived = document.getElementById("error-received");
    const errorInitialPayment = document.getElementById("error-initial-payment");
    const errorInitialDate = document.getElementById("error-initial-date");
    const errorInitialNote = document.getElementById("error-initial-note");
    const errorAttachment = document.getElementById("error-attachment");

    // Optional Attachment Controls
    const fileInput = document.getElementById("work-form-file-input");
    const attachBtn = document.getElementById("work-form-attach-btn");
    const emptyState = document.getElementById("work-file-empty-state");
    const selectedState = document.getElementById("work-file-selected-state");
    const fileNameEl = document.getElementById("work-file-name");
    const fileSizeEl = document.getElementById("work-file-size");
    const replaceBtn = document.getElementById("work-file-replace-btn");
    const removeBtn = document.getElementById("work-file-remove-btn");

    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
    let pendingAttachmentFile = null;
    let pendingAttachmentAction = "none"; // "none" | "add" | "keep" | "replace" | "remove"

    function renderAttachmentUI() {
      if (pendingAttachmentFile) {
        if (emptyState) emptyState.style.display = "none";
        if (selectedState) selectedState.style.display = "flex";
        if (fileNameEl) {
          fileNameEl.textContent = pendingAttachmentFile.name;
          fileNameEl.title = pendingAttachmentFile.name;
        }
        if (fileSizeEl) {
          fileSizeEl.textContent = `(${formatFileSize(pendingAttachmentFile.size)})`;
        }
      } else if (editingItemId !== null && pendingAttachmentAction === "keep") {
        const existing = DataStore.getAll().find(i => String(i.id) === String(editingItemId));
        if (existing && existing.attachment && existing.attachment.name) {
          if (emptyState) emptyState.style.display = "none";
          if (selectedState) selectedState.style.display = "flex";
          if (fileNameEl) {
            fileNameEl.textContent = existing.attachment.name;
            fileNameEl.title = existing.attachment.name;
          }
          if (fileSizeEl) {
            fileSizeEl.textContent = `(${formatFileSize(existing.attachment.size)})`;
          }
        } else {
          if (emptyState) emptyState.style.display = "flex";
          if (selectedState) selectedState.style.display = "none";
        }
      } else {
        if (emptyState) emptyState.style.display = "flex";
        if (selectedState) selectedState.style.display = "none";
      }
    }

    if (attachBtn) {
      attachBtn.addEventListener("click", () => {
        if (fileInput) fileInput.click();
      });
    }

    if (replaceBtn) {
      replaceBtn.addEventListener("click", () => {
        if (fileInput) fileInput.click();
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        if (errorAttachment) errorAttachment.textContent = "";
        if (fileInput) fileInput.value = "";
        pendingAttachmentFile = null;
        if (editingItemId !== null) {
          const existing = DataStore.getAll().find(i => String(i.id) === String(editingItemId));
          if (existing && existing.attachment) {
            pendingAttachmentAction = "remove";
          } else {
            pendingAttachmentAction = "none";
          }
        } else {
          pendingAttachmentAction = "none";
        }
        renderAttachmentUI();
      });
    }

    if (fileInput) {
      fileInput.addEventListener("change", () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;

        if (errorAttachment) errorAttachment.textContent = "";

        if (file.size > MAX_FILE_SIZE) {
          if (errorAttachment) {
            errorAttachment.textContent = `File size exceeds 25 MB limit (${formatFileSize(file.size)}). Please choose a smaller file.`;
          }
          fileInput.value = "";
          return;
        }

        pendingAttachmentFile = file;
        if (editingItemId !== null) {
          const existing = DataStore.getAll().find(i => String(i.id) === String(editingItemId));
          if (existing && existing.attachment) {
            pendingAttachmentAction = "replace";
          } else {
            pendingAttachmentAction = "add";
          }
        } else {
          pendingAttachmentAction = "add";
        }
        renderAttachmentUI();
      });
    }

    function updateRemaining() {
      const total = parseFloat(totalInput.value) || 0;

      if (editingItemId !== null) {
        if (newPaymentSection) newPaymentSection.style.display = "none";
        if (initialPaymentDetails) initialPaymentDetails.style.display = "none";
        if (editPaymentSection) editPaymentSection.style.display = "";

        const existing = DataStore.getAll().find(i => String(i.id) === String(editingItemId));
        const received = getWorkTotalReceived(existing);
        if (receivedValDisplay) {
          receivedValDisplay.textContent = formatINR(received);
        }
        const remaining = Math.max(0, total - received);
        if (remainingDisplay) {
          remainingDisplay.textContent = formatINR(remaining);
        }

        if (addPaymentBtn) {
          addPaymentBtn.style.display = "inline-flex";
          if (remaining <= 0) {
            addPaymentBtn.disabled = true;
            addPaymentBtn.title = "Work is fully paid (₹0 remaining)";
          } else {
            addPaymentBtn.disabled = false;
            addPaymentBtn.title = "Record a payment for this work";
          }
        }
      } else {
        if (editPaymentSection) editPaymentSection.style.display = "none";
        if (newPaymentSection) newPaymentSection.style.display = "";
        if (addPaymentBtn) addPaymentBtn.style.display = "none";

        const initialPaymentRaw = initialPaymentInput ? initialPaymentInput.value.trim() : "";
        const initialPayment = initialPaymentRaw === "" ? 0 : (parseFloat(initialPaymentRaw) || 0);

        if (initialPaymentInput) {
          initialPaymentInput.max = total > 0 ? total : "";
        }

        if (initialPaymentDetails) {
          if (initialPayment > 0) {
            initialPaymentDetails.style.display = "";
          } else {
            initialPaymentDetails.style.display = "none";
            if (errorInitialDate) errorInitialDate.textContent = "";
          }
        }

        if (errorInitialPayment) {
          if (total > 0 && initialPayment > total) {
            errorInitialPayment.textContent = `Initial Payment cannot exceed Total Amount (${formatINR(total)}).`;
          } else if (initialPayment < 0) {
            errorInitialPayment.textContent = "Initial Payment cannot be negative.";
          } else {
            errorInitialPayment.textContent = "";
          }
        }

        const remaining = Math.max(0, total - initialPayment);
        if (remainingDisplay) {
          remainingDisplay.textContent = formatINR(remaining);
        }
      }
    }

    refreshWorkModalFinancials = function() {
      if (modal && modal.classList.contains("is-open")) {
        updateRemaining();
      }
    };

    if (addPaymentBtn) {
      addPaymentBtn.addEventListener("click", () => {
        if (editingItemId !== null) {
          openAddPaymentModal(editingItemId);
        }
      });
    }

    function openModal() {
      editingItemId = null;
      if (modalTitle) modalTitle.textContent = "Add New Work";
      if (submitBtn) submitBtn.textContent = "Add Work";
      resetForm();
      pendingAttachmentAction = "none";
      renderAttachmentUI();
      updateRemaining();
      openModalElement(modal);
      titleInput.focus();
    }

    openEditModal = function(item) {
      if (!item) return;
      editingItemId = item.id;
      if (modalTitle) modalTitle.textContent = "Edit Work";
      if (submitBtn) submitBtn.textContent = "Save Changes";
      resetForm();

      if (item.attachment && item.attachment.name) {
        pendingAttachmentAction = "keep";
      } else {
        pendingAttachmentAction = "none";
      }
      renderAttachmentUI();

      titleInput.value = item.title || "";
      clientInput.value = item.client || "";
      descInput.value = item.description || "";
      deadlineInput.value = item.deadline || "";
      priorityInput.value = item.priority || "Medium";
      statusInput.value = item.status || "Pending";
      totalInput.value = item.totalAmount !== undefined ? item.totalAmount : "";

      updateRemaining();

      openModalElement(modal);
      titleInput.focus();
    };
    window.openEditModal = openEditModal;

    function closeModal() {
      editingItemId = null;
      if (modalTitle) modalTitle.textContent = "Add New Work";
      if (submitBtn) submitBtn.textContent = "Add Work";
      closeModalElement(modal);
      resetForm();
    }
    closeWorkModal = closeModal;

    function resetForm() {
      if (form) form.reset();
      if (errorTitle) errorTitle.textContent = "";
      if (errorTotal) errorTotal.textContent = "";
      if (errorReceived) errorReceived.textContent = "";
      if (errorInitialPayment) errorInitialPayment.textContent = "";
      if (errorInitialDate) errorInitialDate.textContent = "";
      if (errorInitialNote) errorInitialNote.textContent = "";
      if (errorAttachment) errorAttachment.textContent = "";
      if (initialPaymentInput) initialPaymentInput.value = "";
      if (initialDateInput) initialDateInput.value = "";
      if (initialNoteInput) initialNoteInput.value = "";
      if (initialPaymentDetails) initialPaymentDetails.style.display = "none";
      if (receivedValDisplay) receivedValDisplay.textContent = "₹0";
      if (remainingDisplay) remainingDisplay.textContent = "₹0";
      if (addPaymentBtn) addPaymentBtn.style.display = "none";
      pendingAttachmentFile = null;
      pendingAttachmentAction = "none";
      if (fileInput) fileInput.value = "";
      renderAttachmentUI();
    }

    if (openBtn) openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (totalInput) totalInput.addEventListener("input", updateRemaining);
    if (initialPaymentInput) initialPaymentInput.addEventListener("input", updateRemaining);
    if (initialDateInput) {
      initialDateInput.addEventListener("input", () => {
        if (errorInitialDate && initialDateInput.value.trim()) {
          errorInitialDate.textContent = "";
        }
      });
    }

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let isValid = true;
        const titleVal = titleInput.value.trim();
        const totalVal = parseFloat(totalInput.value);

        if (errorTitle) errorTitle.textContent = "";
        if (errorTotal) errorTotal.textContent = "";
        if (errorReceived) errorReceived.textContent = "";
        if (errorInitialPayment) errorInitialPayment.textContent = "";
        if (errorInitialDate) errorInitialDate.textContent = "";
        if (errorInitialNote) errorInitialNote.textContent = "";
        if (errorAttachment) errorAttachment.textContent = "";

        if (!titleVal) {
          if (errorTitle) errorTitle.textContent = "Work Title is required.";
          isValid = false;
        }

        if (isNaN(totalVal) || totalVal <= 0) {
          if (errorTotal) errorTotal.textContent = "Total Amount must be greater than ₹0.";
          isValid = false;
        }

        let initialPaymentVal = 0;
        let initialDateVal = "";
        let initialNoteVal = "";

        if (editingItemId !== null) {
          const existing = DataStore.getAll().find(i => String(i.id) === String(editingItemId));
          const existingReceived = getWorkTotalReceived(existing);
          if (!isNaN(totalVal) && existingReceived > totalVal) {
            if (errorTotal) errorTotal.textContent = `Total Amount cannot be less than already received amount (${formatINR(existingReceived)}).`;
            isValid = false;
          }
        } else {
          // New Work: validate initial payment
          const initialPaymentRaw = initialPaymentInput ? initialPaymentInput.value.trim() : "";
          initialPaymentVal = initialPaymentRaw === "" ? 0 : parseFloat(initialPaymentRaw);

          if (isNaN(initialPaymentVal) || initialPaymentVal < 0) {
            if (errorInitialPayment) errorInitialPayment.textContent = "Initial Payment cannot be negative.";
            isValid = false;
          } else if (!isNaN(totalVal) && initialPaymentVal > totalVal) {
            if (errorInitialPayment) errorInitialPayment.textContent = `Initial Payment cannot exceed Total Amount (${formatINR(totalVal)}).`;
            isValid = false;
          }

          if (initialPaymentVal > 0) {
            initialDateVal = initialDateInput ? initialDateInput.value.trim() : "";
            if (!initialDateVal) {
              if (errorInitialDate) errorInitialDate.textContent = "Payment Date is required.";
              isValid = false;
            }
            initialNoteVal = initialNoteInput ? initialNoteInput.value.trim() : "";
          }
        }

        if (!isValid) return;

        if (submitBtn) submitBtn.disabled = true;

        try {
          if (editingItemId !== null) {
            const existing = DataStore.getAll().find(i => String(i.id) === String(editingItemId));
            if (!existing) {
              closeModal();
              return;
            }

            let updatedAttachment = undefined;

            if (pendingAttachmentAction === "keep") {
              updatedAttachment = existing.attachment;
            } else if (pendingAttachmentAction === "remove") {
              if (existing.attachment && existing.attachment.id) {
                await AttachmentStore.deleteAttachment(existing.attachment.id, existing.id);
              }
              updatedAttachment = undefined;
            } else if (pendingAttachmentAction === "replace") {
              if (pendingAttachmentFile) {
                if (existing.attachment && existing.attachment.id) {
                  await AttachmentStore.deleteAttachment(existing.attachment.id, existing.id);
                }
                const newAttId = "att_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
                await AttachmentStore.saveAttachment({
                  id: newAttId,
                  workId: existing.id,
                  file: pendingAttachmentFile
                });
                updatedAttachment = {
                  id: newAttId,
                  name: pendingAttachmentFile.name,
                  type: pendingAttachmentFile.type || "application/octet-stream",
                  size: pendingAttachmentFile.size,
                  lastModified: pendingAttachmentFile.lastModified || Date.now()
                };
              } else {
                updatedAttachment = existing.attachment;
              }
            } else if (pendingAttachmentAction === "add") {
              if (pendingAttachmentFile) {
                const newAttId = "att_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
                await AttachmentStore.saveAttachment({
                  id: newAttId,
                  workId: existing.id,
                  file: pendingAttachmentFile
                });
                updatedAttachment = {
                  id: newAttId,
                  name: pendingAttachmentFile.name,
                  type: pendingAttachmentFile.type || "application/octet-stream",
                  size: pendingAttachmentFile.size,
                  lastModified: pendingAttachmentFile.lastModified || Date.now()
                };
              }
            }

            const payments = (existing && Array.isArray(existing.payments)) ? existing.payments : [];
            const receivedVal = getWorkTotalReceived({ payments });
            const remainingVal = Math.max(0, totalVal - receivedVal);

            const updatedItem = {
              ...existing,
              title: titleVal,
              client: clientInput.value.trim(),
              description: descInput.value.trim(),
              deadline: deadlineInput.value || "",
              priority: priorityInput.value,
              status: statusInput.value,
              totalAmount: totalVal,
              payments: payments,
              receivedAmount: receivedVal,
              remainingAmount: remainingVal
            };

            if (updatedAttachment) {
              updatedItem.attachment = updatedAttachment;
            } else {
              delete updatedItem.attachment;
            }

            DataStore.updateItem(updatedItem);

            // Preserve or update Client Details context if editing a work from Client Details
            if (selectedClientName && existing && (existing.client || "").trim().toLowerCase() === selectedClientName.trim().toLowerCase()) {
              selectedClientName = clientInput.value.trim() || null;
            }
          } else {
            const newWorkId = Date.now();
            let newAttachment = undefined;

            if (pendingAttachmentFile) {
              const newAttId = "att_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
              await AttachmentStore.saveAttachment({
                id: newAttId,
                workId: newWorkId,
                file: pendingAttachmentFile
              });
              newAttachment = {
                id: newAttId,
                name: pendingAttachmentFile.name,
                type: pendingAttachmentFile.type || "application/octet-stream",
                size: pendingAttachmentFile.size,
                lastModified: pendingAttachmentFile.lastModified || Date.now()
              };
            }

            const payments = [];
            if (initialPaymentVal > 0) {
              payments.push({
                id: "pay_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
                amount: initialPaymentVal,
                date: initialDateVal,
                note: initialNoteVal || "Initial payment"
              });
            }

            const newItem = {
              id: newWorkId,
              title: titleVal,
              client: clientInput.value.trim(),
              description: descInput.value.trim(),
              deadline: deadlineInput.value || "",
              priority: priorityInput.value,
              status: statusInput.value,
              totalAmount: totalVal,
              payments: payments,
              receivedAmount: initialPaymentVal,
              remainingAmount: Math.max(0, totalVal - initialPaymentVal)
            };

            if (newAttachment) {
              newItem.attachment = newAttachment;
            }

            DataStore.addItem(newItem);
          }

          renderAllViews();
          closeModal();
        } catch (storageErr) {
          console.error("Failed to store attachment in IndexedDB:", storageErr);
          if (errorAttachment) {
            errorAttachment.textContent = "Storage error: " + (storageErr.message || "Could not save file") + ". Work was not saved.";
          }
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    const searchInput = document.getElementById("work-search-input");
    const statusFilter = document.getElementById("work-status-filter");
    const priorityFilter = document.getElementById("work-priority-filter");
    const sortFilter = document.getElementById("work-sort-filter");

    if (searchInput) searchInput.addEventListener("input", renderWork);
    if (statusFilter) statusFilter.addEventListener("change", renderWork);
    if (priorityFilter) priorityFilter.addEventListener("change", renderWork);
    if (sortFilter) sortFilter.addEventListener("change", renderWork);
  }

  // --- Router & Navigation ---
  function initRouter() {
    const navItems = document.querySelectorAll('.nav-item');
    const pageViews = document.querySelectorAll('.page-view');
    const sidebar = document.getElementById('appSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const hamburgerBtn = document.getElementById('hamburgerBtn');

    const closeMobileMenu = () => {
      if (sidebar) sidebar.classList.remove('open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('open');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    };

    const toggleMobileMenu = () => {
      const isOpen = sidebar && sidebar.classList.contains('open');
      if (isOpen) closeMobileMenu();
      else {
        if (sidebar) sidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('open');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
      }
    };

    const navigateTo = (route) => {
      const targetView = document.getElementById(`page-${route}`) || document.getElementById('page-dashboard');
      const actualRoute = targetView.id.replace('page-', '');

      pageViews.forEach(view => view.classList.remove('active'));
      targetView.classList.add('active');

      if (actualRoute !== 'clients' && selectedClientName !== null) {
        selectedClientName = null;
      }

      navItems.forEach(item => {
        if (item.dataset.route === actualRoute) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      closeMobileMenu();

      if (window.location.hash !== `#${actualRoute}`) {
        window.location.hash = actualRoute;
      }

      renderAllViews();
    };

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (item.dataset.route === 'clients' && selectedClientName !== null) {
          selectedClientName = null;
          renderClients();
        }
      });
    });

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileMenu);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    window.addEventListener('hashchange', () => {
      const route = window.location.hash.replace('#', '');
      navigateTo(route || 'dashboard');
    });

    const initialRoute = window.location.hash.replace('#', '');
    navigateTo(initialRoute || 'dashboard');
  }

  // --- Unified Theme Management ---
  function initTheme() {
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');

    const updateThemeUI = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      if (mobileThemeToggle) {
        mobileThemeToggle.setAttribute(
          'aria-label',
          theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
        );
      }
    };

    const changeTheme = (newTheme) => {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      updateThemeUI(newTheme);
    };

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 
                       document.documentElement.getAttribute('data-theme') || 
                       'dark';
    updateThemeUI(savedTheme);

    if (mobileThemeToggle) {
      mobileThemeToggle.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        changeTheme(activeTheme === 'dark' ? 'light' : 'dark');
      });
    }
  }

  function getUserInitials(name) {
    if (!name || typeof name !== "string") return "U";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function updateUserInfoUI() {
    if (!currentUser) return;
    const fullName = currentUser.fullName || "User";
    const email = currentUser.email || "";
    const initials = getUserInitials(fullName);

    // Settings page info
    const nameEl = document.getElementById("settings-user-name");
    const emailEl = document.getElementById("settings-user-email");
    if (nameEl) nameEl.textContent = fullName;
    if (emailEl) emailEl.textContent = email;

    // Header Profile button
    const headerAvatar = document.getElementById("header-user-avatar");
    const headerName = document.getElementById("header-user-name");
    const headerEmail = document.getElementById("header-user-email");
    if (headerAvatar) headerAvatar.textContent = initials;
    if (headerName) headerName.textContent = fullName;
    if (headerEmail) headerEmail.textContent = email;

    // Profile Dropdown details
    const dropdownAvatar = document.getElementById("dropdown-user-avatar");
    const dropdownName = document.getElementById("dropdown-user-name");
    const dropdownEmail = document.getElementById("dropdown-user-email");
    if (dropdownAvatar) dropdownAvatar.textContent = initials;
    if (dropdownName) dropdownName.textContent = fullName;
    if (dropdownEmail) dropdownEmail.textContent = email;

    // Demo Mode UI Indicators & Settings visibility
    const demoBadge = document.getElementById("demoBadgeIndicator");
    const settingsDemoSection = document.getElementById("settings-demo-section");
    const dropdownResetDemoBtn = document.getElementById("dropdownResetDemoBtn");

    if (demoBadge) demoBadge.style.display = isDemoMode ? "inline-flex" : "none";
    if (settingsDemoSection) settingsDemoSection.style.display = isDemoMode ? "block" : "none";
    if (dropdownResetDemoBtn) dropdownResetDemoBtn.style.display = isDemoMode ? "flex" : "none";

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      });
    }
  }

  // --- Feedback & Demo Reset Handling ---
  // Placeholder feedback URL; set to Google Form / Typeform link before public sharing
  const VORKOO_FEEDBACK_URL = "";

  function openFeedbackModal() {
    if (VORKOO_FEEDBACK_URL && VORKOO_FEEDBACK_URL.trim().startsWith("http")) {
      window.open(VORKOO_FEEDBACK_URL.trim(), "_blank", "noopener,noreferrer");
      return;
    }
    const modal = document.getElementById("feedback-modal");
    if (modal) {
      openModalElement(modal);
      const closeBtn = document.getElementById("close-feedback-btn");
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeFeedbackModal() {
    const modal = document.getElementById("feedback-modal");
    if (modal) closeModalElement(modal);
  }

  function initFeedbackModal() {
    const modal = document.getElementById("feedback-modal");
    if (!modal) return;
    const closeBtn = document.getElementById("close-feedback-btn");
    const footerCloseBtn = document.getElementById("footer-close-feedback-btn");

    if (closeBtn) closeBtn.addEventListener("click", closeFeedbackModal);
    if (footerCloseBtn) footerCloseBtn.addEventListener("click", closeFeedbackModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeFeedbackModal();
    });

    const headerFeedbackBtn = document.getElementById("headerFeedbackBtn");
    const dropdownFeedbackBtn = document.getElementById("dropdownFeedbackBtn");
    const settingsFeedbackBtn = document.getElementById("settingsFeedbackBtn");

    if (headerFeedbackBtn) headerFeedbackBtn.addEventListener("click", openFeedbackModal);
    if (dropdownFeedbackBtn) {
      dropdownFeedbackBtn.addEventListener("click", () => {
        const dropdown = document.getElementById("userProfileDropdown");
        if (dropdown) dropdown.classList.remove("is-open");
        openFeedbackModal();
      });
    }
    if (settingsFeedbackBtn) settingsFeedbackBtn.addEventListener("click", openFeedbackModal);
  }

  function handleResetDemo() {
    showConfirmDialog({
      title: "Reset Demo Data",
      message: "Are you sure you want to reset the demo workspace? This will restore the sample works, clients, and payments to their initial demo state.",
      okText: "Reset Demo",
      onConfirm: () => {
        resetDemoWorkspace();
      }
    });
  }

  function resetDemoWorkspace() {
    if (!isDemoMode) return;
    const userKey = getUserStorageKey(currentUser.email);
    try {
      localStorage.removeItem(userKey);
      localStorage.removeItem("vorkoo-dismissed-warnings_" + normalizeEmail(currentUser.email));
    } catch (e) {
      console.warn("Failed clearing demo keys", e);
    }
    selectedClientName = null;
    DataStore.items = getInitialDemoWorks();
    DataStore.persist();
    renderAllViews();
    showConfirmDialog({
      title: "Demo Reset Complete",
      message: "The demo workspace has been restored to the initial sample dataset.",
      okText: "OK",
      isAlert: true
    });
  }

  function initUserProfile() {
    const profileBtn = document.getElementById("userProfileBtn");
    const dropdown = document.getElementById("userProfileDropdown");
    const settingsLink = document.getElementById("dropdown-settings-link");
    const dropdownResetBtn = document.getElementById("dropdownResetDemoBtn");
    const settingsResetBtn = document.getElementById("settingsResetDemoBtn");

    if (!profileBtn || !dropdown) return;

    function toggleDropdown(show) {
      const isOpen = dropdown.classList.contains("is-open");
      const willOpen = typeof show === "boolean" ? show : !isOpen;
      if (willOpen) {
        dropdown.classList.add("is-open");
        profileBtn.setAttribute("aria-expanded", "true");
        dropdown.setAttribute("aria-hidden", "false");
      } else {
        dropdown.classList.remove("is-open");
        profileBtn.setAttribute("aria-expanded", "false");
        dropdown.setAttribute("aria-hidden", "true");
      }
    }

    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !profileBtn.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    if (settingsLink) {
      settingsLink.addEventListener("click", () => {
        toggleDropdown(false);
      });
    }

    if (dropdownResetBtn) {
      dropdownResetBtn.addEventListener("click", () => {
        toggleDropdown(false);
        handleResetDemo();
      });
    }

    if (settingsResetBtn) {
      settingsResetBtn.addEventListener("click", () => {
        handleResetDemo();
      });
    }
  }

  // --- Add Payment & Payment History Modal Controllers ---
  let activeHistoryWorkId = null;

  function openAddPaymentModal(targetWorkId = null) {
    const modal = document.getElementById("add-payment-modal");
    if (!modal) return;

    const workSelect = document.getElementById("payment-form-work");
    const bannerWrap = document.getElementById("payment-remaining-banner-wrap");
    const bannerDisplay = document.getElementById("payment-remaining-display");
    const amountInput = document.getElementById("payment-form-amount");
    const dateInput = document.getElementById("payment-form-date");
    const noteInput = document.getElementById("payment-form-note");
    const errorWork = document.getElementById("error-payment-work");
    const errorAmount = document.getElementById("error-payment-amount");
    const errorDate = document.getElementById("error-payment-date");

    if (errorWork) errorWork.textContent = "";
    if (errorAmount) errorAmount.textContent = "";
    if (errorDate) errorDate.textContent = "";
    if (amountInput) amountInput.value = "";
    if (noteInput) noteInput.value = "";

    // Default to today's date in YYYY-MM-DD
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    const allWorks = DataStore.getAll();
    if (workSelect) {
      workSelect.innerHTML = `<option value="">-- Choose a work item --</option>` +
        allWorks.map(w => {
          const rem = getWorkRemainingAmount(w);
          const isPaid = rem <= 0;
          return `<option value="${w.id}" ${isPaid ? 'disabled' : ''}>${escapeHTML(w.title)} (${escapeHTML(w.client || 'Self')}) - Remaining: ${formatINR(rem)}${isPaid ? ' (Paid)' : ''}</option>`;
        }).join("");

      if (targetWorkId) {
        workSelect.value = String(targetWorkId);
      }
    }

    function updateSelectedWorkBanner() {
      const selectedId = workSelect ? workSelect.value : null;
      const work = allWorks.find(w => String(w.id) === String(selectedId));
      if (work) {
        const rem = getWorkRemainingAmount(work);
        if (bannerDisplay) bannerDisplay.textContent = formatINR(rem);
        if (bannerWrap) bannerWrap.style.display = "block";
      } else {
        if (bannerWrap) bannerWrap.style.display = "none";
      }
    }

    updateSelectedWorkBanner();
    if (workSelect) {
      workSelect.onchange = updateSelectedWorkBanner;
    }

    openModalElement(modal);
    if (targetWorkId && amountInput) {
      amountInput.focus();
    } else if (workSelect) {
      workSelect.focus();
    }
  }

  function closeAddPaymentModal() {
    const modal = document.getElementById("add-payment-modal");
    closeModalElement(modal);
  }

  function initAddPaymentModal() {
    const modal = document.getElementById("add-payment-modal");
    if (!modal) return;

    const openBtn = document.getElementById("open-add-payment-btn");
    const closeBtn = document.getElementById("close-add-payment-btn");
    const cancelBtn = document.getElementById("cancel-add-payment-btn");
    const form = document.getElementById("add-payment-form");

    if (openBtn) openBtn.addEventListener("click", () => openAddPaymentModal());
    if (closeBtn) closeBtn.addEventListener("click", closeAddPaymentModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeAddPaymentModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeAddPaymentModal();
    });

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const workSelect = document.getElementById("payment-form-work");
        const amountInput = document.getElementById("payment-form-amount");
        const dateInput = document.getElementById("payment-form-date");
        const noteInput = document.getElementById("payment-form-note");

        const errorWork = document.getElementById("error-payment-work");
        const errorAmount = document.getElementById("error-payment-amount");
        const errorDate = document.getElementById("error-payment-date");

        if (errorWork) errorWork.textContent = "";
        if (errorAmount) errorAmount.textContent = "";
        if (errorDate) errorDate.textContent = "";

        const workId = workSelect ? workSelect.value : "";
        const amountVal = amountInput ? parseFloat(amountInput.value) : NaN;
        const dateVal = dateInput ? dateInput.value.trim() : "";
        const noteVal = noteInput ? noteInput.value.trim() : "";

        let isValid = true;
        const work = DataStore.getAll().find(w => String(w.id) === String(workId));

        if (!work) {
          if (errorWork) errorWork.textContent = "Please select a work item.";
          isValid = false;
        }

        const remaining = work ? getWorkRemainingAmount(work) : 0;

        if (isNaN(amountVal) || amountVal <= 0) {
          if (errorAmount) errorAmount.textContent = "Payment Amount must be greater than ₹0.";
          isValid = false;
        } else if (work && amountVal > remaining) {
          if (errorAmount) errorAmount.textContent = `Amount cannot exceed remaining balance (${formatINR(remaining)}).`;
          isValid = false;
        }

        if (!dateVal) {
          if (errorDate) errorDate.textContent = "Payment Date is required.";
          isValid = false;
        }

        if (!isValid) return;

        const newPayment = {
          id: "pay_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
          amount: amountVal,
          date: dateVal,
          note: noteVal
        };

        if (!Array.isArray(work.payments)) {
          work.payments = [];
        }
        work.payments.push(newPayment);

        work.receivedAmount = getWorkTotalReceived(work);
        work.remainingAmount = getWorkRemainingAmount(work);

        DataStore.updateItem(work);
        renderAllViews();
        closeAddPaymentModal();
      });
    }
  }

  function renderPaymentHistoryModalContent(workId) {
    const bodyEl = document.getElementById("payment-history-body");
    if (!bodyEl) return;

    const work = DataStore.getAll().find(w => String(w.id) === String(workId));
    if (!work) {
      bodyEl.innerHTML = `
        <div class="history-empty-state">
          <p>Work item not found.</p>
        </div>
      `;
      return;
    }

    const total = Number(work.totalAmount) || 0;
    const received = getWorkTotalReceived(work);
    const remaining = getWorkRemainingAmount(work);
    const { status, badgeClass } = getPaymentStatusInfo(work);

    const payments = Array.isArray(work.payments) ? [...work.payments] : [];
    payments.reverse();

    let paymentsHTML = "";
    if (payments.length === 0) {
      paymentsHTML = `
        <div class="history-empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 8px; opacity: 0.5;"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          <p>No payments recorded yet for this work item.</p>
        </div>
      `;
    } else {
      paymentsHTML = `
        <div class="history-list">
          ${payments.map(p => `
            <div class="history-item-card">
              <div class="history-item-left">
                <span class="history-item-amount">+${formatINR(p.amount)}</span>
                <span class="history-item-note">${escapeHTML(p.note || "Payment received")}</span>
              </div>
              <div class="history-item-right">
                <span class="history-item-date">
                  ${escapeHTML(formatPaymentDate(p.date))}
                </span>
                <button type="button" class="btn btn-secondary history-item-edit-btn" data-work-id="${work.id}" data-payment-id="${p.id}" title="Edit Payment" aria-label="Edit Payment">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  <span>Edit</span>
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    bodyEl.innerHTML = `
      <div class="history-summary-box">
        <div class="history-work-meta">
          <div>
            <h3 class="history-work-title">${escapeHTML(work.title)}</h3>
            <p class="history-work-client">${escapeHTML(work.client || "Self / Unassigned")}</p>
          </div>
          <span class="work-badge ${badgeClass}">${status}</span>
        </div>

        <div class="history-financials-grid">
          <div class="conflict-finance-col">
            <span class="label">Total Amount</span>
            <span class="val">${formatINR(total)}</span>
          </div>
          <div class="conflict-finance-col">
            <span class="label">Total Received</span>
            <span class="val received">${formatINR(received)}</span>
          </div>
          <div class="conflict-finance-col">
            <span class="label">Remaining</span>
            <span class="val remaining">${formatINR(remaining)}</span>
          </div>
        </div>
      </div>

      <div style="margin-top: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary); margin: 0;">
            Payment Entries (${payments.length})
          </h4>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button type="button" class="btn btn-secondary history-generate-invoice-btn" data-id="${work.id}" style="padding: 4px 10px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 5px;" title="Generate Payment Invoice">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              <span>Invoice</span>
            </button>
            ${remaining > 0 ? `
              <button type="button" class="btn btn-secondary pay-btn-add history-quick-add-btn" data-id="${work.id}" style="padding: 4px 10px; font-size: 0.8rem;">
                + Add Payment
              </button>
            ` : ''}
          </div>
        </div>
        ${paymentsHTML}
      </div>
    `;

    const quickAddBtn = bodyEl.querySelector(".history-quick-add-btn");
    if (quickAddBtn) {
      quickAddBtn.addEventListener("click", () => {
        closePaymentHistoryModal();
        openAddPaymentModal(work.id);
      });
    }

    bodyEl.querySelectorAll(".history-generate-invoice-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const wId = btn.getAttribute("data-id");
        openInvoiceModal(wId);
      });
    });

    bodyEl.querySelectorAll(".history-item-edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const pId = btn.getAttribute("data-payment-id");
        const wId = btn.getAttribute("data-work-id");
        openEditPaymentModal(wId, pId);
      });
    });
  }

  function openPaymentHistoryModal(workId) {
    const modal = document.getElementById("payment-history-modal");
    if (!modal) return;

    activeHistoryWorkId = workId;
    renderPaymentHistoryModalContent(workId);

    openModalElement(modal);
    const closeBtn = document.getElementById("close-payment-history-btn");
    if (closeBtn) closeBtn.focus();
  }

  function closePaymentHistoryModal() {
    const modal = document.getElementById("payment-history-modal");
    closeModalElement(modal);
    activeHistoryWorkId = null;
  }

  function initPaymentHistoryModal() {
    const modal = document.getElementById("payment-history-modal");
    if (!modal) return;

    const closeBtn = document.getElementById("close-payment-history-btn");
    const footerCloseBtn = document.getElementById("footer-close-history-btn");
    const footerInvoiceBtn = document.getElementById("footer-generate-invoice-btn");

    if (closeBtn) closeBtn.addEventListener("click", closePaymentHistoryModal);
    if (footerCloseBtn) footerCloseBtn.addEventListener("click", closePaymentHistoryModal);
    if (footerInvoiceBtn) {
      footerInvoiceBtn.addEventListener("click", () => {
        if (activeHistoryWorkId) {
          openInvoiceModal(activeHistoryWorkId);
        }
      });
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closePaymentHistoryModal();
    });
  }

  // --- Payment Invoice Modal Controller ---
  let activeInvoiceWorkId = null;

  function renderInvoiceModalContent(workId) {
    const bodyEl = document.getElementById("invoice-modal-body");
    if (!bodyEl) return;

    // Always fetch latest data from current user's DataStore (Account isolated & Live)
    const work = DataStore.getAll().find(w => String(w.id) === String(workId));
    if (!work) {
      bodyEl.innerHTML = `
        <div class="history-empty-state">
          <p>Work item not found.</p>
        </div>
      `;
      return;
    }

    const total = Number(work.totalAmount) || 0;
    const received = getWorkTotalReceived(work);
    const remaining = getWorkRemainingAmount(work);
    const { status, badgeClass } = getPaymentStatusInfo(work);

    const workStatus = work.status || "Pending";
    const workStatusClass = "badge-status-" + workStatus.toLowerCase().replace(/\s+/g, "-");
    const deadlineDisplay = work.deadline ? (formatDeadlineDisplay(work.deadline) || work.deadline) : "No deadline";

    // Payments newest first
    const payments = Array.isArray(work.payments) ? [...work.payments] : [];
    payments.reverse();

    let paymentsHTML = "";
    if (payments.length === 0) {
      paymentsHTML = `
        <div class="invoice-empty-payments">
          <p>No payments recorded yet for this work item.</p>
        </div>
      `;
    } else {
      paymentsHTML = `
        <table class="invoice-table">
          <thead>
            <tr>
              <th style="width: 28%;">Payment Date</th>
              <th style="width: 44%;">Payment Note</th>
              <th style="width: 28%; text-align: right;">Payment Amount</th>
            </tr>
          </thead>
          <tbody>
            ${payments.map(p => {
              const isMigratedEmptyDate = !p.date || String(p.date).trim() === "";
              const dateDisplay = isMigratedEmptyDate ? "Date not recorded" : (formatDeadlineDisplay(p.date) || p.date);
              const noteDisplay = p.note ? p.note : (isMigratedEmptyDate ? "Previously received" : "Payment received");
              return `
                <tr>
                  <td>${escapeHTML(dateDisplay)}</td>
                  <td>${escapeHTML(noteDisplay)}</td>
                  <td class="invoice-td-amount">+${formatINR(p.amount)}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align: right; color: var(--text-secondary); font-size: 0.85rem;">Total Received</td>
              <td class="invoice-tf-amount">${formatINR(received)}</td>
            </tr>
          </tfoot>
        </table>
      `;
    }

    bodyEl.innerHTML = `
      <div class="invoice-sheet" id="invoice-sheet">
        <div class="invoice-header">
          <div class="invoice-brand-col">
            <div class="invoice-brand-name">Vor<span>koo</span></div>
          </div>
          <div class="invoice-title-col">
            <h1 class="invoice-doc-title">PAYMENT INVOICE</h1>
          </div>
        </div>

        <div class="invoice-divider"></div>

        <div class="invoice-section-title">Work Details</div>
        <div class="invoice-work-details-grid">
          <div class="invoice-detail-item">
            <span class="invoice-detail-label">Work Title</span>
            <span class="invoice-detail-value invoice-work-title">${escapeHTML(work.title)}</span>
          </div>
          <div class="invoice-detail-item">
            <span class="invoice-detail-label">Client Name</span>
            <span class="invoice-detail-value">${escapeHTML(work.client || "Self / Unassigned")}</span>
          </div>
          <div class="invoice-detail-item">
            <span class="invoice-detail-label">Work Deadline</span>
            <span class="invoice-detail-value">${escapeHTML(deadlineDisplay)}</span>
          </div>
          <div class="invoice-detail-item">
            <span class="invoice-detail-label">Work Status</span>
            <span class="invoice-detail-value">
              <span class="work-badge ${workStatusClass}">${escapeHTML(workStatus)}</span>
            </span>
          </div>
        </div>

        <div class="invoice-divider"></div>

        <div class="invoice-section-title">Financial Summary</div>
        <div class="invoice-financials-grid">
          <div class="invoice-finance-box">
            <span class="invoice-finance-label">Total Work Value</span>
            <span class="invoice-finance-val">${formatINR(total)}</span>
          </div>
          <div class="invoice-finance-box">
            <span class="invoice-finance-label">Total Received</span>
            <span class="invoice-finance-val invoice-val-received">${formatINR(received)}</span>
          </div>
          <div class="invoice-finance-box">
            <span class="invoice-finance-label">Remaining Amount</span>
            <span class="invoice-finance-val invoice-val-remaining">${formatINR(remaining)}</span>
          </div>
          <div class="invoice-finance-box">
            <span class="invoice-finance-label">Payment Status</span>
            <span class="invoice-finance-val">
              <span class="work-badge ${badgeClass}">${status}</span>
            </span>
          </div>
        </div>

        <div class="invoice-divider"></div>

        <div class="invoice-section-title">Payment History</div>
        ${paymentsHTML}
      </div>
    `;
  }

  function openInvoiceModal(workId) {
    const modal = document.getElementById("invoice-modal");
    if (!modal) return;

    activeInvoiceWorkId = workId;
    renderInvoiceModalContent(workId);

    openModalElement(modal);
    const closeBtn = document.getElementById("close-invoice-modal-btn");
    if (closeBtn) closeBtn.focus();
  }

  function closeInvoiceModal() {
    const modal = document.getElementById("invoice-modal");
    closeModalElement(modal);
    activeInvoiceWorkId = null;
  }

  function printInvoice() {
    window.print();
  }

  function initInvoiceModal() {
    const modal = document.getElementById("invoice-modal");
    if (!modal) return;

    const closeBtn = document.getElementById("close-invoice-modal-btn");
    const footerCloseBtn = document.getElementById("footer-close-invoice-btn");
    const headerPrintBtn = document.getElementById("header-print-invoice-btn");
    const footerPrintBtn = document.getElementById("footer-print-invoice-btn");

    if (closeBtn) closeBtn.addEventListener("click", closeInvoiceModal);
    if (footerCloseBtn) footerCloseBtn.addEventListener("click", closeInvoiceModal);
    if (headerPrintBtn) headerPrintBtn.addEventListener("click", printInvoice);
    if (footerPrintBtn) footerPrintBtn.addEventListener("click", printInvoice);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeInvoiceModal();
    });
  }

  // --- Edit Payment Modal Controller ---
  let activeEditWorkId = null;
  let activeEditPaymentId = null;

  function calculateMaxAllowedPayment(work, excludePaymentId) {
    const totalAmount = Number(work.totalAmount) || 0;
    const payments = Array.isArray(work.payments) ? work.payments : [];
    const otherSum = payments
      .filter(p => String(p.id) !== String(excludePaymentId))
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    return Math.max(0, totalAmount - otherSum);
  }

  function openEditPaymentModal(workId, paymentId) {
    const modal = document.getElementById("edit-payment-modal");
    if (!modal) return;

    const work = DataStore.getAll().find(w => String(w.id) === String(workId));
    if (!work || !Array.isArray(work.payments)) return;

    const payment = work.payments.find(p => String(p.id) === String(paymentId));
    if (!payment) return;

    activeEditWorkId = workId;
    activeEditPaymentId = paymentId;

    const workTitleEl = document.getElementById("edit-payment-context-title");
    const workClientEl = document.getElementById("edit-payment-context-client");
    const maxDisplayEl = document.getElementById("edit-payment-max-display");
    const amountInput = document.getElementById("edit-payment-form-amount");
    const dateInput = document.getElementById("edit-payment-form-date");
    const noteInput = document.getElementById("edit-payment-form-note");
    const errorAmount = document.getElementById("error-edit-payment-amount");
    const errorDate = document.getElementById("error-edit-payment-date");

    if (errorAmount) errorAmount.textContent = "";
    if (errorDate) errorDate.textContent = "";

    if (workTitleEl) workTitleEl.textContent = work.title || "Untitled Work";
    if (workClientEl) workClientEl.textContent = `Client: ${work.client || "Self / Unassigned"}`;

    const maxAllowed = calculateMaxAllowedPayment(work, paymentId);
    if (maxDisplayEl) maxDisplayEl.textContent = formatINR(maxAllowed);

    if (amountInput) {
      amountInput.value = payment.amount !== undefined ? payment.amount : "";
      amountInput.max = maxAllowed;
    }
    if (dateInput) {
      dateInput.value = payment.date || "";
    }
    if (noteInput) {
      noteInput.value = payment.note || "";
    }

    openModalElement(modal);
    if (amountInput) amountInput.focus();
  }

  function closeEditPaymentModal() {
    const modal = document.getElementById("edit-payment-modal");
    closeModalElement(modal);
    activeEditWorkId = null;
    activeEditPaymentId = null;
  }

  function initEditPaymentModal() {
    const modal = document.getElementById("edit-payment-modal");
    if (!modal) return;

    const closeBtn = document.getElementById("close-edit-payment-btn");
    const cancelBtn = document.getElementById("cancel-edit-payment-btn");
    const form = document.getElementById("edit-payment-form");

    if (closeBtn) closeBtn.addEventListener("click", closeEditPaymentModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeEditPaymentModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeEditPaymentModal();
    });

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const amountInput = document.getElementById("edit-payment-form-amount");
        const dateInput = document.getElementById("edit-payment-form-date");
        const noteInput = document.getElementById("edit-payment-form-note");
        const errorAmount = document.getElementById("error-edit-payment-amount");
        const errorDate = document.getElementById("error-edit-payment-date");

        if (errorAmount) errorAmount.textContent = "";
        if (errorDate) errorDate.textContent = "";

        const work = DataStore.getAll().find(w => String(w.id) === String(activeEditWorkId));
        if (!work || !Array.isArray(work.payments)) {
          closeEditPaymentModal();
          return;
        }

        const paymentIndex = work.payments.findIndex(p => String(p.id) === String(activeEditPaymentId));
        if (paymentIndex === -1) {
          closeEditPaymentModal();
          return;
        }

        const amountVal = amountInput ? parseFloat(amountInput.value) : NaN;
        const dateVal = dateInput ? dateInput.value.trim() : "";
        const noteVal = noteInput ? noteInput.value.trim() : "";

        let isValid = true;

        const totalAmount = Number(work.totalAmount) || 0;
        const maxAllowed = calculateMaxAllowedPayment(work, activeEditPaymentId);

        if (isNaN(amountVal) || amountVal <= 0) {
          if (errorAmount) errorAmount.textContent = "Payment Amount must be greater than ₹0.";
          isValid = false;
        } else if (amountVal > maxAllowed) {
          if (errorAmount) {
            errorAmount.textContent = `Total received cannot exceed work total (${formatINR(totalAmount)}). Maximum allowed for this payment is ${formatINR(maxAllowed)}.`;
          }
          isValid = false;
        }

        if (!dateVal) {
          if (errorDate) errorDate.textContent = "Payment Date is required.";
          isValid = false;
        }

        if (!isValid) return;

        // Preserve existing payment ID and update in-place
        const existingPayment = work.payments[paymentIndex];
        existingPayment.amount = amountVal;
        existingPayment.date = dateVal;
        existingPayment.note = noteVal;

        // Recalculate Received Amount, Remaining Amount, Payment Status
        work.receivedAmount = getWorkTotalReceived(work);
        work.remainingAmount = getWorkRemainingAmount(work);
        work.paymentStatus = getWorkPaymentStatus(work);

        DataStore.updateItem(work);
        closeEditPaymentModal();
        renderAllViews();
      });
    }
  }

  // --- Centralized Keyboard (Escape) Listener ---
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    // 1. Confirm dialog has highest priority
    const confirmModal = document.getElementById("vorkoo-confirm-modal");
    if (confirmModal && confirmModal.classList.contains("is-open")) {
      if (typeof activeConfirmCancel === "function") {
        activeConfirmCancel();
      } else {
        closeModalElement(confirmModal);
      }
      return;
    }

    // 1b. Feedback modal
    const feedbackModal = document.getElementById("feedback-modal");
    if (feedbackModal && feedbackModal.classList.contains("is-open")) {
      closeFeedbackModal();
      return;
    }

    // 2. Invoice modal
    const invoiceModal = document.getElementById("invoice-modal");
    if (invoiceModal && invoiceModal.classList.contains("is-open")) {
      closeInvoiceModal();
      return;
    }

    // 3. Edit payment modal
    const editPaymentModal = document.getElementById("edit-payment-modal");
    if (editPaymentModal && editPaymentModal.classList.contains("is-open")) {
      closeEditPaymentModal();
      return;
    }

    // 4. Payment history modal
    const paymentHistoryModal = document.getElementById("payment-history-modal");
    if (paymentHistoryModal && paymentHistoryModal.classList.contains("is-open")) {
      closePaymentHistoryModal();
      return;
    }

    // 5. Add payment modal
    const addPaymentModal = document.getElementById("add-payment-modal");
    if (addPaymentModal && addPaymentModal.classList.contains("is-open")) {
      closeAddPaymentModal();
      return;
    }

    // 6. Deadline conflict modal
    const conflictModal = document.getElementById("deadline-conflict-modal");
    if (conflictModal && conflictModal.classList.contains("is-open")) {
      closeConflictModal();
      return;
    }

    // 7. Add / Edit Work modal
    const workModal = document.getElementById("add-work-modal");
    if (workModal && workModal.classList.contains("is-open")) {
      if (typeof closeWorkModal === "function") {
        closeWorkModal();
      } else {
        closeModalElement(workModal);
      }
      return;
    }

    // 8. User profile dropdown
    const dropdown = document.getElementById("userProfileDropdown");
    if (dropdown && dropdown.classList.contains("is-open")) {
      const profileBtn = document.getElementById("userProfileBtn");
      dropdown.classList.remove("is-open");
      if (profileBtn) {
        profileBtn.setAttribute("aria-expanded", "false");
        profileBtn.focus();
      }
      return;
    }
  });

  // --- App Bootstrap ---
  function bootstrap() {
    DataStore.init();
    updateUserInfoUI();
    initUserProfile();
    initFeedbackModal();
    initTheme();
    initWorkModal();
    initConflictModal();
    initAddPaymentModal();
    initPaymentHistoryModal();
    initEditPaymentModal();
    initInvoiceModal();
    initRouter();
    renderAllViews();

    // Service Worker Registration for PWA support (handles GitHub Pages subpaths)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('../sw.js', { scope: '../' })
          .then((reg) => {
            // SW registered successfully with repository subpath scope
          })
          .catch((err) => {
            console.warn('ServiceWorker registration error:', err);
          });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();