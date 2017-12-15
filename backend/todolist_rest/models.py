# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
from django.utils.datetime_safe import datetime, date


class Todo(models.Model):
    description = models.CharField(max_length=200)
    finished = models.BooleanField(default=False)
    expire_date = models.DateField(default=date.today)
    importance = models.IntegerField(default=0)

# Create your models here.
