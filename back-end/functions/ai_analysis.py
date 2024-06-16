from functions.process_author import process_author
from functions.process_publisher import process_publisher
from functions.process_date import process_date
from functions.parse_webpage import parse_webpage
from functions.process_publishing import get_publishing_details
from functions.explore_other_sources import find_other_sources, explore_sources
import json
from functions.webpage_analysis import webpage_annotations

def ai_analysis(url: str) -> dict:
    '''
    Builds AI analysis of a given URL.
    :param url: String of the URL.
    :return: JSON object that follows this structure
    {
    	"author": author content,
    	"publisher": publish content,
    	"date": date content,
    	"other_sources": [url]
    	"other_sources_summary": summary content
    	"webpage_annotations": [
    		"red": [(sentence, ai_analysis)]
    		"orange": [(sentence, ai_analysis)]
    		"blue": [(sentence, ai_analysis)]
    	]
   	}
    '''
    webpage_content = parse_webpage(url)
    publishing_details = get_publishing_details(webpage_content)
    author = publishing_details["author"]
    date = publishing_details["date"]
    publisher = publishing_details["publisher"]
    main_content = publishing_details["main_content"]

    author_analysis = process_author(author, publisher)
    date_analysis = process_date(date)
    publisher_analysis = process_publisher(publisher)
    other_sources = find_other_sources(main_content)
    external_summary = explore_sources(other_sources, webpage_content)
    webpage_annotations_analysis = webpage_annotations(webpage_content)

    result = {
        "author": author_analysis,
        "publisher": publisher_analysis,
        "date": date_analysis,
        "other_sources": other_sources,
        "other_sources_summary": external_summary,
        "webpage_annotations": webpage_annotations_analysis
    }

    return {}
