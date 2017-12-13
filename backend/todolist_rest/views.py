# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .serializers import TodoSerializer
from .models import Todo


class TodoViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

# Create your views here.
@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'todos': reverse('todo-list', request=request, format=format)
    })