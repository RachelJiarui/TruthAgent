from datetime import datetime, timedelta
from talk_to_gemini import talk_to_gemini
import json

def date_tag(time_since_publish: str) -> str:
    '''
    Returns the string value of what the date label should be.
    :param time_since_publish: String value of the publishing date.
    :return: String value of the text in the label.
    '''
    diff = process_date(time_since_publish)

    days = diff.days
    seconds = diff.seconds
    label = ""

    # We only care about the number of seconds if the number of days is 0
    if days == 0:
        # See which unit measurement is most helpful [seconds, minutes, hours]
        if seconds < 60:
            label = str(seconds) + " seconds ago"
            return label
        minutes = seconds // 60
        if minutes < 60:
            label = str(minutes) + " minutes ago"
            return label
        hours = minutes // 60
        label = str(hours) + " hours ago"
        return label

    # If there are multiple days in between publication, see which unit measurement is most helpful [days, months, years]
    if days < 30:
        label = str(days) + " days ago"
        return label
    months = days // 30
    if months < 12:
        label = str(months) + " months ago"
        return label
    years = months // 12
    label = str(years) + " years ago"
    return label

def process_date(date: str) -> timedelta:
    '''
    Finds how many minutes, hours, days, years it's been since the given date.
    :param date: Date in any common string format.
    :return: Timedelta object representing the difference of now to the given date. Access specific time units. Only days, seconds and miliseconds are available.
    '''
    now = datetime.now()

    prompt = f'Given this date in arbitrary format "{date}", please reformat the date as a JSON object with the keys being year, month, day and hour and the value being the appropriate integer values. The year value should always be a four digit number. The month value should always be between 1 and 12. The day value should always be between 1 and 31. The hour value should always be between 0 and 23. Return just the JSON object.'
    resp = talk_to_gemini(prompt, True)
    print(resp) # test
    publishing_date_dict = json.loads(resp)

    # checks

    publishing_date = datetime(
        publishing_date_dict.get("year", 2024),
        publishing_date_dict.get("month", 1),
        publishing_date_dict.get("day", 1),
        publishing_date_dict.get("hour", 0),
    )

    date_diff = now - publishing_date
    return date_diff

# print(date_tag("JUN 14 2024 9:35 AM")) -> "2 hours ago"
