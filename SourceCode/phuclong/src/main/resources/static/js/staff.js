
const STORAGE_KEY = "pl_staff_mock_orders_v1";

const STATUS_META = {
    PENDING: { label: "Chờ xác nhận", badgeClass: "status-pending", next: "CONFIRMED", nextLabel: "Xác nhận đơn" },
    CONFIRMED: { label: "Đã xác nhận", badgeClass: "status-confirmed", next: "PREPARING", nextLabel: "Bắt đầu pha chế" },
    PREPARING: { label: "Đang pha chế", badgeClass: "status-preparing", next: "READY", nextLabel: "Sẵn sàng giao" },
    READY: { label: "Sẵn sàng", badgeClass: "status-ready", next: "DELIVERING", nextLabel: "Giao hàng" },
    DELIVERING: { label: "Đang giao", badgeClass: "status-delivering", next: "COMPLETED", nextLabel: "Hoàn tất đơn" },
    COMPLETED: { label: "Hoàn tất", badgeClass: "status-completed", next: null, nextLabel: null },
    CANCELLED: { label: "Đã hủy", badgeClass: "status-cancelled", next: null, nextLabel: null }
};

const INITIAL_MOCK_ORDERS = [
    {
        orderId: "PL1001",
        customerName: "Nguyễn Minh Anh",
        phone: "0901234567",
        address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        orderDate: "21/11/2026 12:15",
        status: "PENDING",
        items: [
            { name: "Trà Ô Long Vải", size: "L", qty: 2, price: 55000 },
            { name: "Hồng Trà Sữa", size: "M", qty: 1, price: 45000 }
        ]
    },
    {
        orderId: "PL1002",
        customerName: "Trần Quốc Bảo",
        phone: "0912345678",
        address: "45 Võ Văn Tần, Quận 3, TP.HCM",
        orderDate: "21/11/2026 12:25",
        status: "PREPARING",
        items: [
            { name: "Trà Đào Cam Sả", size: "L", qty: 2, price: 50000 }
        ]
    },
    {
        orderId: "PL1003",
        customerName: "Lê Thu Hà",
        phone: "0987654321",
        address: "88 Cách Mạng Tháng 8, Quận 10, TP.HCM",
        orderDate: "21/11/2026 11:40",
        status: "COMPLETED",
        items: [
            { name: "Matcha Latte", size: "L", qty: 1, price: 60000 },
            { name: "Bánh Mì Gà Xé", size: "Chuẩn", qty: 1, price: 39000 }
        ]
    },
    {
        orderId: "PL1004",
        customerName: "Phạm Gia Huy",
        phone: "0933445566",
        address: "19 Phan Xích Long, Phú Nhuận, TP.HCM",
        orderDate: "21/11/2026 11:10",
        status: "CANCELLED",
        items: [
            { name: "Trà Nhãn Sen", size: "M", qty: 2, price: 49000 }
        ]
    }
];

function loadOrders() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ORDERS));
        return structuredClone(INITIAL_MOCK_ORDERS);
    }
    try {
        return JSON.parse(raw);
    } catch {
        return structuredClone(INITIAL_MOCK_ORDERS);
    }
}

