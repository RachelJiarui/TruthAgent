import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

from functions.talk_to_gemini import talk_to_gemini
from functions.parse_webpage import parse_webpage

def get_publishing_details(content: str) -> dict:
    '''
    Gets the author, the date of when the content was published, the main content or title of the content, and who the publisher is.
    :param content: main content scraped from HTML.
    :return: JSON object with the keys being 'author', 'date', 'main_idea', and 'publisher'.
    '''
    prompt = "Given this body text from an article, tell me who the author is, the date it was published, the main idea or title of the content, and who the publisher of the article is. If there is no author listed, write 'No author'. If there is no date listed, write 'No date'. If there is no publisher listed, write 'No publisher'. Return JSON format with the keys being 'author', 'date', 'main_idea' and 'publisher'. Return nothing but this JSON object."
    resp = talk_to_gemini(prompt + ": " + content, return_json=True)
    return json.loads(resp)



def investigate_publishing_details(author: str, publisher: str) -> dict:
    '''
    Google Search the name of the author and publisher, scrape the HTML from the first five results,
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

    # Wait until the search results are loaded
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "a")))
    except Exception as e:
        print(f"Error waiting for search results: {e}")
        driver.quit()
        return {}

    links = []
    results = driver.find_elements(By.CSS_SELECTOR, "a[jsname='UWckNb']") # a.UWckNb
    for result in results[:5]:
        links.append(result.get_attribute("href"))

    driver.quit()

    # Check if links were found
    if not links:
        print("No links found.")
        return {}

    scraped_data = {}
    for link in links:
        content = parse_webpage(link)
        # TODO: Handling CAPTCHA
        if content:
            scraped_data[link] = content

    return scraped_data
