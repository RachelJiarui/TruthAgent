import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

# Input you test prompt here
prompt = "Give me a claim or assumption of this sentence: 'Our aim was to provide real scientifically evidence-based medical help to those with covid, those who had been injured by the covid injections and to provide healthy individuals with advice and home kits for fending off covid-19 and other viral illnesses.' If it is a sentence that doesn't hold a lot of informational value, then say 'No info'. Otherwise,"

response = model.generate_content(prompt)
print(response)
