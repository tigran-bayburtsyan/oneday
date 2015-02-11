from django.db import models
import requests
import json
from socials import keys
from datetime import datetime
import tweepy
from django.utils.timezone import utc


# CONST PARAMETERS """
YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


# Returns RespDict or Error with True or False if error accurred
def api_call_get(url, params):
    r = requests.get(url=url, params=params)
    return json.loads(r.text)


# Returns RespDict or Error with True or False if error accurred
def api_call_post(url, params):
    r = requests.post(url=url, data=params)
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
        data = api_call_get(YOUTUBE_SEARCH_URL, {
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
                y.save()
                videos.append(y)
        return videos


""" Twitter Models """


class Tweet(models.Model):
    tweet_id = models.CharField(max_length=50, default=None, null=False)
    text = models.CharField(max_length=150, default=None, null=False)
    retweet_count = models.IntegerField()
    pub_date = models.DateTimeField(blank=True, default=None, null=True)
    user_id = models.CharField(max_length=50, default=None, null=False)

    @staticmethod
    def parse_tweets(results, is_unique):
        tweets = []
        for tweet in results:
            f = 0
            if is_unique:
                f = Tweet.objects.filter(tweet_id=tweet.id).count()
            if f == 0:
                t = Tweet()
                t.tweet_id = str(tweet.id)
                t.pub_date = tweet.created_at.replace(tzinfo=utc)
                t.retweet_count = tweet.retweet_count
                t.text = tweet.text
                t.user_id = str(tweet.user.id)
                t.save()
                for ht in tweet.entities['hashtags']:
                    h = TwitterHashTag()
                    h.text = ht["text"]
                    h.tweet = t
                    h.save()
                tweets.append(t)
        return tweets

    @staticmethod
    def tweets_by_location(lat, lng, distance, min_date, is_unique=False):
        auth = tweepy.OAuthHandler(keys.TWEETER_CONSUMER_KEY, keys.TWEETER_CONSUMER_SECRET)
        auth.set_access_token(keys.TWEETER_ACCESS_TOKEN, keys.TWEETER_ACCESS_TOKEN_SECRET)
        api = tweepy.API(auth)
        geo_code = str(lat) + "," + str(lng) + "," + str(distance) + "mi"
        results = api.search(q='', geocode=geo_code
                             , since=min_date.strftime('%Y-%m-%d'), count=100, result_type="recent")
        return Tweet.parse_tweets(results, is_unique)

    @staticmethod
    def tweets_by_hashtag(hashtag, lat, lng, distance, min_date, is_unique=False):
        auth = tweepy.OAuthHandler(keys.TWEETER_CONSUMER_KEY, keys.TWEETER_CONSUMER_SECRET)
        auth.set_access_token(keys.TWEETER_ACCESS_TOKEN, keys.TWEETER_ACCESS_TOKEN_SECRET)
        api = tweepy.API(auth)
        query = "#" + hashtag
        geo_code = str(lat) + "," + str(lng) + "," + str(distance) + "mi"
        results = api.search(q=query, geocode=geo_code, since=min_date.strftime('%Y-%m-%d'), count=100, result_type="recent")
        return Tweet.parse_tweets(results, is_unique)


class TwitterHashTag(models.Model):
    text = models.CharField(max_length=150, default=None, null=False)
    tweet = models.ForeignKey(Tweet, null=True, blank=True)