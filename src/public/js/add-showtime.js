// Lấy thẻ input bằng id
const dateInput = document.getElementById('dateInput');

// Tạo một đối tượng Date mới
const currentDate = new Date();

// Lấy ngày, tháng, và năm hiện tại
const year = currentDate.getFullYear();
let month = currentDate.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0, cần cộng thêm 1 để hiển thị đúng
let day = currentDate.getDate();

// Nếu tháng hoặc ngày có một chữ số, thêm '0' vào trước để hiển thị đúng định dạng
month = month < 10 ? '0' + month : month;
day = day < 10 ? '0' + day : day;

// Đặt giá trị của trường input là ngày hiện tại (định dạng YYYY-MM-DD)
dateInput.value = `${year}-${month}-${day}`;