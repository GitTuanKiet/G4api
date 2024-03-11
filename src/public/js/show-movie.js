function showFullSummary(description) {
    var popupOverlay = document.getElementById('popupOverlay');
    var popupContent = document.getElementById('popupContent');
  
    // Set nội dung tóm tắt đầy đủ
    popupContent.innerHTML = description;
  
    // Hiển thị cửa sổ bật lên
    popupOverlay.style.display = 'block';
  }
  
  function closePopup() {
    var popupOverlay = document.getElementById('popupOverlay');
  
    // Ẩn cửa sổ bật lên
    popupOverlay.style.display = 'none';
  }


  //Trailer
  function openTrailer(url_trailer){
    var overlay = document.getElementById("overlayTrailer");
    var popup = document.getElementById("popupTrailer");
    var videoPlayer = document.getElementById('iframeTrailer');
    videoPlayer.src = url_trailer;
    overlay.style.display = "block";
    popup.style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.getElementById("overlayTrailer");
    var popup = document.getElementById("popupTrailer");
    var videoPlayer = document.getElementById('iframeTrailer');
    
    document.querySelector('.openTrailer').addEventListener("click", function () {
        overlay.style.display = "block";
        popup.style.display = "block";
    });
  
    overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        popup.style.display = "none";
        videoPlayer.src = '';
    });
});


  