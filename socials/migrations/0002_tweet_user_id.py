# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('socials', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='tweet',
            name='user_id',
            field=models.CharField(default=None, max_length=50),
            preserve_default=True,
        ),
    ]
