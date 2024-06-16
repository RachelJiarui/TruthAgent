from typing import Dict, List, Tuple

def webpage_annotations(parsed_webpage: str) -> Dict[str, List[tuple[str, str]]]:
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
    return {
        "Red": [("hi", "hi")],
        "Orange": [("hi", "hi")],
        "Blue": [("hi", "hi")]
    }
