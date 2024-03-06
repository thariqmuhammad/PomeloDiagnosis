import random
import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
import base64
from flask import Flask, flash, redirect, url_for, render_template, request
from tensorflow.keras.preprocessing import image

app = Flask(__name__)
app.secret_key = 'secretkey'

@app.route('/')
def home():
    return render_template("home.html")


@app.route('/predic', methods=['GET', 'POST'])
def predic():
    return render_template("predic.html")


@app.route('/tescam')
def tes():
    return render_template("tescam.html")


@app.route('/tangkap', methods=['GET', 'POST'])
def tangkap():
    print(request.form.get('coba'))
    return render_template('tangkap.html')

@app.route('/proses', methods=['GET', 'POST'])
def proses():
    class_names = ['Blendok', 'Kanker', 'Lalat', 'Sehat']
    dataGambar = request.form.get('uriGambar')  # url gambar hasil capture

    if request.method == 'GET':
        # Tangani permintaan GET dengan cara yang berbeda (misalnya, render template yang berbeda)
        return render_template('predic.html')

    if dataGambar == 'kk':
        # Tampilkan pesan kesalahan jika tidak ada gambar yang diunggah atau diambil
        flash('Anda harus mengupload atau mengambil gambar terlebih dahulu!', 'danger')
        return redirect(url_for('predic'))

    # upload gambar via webcam ke folder
    datas = dataGambar[22:]
    Capture_image = datas.encode()
    filename = str(random.randrange(1, 10000)) + ".jpg"

    # simpan gambar ke folder
    with open(f"gambar/{filename}.jpg", "wb") as fh:
        fh.write(base64.decodebytes(Capture_image))
    files = f"gambar/{filename}.jpg"

    # KODE PROSES DISINI

    if request.method == "POST":
        my_reloaded_model = load_model('Test3_Densenet121_fe.h5')

        img = Image.open(files)
        resize_image = img.resize((128, 128))

        # Ensure the image has 3 channels (RGB)
        rgb_image = resize_image.convert('RGB')

        # Ensure the same preprocessing steps as predict_images_in_folder
        img_array = image.img_to_array(rgb_image)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # Normalize pixel values

        prediction = my_reloaded_model.predict(img_array)
        output = class_names[np.argmax(prediction[0])]
        confidence = round(100 * (np.max(prediction[0])), 2)

    # END KODE PROSES
    return render_template("predic.html", data=dataGambar, hasil=output, percentage=confidence, preview_image_url=dataGambar)

if __name__ == "__main__":
    app.run(debug=True)
