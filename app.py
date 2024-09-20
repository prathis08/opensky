
from flask import Flask, request, jsonify, render_template
import os
import tempfile
from flask_cors import CORS
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

app = Flask(__name__)

SERVICE_ACCOUNT_FILE = 'service-acc.json'
SCOPES = ['https://www.googleapis.com/auth/drive.file']

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)
service = build('drive', 'v3', credentials=credentials)

FOLDER_ID = '19LtR_N3nFgzfgSoa3MKh9aj8T5-ZDmR1'

CORS(app)


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/upload', methods=['POST'])
def upload_files():
    print(request.files.getlist('files'))
    if 'files' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    uploaded_files = request.files.getlist('files')
    if not uploaded_files or all(file.filename == '' for file in uploaded_files):
        return jsonify({'error': 'No selected files'}), 400

    uploaded_file_ids = []

    for file in uploaded_files:
        if file:
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                file.save(temp_file.name)
                temp_file_path = temp_file.name

            file_metadata = {
                'name': file.filename,
                'parents': [FOLDER_ID]
            }
            media = MediaFileUpload(temp_file_path, resumable=True)

            try:
                uploaded_file = service.files().create(
                    body=file_metadata, media_body=media, fields='id').execute()
                uploaded_file_ids.append(uploaded_file.get('id'))
            except Exception as e:
                return jsonify({'error': str(e)}), 500
            finally:
                os.remove(temp_file_path)

    return jsonify({'file_ids': uploaded_file_ids, 'message': 'Files uploaded successfully!'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5001')
