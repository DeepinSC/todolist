from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from . import views


# Create a router and register my viewset with it.
router = DefaultRouter()
router.register(r'todos', views.TodoViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^todolist', include(router.urls)),
]