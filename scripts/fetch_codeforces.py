#!/usr/bin/env python3
"""Save a trimmed snapshot of the public Codeforces data used by the site.

The dashboard and the homepage read assets/data/codeforces.json first, so they
always have data to show, and then try the live API in the visitor's browser.
The file is rewritten only when the data itself changes.
"""
import argparse
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / 'assets' / 'data' / 'codeforces.json'
API = 'https://codeforces.com/api/'


def call(method, **params):
    url = API + method + '?' + urllib.parse.urlencode(params)
    request = urllib.request.Request(url, headers={'User-Agent': 'site-snapshot'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                payload = json.load(response)
            if payload.get('status') != 'OK':
                raise RuntimeError(payload.get('comment', 'Codeforces API error'))
            return payload['result']
        except Exception as error:  # the API rate-limits and occasionally times out
            if attempt == 2:
                raise
            print(f'{method}: {error}; retrying', file=sys.stderr)
            time.sleep(5 * (attempt + 1))


def snapshot(handle, count):
    user = call('user.info', handles=handle)[0]
    time.sleep(2)
    rating = call('user.rating', handle=handle)
    time.sleep(2)
    submissions = call('user.status', handle=handle, **{'from': 1, 'count': count})
    return {
        'handle': handle,
        'user': {key: user.get(key) for key in ('handle', 'rating', 'maxRating', 'rank', 'maxRank')},
        'rating': [{key: entry.get(key) for key in
                    ('contestId', 'contestName', 'rank', 'ratingUpdateTimeSeconds', 'oldRating', 'newRating')}
                   for entry in rating],
        'submissions': [{
            'id': item.get('id'),
            'creationTimeSeconds': item.get('creationTimeSeconds'),
            'verdict': item.get('verdict'),
            'programmingLanguage': item.get('programmingLanguage'),
            'problem': {key: item.get('problem', {}).get(key)
                        for key in ('contestId', 'index', 'name', 'rating', 'tags')
                        if item.get('problem', {}).get(key) is not None},
        } for item in submissions],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--handle', default='Au1Bhi')
    parser.add_argument('--count', type=int, default=1000)
    parser.add_argument('--output', type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    data = snapshot(args.handle, args.count)
    if args.output.exists():
        previous = json.loads(args.output.read_text(encoding='utf-8'))
        previous.pop('fetchedAt', None)
        if previous == data:
            print('Codeforces data unchanged; snapshot left as is.')
            return
    data = {'fetchedAt': int(time.time()), **data}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    print(f"Wrote {args.output} ({len(data['rating'])} contests, {len(data['submissions'])} submissions).")


if __name__ == '__main__':
    main()
