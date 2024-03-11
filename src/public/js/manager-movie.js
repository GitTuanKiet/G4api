
const maxLength = 100; // Số ký tự tối đa bạn muốn hiển thị
const text = document.getElementById('limitedText').textContent;

if (text.length > maxLength) {
    document.getElementById('limitedText').textContent = text.slice(0, maxLength) + '...';
}
    