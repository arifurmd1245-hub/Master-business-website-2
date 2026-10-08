
// Master Universal Business Web System Logic

// Config State
let bizConfig = JSON.parse(localStorage.getItem('master_biz_config')) || {
    name: "Universal Business",
    whatsapp: "8801700000000",
    delInside: 60,
    delOutside: 120
};

// Data Items State
let bizItems = JSON.parse(localStorage.getItem('master_biz_items')) || [
    { id: "101", title: "Smart Wireless Headphone", price: 2500, type: "product", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" },
    { id: "102", title: "Professional AC Servicing", price: 1500, type: "service", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60" }
];

// Orders List
let bizOrders = JSON.parse(localStorage.getItem('master_biz_orders')) || [];

let activeCart = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAppUI();
});

function loadAppUI() {
    document.getElementById('biz-title').innerText = bizConfig.name;
    document.getElementById('footer-biz-name').innerText = bizConfig.name;
    document.getElementById('wa-btn').href = `https://wa.me/${bizConfig.whatsapp}`;
    document.getElementById('item-count').innerText = `${bizItems.length} Items`;

    // Render Shipping Area Select
    const delSelect = document.getElementById('delivery-select');
    delSelect.innerHTML = `
        <option value="${bizConfig.delInside}">Inside City (৳${bizConfig.delInside})</option>
        <option value="${bizConfig.delOutside}">Outside City (৳${bizConfig.delOutside})</option>
    `;

    renderProductsGrid();
}

function renderProductsGrid() {
    const grid = document.getElementById('products-grid');
    if (bizItems.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-gray-400 py-8">No products or services available right now.</p>`;
        return;
    }

    grid.innerHTML = bizItems.map(item => `
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <img src="${item.image || 'https://via.placeholder.com/400'}" class="w-full h-44 object-cover">
            <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <span class="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${item.type === 'product' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}">${item.type}</span>
                    <h4 class="font-bold text-gray-900 text-sm mt-2">${item.title}</h4>
                    <p class="text-base font-extrabold text-blue-600 mt-1">৳${item.price}</p>
                </div>
                <button onclick="handleAddToCart('${item.id}')" class="mt-4 w-full bg-blue-600 text-white text-xs py-2.5 rounded-lg font-bold hover:bg-blue-700 transition">
                    ${item.type === 'service' ? 'Book Appointment' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `).join('');
}

function handleAddToCart(id) {
    const found = bizItems.find(i => i.id === id);
    if (found) {
        activeCart.push(found);
        document.getElementById('checkout-container').classList.remove('hidden');
        recalculateTotal();
        document.getElementById('checkout-container').scrollIntoView({ behavior: 'smooth' });
    }
}

function recalculateTotal() {
    const subtotal = activeCart.reduce((acc, i) => acc + i.price, 0);
    const delCharge = parseInt(document.getElementById('delivery-select').value) || 0;
    
    document.getElementById('subtotal-val').innerText = subtotal;
    document.getElementById('delivery-val').innerText = delCharge;
    document.getElementById('grandtotal-val').innerText = subtotal + delCharge;
}

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    const select = document.getElementById('delivery-select');
    const delCharge = parseInt(select.value);
    const subtotal = activeCart.reduce((acc, i) => acc + i.price, 0);

    const orderObj = {
        id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        name, phone, address,
        zone: select.options[select.selectedIndex].text,
        total: subtotal + delCharge,
        status: 'Pending'
    };

    bizOrders.push(orderObj);
    localStorage.setItem('master_biz_orders', JSON.stringify(bizOrders));

    // Populate Invoice
    document.getElementById('inv-id').innerText = orderObj.id;
    document.getElementById('inv-name').innerText = orderObj.name;
    document.getElementById('inv-phone').innerText = orderObj.phone;
    document.getElementById('inv-zone').innerText = orderObj.zone;
    document.getElementById('inv-address').innerText = orderObj.address;
    document.getElementById('inv-amount').innerText = orderObj.total;

    document.getElementById('checkout-container').classList.add('hidden');
    document.getElementById('invoice-container').classList.remove('hidden');
    document.getElementById('invoice-container').scrollIntoView({ behavior: 'smooth' });
    activeCart = [];
});

// Admin Modal Functions
function openAdmin() {
    document.getElementById('admin-modal').classList.remove('hidden');
}

function closeAdmin() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function authenticateAdmin() {
    const pass = document.getElementById('admin-pass-input').value;
    if (pass === '1234') {
        document.getElementById('admin-login-box').classList.add('hidden');
        document.getElementById('admin-content-box').classList.remove('hidden');
        renderAdminDashboard();
    } else {
        alert('Invalid Security Password!');
    }
}

function tabSwitch(tabName) {
    document.getElementById('tab-products').classList.add('hidden');
    document.getElementById('tab-orders').classList.add('hidden');
    document.getElementById('tab-settings').classList.add('hidden');
    
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
}

function renderAdminDashboard() {
    // Items table
    const itemsTbody = document.getElementById('items-table-body');
    itemsTbody.innerHTML = bizItems.map(i => `
        <tr class="border-b">
            <td class="p-3 font-semibold">${i.title}</td>
            <td class="p-3 uppercase text-xs font-bold">${i.type}</td>
            <td class="p-3 font-mono">৳${i.price}</td>
            <td class="p-3"><button onclick="removeItem('${i.id}')" class="text-red-600 font-bold hover:underline">Remove</button></td>
        </tr>
    `).join('');

    // Orders table
    document.getElementById('orders-badge').innerText = bizOrders.length;
    const ordersTbody = document.getElementById('orders-table-body');
    ordersTbody.innerHTML = bizOrders.map(o => `
        <tr class="border-b">
            <td class="p-3 font-mono font-bold">${o.id}</td>
            <td class="p-3">${o.name}</td>
            <td class="p-3">${o.phone}</td>
            <td class="p-3 font-bold text-green-700">৳${o.total}</td>
            <td class="p-3"><span class="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">${o.status}</span></td>
        </tr>
    `).join('');

    // Settings fields
    document.getElementById('cfg-biz-name').value = bizConfig.name;
    document.getElementById('cfg-wa-num').value = bizConfig.whatsapp;
    document.getElementById('cfg-del-in').value = bizConfig.delInside;
    document.getElementById('cfg-del-out').value = bizConfig.delOutside;
}

function saveNewItem() {
    const title = document.getElementById('add-title').value;
    const price = parseInt(document.getElementById('add-price').value);
    const type = document.getElementById('add-type').value;
    const image = document.getElementById('add-img').value;

    if (!title || !price) {
        alert('Item Title and Price are required.');
        return;
    }

    bizItems.push({ id: Date.now().toString(), title, price, type, image });
    localStorage.setItem('master_biz_items', JSON.stringify(bizItems));
    renderAdminDashboard();
    loadAppUI();
    alert('Item added successfully!');
}

function removeItem(id) {
    bizItems = bizItems.filter(i => i.id !== id);
    localStorage.setItem('master_biz_items', JSON.stringify(bizItems));
    renderAdminDashboard();
    loadAppUI();
}

function saveBusinessConfig() {
    bizConfig.name = document.getElementById('cfg-biz-name').value;
    bizConfig.whatsapp = document.getElementById('cfg-wa-num').value;
    bizConfig.delInside = parseInt(document.getElementById('cfg-del-in').value);
    bizConfig.delOutside = parseInt(document.getElementById('cfg-del-out').value);

    localStorage.setItem('master_biz_config', JSON.stringify(bizConfig));
    loadAppUI();
    alert('Business configuration updated successfully!');
}
