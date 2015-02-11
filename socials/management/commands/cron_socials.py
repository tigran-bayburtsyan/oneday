from django.core.management.base import BaseCommand, CommandError
from socials.models import Youtube, Tweet
from datetime import datetime, date
import time


class Command(BaseCommand):
    args = '<social name[youtube, twitter, instagram, facebook, flickr]>'
    help = 'Type Social Name go grab or just type "all" to grab all socials'

    def handle(self, *args, **options):
        soc = str(args[0]).lower()
        if soc == "youtube":
            videos = Youtube.videos_by_location(37.42307, -122.08427, 100, date.fromordinal(date.today().toordinal()-1))
            print(len(videos))
        elif soc == "twitter":
            while True:
                # tweets = Tweet.tweets_by_location(37.42307, -122.08427, 1000, date.fromordinal(date.today().toordinal()-3))
                # tweets = Tweet.tweets_by_hashtag(hashtag="amazon", is_unique=True)
                tweets = Tweet.tweets_by_hashtag(hashtag="ChapelHillShooting", lat=37.42307, lng=-122.08427, distance=1000
                                                         , min_date=date.fromordinal(date.today().toordinal()-1)
                                                         , is_unique=True)
                print(len(tweets))
                time.sleep(3)