from datetime import datetime
from talk_to_gemini import talk_to_gemini

def process_date(date: str) -> str:
    '''
    Finds how many minutes, hours, days, years it's been since the given date.
    :param date: date in any common string format.
    :return: String saying how long it's been.
    '''
    now = datetime.now()
    current_time_dict = {
        "year": now.year,
        "month": now.month,
        "day": now.day,
        "hour": now.hour,
    }

    prompt = 'Given a date in arbitrary format, please return the date using this JSON schema: Date = { "year":  }'
    talk_to_gemini("")
