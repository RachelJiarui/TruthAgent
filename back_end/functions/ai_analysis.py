from functions.process_author import process_author
from functions.process_publisher import process_publisher
from functions.process_date import date_tag
from functions.parse_webpage import parse_webpage, get_body_content
from functions.process_publishing import get_publishing_details
from functions.explore_other_sources import find_other_sources, explore_sources
import json
from functions.webpage_analysis import webpage_annotations
import random

def ai_analysis(url: str) -> dict:
    '''
    Builds AI analysis of a given URL.
    :param url: String of the URL.
    :return: JSON object.
    '''
    print(f"Got to ai analysis. Parsing webpage given url: {url}")
    webpage_content = parse_webpage(url)
    print(f"Parsed webpage. Getting body of the content given webpage content: {webpage_content}")
    body_content = get_body_content(webpage_content)
    print(f"Got body of the content. Getting publishing details with webpage content: {webpage_content}")
    publishing_details = get_publishing_details(webpage_content)
    title = publishing_details["title"]
    author = publishing_details["author"]
    date = publishing_details["date"]
    publisher = publishing_details["publisher"]
    main_idea = publishing_details["main_idea"]
    print("Got publishing details")

    print(f"Processing author from this text: {author}, {publisher}")
    author_analysis = process_author(author, publisher)
    print(f"Processed author. Processing date from this text: {date}")
    date_analysis = date_tag(date)
    print(f"Processed date. Processing publisher from this text: {publisher}")
    publisher_analysis = process_publisher(publisher)
    print(f"Processed publishing details. Finding other sources with main idea: {main_idea}")
    other_sources = find_other_sources(title, main_idea)
    print(f"Found other sources. Exploring these sources: {other_sources} given webpage content")
    external_summary = explore_sources(other_sources, body_content)
    print("Explored other sources. Analyzing the webpage given webpage content")
    webpage_annotations_analysis = webpage_annotations(body_content)

    result = {
        "title": title,
        "main_idea": main_idea,
        "author": author,
        "date": date,
        "publisher": publisher,
        "author_analysis": author_analysis,
        "publisher_analysis": publisher_analysis,
        "date_analysis": date_analysis,
        "body_content": body_content,
        "other_sources": other_sources,
        "other_sources_summary": external_summary,
        "webpage_annotations": webpage_annotations_analysis
    }
    result = process_ai_analysis(result, url)
    print(f"Finished ai analysis: {result}")

    return result

def process_ai_analysis(raw_ai_analysis: dict, url: str):
    '''
    Processes it to be ready for front-end consumption and storage.
    :param: raw_ai_analysis is a dictionary in the form
        result = {
            "author": author_analysis: str,
            "publisher": publisher_analysis: str,
            "date": date_analysis: str,
            "other_sources": other_sources: list[str],
            "other_sources_summary": external_summary: str,
            "webpage_annotations": [
          		"red": [(sentence: str, ai_analysis: str)]
          		"orange": [(sentence: str, ai_analysis: str)]
          		"blue": [(sentence: str, ai_analysis: str)]
           	]
        }
    :return: New dict in the form
        result = {
            "url": {
                "author": author_analysis: str,
                "publisher": publisher_analysis: str,
                "date": date_analysis: str,
                "other_sources": other_sources: list[str],
                "other_sources_summary": external_summary: str,
                "webpage_annotations": {
              		"red": [
                        {
            				"sentence": sentence: str,
            				"ai_analysis": ai_analysis: str,
            				"messages": [{
                                id: #,
                                actor: "ai",
                                msg: "What do you think?"
                            }]
     			        }, ... for each (sentence: str, ai_analysis: str) in original
                    ]
              		"orange": ...
              		"blue": ...
                }
            }
        }
    '''
    processed_analysis = {
        "url": url,
        "title": raw_ai_analysis["title"],
        "main_idea": raw_ai_analysis["main_idea"],
        "date": raw_ai_analysis["date"],
        "author": raw_ai_analysis["author"],
        "body_content": raw_ai_analysis["body_content"],
        "publisher": raw_ai_analysis["publisher"],
        "author_analysis": raw_ai_analysis["author_analysis"],
        "publisher_analysis": raw_ai_analysis["publisher_analysis"],
        "date_analysis": raw_ai_analysis["date_analysis"],
        "other_sources": raw_ai_analysis["other_sources"],
        "other_sources_summary": raw_ai_analysis["other_sources_summary"],
        "webpage_annotations": {}
    }

    # AI starting message
    ai_start_msg = { "id": random.random(), "actor": "ai", "msg": "What do you think?" }

    # Process webpage annotations
    for color, annotations in raw_ai_analysis["webpage_annotations"].items():
        processed_analysis["webpage_annotations"][color] = [
            {
                "sentence": sentence,
                "ai_analysis": ai_analysis,
                "messages": [ai_start_msg]
            }
            for sentence, ai_analysis in annotations
        ]

    return processed_analysis
