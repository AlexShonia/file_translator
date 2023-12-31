# server libraries
import os
from flask import(
    Blueprint, flash, g, redirect, render_template, request, session, url_for, send_file
)

import time
import threading

# translating logic libraries
import re
import docx
from googletrans import Translator

bp = Blueprint("logic", __name__,)

def remove_files_after_download():
    global downloaded
    if downloaded:
        time.sleep(1)
        os.remove(os.path.abspath('file_dir/case.docx'))
        os.remove(os.path.abspath('file_dir/output.txt'))
    
@bp.route("/", methods=['GET', 'POST'])
def upload():
    if request.method == "POST":
        file = request.files.get('file')

        if file:
            fn = "case.docx"
            file_dir = "file_dir"

            os.makedirs(file_dir, exist_ok=True)

            file.save(os.path.join(file_dir, fn))


            input_filename = os.path.abspath('file_dir/case.docx')
            output_filename = os.path.abspath('file_dir/output.txt')

            try:
                translate(input_filename, output_filename, to_lang)
            except NameError:
                print("pick translate to")


            return "Yahoo"
    
    else:
        return render_template("logic/index.html")

@bp.route("/download")
def download_file():
    p = os.path.abspath('file_dir/output.txt')

    response = send_file(p, as_attachment=True)

    global downloaded
    downloaded = True
    remove_files_thread = threading.Thread(target=remove_files_after_download)
    remove_files_thread.start()

    return response

@bp.route('/process_choice', methods=['POST'])
def process_choice():
    data = request.get_json()
    global to_lang
    to_lang = data.get("selected_option")
    print(to_lang)

    # Do something with the selected_option value
    return f'Selected option: {data}'

def translate(input_filename, output_filename, tolang):
        # Function to split text into sentences
    def split_text_into_sentences(text):
        # Use a regular expression to split text into sentences
        sentence_endings = re.compile(r'(?<=[.!?]) +')
        sentences = sentence_endings.split(text)
        return sentences

    # Function to translate text from Georgian to English
    def translate_georgian_to_english(text):
        translator = Translator()

        translation = translator.translate(text, dest=tolang)
        return translation.text

    # Read the Word file
    def read_word_file(filename):
        doc = docx.Document(filename)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + " "
        return text

    # Main function
    def main(input_filename, output_filename):
        input_text = read_word_file(input_filename)
        sentences = split_text_into_sentences(input_text)

        with open(output_filename, 'w', encoding='utf-8') as output_file:
            for sentence in sentences:
                if sentence.strip():
                    translated_sentence = translate_georgian_to_english(sentence)
                    output_file.write(translated_sentence + '\n')

    main(input_filename, output_filename)
        