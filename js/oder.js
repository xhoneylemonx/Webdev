document.addEventListener('DOMContentLoaded', () => {

    // ข้อมูลสินค้าจำลอง (Mock Data) - ควรดึงมาจากฐานข้อมูลจริง
    const products = [
        { 
            id: 'SKU001', 
            name: 'เสื้อครบรอบ30ปี', 
            variants: [
                { size: 'S', price: 250, stock: 5 },
                { size: 'M', price: 300, stock: 10 },
                { size: 'L', price: 350, stock: 15 }
            ]
        },
        { 
            id: 'SKU002', 
            name: 'ร่มครบรอบ30ปี', 
            variants: [
                { size: 'M', price: 499, stock: 50 }
            ]
        },
        { 
            id: 'SKU003', 
            name: 'หมวกครบรอบ30ปี', 
            variants: [
                { size: 'Free Size', price: 950, stock: 10 }
            ]
        },
    ];

    // DOM Elements
    const productSelect = document.getElementById('productSelect');
    const quantityInput = document.getElementById('quantityInput');
    const addItemButton = document.getElementById('addItemButton');
    const orderItemsList = document.getElementById('order-items');
    const totalPriceSpan = document.getElementById('totalPrice');
    const orderForm = document.getElementById('orderForm');

    // ตะกร้าสินค้า
    let cart = [];

    // ฟังก์ชันสร้างตัวเลือกสินค้าใน dropdown
    function renderProductOptions() {
        products.forEach(product => {
            product.variants.forEach(variant => {
                const option = document.createElement('option');
                option.value = `${product.id}-${variant.size}`;
                option.textContent = `${product.name} (ขนาด: ${variant.size}) - ${variant.price.toLocaleString()} บาท`;
                option.dataset.productId = product.id;
                option.dataset.size = variant.size;
                option.dataset.price = variant.price;
                productSelect.appendChild(option);
            });
        });
    }

    // ฟังก์ชันคำนวณราคารวม
    function calculateTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceSpan.textContent = `${total.toLocaleString()} บาท`;
    }

    // ฟังก์ชันแสดงรายการสินค้าในตะกร้า
    function renderCart() {
        orderItemsList.innerHTML = '';
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('order-item');
            li.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name} (${item.size})</div>
                    <div class="item-price">${item.price.toLocaleString()} บาท</div>
                    <div class="item-qty">จำนวน: ${item.quantity}</div>
                </div>
                <button type="button" class="remove-item-btn" data-index="${index}">x</button>
            `;
            orderItemsList.appendChild(li);
        });

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', removeItemFromCart);
        });
        
        calculateTotal();
    }

    // ฟังก์ชันเพิ่มสินค้าลงในตะกร้า
    function addItemToCart() {
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        if (!selectedOption.value) {
            alert('กรุณาเลือกสินค้า');
            return;
        }
        
        const selectedId = selectedOption.dataset.productId;
        const selectedSize = selectedOption.dataset.size;
        const selectedPrice = parseFloat(selectedOption.dataset.price);
        const selectedName = selectedOption.textContent.split('(')[0].trim();
        const quantity = parseInt(quantityInput.value, 10);

        if (isNaN(quantity) || quantity < 1) {
            alert('กรุณาระบุจำนวนที่ถูกต้อง');
            return;
        }

        const existingItemIndex = cart.findIndex(item => item.id === selectedId && item.size === selectedSize);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                id: selectedId,
                name: selectedName,
                size: selectedSize,
                price: selectedPrice,
                quantity: quantity
            });
        }
        
        productSelect.value = '';
        quantityInput.value = 1;
        
        renderCart();
    }

    // ฟังก์ชันลบสินค้าออกจากตะกร้า
    function removeItemFromCart(e) {
        const index = parseInt(e.target.dataset.index, 10);
        cart.splice(index, 1);
        renderCart();
    }

    // ฟังก์ชันยืนยันการสั่งซื้อ
    function submitOrder(e) {
        e.preventDefault();

        if (cart.length === 0) {
            alert('กรุณาเพิ่มสินค้าลงในตะกร้าก่อนยืนยันการสั่งซื้อ');
            return;
        }
        
        const customerName = document.getElementById('customerName').value;
        const customerPhone = document.getElementById('customerPhone').value;
        const customerEmail = document.getElementById('customerEmail').value;
        const customerAddress = document.getElementById('customerAddress').value;
        const purchaseDate = document.getElementById('purchaseDate').value;
        const deliveryOption = document.getElementById('deliveryOption').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const paymentSlip = document.getElementById('paymentSlip').files[0];

        const orderSummary = {
            customer: {
                name: customerName,
                phone: customerPhone,
                email: customerEmail,
                address: customerAddress
            },
            order_info: {
                purchase_date: purchaseDate,
                delivery_option: deliveryOption,
                payment_method: paymentMethod,
                payment_slip: paymentSlip ? paymentSlip.name : 'No file uploaded'
            },
            items: cart,
            totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };

        console.log('ข้อมูลการสั่งซื้อ:', orderSummary);
        alert('ขอบคุณที่สั่งซื้อสินค้า! ระบบได้รับข้อมูลการสั่งซื้อของคุณแล้ว (ดูรายละเอียดใน Console)');

        // ล้างฟอร์มและตะกร้าหลังจากส่งข้อมูล
        orderForm.reset();
        cart = [];
        renderCart();
    }


    // Event Listeners
    addItemButton.addEventListener('click', addItemToCart);
    orderForm.addEventListener('submit', submitOrder);

    // Initial render
    renderProductOptions();
});