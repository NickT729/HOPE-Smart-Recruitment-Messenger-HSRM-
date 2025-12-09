# HOPE Adaptive Messaging Script

A volunteer recruitment message generator for **HOPE Tutoring** - empowering students through education in Arlington, TX.

🌐 **Website**: [https://www.hopetutoring.org/](https://www.hopetutoring.org/)

---

## Features

- **Easy File Upload**: Drag-and-drop support for CSV, Word (DOCX), and PDF files
- **Smart Data Extraction**: Automatically identifies names, emails, phone numbers, interests, and locations
- **Pre-built Templates**: Four professionally crafted recruitment email templates
- **Personalization**: Merge fields for customized messaging ({first_name}, {interests}, {location})
- **Custom Templates**: Ability to create your own subject lines and email body
- **Multiple Download Options**: Export as CSV or ZIP file with individual emails
- **One-Click Copy**: Copy any generated email to clipboard instantly

---

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Add Your Logo (Optional)

Place your HOPE Tutoring logo in:
```
static/images/hope-logo.png
```

### 3. Run the Application

```bash
python app.py
```

### 4. Open in Browser

Navigate to: **http://localhost:5000**

---

## Admin Template

Pre-made templates are available in the `Admin Template` folder for collecting volunteer data:

| File | Description |
|------|-------------|
| `Volunteer_Template_EMPTY.csv` | Empty CSV template - give to admins to fill in |
| `Volunteer_Template_EMPTY.docx` | Empty Word template with table |
| `Volunteer_Template_EMPTY.pdf` | Printable PDF form |
| `Volunteer_Template_DEMO.csv` | CSV with 8 sample volunteers for testing |
| `Volunteer_Template_DEMO.docx` | Word doc with sample data |
| `Volunteer_Template_DEMO.pdf` | PDF with sample data |

### Template Columns (from HOPE signup form)
- Last Name *
- First Name *
- Email Address *
- Phone Number *
- Street Address with City & Zip Code *
- Emergency Contact Name & Phone Number *
- Are you at least 18 years old? *
- Assigned Site/Session
- How did you hear about HOPE Tutoring?

To regenerate templates, run:
```bash
python generate_templates.py
```

---

## Usage Guide

### Step 1: Upload Volunteer Data

Upload a file containing potential volunteer information:
- **CSV**: Use the provided templates in `Admin Template` folder, or any CSV with email addresses
- **DOCX**: Can contain tables or text with email addresses
- **PDF**: Tables or text content will be scanned

The tool automatically recognizes HOPE form fields (Last Name, First Name, Email Address, etc.)

### Step 2: Choose a Template

Select from four pre-built templates:

| Template | Best For |
|----------|----------|
| **General Recruitment** | New potential volunteers |
| **Student-Focused** | Emphasizing tutor-student relationships |
| **Professional Appeal** | Working professionals |
| **Community Impact** | Highlighting local Arlington impact |

Or create a custom template with your own subject line and body.

### Step 3: Generate & Download

- Preview all generated emails
- Copy individual emails with one click
- Download all emails as CSV or ZIP

---

## File Format Examples

### CSV Format (HOPE Form Fields)

```csv
Last Name,First Name,Email Address,Phone Number,Street Address with City & Zip Code,Assigned Site/Session
Johnson,Sarah,sarah@email.com,817-555-0101,"123 Oak St, Arlington, TX 76010",Monday Evening - UTA
Chen,Michael,m.chen@example.com,817-555-0203,"456 Elm Ave, Fort Worth, TX 76102",Tuesday Afternoon - Library
```

### Word/PDF Content

The tool can extract emails and associated names from:
- Tables with headers (recommended)
- Lists of contacts
- General text content

---

## Project Structure

```
HOPE Tool/
├── app.py                    # Flask application
├── requirements.txt          # Python dependencies
├── README.md                 # This file
├── static/
│   ├── css/
│   │   └── style.css         # Styling
│   ├── js/
│   │   └── app.js            # Frontend logic
│   └── images/
│       └── hope-logo.png     # HOPE logo
├── templates/
│   └── index.html            # Main page
└── utils/
    ├── __init__.py
    ├── file_parser.py        # File extraction
    └── message_generator.py  # Email templates
```

---

## Requirements

- Python 3.8+
- Flask 3.0+
- pandas 2.0+
- python-docx 1.0+
- pdfplumber 0.10+

---

## Support

For questions about HOPE Tutoring:
- 📧 Email: admin@hopetutoring.org
- 📞 Phone: 817-860-7757
- 🌐 Website: [hopetutoring.org](https://www.hopetutoring.org/)

---

*"Education is not the filling of a pail, but the lighting of a fire." — William Butler Yeats*