function saveOrders(orders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

let ordersData = loadOrders();

function calcOrderTotal(order) {
    return (order.items || []).reduce((sum, item) => sum + item.price * item.qty, 0);
}

function formatVND(amount) {
    return Number(amount || 0).toLocaleString("vi-VN") + "đ";
}

function updateLiveClock() {
    const el = document.getElementById("liveDateTime");
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function canCancelOrder(status) {
    return status !== "COMPLETED" && status !== "CANCELLED";
}

function changeOrderStatus(orderId, nextStatus) {
    const order = ordersData.find(o => o.orderId === orderId);
    if (!order) return;

    const meta = STATUS_META[order.status];
    const isValidNext = meta && meta.next === nextStatus;
    const isValidCancel = nextStatus === "CANCELLED" && canCancelOrder(order.status);

    if (!isValidNext && !isValidCancel) return;

    order.status = nextStatus;
    saveOrders(ordersData);
    renderOrdersTable();
    renderDashboard();
    renderReportsPage();
}

function openOrderModal(orderId) {
    const order = ordersData.find(o => o.orderId === orderId);
    const backdrop = document.getElementById("orderDetailModal");
    if (!order || !backdrop) return;

    const statusInfo = STATUS_META[order.status] || { label: order.status, badgeClass: "status-pending" };

    document.getElementById("modalOrderTitle").textContent = `Chi tiết đơn #${order.orderId}`;
    document.getElementById("modalOrderInfo").innerHTML = `
        <div><strong>Khách hàng:</strong> ${order.customerName}</div>
        <div><strong>SĐT:</strong> ${order.phone}</div>
        <div><strong>Thời gian:</strong> ${order.orderDate}</div>
        <div><strong>Trạng thái:</strong> <span class="status-badge ${statusInfo.badgeClass}">${statusInfo.label}</span></div>
        <div style="grid-column: 1 / -1;"><strong>Địa chỉ:</strong> ${order.address}</div>
    `;

    document.getElementById("modalOrderItems").innerHTML = (order.items || []).map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--border-color); font-size: 13px;">
            <div>
                <div style="font-weight: 600;">${item.name} <span style="color: var(--text-muted); font-weight: 400;">(${item.size})</span></div>
                <div style="color: var(--text-muted); font-size: 12px;">${formatVND(item.price)} x ${item.qty}</div>
            </div>
            <strong style="color: var(--pl-green-dark);">${formatVND(item.price * item.qty)}</strong>
        </div>
    `).join("");

    document.getElementById("modalOrderTotal").textContent = formatVND(calcOrderTotal(order));

    backdrop.classList.add("is-open");
    backdrop.setAttribute("aria-hidden", "false");
}

function closeOrderModal() {
    const backdrop = document.getElementById("orderDetailModal");
    if (!backdrop) return;
    backdrop.classList.remove("is-open");
    backdrop.setAttribute("aria-hidden", "true");
}

function renderOrdersTable() {
    const tbody = document.getElementById("ordersTableBody");
    if (!tbody) return;

    const statusFilter = document.getElementById("statusFilter")?.value || "ALL";
    const keyword = (document.getElementById("searchOrderInput")?.value || "").trim().toLowerCase();

    const filtered = ordersData.filter(order => {
        const matchStatus = statusFilter === "ALL" || order.status === statusFilter;
        const matchKeyword = !keyword ||
            order.orderId.toLowerCase().includes(keyword) ||
            order.customerName.toLowerCase().includes(keyword);
        return matchStatus && matchKeyword;
    });

    if (!filtered.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">
                    Không có đơn hàng nào khớp với bộ lọc hiện tại.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(order => {
        const meta = STATUS_META[order.status] || { label: order.status, badgeClass: "status-pending", next: null, nextLabel: null };
        const nextBtnHtml = meta.next
            ? `<button type="button" class="action-btn" onclick="changeOrderStatus('${order.orderId}', '${meta.next}')">${meta.nextLabel}</button>`
            : "";
        const cancelBtnHtml = canCancelOrder(order.status)
            ? `<button type="button" class="danger-btn" onclick="changeOrderStatus('${order.orderId}', 'CANCELLED')">Hủy đơn</button>`
            : "";

        return `
            <tr>
                <td><strong>#${order.orderId}</strong></td>
                <td>
                    <div style="font-weight: 600;">${order.customerName}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">${order.phone}</div>
                </td>
                <td>${order.orderDate}</td>
                <td><span class="status-badge ${meta.badgeClass}">${meta.label}</span></td>
                <td><strong>${formatVND(calcOrderTotal(order))}</strong></td>
                <td>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        <button type="button" class="secondary-btn" onclick="openOrderModal('${order.orderId}')">Chi tiết</button>
                        ${nextBtnHtml}
                        ${cancelBtnHtml}
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function renderDashboard() {
    const pendingEl = document.getElementById("statPending");
    const preparingEl = document.getElementById("statPreparing");
    const completedEl = document.getElementById("statCompleted");
    const revenueEl = document.getElementById("statRevenue");
    const pendingListEl = document.getElementById("dashPendingList");
    const reportBoxEl = document.getElementById("dashReportBox");
    const chartEl = document.getElementById("dashStatusChart");
    const topItemsEl = document.getElementById("dashTopItems");
    const recentEl = document.getElementById("dashRecentOrders");
    const pendingBadgeEl = document.getElementById("quickPendingBadge");

    if (!pendingEl && !pendingListEl && !reportBoxEl && !chartEl) return;

    const pendingOrders = ordersData.filter(o => o.status === "PENDING");
    const preparingOrders = ordersData.filter(o => o.status === "PREPARING");
    const completedOrders = ordersData.filter(o => o.status === "COMPLETED");
    const cancelledOrders = ordersData.filter(o => o.status === "CANCELLED");

    // Chỉ tính doanh thu từ đơn COMPLETED, tuyệt đối không tính đơn CANCELLED
    const completedRevenue = completedOrders.reduce((sum, o) => sum + calcOrderTotal(o), 0);

    if (pendingEl) pendingEl.textContent = String(pendingOrders.length);
    if (preparingEl) preparingEl.textContent = String(preparingOrders.length);
    if (completedEl) completedEl.textContent = String(completedOrders.length);
    if (revenueEl) revenueEl.textContent = formatVND(completedRevenue);
    if (pendingBadgeEl) pendingBadgeEl.textContent = `${pendingOrders.length} chờ`;

    if (chartEl) {
        const entries = Object.entries(STATUS_META);
        const counts = entries.map(([code]) => ordersData.filter(o => o.status === code).length);
        const maxCount = Math.max(1, ...counts);

        chartEl.innerHTML = entries.map(([code, meta], idx) => {
            const count = counts[idx];
            const heightPct = Math.max(10, Math.round((count / maxCount) * 100));
            const shortCode = code.slice(0, 4);
            return `
                <div class="pos-bar-col" title="${meta.label}: ${count} đơn">
                    <span style="font-size: 11px; font-weight: 700; color: var(--pl-green-dark);">${count}</span>
                    <div class="pos-bar-fill" style="height: ${heightPct}%;"></div>
                    <span class="pos-bar-label">${shortCode}</span>
                </div>
            `;
        }).join("");
    }

    if (topItemsEl) {
        const map = new Map();
        completedOrders.forEach(order => {
            (order.items || []).forEach(item => {
                const key = `${item.name} (${item.size})`;
                const cur = map.get(key) || { name: key, qty: 0, total: 0 };
                cur.qty += item.qty;
                cur.total += item.price * item.qty;
                map.set(key, cur);
            });
        });
        const topList = Array.from(map.values()).sort((a, b) => b.qty - a.qty).slice(0, 3);
        topItemsEl.innerHTML = topList.length
            ? topList.map(item => `
                <div class="pos-list-row">
                    <div>
                        <div style="font-weight: 600;">${item.name}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">Đã bán: ${item.qty}</div>
                    </div>
                    <strong style="color: var(--pl-green-dark);">${formatVND(item.total)}</strong>
                </div>
            `).join("")
            : `<p style="color: var(--text-muted); font-size: 13px;">Chưa có đơn hoàn tất để thống kê món.</p>`;
    }

    if (recentEl) {
        recentEl.innerHTML = ordersData.slice(0, 4).map(o => {
            const meta = STATUS_META[o.status] || { label: o.status, badgeClass: "status-pending" };
            return `
                <div class="pos-list-row">
                    <div>
                        <div style="font-weight: 700;">#${o.orderId} • ${o.customerName}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${o.orderDate}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="status-badge ${meta.badgeClass}">${meta.label}</span>
                        <strong>${formatVND(calcOrderTotal(o))}</strong>
                    </div>
                </div>
            `;
        }).join("");
    }

    if (pendingListEl) {
        pendingListEl.innerHTML = pendingOrders.length
            ? pendingOrders.map(o => `
                <div class="pos-list-row">
                    <div>
                        <div style="font-weight: 700;">#${o.orderId} • ${o.customerName}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">${formatVND(calcOrderTotal(o))}</div>
                    </div>
                    <button type="button" class="action-btn" onclick="changeOrderStatus('${o.orderId}', 'CONFIRMED')">Xác nhận</button>
                </div>
            `).join("")
            : `<p style="color: var(--text-muted); font-size: 13px;">Không có đơn nào đang chờ xác nhận.</p>`;
    }

    if (reportBoxEl) {
        reportBoxEl.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">Đơn hoàn tất (tính doanh thu):</span>
                <strong>${completedOrders.length}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">Đơn đã hủy (không tính):</span>
                <strong style="color: #b91c1c;">${cancelledOrders.length}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 6px; border-top: 1px solid var(--border-color); font-size: 15px;">
                <strong>Doanh thu hợp lệ:</strong>
                <strong style="color: var(--pl-green-dark);">${formatVND(completedRevenue)}</strong>
            </div>
        `;
    }
}

function renderReportsPage() {
    const revEl = document.getElementById("repValidRevenue");
    if (!revEl) return;

    const completedOrders = ordersData.filter(o => o.status === "COMPLETED");
    const cancelledOrders = ordersData.filter(o => o.status === "CANCELLED");

    const validRevenue = completedOrders.reduce((sum, o) => sum + calcOrderTotal(o), 0);
    const avgOrderValue = completedOrders.length ? Math.round(validRevenue / completedOrders.length) : 0;

    revEl.textContent = formatVND(validRevenue);
    document.getElementById("repCompletedCount").textContent = String(completedOrders.length);
    document.getElementById("repAvgOrderValue").textContent = formatVND(avgOrderValue);
    document.getElementById("repCancelledCount").textContent = String(cancelledOrders.length);

    const breakdownEl = document.getElementById("repStatusBreakdown");
    if (breakdownEl) {
        breakdownEl.innerHTML = Object.entries(STATUS_META).map(([code, meta]) => {
            const matched = ordersData.filter(o => o.status === code);
            const totalMoney = matched.reduce((sum, o) => sum + calcOrderTotal(o), 0);
            const note = code === "COMPLETED"
                ? `<span style="color: var(--pl-green-dark); font-weight: 600;">+${formatVND(totalMoney)}</span>`
                : `<span style="color: var(--text-muted);">${formatVND(totalMoney)} (chưa/không tính)</span>`;

            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                    <div>
                        <span class="status-badge ${meta.badgeClass}">${meta.label}</span>
                        <strong style="margin-left: 8px;">${matched.length} đơn</strong>
                    </div>
                    <div style="font-size: 13px;">${note}</div>
                </div>
            `;
        }).join("");
    }

    const topProductsEl = document.getElementById("repTopProducts");
    if (topProductsEl) {
        const productMap = new Map();
        completedOrders.forEach(order => {
            (order.items || []).forEach(item => {
                const key = `${item.name} (${item.size})`;
                const current = productMap.get(key) || { name: key, qty: 0, revenue: 0 };
                current.qty += item.qty;
                current.revenue += item.price * item.qty;
                productMap.set(key, current);
            });
        });

        const sortedProducts = Array.from(productMap.values()).sort((a, b) => b.qty - a.qty);
        topProductsEl.innerHTML = sortedProducts.length
            ? sortedProducts.map((p, idx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-main); border-radius: 10px;">
                    <div>
                        <strong>#${idx + 1} ${p.name}</strong>
                        <div style="font-size: 12px; color: var(--text-muted);">Đã bán: ${p.qty} ly/phần</div>
                    </div>
                    <strong style="color: var(--pl-green-dark);">${formatVND(p.revenue)}</strong>
                </div>
            `).join("")
            : `<p style="color: var(--text-muted);">Chưa có đơn hoàn tất nào để thống kê món.</p>`;
    }

    const tbody = document.getElementById("repCompletedTableBody");
    if (tbody) {
        tbody.innerHTML = completedOrders.length
            ? completedOrders.map(order => {
                const totalQty = (order.items || []).reduce((s, i) => s + i.qty, 0);
                return `
                    <tr>
                        <td><strong>#${order.orderId}</strong></td>
                        <td>${order.customerName}</td>
                        <td>${order.orderDate}</td>
                        <td>${totalQty} món</td>
                        <td><strong style="color: var(--pl-green-dark);">${formatVND(calcOrderTotal(order))}</strong></td>
                    </tr>
                `;
            }).join("")
            : `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Chưa có đơn hàng nào hoàn tất.</td></tr>`;
    }
}

// =========================================
// KHỞI TẠO BAN ĐẦU
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    updateLiveClock();
    setInterval(updateLiveClock, 30000);

    document.getElementById("statusFilter")?.addEventListener("change", renderOrdersTable);
    document.getElementById("searchOrderInput")?.addEventListener("input", renderOrdersTable);

    document.getElementById("resetMockBtn")?.addEventListener("click", () => {
        ordersData = structuredClone(INITIAL_MOCK_ORDERS);
        saveOrders(ordersData);
        renderOrdersTable();
        renderDashboard();
        renderReportsPage();
    });

    document.getElementById("closeOrderModalBtn")?.addEventListener("click", closeOrderModal);
    document.getElementById("orderDetailModal")?.addEventListener("click", (e) => {
        if (e.target.id === "orderDetailModal") {
            closeOrderModal();
        }
    });

    renderOrdersTable();
    renderDashboard();
    renderReportsPage();
});
