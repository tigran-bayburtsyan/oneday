from django.core.management.base import BaseCommand, CommandError
from socials.models import Youtube
from datetime import datetime, date


class Command(BaseCommand):
    args = '<social name[youtube, twitter, instagram, facebook, flickr]>'
    help = 'Type Social Name go grab or just type "all" to grab all socials'

    def handle(self, *args, **options):
        if str(args[0]).lower() == "youtube":
            videos = Youtube.videos_by_location(37.42307, -122.08427, 100, date.fromordinal(date.today().toordinal()-1))
            print("Fetched", len(videos), "videos")