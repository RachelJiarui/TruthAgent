import google.generativeai as genai
import os

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

response = model.generate_content("Give me the context of Trump's campaign in 2024. Surf the web to give me three links to articles that talk about diverse opinions to Trump's campaign.")
print(response)