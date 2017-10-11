import json
import os

import requests

url = ''
API_KEY = ''
API_SECRET = ''

authorization = 'sso-key {API_KEY}:{API_SECRET}'.format(
    API_KEY=API_KEY, API_SECRET=API_SECRET)


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


def get_domain_names(word):
    data = '["{word}.com", "{word}.io", "{word}.net", "{word}.org", "{word}.co"]'.format(
        word=word)
    return data


def check_domains(word):
    data = get_domain_names(word)
    response = requests.post(
        url,
        headers={
            "Accept": "application/json",
            'Authorization': authorization,
            'Content-Type': 'application/json'
        },
        data=data)
    result = {}
    result['available'] = []
    result['unavailable'] = []
    for domain in response.json()['domains']:
        if domain['available']:
            result['available'].append(domain['domain'])
        else:
            result['unavailable'].append(domain['domain'])

    return result


postreqdata = open(os.environ['req']).read()
parsed_json = json.loads(postreqdata)
word = parsed_json['word']

result = check_domains(word)
write_http_response(200, result)
