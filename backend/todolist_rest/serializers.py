from .models import Todo
from rest_framework import serializers


class TodoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Todo
        fields = ('url', 'id', 'description', 'finished','expire_date','importance')