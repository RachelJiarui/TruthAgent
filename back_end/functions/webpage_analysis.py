from typing import Dict, List, ParamSpecArgs, Tuple
import nltk
import re
from nltk.tokenize import sent_tokenize

nltk.download('punkt')

def webpage_annotations(text: str) -> Dict[str, List[tuple[str, str]]]:
    '''
    Given the body content of a website, return sentences that are annotated. A sentence is annotated by the following rules:
        - Red: If content is disputed by verifiable facts
        - Orange: If content is disputed by other sources online and if AI disagrees
        - Blue: If content contains highly manipulatory wording OR if its political charged
    :param: Body content of the webpage.
    :return: JSON object with the following structure:
        {
            "Red": [(sentence, ai_analysis)]
            "Orange": [(sentence, ai_analysis)]
            "Blue": [(sentence, ai_analysis)]
        }
    '''
    # Normalize white space
    text = re.sub(r'\s+', ' ', text)

    # Sentence tokenizer
    sentences = sent_tokenize(text)
    sentences = [sentence.strip() for sentence in sentences]

    result = {
        "Red": [],
        "Orange": [],
        "Blue": []
    }

    for sentence in sentences:
        # If the sentence is disputed by verifiable facts
        if is_red(sentence):
            pass
        # If the sentence is disputed by other sources the AI finds or by the AI itself
        elif is_orange(sentence):
            pass
        # If the sentence contains highly manipulatory wording OR if its politically charged
        elif is_blue(sentence):

    return result

def is_red(sentence: str) -> bool:
    '''
    Determines if this sentence is worthy of code red, a.k.a it is verifiably false.
    :param sentence: Sentence to examine.
    :return: True if it is code red, false if it's not.
    '''
    # call Fact Check API or a verifiable database
    return True

def is_orange(sentence: str) -> bool:
    '''
    Determines if the sentence is worthy of code orange.
    :param sentence: Sentence to examine.
    :return: True if it is code orange, false if it's not.
    '''
    return True

def is_blue(sentence: str) -> bool:
    '''
    Determines if the sentence is worthy of code blue.
    :param sentence: Sentence to examine.
    :return: True if it is code orange, false if it's not.
    '''
