        // ตัวแปรสำหรับการซูมรูปภาพ
        let currentZoom = 1;
        const ZOOM_STEP = 0.2;
        const MIN_ZOOM = 0.5;
        const MAX_ZOOM = 3;
        
        // อ้างอิงถึงองค์ประกอบ HTML
        const image = document.querySelector('img');
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const printBtn = document.getElementById('printBtn');
        const darkModeBtn = document.getElementById('darkModeBtn');
        
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        const notificationBtn = document.getElementById('notificationBtn');
        const paymentNotification = document.getElementById('paymentNotification');
        const loader = document.getElementById('loader');
        
        // ฟังก์ชันซูมภาพ
        function zoomImage(zoomDirection) {
            if (zoomDirection === 'in') {
                if (currentZoom < MAX_ZOOM) {
                    currentZoom += ZOOM_STEP;
                }
            } else if (zoomDirection === 'out') {
                if (currentZoom > MIN_ZOOM) {
                    currentZoom -= ZOOM_STEP;
                }
            } else if (zoomDirection === 'reset') {
                currentZoom = 1;
            }
            
            image.style.transform = `scale(${currentZoom})`;
            image.style.transition = 'transform 0.3s ease';
            
            // แสดงการแจ้งเตือนการซูม
            showNotification(`ซูมภาพ: ${Math.round(currentZoom * 100)}%`, 'info');
        }
        
        // ฟังก์ชันแสดงการแจ้งเตือน
        function showNotification(message, type = 'info') {
            // อัพเดทเนื้อหาการแจ้งเตือน
            paymentNotification.innerHTML = `
                <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <div>${message}</div>
                <button onclick="closeNotification()" style="background:none;border:none;color:white;cursor:pointer;margin-left:10px;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // ตั้งคลาสตามประเภท
            paymentNotification.className = 'notification';
            if (type === 'warning') {
                paymentNotification.classList.add('warning');
            }
            
            // แสดงการแจ้งเตือน
            paymentNotification.classList.add('show');
            
            // ปิดการแจ้งเตือนอัตโนมัติหลังจาก 5 วินาที
            setTimeout(() => {
                closeNotification();
            }, 5000);
        }
        
        // ฟังก์ชันปิดการแจ้งเตือน
        function closeNotification() {
            paymentNotification.classList.remove('show');
        }
        
        // ฟังก์ชันแสดงตัวโหลด
        function showLoader() {
            loader.classList.add('show');
        }
        
        // ฟังก์ชันซ่อนตัวโหลด
        function hideLoader() {
            loader.classList.remove('show');
        }
        
        // ฟังก์ชันสำหรับการดาวน์โหลด PDF (จำลอง)
function simulateDownload() {
    showLoader();
    showNotification('กำลังดาวน์โหลดไฟล์ PDF...', 'info');

    const pdfUrl = '6805_ใบแจ้งค่าไฟฟ้า.pdf'; // path ไฟล์
    const fileName = '6805_ใบแจ้งค่าไฟฟ้า.pdf';

    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
        hideLoader();
        showNotification('ดาวน์โหลดไฟล์สำเร็จ', 'success');
    }, 1000);
}

        
        // ฟังก์ชันสำหรับการพิมพ์ (จำลอง)
    function simulatePrint() {
    //showLoader();
    showNotification('กำลังเตรียมพิมพ์ใบแจ้งค่าไฟฟ้า...', 'info');

    const pdfUrl = '6805_ใบแจ้งค่าไฟฟ้า.pdf';

    const printWindow = window.open(pdfUrl, '_blank');

    if (!printWindow) {
        //hideLoader();
        showNotification('กรุณาอนุญาต popup เพื่อพิมพ์ไฟล์', 'error');
        return;
    }

    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();

        //hideLoader();
        showNotification('พร้อมพิมพ์ใบแจ้งค่าไฟฟ้าแล้ว', 'success');
    };
}
        
        // ฟังก์ชันสลับโหมดมืด/สว่าง
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            
            // เปลี่ยนไอคอนตามโหมด
            const icon = darkModeBtn.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-sun';
                showNotification('เปลี่ยนเป็นโหมดมืดแล้ว', 'info');
            } else {
                icon.className = 'fas fa-moon';
                showNotification('เปลี่ยนเป็นโหมดสว่างแล้ว', 'info');
            }
        }
        
        // ฟังก์ชันเลื่อนไปด้านบน
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // ฟังก์ชันแสดงการแจ้งเตือนการชำระเงิน
        function showPaymentNotification() {
            showNotification(`⏰ กำหนดชำระค่าไฟฟ้าวันที่ 6 มิถุนายน 2568<br>จำนวนเงิน 1,401.00 บาท`, 'warning');
        }
        
        // ฟังก์ชันเพิ่มเอฟเฟกต์ไฮไลต์
        function highlightImportantInfo() {
            const importantRow = document.querySelector('.important-row');
            el.importantRow.classList.add('highlight');
            
            setTimeout(() => {
                importantRow.classList.remove('highlight');
            }, 2000);
        }
        
        // ฟังก์ชันตรวจสอบการชำระเงินใกล้กำหนด
        function checkDueDate() {
            const dueDate = new Date(2025, 5, 6); // 6 มิถุนายน 2568
            const today = new Date();
            const timeDiff = dueDate.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (daysDiff <= 7 && daysDiff > 0) {
                showNotification(`⏰ อีก ${daysDiff} วัน จะถึงกำหนดชำระค่าไฟฟ้า!`, 'warning');
            } else if (daysDiff <= 0) {
                showNotification(`⚠️ เกินกำหนดชำระค่าไฟฟ้าแล้ว!`, 'warning');
            }
        }
        
        // กำหนด Event Listeners
        zoomInBtn.addEventListener('click', () => zoomImage('in'));
        zoomOutBtn.addEventListener('click', () => zoomImage('out'));
        downloadBtn.addEventListener('click', simulateDownload);
        printBtn.addEventListener('click', simulatePrint);
        darkModeBtn.addEventListener('click', toggleDarkMode);
        scrollTopBtn.addEventListener('click', scrollToTop);
        notificationBtn.addEventListener('click', showPaymentNotification);
        
        // คลิกที่รูปเพื่อรีเซ็ตซูม
        image.addEventListener('click', () => {
            if (currentZoom !== 1) {
                zoomImage('reset');
            }
        });
        
        // ปุ่มเลื่อนขึ้นด้านบนจะแสดงเมื่อเลื่อนลง
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'flex'; // แสดงตลอดเวลาในตัวอย่างนี้
            }
        });
        
        // เมื่อโหลดหน้าเว็บเสร็จ
        document.addEventListener('DOMContentLoaded', () => {
            // ตรวจสอบวันที่ครบกำหนด
            setTimeout(checkDueDate, 1000);
            
            // ไฮไลต์ข้อมูลสำคัญ
            setTimeout(highlightImportantInfo, 1500);
            
            // แสดงการแจ้งเตือนต้อนรับ
            setTimeout(() => {
                showNotification('ยินดีต้อนรับสู่ระบบใบแจ้งค่าไฟฟ้าดิจิทัล', 'info');
            }, 500);
            
            // เพิ่มเอฟเฟกต์ให้กับภาพ
            setTimeout(() => {
                image.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            }, 1000);
        });
        
        // เพิ่มคีย์บอร์ดชอร์ตคัท
        document.addEventListener('keydown', (e) => {
            // Ctrl + + เพื่อซูมเข้า
            if (e.ctrlKey && e.key === '+') {
                e.preventDefault();
                zoomImage('in');
            }
            
            // Ctrl + - เพื่อซูมออก
            if (e.ctrlKey && e.key === '-') {
                e.preventDefault();
                zoomImage('out');
            }
            
            // Ctrl + 0 เพื่อรีเซ็ตซูม
            if (e.ctrlKey && e.key === '0') {
                e.preventDefault();
                zoomImage('reset');
            }
            
            // D สำหรับโหมดมืด
            if (e.key === 'd' || e.key === 'D') {
                toggleDarkMode();
            }
        });
