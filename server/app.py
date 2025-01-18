from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
from openai import OpenAI
import json
from flask_cors import CORS  # Import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(_name_)

api_key1 = os.getenv('API_KEY')
# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": ["http://localhost:4200", "http://localhost:5173"]}})



client = OpenAI(api_key=api_key1)

def extract_text_from_pdf(pdf_path):
    """
    Extract text from a PDF file using PyPDF2.
    """
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        return str(e)

def query_gpt4(extracted_text):
    prompt = f"""
    You are an AI assistant specialized in extracting invoice data from various formats. Analyze the following text extracted from an invoice PDF and  translate into english return the data in a structured JSON format.
    Extract text from an invoice file written in Any language, translate it into English, and organize the data into key-value pairs in JSON format.
    only provide json 
    {extracted_text}
    
    
    Please provide the structured JSON data for this invoice.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that extracts and structures invoice data."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000
        )
        return response.choices[0].message.content
    except Exception as e:
        return str(e)

@app.route('/extract-data', methods=['POST'])
def extract_data():
    """
    Endpoint to process PDF and query GPT-4.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    pdf_file = request.files['file']

    pdf_path = f"./{pdf_file.filename}"
    pdf_file.save(pdf_path)

    extracted_text = extract_text_from_pdf(pdf_path)

    if not extracted_text:
        return jsonify({"error": "Failed to extract text from PDF"}), 500

    gpt_response = query_gpt4(f"Extract relevant data from the following text:\n{extracted_text}")

    print(gpt_response)
    

    return {"data": gpt_response}

if _name_ == '_main_':
    app.run(debug=True)