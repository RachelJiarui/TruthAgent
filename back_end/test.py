import google.generativeai as genai
import os

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

# Input you test prompt here
prompt = "Tell me about what kind of news Health Helpline publishes in one sentence. Then tell me in another sentence their political affiliation and if there are any controversies involving them."

response = model.generate_content(prompt)
print(response)
