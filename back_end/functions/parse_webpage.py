from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import json
import time
from typing import Union
from bs4 import BeautifulSoup

from functions.talk_to_gemini import talk_to_gemini

def get_HTML(link: str) -> str:
    '''
    Get the raw HTML of a webpage using selenium.
    :param link: The link to the webpage.
    :return: The raw HTML of the webpage.
    '''
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

    print("Trying to get link...")
    try :
        driver.get(link)
        return driver.page_source
    except Exception as e:
        print(e)

    return("HTML not found.")


def parse_webpage(link: str) -> str:
    '''
    Parses link to remove unneccessary tags and properties, leaving just what is defined as
    necessary.
    :param link: Link to the website.
    :return: String of stripped html.
    '''
    # Get raw HTML from selenium search
    raw_HTML = get_HTML(link)
    stripped_HTML = ""

    soup = BeautifulSoup(raw_HTML, 'lxml')

    # Extract the content inside div, span, and p tags
    keepers = ['div', 'span', 'p']
    for tag in soup.find_all(keepers):
        if not tag.find(keepers):
            stripped_HTML += tag.get_text(separator=' ', strip=True) + ' '

    return stripped_HTML.strip()

def get_body_content(parsed_webpage: str) -> str:
    parsed_webpage.replace('"', '')
    prompt = f"Given all the text on an article on a webpage, remove all text that are advertisements, titles, buttons, and other text that are not relevant to what the article is conveying. Do not change any of the original text, just remove. Here is the webpage text: {parsed_webpage}"
    return talk_to_gemini(prompt)

def summarize_content(content: str, prompt="Summarize the content.", number_sentences=1) -> str:
    '''
    Summarizes a chunk of text.
    :param content: Chunk of text.
    :return: Summarize the text.
    '''
    prompt = f'{prompt} Given these rules, summarize the given content into {number_sentences} sentence(s): "{content}"'
    return talk_to_gemini(prompt)

# testing get HTML
# print(get_HTML("https://www.foxnews.com/opinion/21-lines-get-people-think-about-fossil-fuels-balanced-way"))
