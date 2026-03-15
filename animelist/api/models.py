from django.conf import settings
from django.db import models

# Create your models here.

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    anime_id = models.IntegerField()
    anime_title = models.CharField(max_length=500, blank=True, null=True)
    anime_image = models.URLField(max_length=1000, blank=True, null=True)
    rating = models.SmallIntegerField()
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user} - {self.anime_title or self.anime_id} - Rating : {self.rating}/10"
    
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



import uuid


class Watchlist(models.Model):
    STATUS_CHOICES = [
        ('W', 'Watching'),
        ('C', 'Completed'),
        ('PW', 'Plan to Watch'),
        ('OH', 'On Hold'),
        ('D', 'Dropped'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    anime_id = models.IntegerField()
    anime_title = models.CharField(max_length=500, blank=True, null=True)
    anime_image = models.URLField(max_length=1000, blank=True, null=True)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='PW')
    is_favorite = models.BooleanField(default=False)
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'watchlist'
        unique_together = ['user', 'anime_id']
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.user.username} - {self.anime_title or self.anime_id} ({self.status})"


class UserProfile(models.Model):
    """Extended user profile for sharing settings"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    share_code = models.CharField(max_length=32, unique=True, blank=True, null=True)
    is_watchlist_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_profiles'

    def __str__(self):
        return f"Profile of {self.user.username}"

    def generate_share_code(self):
        self.share_code = uuid.uuid4().hex[:16]
        self.save()
        return self.share_code