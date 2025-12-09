"""
HOPE Adaptive Messaging Script
A volunteer recruitment message generator for HOPE Tutoring
https://www.hopetutoring.org/
"""

import os
import io
import csv
import zipfile
import webbrowser
import threading
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
from utils.file_parser import FileParser
from utils.message_generator import MessageGenerator

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

# Allowed file extensions
ALLOWED_EXTENSIONS = {'csv', 'docx', 'pdf'}

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    """Render the main page."""
    templates = MessageGenerator.get_available_templates()
    categories = MessageGenerator.get_template_categories()
    return render_template('index.html', templates=templates, categories=categories)


@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload and extract volunteer data with recovery mode."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not supported. Please upload CSV, DOCX, or PDF files.'}), 400
    
    filepath = None
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Parse the file
        parser = FileParser()
        data = parser.parse(filepath)
        
        # Clean up uploaded file
        if filepath and os.path.exists(filepath):
            os.remove(filepath)
        
        if not data:
            return jsonify({'error': 'Could not extract any volunteer data from the file. Please ensure your file contains names and email addresses.'}), 400
        
        return jsonify({
            'success': True,
            'data': data,
            'count': len(data)
        })
    
    except Exception as e:
        # Clean up file on error
        if filepath and os.path.exists(filepath):
            try:
                os.remove(filepath)
            except:
                pass
        
        # Try recovery mode - attempt partial extraction
        error_msg = str(e)
        partial_data = []
        
        # If we got some data before the error, return it
        if 'partial_data' in dir() and partial_data:
            return jsonify({
                'error': f'Partial extraction: {error_msg}',
                'partial_data': partial_data,
                'count': len(partial_data)
            }), 206  # Partial Content
        
        return jsonify({'error': f'Error processing file: {error_msg}'}), 500


@app.route('/download/sample', methods=['GET'])
def download_sample():
    """Download a sample CSV template file."""
    sample_path = os.path.join(os.path.dirname(__file__), 'Admin Templates', 'Volunteer_Template_DEMO.csv')
    if os.path.exists(sample_path):
        return send_file(sample_path, as_attachment=True, download_name='sample_volunteer_template.csv')
    
    # Create a simple sample if file doesn't exist
    sample_csv = """First Name,Last Name,Email Address,Phone Number,Street Address with City & Zip Code,Assigned Site/Session
John,Doe,john.doe@example.com,817-555-0101,"123 Main St, Arlington, TX 76010",Monday Evening
Jane,Smith,jane.smith@example.com,817-555-0102,"456 Oak Ave, Arlington, TX 76011",Tuesday Afternoon
"""
    return send_file(
        io.BytesIO(sample_csv.encode('utf-8')),
        mimetype='text/csv',
        as_attachment=True,
        download_name='sample_volunteer_template.csv'
    )


@app.route('/generate', methods=['POST'])
def generate_messages():
    """Generate personalized recruitment emails."""
    try:
        data = request.json
        volunteers = data.get('volunteers', [])
        template_id = data.get('template_id', 'general')
        custom_subject = data.get('custom_subject', '')
        custom_body = data.get('custom_body', '')
        
        if not volunteers:
            return jsonify({'error': 'No volunteer data provided'}), 400
        
        generator = MessageGenerator()
        messages = generator.generate_batch(
            volunteers=volunteers,
            template_id=template_id,
            custom_subject=custom_subject if custom_subject else None,
            custom_body=custom_body if custom_body else None
        )
        
        return jsonify({
            'success': True,
            'messages': messages,
            'count': len(messages)
        })
    
    except Exception as e:
        return jsonify({'error': f'Error generating messages: {str(e)}'}), 500


@app.route('/download/csv', methods=['POST'])
def download_csv():
    """Download all generated emails as CSV."""
    try:
        data = request.json
        messages = data.get('messages', [])
        
        if not messages:
            return jsonify({'error': 'No messages to download'}), 400
        
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['Name', 'Email', 'Subject', 'Body'])
        
        for msg in messages:
            writer.writerow([
                msg.get('name', ''),
                msg.get('email', ''),
                msg.get('subject', ''),
                msg.get('body', '').replace('\n', '\\n')
            ])
        
        output.seek(0)
        
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='hope_recruitment_emails.csv'
        )
    
    except Exception as e:
        return jsonify({'error': f'Error creating CSV: {str(e)}'}), 500


@app.route('/download/zip', methods=['POST'])
def download_zip():
    """Download all generated emails as individual text files in a ZIP."""
    try:
        data = request.json
        messages = data.get('messages', [])
        
        if not messages:
            return jsonify({'error': 'No messages to download'}), 400
        
        # Create ZIP in memory
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for i, msg in enumerate(messages, 1):
                name = msg.get('name', f'Volunteer_{i}').replace(' ', '_')
                content = f"To: {msg.get('email', '')}\n"
                content += f"Subject: {msg.get('subject', '')}\n\n"
                content += msg.get('body', '')
                
                zip_file.writestr(f"{name}_email.txt", content)
        
        zip_buffer.seek(0)
        
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name='hope_recruitment_emails.zip'
        )
    
    except Exception as e:
        return jsonify({'error': f'Error creating ZIP: {str(e)}'}), 500


@app.route('/templates', methods=['GET'])
def get_templates():
    """Get all available email templates."""
    templates = MessageGenerator.get_available_templates()
    return jsonify({'templates': templates})


def open_browser():
    """Open the browser after a short delay to let the server start."""
    webbrowser.open('http://localhost:5000')


if __name__ == '__main__':
    # Open browser automatically after 1.5 seconds
    threading.Timer(1.5, open_browser).start()
    print("\n🚀 Starting HOPE Messaging Tool...")
    print("📍 Opening browser at http://localhost:5000\n")
    app.run(debug=True, port=5000, use_reloader=False)

