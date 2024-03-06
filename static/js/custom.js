$(document).ready(function () {
    // Fungsi untuk menampilkan atau menyembunyikan kelas hasil berdasarkan parameter visible
    function toggleResult(visible) {
        if (visible) {
            $(".hasil").show();
        } else {
            $(".hasil").hide();
        }
    }
    
    // Fungsi untuk menampilkan gambar pratinjau
    function showPreviewImage(url) {
        $('#preview_img').attr('src', url);
        $("#dataGambar").val(url);
        toggleResult(false); // Sembunyikan hasil prediksi jika sedang ditampilkan
    }

    // Handler untuk tombol rekam
    $(".record").click(function () {
        $(".record").html('<a href="">Tutup Kamera<a>')
        $(".webcamku").html(`
            <div class="img-container position-relative">
                <div style="text-align: center;">
                    <video id="preview" class="img-fluid rounded" style="max-height: 450px;"></video>
                </div>
                <div style="text-align: center;">
                    <button class="btn btn-primary" id="capture" style="border-radius:50%;width:100px;height:100px;position:relative;top:-60px">
                        <img src="../static/gambar/camera.svg" width="50">
                    </button>
                </div>
            </div>
        `);
         toggleResult(false);

        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 450,
                height: 450,
                facingMode: 'environment'
            }
        })
            .then(stream => {
                preview.srcObject = stream;
                preview.play();
                preview.style.transform = 'scaleX(1)';
            })
            .catch(error => {
                console.error(error)
            })

        // Handler untuk tombol capture
        $('#capture').click(function () {
            const result = $('#result');
            const context = output.getContext('2d');

            output.width = $('#preview').width();
            output.height = $('#preview').height();

            context.drawImage(preview, 0, 0, output.width, output.height);
            result.src = output.toDataURL();
            const url = output.toDataURL();
            console.log(url);
            $(".record").html('<a href="">Ambil Ulang<a>')
            $(".webcamku").html(`
                <div style="text-align: center;">
                    <img src="${url}" style="transform: scaleX(1);">
                </div>
            `);
            $("#dataGambar").val(url);
            showPreviewImage(url); // Tampilkan gambar pratinjau
        })
    })

    // Handler untuk input file
    $('input[type=file]').on('change', function (e) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var url = e.target.result;
            showPreviewImage(url); // Tampilkan gambar pratinjau
        }
        reader.readAsDataURL(this.files[0]);
    })

    // Dapatkan semua elemen dengan kelas "alert-dismissible"
    var alertMessages = document.querySelectorAll(".alert-dismissible");

    // Iterasi semua elemen dan tambahkan event listener
    alertMessages.forEach(function (alertMessage) {
        alertMessage.querySelector(".close").addEventListener("click", function () {
            alertMessage.style.display = "none";
        });
    });

    $.post("/proses", function (data) {
        // Setelah memproses hasil prediksi, atur gambar yang diunggah atau diambil
        $("#preview_img").attr("src", data.data);
    });

    window.addEventListener('onload', function (event) {
        window.location.href = '/predic';
    });
})
