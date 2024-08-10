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
from functions.parse_webpage import summarize_content
from typing import List

from functions.process_publishing import get_publishing_details

def find_other_sources(original_title: str, main_idea: str) -> dict:
    '''
    Given a title or topic, return three other URL of sources that report on that title or topics.
    :param main_idea: Title of topic.
    :return: List of URLs.
    '''
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

    search_query = f"{main_idea}"
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
    for result in results[1:5]:
        links.append(result.get_attribute("href"))

    driver.quit()

    # Check if links were found
    if not links:
        print("No links found.")
        return {}

    scraped_data = {}
    for link in links:
        content = parse_webpage(link)
        info = get_publishing_details(content)
        if content and info and info["title"] and info["title"] != "No title" and info["title"] != original_title:
            scraped_data[link] = (info["title"], content)

    return scraped_data

def explore_sources(external_urls_data: dict, original_source_content: str) -> str:
    '''
    Given a set of URLs, return a summary of what the three URLs talk about in comparison to the original webpage.
    :param external_urls_data: Dictionary of URLs and their scraped content.
    :param original_content: Source webpage content.
    :return: Summary comparing the original source with net sources or "No data available."
    '''
    summary = summarize_content(str(external_urls_data))

    if not summary:
        return "No data available."

    source_content_summary = summarize_content(original_source_content)

    # Compare the original content with the scraped content
    comparison_prompt = f"Compare the sentiment and perspectives between two summaries. One summary contains the summary of the original article: {source_content_summary}. The other summary is the summary of multiple other sources reporting on the same topic as the original article: {summary}. What are the similarities between the two? What are the differences? Response in a clear, concise paragraph without any markdown formatting."
    comparative_summary = talk_to_gemini(comparison_prompt, return_json=False)

    return comparative_summary


    # explore_sources(find_other_sources("COVID-19"))
