from django.conf import settings
from django.db import models

# Create your models here.

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    anime_id = models.IntegerField()
    rating = models.SmallIntegerField()
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user} - {self.anime_id} - Rating : {self.rating}/10"



class Watchlist(models.Model):
    STATUS_CHOICES = [
        ('PW', 'Planning to watch'),
        ('WT', 'Currently Watching'),
        ('CT', 'Completed'),
        ('DR', 'Dropped'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    anime_id = models.IntegerField()
    status = models.CharField(max_length=2, choices=STATUS_CHOICES)
    added_at = models.DateTimeField(auto_now_add=True)