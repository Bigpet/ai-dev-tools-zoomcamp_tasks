from django.db import models
from django.utils import timezone


class TaskList(models.Model):
	"""Optional grouping of tasks (e.g., "Personal", "Work")."""
	name = models.CharField(max_length=200)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["name"]

	def __str__(self):
		return self.name


class Task(models.Model):
	"""A single todo/task item."""
	PRIORITY_HIGH = 1
	PRIORITY_MEDIUM = 2
	PRIORITY_LOW = 3
	PRIORITY_CHOICES = (
		(PRIORITY_HIGH, "High"),
		(PRIORITY_MEDIUM, "Medium"),
		(PRIORITY_LOW, "Low"),
	)

	task_list = models.ForeignKey(
		TaskList, related_name="tasks", on_delete=models.CASCADE, null=True, blank=True
	)
	title = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	due_date = models.DateTimeField(null=True, blank=True)
	completed = models.BooleanField(default=False)
	priority = models.PositiveSmallIntegerField(choices=PRIORITY_CHOICES, default=PRIORITY_MEDIUM)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	completed_at = models.DateTimeField(null=True, blank=True)
	order = models.PositiveIntegerField(default=0)

	class Meta:
		ordering = ["-priority", "due_date", "order"]

	def __str__(self):
		return self.title

	def save(self, *args, **kwargs):
		"""Set or clear `completed_at` automatically when `completed` changes."""
		if self.completed and self.completed_at is None:
			self.completed_at = timezone.now()
		if not self.completed and self.completed_at is not None:
			self.completed_at = None
		super().save(*args, **kwargs)

