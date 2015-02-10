# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tweet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('tweet_id', models.CharField(default=None, max_length=50)),
                ('text', models.CharField(default=None, max_length=150)),
                ('retweet_count', models.IntegerField()),
                ('pub_date', models.DateTimeField(blank=True, null=True, default=None)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TwitterHashTag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('text', models.CharField(default=None, max_length=150)),
                ('tweet', models.ForeignKey(blank=True, to='socials.Tweet', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Youtube',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('video_id', models.CharField(default=None, max_length=25)),
                ('title', models.CharField(blank=True, max_length=255, null=True, default=None)),
                ('description', models.TextField(blank=True, null=True, default=None)),
                ('photo', models.TextField(blank=True, null=True, default=None)),
                ('pub_date', models.DateTimeField(blank=True, null=True, default=None)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
