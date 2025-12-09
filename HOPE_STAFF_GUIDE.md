# 📚 HOPE Smart Recruitment Messenger (HSRM) - Complete Staff Guide

> **A comprehensive guide for understanding, using, and deploying the HSRM tool**

---

## 📖 Table of Contents

1. [What is HSRM?](#what-is-hsrm)
2. [How It Was Built](#how-it-was-built)
3. [How It Works](#how-it-works)
4. [Features Overview](#features-overview)
5. [Step-by-Step User Guide](#step-by-step-user-guide)
6. [Understanding the Data Flow](#understanding-the-data-flow)
7. [Deployment Options](#deployment-options)
8. [Frequently Asked Questions](#frequently-asked-questions)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 What is HSRM?

**HOPE Smart Recruitment Messenger (HSRM)** is a web-based tool designed specifically for HOPE Tutoring to streamline volunteer recruitment outreach. Instead of manually typing personalized emails for each potential volunteer, HSRM automates this process.

### The Problem It Solves

Before HSRM:
- Staff manually typed each volunteer's name into email templates
- Copy-pasting was tedious and error-prone
- Tracking who was contacted was done in spreadsheets
- No easy way to see response rates

After HSRM:
- Upload a file with volunteer data → Get personalized emails instantly
- Choose from 20+ professionally written templates
- Track responses (Pending, Responded, Signed Up, Declined)
- View analytics and response rates
- Filter contacts by upload batch

---

## 🛠️ How It Was Built

### Technology Stack

HSRM is built using modern, industry-standard technologies:

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │    HTML5    │  │    CSS3     │  │ JavaScript  │          │
│  │  (Structure)│  │  (Styling)  │  │  (Logic)    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Python Flask                      │    │
│  │         (Web Server & API Endpoints)                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│           ┌───────────────┼───────────────┐                 │
│           ▼               ▼               ▼                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   pandas    │  │ python-docx │  │ pdfplumber  │          │
│  │ (CSV Parse) │  │(Word Parse) │  │ (PDF Parse) │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Key Components Explained

| Component | What It Does | Why We Use It |
|-----------|--------------|---------------|
| **Flask** | Python web framework | Simple, lightweight, perfect for small apps |
| **HTML/CSS/JS** | User interface | Works in any browser, no install needed |
| **pandas** | Data processing library | Reads CSV files, handles spreadsheet data |
| **python-docx** | Word document library | Extracts data from .docx files |
| **pdfplumber** | PDF reading library | Extracts tables and text from PDFs |
| **localStorage** | Browser storage | Saves tracking data locally (encrypted) |

### File Structure

```
HOPE toolv2/
├── app.py                    # Main server (the brain)
├── requirements.txt          # List of Python packages needed
├── templates/
│   └── index.html           # The webpage you see
├── static/
│   ├── css/
│   │   └── style.css        # All the styling (colors, layout)
│   ├── js/
│   │   └── app.js           # Interactive features (buttons, uploads)
│   └── images/
│       └── hope-logo.png    # HOPE logo
├── utils/
│   ├── file_parser.py       # Code that reads your uploaded files
│   └── message_generator.py # Code that creates personalized emails
└── Admin Templates/         # Demo files for testing
    ├── Volunteer_Template_DEMO.csv
    ├── Volunteer_Template_DEMO.pdf
    └── ... (other templates)
```

### How the Code Works (Simplified)

1. **When you upload a file:**
```python
# file_parser.py looks for these patterns:
- Email addresses (anything@something.com)
- Names (columns labeled "First Name", "Name", etc.)
- Phone numbers (817-555-1234 pattern)
```

2. **When you generate emails:**
```python
# message_generator.py replaces placeholders:
"Dear {first_name}," → "Dear Sarah,"
"{location}" → "Arlington"
```

3. **When you track responses:**
```javascript
// app.js encrypts and stores in your browser:
localStorage.setItem('hsrm_tracking', encryptedData);
```

---

## ⚙️ How It Works

### The Three-Step Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   STEP 1    │────▶│   STEP 2    │────▶│   STEP 3    │
│   Upload    │     │  Customize  │     │   Export    │
│             │     │             │     │             │
│ Drop a file │     │ Pick a      │     │ Download    │
│ with names  │     │ template or │     │ emails or   │
│ and emails  │     │ write your  │     │ copy them   │
│             │     │ own message │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Data Processing Pipeline

```
Your File (CSV/DOCX/PDF)
         │
         ▼
┌─────────────────────┐
│   File Parser       │
│   Extracts:         │
│   • Names           │
│   • Emails          │
│   • Phone numbers   │
│   • Interests       │
│   • Location        │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   Template Engine   │
│   Replaces:         │
│   {first_name}      │
│   {email}           │
│   {location}        │
│   etc.              │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   Output            │
│   • CSV file        │
│   • ZIP with .txt   │
│   • Copy to clip    │
└─────────────────────┘
```

---

## ✨ Features Overview

### Core Features

| Feature | Description |
|---------|-------------|
| 📤 **Smart File Upload** | Drag-and-drop CSV, Word, or PDF files |
| 🔍 **Auto Data Extraction** | Automatically finds names, emails, phones |
| ✏️ **Inline Editing** | Click any cell to fix mistakes before generating |
| 📧 **20+ Email Templates** | Professional templates for any situation |
| 🎨 **Custom Templates** | Write your own subject and body |
| 📊 **Response Tracking** | Track: Pending, Responded, Signed Up, Declined |
| 📁 **Batch Tracking** | Filter contacts by upload batch |
| 📈 **Analytics Dashboard** | See response rates and conversion funnel |
| 🌙 **Dark Mode** | Easy on the eyes |
| 🔒 **Encrypted Storage** | Your data is encrypted in browser storage |

### Template Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| 📨 **Initial Outreach** | First contact | General, Student-Focused, Professional |
| 🔄 **Follow-Up** | No response yet | Gentle Reminder, Urgent Need, Success Story |
| 🎉 **Seasonal** | Timely campaigns | Back to School, Thanksgiving, New Year |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Generate emails (Step 2) |
| `Ctrl + S` | Download CSV (Step 3) |
| `Escape` | Close any modal |

---

## 📝 Step-by-Step User Guide

### Getting Started

#### 1. Prepare Your Volunteer Data

Create a spreadsheet (Excel or Google Sheets) with these columns:
- **First Name** (required)
- **Last Name** (optional)
- **Email Address** (required)
- **Phone Number** (optional)
- **Address** (optional)

Save as CSV, or you can use Word/PDF with a table.

#### 2. Upload Your File

1. Open HSRM in your browser
2. Drag your file onto the upload zone (or click to browse)
3. Wait for processing (usually 1-2 seconds)

#### 3. Review & Edit Data

- Check the extracted data in the preview table
- **Yellow rows** = duplicate emails detected
- **Click any cell** to edit it directly
- Warnings show missing data (e.g., "3 contacts missing phone numbers")

#### 4. Choose a Template

1. Click a category tab: Initial Outreach, Follow-Up, or Seasonal
2. Browse templates - each shows a preview thumbnail
3. Click **"Preview"** to see the full email
4. Click **"Use"** or click the card to select it

#### 5. Generate Emails

1. Click **"Generate Emails →"**
2. 🎉 Confetti celebration!
3. Review generated emails

#### 6. Export or Copy

- **Download CSV**: Get a spreadsheet with all emails
- **Download ZIP**: Get individual .txt files for each email
- **Copy**: Click copy button on any email

#### 7. Track Responses

After sending emails:
1. Return to HSRM
2. Use the status dropdown on each email: Pending → Responded → Signed Up
3. Click **"View All"** to see all tracked contacts
4. Click **"📈 Dashboard"** to see analytics

---

## 🔄 Understanding the Data Flow

### Where Your Data Lives

```
┌──────────────────────────────────────────────────────────┐
│                    YOUR COMPUTER                          │
│                                                           │
│  ┌─────────────────┐    ┌─────────────────────────────┐  │
│  │  Your Browser   │    │      HSRM Server            │  │
│  │                 │    │      (localhost:5000)       │  │
│  │  ┌───────────┐  │    │                             │  │
│  │  │localStorage│◀─────│  Temporary file processing  │  │
│  │  │(encrypted) │  │    │  (files deleted after use) │  │
│  │  └───────────┘  │    │                             │  │
│  │                 │    └─────────────────────────────┘  │
│  │  Stores:        │                                     │
│  │  • Tracking data│         ⬆️ NEVER LEAVES            │
│  │  • Theme pref   │         YOUR COMPUTER              │
│  │  • Cached data  │                                     │
│  └─────────────────┘                                     │
└──────────────────────────────────────────────────────────┘
```

### Privacy & Security

✅ **What HSRM does:**
- Processes files locally on your computer
- Encrypts tracking data in your browser
- Deletes uploaded files immediately after processing
- Never sends data to external servers

❌ **What HSRM does NOT do:**
- Store data on the internet
- Share data with third parties
- Send emails automatically (you do that manually)
- Require an account or login

---

## 🚀 Deployment Options

### Option 1: Run Locally (Easiest - Recommended for Testing)

**Best for:** Individual staff members testing the tool

**Requirements:**
- Computer with Python installed
- 5 minutes setup time

**Steps:**

```bash
# 1. Install Python (if not installed)
# Download from: https://www.python.org/downloads/

# 2. Open Command Prompt/Terminal in the HOPE toolv2 folder

# 3. Install dependencies (one time only)
pip install -r requirements.txt

# 4. Run the app
python app.py

# 5. Open browser to: http://localhost:5000
```

**Pros:** ✅ Free, ✅ Private, ✅ No internet needed
**Cons:** ❌ Only works on one computer at a time

---

### Option 2: Shared Office Computer

**Best for:** Multiple staff members in the same office

**Setup:**
1. Install on one designated office computer
2. Create a desktop shortcut to run `python app.py`
3. Staff can take turns using it

**Pro tip:** Create a batch file for easy starting:

```batch
@echo off
cd "C:\Path\To\HOPE toolv2"
python app.py
pause
```

Save as `Start_HSRM.bat` on the desktop.

---

### Option 3: PythonAnywhere (Free Cloud Hosting)

**Best for:** Remote access, multiple users, no local install

**What is PythonAnywhere?**
A free service that hosts Python web apps in the cloud.

**Steps:**

1. **Create free account** at [pythonanywhere.com](https://www.pythonanywhere.com)

2. **Upload the code:**
   - Go to "Files" tab
   - Create folder `hsrm`
   - Upload all files from HOPE toolv2

3. **Install dependencies:**
   - Go to "Consoles" → "Bash"
   - Run: `pip install --user flask pandas python-docx pdfplumber`

4. **Create web app:**
   - Go to "Web" tab
   - Click "Add a new web app"
   - Choose "Flask"
   - Set source code path to `/home/yourusername/hsrm`

5. **Configure WSGI:**
   - Edit the WSGI file
   - Change the import to point to your app

6. **Reload and access:**
   - Click "Reload"
   - Visit: `yourusername.pythonanywhere.com`

**Pros:** ✅ Access from anywhere, ✅ Free tier available, ✅ Always running
**Cons:** ❌ 100MB storage limit (free), ❌ Slower than local

---

### Option 4: Replit (Instant Cloud IDE)

**Best for:** Quick sharing and collaboration

**Steps:**

1. Go to [replit.com](https://replit.com)
2. Create account
3. Click "Create Repl" → "Import from GitHub" (or upload files)
4. Replit auto-detects Python and runs it
5. Share the URL with staff

**Pros:** ✅ Instant setup, ✅ Easy sharing, ✅ Collaborative editing
**Cons:** ❌ Free tier has limitations, ❌ Public by default (paid for private)

---

### Option 5: Docker Container (Advanced)

**Best for:** IT departments wanting standardized deployment

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t hsrm .
docker run -p 5000:5000 hsrm
```

---

### Deployment Comparison

| Option | Cost | Difficulty | Access | Best For |
|--------|------|------------|--------|----------|
| Local | Free | Easy | One computer | Testing |
| Shared PC | Free | Easy | One office | Small teams |
| PythonAnywhere | Free/Paid | Medium | Anywhere | Remote teams |
| Replit | Free/Paid | Easy | Anywhere | Quick demos |
| Docker | Free | Hard | IT controlled | Enterprise |

---

## ❓ Frequently Asked Questions

### General

**Q: Do I need to be technical to use this?**
A: No! The interface is designed for anyone. Just drag, drop, and click.

**Q: What file formats are supported?**
A: CSV (spreadsheets), DOCX (Word documents), and PDF files.

**Q: Does this send emails automatically?**
A: No. HSRM generates the email text, but you copy/paste or import into your email client.

**Q: Is my data safe?**
A: Yes. Everything stays on your computer. Files are deleted after processing, and tracking data is encrypted.

### Technical

**Q: Why does it say "localhost:5000"?**
A: "localhost" means "this computer." The app runs a small web server on your machine.

**Q: Can multiple people use it at once?**
A: For local installation, one person at a time. For cloud deployment, multiple users can access it.

**Q: What if Python isn't installed?**
A: Download it free from python.org. The installer takes 2 minutes.

### Troubleshooting

**Q: The app won't start. What do I do?**
A: 
1. Make sure Python is installed: `python --version`
2. Install dependencies: `pip install -r requirements.txt`
3. Check if port 5000 is free (close other apps using it)

**Q: My file didn't parse correctly.**
A: 
1. Make sure emails are in a column labeled "Email" or similar
2. Ensure the file isn't password protected
3. Try saving as CSV if using Excel

**Q: Tracking data disappeared.**
A: Tracking is stored in your browser. Clearing browser data or using incognito mode will reset it.

---

## 🔧 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| "python is not recognized" | Install Python and add to PATH |
| "ModuleNotFoundError" | Run `pip install -r requirements.txt` |
| "Port 5000 in use" | Close other apps or change port in app.py |
| Blank page loads | Check terminal for errors, refresh browser |
| File won't upload | Check file format, try CSV instead |
| No data extracted | Ensure file has email addresses |

### Getting Help

1. **Check the console:** Look at the terminal window for error messages
2. **Browser console:** Press F12 → Console tab for JavaScript errors
3. **Restart:** Close terminal, restart `python app.py`
4. **Clear cache:** Try incognito mode or clear browser cache

---

## 📞 Contact & Support

**HOPE Tutoring Center**
- 📧 Email: admin@hopetutoring.org
- 📞 Phone: 817-860-7757
- 🌐 Website: [hopetutoring.org](https://www.hopetutoring.org)

---

## 📄 Quick Reference Card

```
┌────────────────────────────────────────────────────────────┐
│                    HSRM QUICK REFERENCE                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  START THE APP:                                             │
│  > cd "path/to/HOPE toolv2"                                │
│  > python app.py                                            │
│  > Open: http://localhost:5000                              │
│                                                             │
│  KEYBOARD SHORTCUTS:                                        │
│  Ctrl+Enter = Generate emails                               │
│  Ctrl+S     = Download CSV                                  │
│  Escape     = Close modals                                  │
│                                                             │
│  MERGE FIELDS FOR CUSTOM TEMPLATES:                         │
│  {first_name}  - Volunteer's first name                     │
│  {name}        - Full name                                  │
│  {email}       - Email address                              │
│  {location}    - City/location                              │
│  {interests}   - Their interests                            │
│                                                             │
│  DEMO FILES (Admin Templates folder):                       │
│  • DEMO.pdf      - 8 volunteers                             │
│  • DEMO_BATCH2.pdf - 10 volunteers                          │
│  • DEMO_V3.pdf   - 3 students (quick test)                  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

*Last updated: December 2024*
*HSRM Version 2.0*

