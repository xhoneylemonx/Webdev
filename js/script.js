document.addEventListener('DOMContentLoaded', () => {
    // ข้อมูลจำลอง (Mock Data)
    let products = [
        // เปลี่ยนโครงสร้างข้อมูลให้มี variants สำหรับขนาด
        { 
            id: 'SKU001', 
            name: 'เสื้อครบรอบ30ปี', 
            category: 'fashion', 
            variants: [
                { size: 'S', price: 250, stock: 5 },
                { size: 'M', price: 300, stock: 10 },
                { size: 'L', price: 350, stock: 15 }
            ],
            image: 'https://via.placeholder.com/100x100/3498db/ffffff?text=Shirt' 
        },
        { 
            id: 'SKU002', 
            name: 'ร่มครบรอบ30ปี', 
            category: 'work-life', 
            variants: [
                { size: 'M', price: 499, stock: 50 }
            ],
            image: 'https://via.placeholder.com/100x100/e74c3c/ffffff?text=Umbrella' 
        },
        { 
            id: 'SKU003', 
            name: 'หมวกครบรอบ30ปี', 
            category: 'fashion', 
            variants: [
                { size: 'Free Size', price: 950, stock: 10 }
            ],
            image: 'https://via.placeholder.com/100x100/f1c40f/333333?text=Hat' 
        },
        { 
            id: 'SKU004', 
            name: 'กระเป๋าครบรอบ30ปี', 
            category: 'fashion', 
            variants: [
                { size: 'Free Size', price: 950, stock: 10 }
            ],
            image: 'https://via.placeholder.com/100x100/2ecc71/ffffff?text=Bag' 
        },
        { 
            id: 'SKU005', 
            name: 'แก้วครบรอบ30ปี', 
            category: 'work-life', 
            variants: [
                { size: 'M', price: 950, stock: 10 }
            ],
            image: 'https://via.placeholder.com/100x100/9b59b6/ffffff?text=Glass' 
        },
        { 
            id: 'SKU006', 
            name: 'เข็มกลัดครบรอบ30ปี', 
            category: 'fashion', 
            variants: [
                { size: 'Free Size', price: 950, stock: 10 }
            ],
            image: 'https://via.placeholder.com/100x100/34495e/ffffff?text=Badge' 
        },
        { 
            id: 'SKU007', 
            name: 'สมุดครบรอบ30ปี', 
            category: 'fashion', 
            variants: [
                { size: 'A5', price: 950, stock: 10 }
            ],
            image: 'https://via.placeholder.com/100x100/e67e22/ffffff?text=Notebook' 
        },
        { 
            id: 'SKU008', 
            name: 'ปากกาครบรอบ30ปี', 
            category: 'work-life', 
            variants: [
                { size: 'Free Size', price: 950, stock: 10 }
            ],
            image: 'https://via.placeholder.com/100x100/bdc3c7/333333?text=Pen' 
        },
    ];

    // เพิ่มหมวดหมู่ใหม่ 'work-life' เข้ามา
    let categories = ['fashion', 'home', 'work-life'];

    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item');
    const pageContents = document.querySelectorAll('.page-content');
    const productTableBody = document.getElementById('productTableBody');
    const addProductForm = document.getElementById('addProductForm');
    const productCategorySelect = document.getElementById('productCategory');
    const addCategoryForm = document.getElementById('addCategoryForm');
    const newCategoryNameInput = document.getElementById('newCategoryName');
    const categoryListUl = document.getElementById('categoryList');
    const productImageInput = document.getElementById('productImage');
    const imagePreviewContainer = document.getElementById('image-preview');
    const variantsContainer = document.getElementById('variants-container');
    const addVariantButton = document.getElementById('addVariantButton');

    // ฟังก์ชันแสดงรายการสินค้า
    function renderProductTable() {
        productTableBody.innerHTML = '';
        products.forEach(product => {
            const detailsList = product.variants.map(v => 
                `<li>ขนาด: ${v.size}, ราคา: ${v.price.toLocaleString()} บาท, คงเหลือ: ${v.stock}</li>`
            ).join('');
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" class="product-image-thumbnail"></td>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td><ul class="product-details">${detailsList}</ul></td>
                <td><button class="btn-delete" data-id="${product.id}">ลบ</button></td>
            `;
            productTableBody.appendChild(row);
        });

        productTableBody.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                deleteProduct(productId);
            });
        });
    }

    // ฟังก์ชันเพิ่มช่องกรอกขนาดใหม่
    function addVariantInput() {
        const variantItem = document.createElement('div');
        variantItem.classList.add('variant-item');
        variantItem.innerHTML = `
            <input type="text" placeholder="ขนาด (เช่น S, M, L)" class="variant-size" required>
            <input type="number" placeholder="ราคา" class="variant-price" required>
            <input type="number" placeholder="จำนวนคงเหลือ" class="variant-stock" required>
            <button type="button" class="btn-delete btn-remove-variant">ลบ</button>
        `;
        variantsContainer.appendChild(variantItem);
        variantItem.querySelector('.btn-remove-variant').addEventListener('click', () => {
            variantsContainer.removeChild(variantItem);
        });
    }

    // ฟังก์ชันแสดงภาพตัวอย่างที่เลือกจากเครื่อง
    function handleImagePreview() {
        const file = productImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewContainer.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreviewContainer.innerHTML = `<p>ไม่มีรูปภาพ</p>`;
        }
    }

    // ฟังก์ชันแสดงรายการหมวดหมู่ใน select box
    function renderCategoryOptions() {
        productCategorySelect.innerHTML = '<option value="">-- เลือกหมวดหมู่ --</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            productCategorySelect.appendChild(option);
        });
    }

    // ฟังก์ชันแสดงรายการหมวดหมู่ในหน้าจัดการ
    function renderCategoryList() {
        categoryListUl.innerHTML = '';
        categories.forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <button class="btn-delete-category" data-category="${category}">ลบ</button>
            `;
            categoryListUl.appendChild(li);
        });

        categoryListUl.querySelectorAll('.btn-delete-category').forEach(button => {
            button.addEventListener('click', (e) => {
                const categoryName = e.target.dataset.category;
                deleteCategory(categoryName);
            });
        });
    }

    // ฟังก์ชันสลับหน้า
    function switchPage(pageId) {
        pageContents.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId.replace('-page', '')}"]`).classList.add('active');
    }

    // ฟังก์ชันเพิ่มสินค้าใหม่
    function addProduct(event) {
        event.preventDefault();
        
        const file = productImageInput.files[0];
        if (!file) {
            alert('กรุณาเลือกรูปภาพสินค้า');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const productVariants = [];
            document.querySelectorAll('.variant-item').forEach(item => {
                const size = item.querySelector('.variant-size').value;
                const price = parseFloat(item.querySelector('.variant-price').value);
                const stock = parseInt(item.querySelector('.variant-stock').value, 10);
                if (size && !isNaN(price) && !isNaN(stock)) {
                    productVariants.push({ size, price, stock });
                }
            });

            if (productVariants.length === 0) {
                alert('กรุณาเพิ่มขนาดสินค้าอย่างน้อย 1 รายการ');
                return;
            }

            const newProduct = {
                id: 'SKU' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                variants: productVariants,
                image: e.target.result
            };
            products.push(newProduct);
            renderProductTable();
            alert('เพิ่มสินค้าสำเร็จ!');
            addProductForm.reset();
            imagePreviewContainer.innerHTML = `<p>ไม่มีรูปภาพ</p>`;
            variantsContainer.innerHTML = '';
            addVariantInput();
            switchPage('products-page');
        };
        reader.readAsDataURL(file);
    }

    // ฟังก์ชันลบสินค้า
    function deleteProduct(id) {
        if (confirm(`คุณแน่ใจหรือไม่ที่จะลบสินค้า ID: ${id}?`)) {
            products = products.filter(p => p.id !== id);
            renderProductTable();
            alert('ลบสินค้าสำเร็จ!');
        }
    }

    // ฟังก์ชันเพิ่มหมวดหมู่ใหม่
    function addCategory(event) {
        event.preventDefault();
        const newCategory = newCategoryNameInput.value.toLowerCase();
        if (!categories.includes(newCategory)) {
            categories.push(newCategory);
            renderCategoryOptions();
            renderCategoryList();
            alert(`เพิ่มหมวดหมู่ "${newCategory}" สำเร็จ!`);
            addCategoryForm.reset();
        } else {
            alert('หมวดหมู่มีอยู่แล้ว!');
        }
    }

    // ฟังก์ชันลบหมวดหมู่
    function deleteCategory(categoryName) {
        if (confirm(`คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่ "${categoryName}"? การทำเช่นนี้จะไม่ลบสินค้าที่อยู่ในหมวดหมู่นี้`)) {
            categories = categories.filter(c => c !== categoryName);
            renderCategoryOptions();
            renderCategoryList();
            alert('ลบหมวดหมู่สำเร็จ!');
        }
    }

    // Event Listeners
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.dataset.page + '-page';
            switchPage(pageId);
        });
    });

    addProductForm.addEventListener('submit', addProduct);
    addCategoryForm.addEventListener('submit', addCategory);
    productImageInput.addEventListener('change', handleImagePreview);
    addVariantButton.addEventListener('click', addVariantInput);

    // Initial render
    renderProductTable();
    renderCategoryOptions();
    renderCategoryList();
    addVariantInput(); // เพิ่มช่องกรอกขนาดเริ่มต้น 1 ช่อง
});