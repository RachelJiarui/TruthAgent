from functions.talk_to_gemini import talk_to_gemini

# This lowkey sucks, ex: Health Helpline, try to use Media Fact Check later down the line
def process_publisher(publisher: str) -> str:
    '''
    Given a publisher, return some basic information about it, its political leaning, and any red flags.
    :param publisher: Publisher as a string.
    :return: Generated caption of the publisher.
    '''
    prompt = f"Tell me about what kind of news {publisher} publishes in one sentence. Then tell me in another sentence their political affiliation and if there are any controversies involving them."
    resp = talk_to_gemini(prompt)

    # TODO: Later integrate with Media Bias Fact Check API (given that we have the funds)
    return resp
