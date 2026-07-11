const { chromium } = require('playwright');
const readline = require('readline');

// Configurable base URL, default to http://localhost (docker-compose port 80)
// Can be overridden via APP_URL environment variable, e.g. APP_URL=http://localhost:5173 node race-test.js
const BASE_URL = process.env.APP_URL || 'http://localhost';

const accounts = [
  { username: 'wenwu', password: 'Aa123456@', pos: { x: 0, y: 0 } },
  { username: 'kduy', password: 'Aa123456@', pos: { x: 120, y: 60 } },
  { username: 'vantoi', password: 'Aa123456@', pos: { x: 240, y: 120 } },
  { username: 'wuw', password: 'Aa123456@', pos: { x: 360, y: 180 } }
];

async function run() {
  console.log('==================================================');
  console.log('  ScheduleMeeting - Playwright Race Condition Test');
  console.log('==================================================');
  console.log(`Target URL: ${BASE_URL}\n`);
  console.log('Đang khởi chạy 4 trình duyệt song song...');

  const instances = [];

  try {
    // 1. Launch 4 separate browser instances stacked in a cascading layout
    for (let i = 0; i < accounts.length; i++) {
      const acc = accounts[i];
      console.log(`- Mở trình duyệt ${i + 1} cho tài khoản: "${acc.username}"`);

      const browser = await chromium.launch({
        headless: false,
        args: [
          `--window-position=${acc.pos.x},${acc.pos.y}`,
          `--window-size=900,680`
        ]
      });

      const context = await browser.newContext({
        viewport: null
      });
      const page = await context.newPage();

      instances.push({ browser, context, page, account: acc });
    }

    // 2. Automate login for each browser
    console.log('\nĐang tiến hành đăng nhập tự động...');
    for (let i = 0; i < instances.length; i++) {
      const { page, account } = instances[i];
      const loginUrl = `${BASE_URL.replace(/\/$/, '')}/login`;

      console.log(`- Trình duyệt ${i + 1} (${account.username}): Điều hướng tới ${loginUrl}`);
      await page.goto(loginUrl);

      console.log(`- Trình duyệt ${i + 1} (${account.username}): Điền thông tin đăng nhập`);
      await page.waitForSelector('#login-username', { timeout: 10000 });
      await page.fill('#login-username', account.username);
      await page.fill('#login-password', account.password);

      console.log(`- Trình duyệt ${i + 1} (${account.username}): Click Đăng nhập`);
      await page.click('button[type="submit"]');

      // Wait for URL to change away from login screen
      await page.waitForFunction((urlStr) => !window.location.pathname.endsWith('/login'), null, { timeout: 15000 });

      // Directly navigate to bookings page for user convenience
      const bookingsUrl = `${BASE_URL.replace(/\/$/, '')}/bookings`;
      console.log(`- Trình duyệt ${i + 1} (${account.username}): Di chuyển sang trang đặt phòng (${bookingsUrl})`);
      await page.goto(bookingsUrl);
      await page.waitForLoadState('networkidle');

      // Inject CSS to scale down page and keep modal submit buttons locked to footer
      await page.addStyleTag({
        content: `
          body {
            zoom: 0.75 !important;
          }
          .modal-overlay {
            align-items: center !important;
            justify-content: center !important;
          }
          .modal-content {
            max-height: 90vh !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .modal-body {
            flex: 1 !important;
            overflow-y: auto !important;
          }
        `
      });
    }

    console.log('\n=================== SẴN SÀNG ===================');
    console.log('1. Vui lòng thao tác trên cả 4 màn hình trình duyệt để mở modal đăng ký đặt lịch.');
    console.log('2. Nhập các thông tin đặt phòng (chọn phòng, thời gian, thiết bị...).');
    console.log('3. Điền cùng một khung giờ/phòng họp nếu muốn test trùng lịch.');
    console.log('4. KHÔNG tự click nút "Đăng Ký Đặt Lịch" trên trình duyệt.');
    console.log('5. Sau khi nhập xong ở cả 4 bên, quay lại cửa sổ terminal này.');
    console.log('==================================================\n');

    // Create readline interface for command prompt
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

    await askQuestion('==> Nhấn phím ENTER để thực hiện CLICK nút submit đồng thời trên cả 4 trình duyệt...');

    console.log('\nĐang gửi lệnh click đồng thời ở cả 4 cửa sổ...');

    // Concurrently click the submit button that is currently visible in each page
    const clickPromises = instances.map(async (inst, idx) => {
      const { page, account } = inst;
      try {
        // Find visible submit button (e.g. "Đăng Ký Đặt Lịch" or "Đăng Ký Lịch Định Kỳ")
        const submitBtn = page.locator('button[type="submit"]:visible');

        // Ensure the button is present before clicking
        await submitBtn.waitFor({ state: 'visible', timeout: 5000 });

        // Concurrently click
        await submitBtn.click();
        return { success: true, username: account.username };
      } catch (err) {
        return { success: false, username: account.username, error: err.message };
      }
    });

    const results = await Promise.all(clickPromises);

    console.log('\nKết quả kích hoạt click:');
    results.forEach((res, idx) => {
      if (res.success) {
        console.log(`- [Thành công] Trình duyệt ${idx + 1} (${res.username}): Đã click nút submit.`);
      } else {
        console.log(`- [Thất bại] Trình duyệt ${idx + 1} (${res.username}): Không thể click - Lỗi: ${res.error}`);
      }
    });

    console.log('\n==================================================');
    console.log('Đã kích hoạt race condition thành công.');
    console.log('Vui lòng kiểm tra phản hồi trên 4 cửa sổ trình duyệt (xem Toast message báo lỗi hoặc thành công).');
    console.log('Nhấn ENTER một lần nữa để đóng trình duyệt và thoát.');
    console.log('==================================================\n');

    await askQuestion('');

    // Clean up and close browsers
    console.log('Đang đóng các trình duyệt...');
    for (const inst of instances) {
      await inst.browser.close();
    }

    rl.close();
    console.log('Hoàn thành!');
  } catch (error) {
    console.error('\nĐã xảy ra lỗi trong quá trình thực thi script:', error);
    for (const inst of instances) {
      if (inst.browser) {
        await inst.browser.close().catch(() => { });
      }
    }
    process.exit(1);
  }
}

run();
