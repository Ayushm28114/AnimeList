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
    
    @property
    def likes_count(self):
        return self.votes.filter(vote_type='like').count()
    
    @property
    def dislikes_count(self):
        return self.votes.filter(vote_type='dislike').count()


class ReviewReply(models.Model):
    """Replies to reviews"""
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'review_replies'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Reply by {self.user} on review {self.review.id}"


class ReviewVote(models.Model):
    """Likes/Dislikes on reviews"""
    VOTE_CHOICES = [
        ('like', 'Like'),
        ('dislike', 'Dislike'),
    ]
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    vote_type = models.CharField(max_length=10, choices=VOTE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'review_votes'
        unique_together = ['review', 'user']  # One vote per user per review
    
    def __str__(self):
        return f"{self.user} {self.vote_type}d review {self.review.id}"



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