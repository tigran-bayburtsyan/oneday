from django.db import models
import requests
import json
from socials import keys
from datetime import datetime


# CONST PARAMETERS """
YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


# Returns RespDict or Error with True or False if error accurred
def api_call(url, params):
    r = requests.get(url=url, params=params)
    return json.loads(r.text)


class Youtube(models.Model):
    video_id = models.CharField(max_length=25, default=None, null=False)
    title = models.CharField(max_length=255, default=None, null=True, blank=True)
    description = models.TextField(default=None, null=True, blank=True)
    photo = models.TextField(blank=True, default=None, null=True)
    pub_date = models.DateTimeField(blank=True, default=None, null=True)

    # Returns New Youtube model objects without saving it to database, maybe we don't need saving
    # It will give only videos which we don't have in database if we will give " is_unique" parameter to True
    @staticmethod
    def videos_by_location(lat, lng, distance, min_date, is_unique=False):
        data = api_call(YOUTUBE_SEARCH_URL, {
            "part": "snippet",
            "key": keys.YOUTUBE_API_KEY,
            "location": ",".join((str(lat), str(lng))),
            "locationRadius": str(distance) + "km",
            "type": "video",
            "maxResults": "50",
            "minResults": "50",
            "publishedAfter":  min_date.strftime('%Y-%m-%dT%H:%M:%SZ'),
            "order": "rating",
        })
        if "items" not in data:
            raise Exception(json.dumps(data))  # There are some error from Youtube side
        videos = []
        for video in data["items"]:
            f = 0
            if is_unique:
                f = Youtube.objects.filter(video_id=video["id"]).count()
            if f == 0:
                y = Youtube()
                y.video_id = video["id"]
                y.description = ""  # video["snippet"]["description"] Don't need description from Youtube
                y.title = video["snippet"]["title"]
                y.photo = video["snippet"]["thumbnails"]["high"]["url"]
                y.pub_date = datetime.strptime(str(video["snippet"]["publishedAt"]).replace(".000Z", ""), '%Y-%m-%dT%H:%M:%S')
                videos.append(video)
        return videos