from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
from openai import OpenAI
import json
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
# Enable CORS for all routes
CORS(app, origins="http://localhost:4200") 


client = OpenAI(api_key="")

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
    You are an AI assistant specialized in extracting invoice data from various formats. Analyze the following text extracted from an invoice PDF and return the data in a structured JSON format. Follow these guidelines:

    1. Identify and extract all relevant invoice information, including but not limited to:
       - Invoice number
       - Invoice date
       - Due date
       - Vendor/Seller information (name, address, contact details)
       - Customer/Buyer information (name, address, contact details)
       - Line items (description, quantity, unit price, total)
       - Subtotal
       - Tax amounts (and rates if available)
       - Total amount due
       - Payment terms
       - Any additional fees or discounts

    2. If a field is not present in the invoice, omit it from the JSON output.

    3. For line items, create an array of objects, each representing a single item.

    4. Use appropriate data types (string, number, array) for each field.

    5. If dates are present, format them as "YYYY-MM-DD" if possible.

    6. If currency is specified, include it in the relevant fields.

    7. If you encounter any ambiguous or unclear information, add a "notes" field to the JSON with explanations.

    8. Maintain the original naming conventions found in the invoice where possible.

    Extracted text from the PDF:

    {extracted_text}

    Please provide the structured JSON data for this invoice.  Do not add escape characters like \n or \ in the JSON. Make sure the fields are appropriately structured.
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

if __name__ == '__main__':
    app.run(debug=True)