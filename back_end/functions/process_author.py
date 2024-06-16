from functions.talk_to_gemini import talk_to_gemini
from functions.process_publishing import investigate_publishing_details

def process_author(author: str, publisher: str) -> str:
    '''
    Given an author and publisher, returns a summary about the author and any biases or controversies surrounding the author.
    :param author: The determined author of the article.
    :param publisher: The determined publisher of the article.
    :return: A summary about the author and any biases or controversies surrounding the author.
    '''
    content = investigate_publishing_details(author, publisher)

    if author == "No author":
        return "No author"
    if publisher == "No publisher":
        return "No publisher"

    prompt = "Given this dictionary of webpage contents after searching for an author and publisher, give me a one sentence summary about the author. Now write a sentence about if there are any apparent biases or controversies surrounding the author. Return JSON format with the keys being 'author_summary' and 'author_biases'. Return nothing but this JSON object."

    return talk_to_gemini(prompt + ": " + str(content), return_json=True).strip()
