import json
import os

import requests


def write_http_response(status, body_dict):
    return_dict = {
        "status": status,
        "body": body_dict,
        "headers": {
            "Content-Type": "application/json"
        }
    }
    output = open(os.environ["res"], 'w')
    output.write(json.dumps(return_dict))


def get_url(word, service):
    if service == 'angel':
        return 'https://angel.co/' + word

    if service == 'facebook':
        return 'https://www.facebook.com/' + word

    if service == 'github':
        return 'https://github.com/' + word

    if service == 'instagram':
        return 'https://www.instagram.com/' + word

    if service == 'medium':
        return 'https://medium.com/@' + word

    if service == 'twitter':
        return 'https://twitter.com/' + word


def social_check(word, service):
    result = {}
    r = requests.get(get_url(word, service))
    if r.status_code == 404:
        result['available'] = True
    else:
        result['available'] = False
    return result


postreqdata = open(os.environ['req']).read()
parsed_json = json.loads(postreqdata)
word = parsed_json['word']
service = parsed_json['service']

result = social_check(word, service)
write_http_response(200, result)
