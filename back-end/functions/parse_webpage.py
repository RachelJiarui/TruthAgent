from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import json
import time

from bs4 import BeautifulSoup

from talk_to_gemini import talk_to_gemini

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
    :param: Link to the website.
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

def get_publishing_details(content: str) -> str:
    '''
    Gets the author, the date of when the content was published and who the publisher is.
    :param: main content scraped from HTML.
    :return: JSON object with the keys being 'author', 'date', and 'publisher'.
    '''
    prompt = "Given this body text from an article, tell me who the author is, the date it was published, and who the publisher of the article is. If there is no author listed, write 'No author'. If there is no date listed, write 'No date'. If there is no publisher listed, write 'No publisher'. Return JSON format with the keys being 'author', 'date', and 'publisher'. Return nothing but this JSON object."
    return talk_to_gemini(prompt + ": " + content).strip()



def investigate_publishing_details(author: str, publisher: str) -> dict:
    '''
    Google Search the name of the author and publisher, scrape the HTML from the first three results,
    and return each text in JSON format.
    :param author_name: The name of the author to search.
    :param publisher_name: The name of the publisher to search.
    :return: A dictionary with the URLs as keys and the parsed content in JSON format as values.
    '''
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

    search_query = f"{author} {publisher}"
    driver.get("https://www.google.com")

    search_box = driver.find_element(By.NAME, "q")
    search_box.send_keys(search_query)
    search_box.send_keys(Keys.RETURN)

    time.sleep(2)

    links = []
    results = driver.find_elements(By.CSS_SELECTOR, "a.UWckNb")
    for result in results[:3]:
        links.append(result.get_attribute("href"))

    driver.quit()

    scraped_data = {}
    for link in links:
        content = parse_webpage(link)
        if content:
            publishing_details = get_publishing_details(content)
            scraped_data[link] = json.loads(publishing_details)

    return scraped_data

print(investigate_publishing_details("No author", "No publisher"))
