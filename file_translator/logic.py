# server libraries
import os
from flask import(
    Blueprint, flash, g, redirect, render_template, request, session, url_for, send_file
)

from werkzeug.utils import secure_filename

# translating logic libraries
import re
import docx
from googletrans import Translator

bp = Blueprint("logic", __name__,)

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

            translate(input_filename, output_filename, from_lang, to_lang)
            print(from_lang, to_lang)
            return "Yahoo"
    
    else:
        return render_template("logic/index.html")

@bp.route("/download")
def download_file():
    p = os.path.abspath('file_dir/output.txt')
    return(send_file(p, as_attachment=True))

@bp.route('/process_choice', methods=['POST'])
def process_choice():
    data = request.get_json()
    global from_lang
    global to_lang
    from_lang = data.get("selected_option1")
    to_lang = data.get("selected_option2")

    

    # print(from_lang, to_lang)


    # Do something with the selected_option value
    return f'Selected option: {data}'

def translate(input_filename, output_filename, lang1, lang2):
        # Function to split text into sentences
    def split_text_into_sentences(text):
        # Use a regular expression to split text into sentences
        sentence_endings = re.compile(r'(?<=[.!?]) +')
        sentences = sentence_endings.split(text)
        return sentences

    # Function to translate text from Georgian to English
    def translate_georgian_to_english(text):
        translator = Translator()
        translation = translator.translate(text, src=lang1, dest=lang2)
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
        