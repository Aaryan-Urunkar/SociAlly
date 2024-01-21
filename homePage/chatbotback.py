from flask import Flask, render_template, request
import google.generativeai as generativeai
import os
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.environ["API_KEY"]
generativeai.configure(api_key=API_KEY)

app = Flask(__name__, static_url_path='/static')


@app.route('/')
def home():
    return render_template("index.html")

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_input = request.form['message']
    models = [m for m in generativeai.list_models() if 'generateText' in m.supported_generation_methods]
    model = models[0].name
    prompt = f"User : {user_input}\nChatbot :"

    response = generativeai.generate_text(
        model=model,
        prompt=prompt,
        stop_sequences=None,
        temperature=0,
        max_output_tokens=100
    )

    bot_resp = response.result

    chat_history = []
    chat_history.append(f"User : {user_input} \nChatbot : {bot_resp}")
    return render_template(
        "chatbot.html",
        bot_resp=bot_resp,
        chat_history=chat_history
    )

if __name__ == '__main__':
    app.run(debug=True)