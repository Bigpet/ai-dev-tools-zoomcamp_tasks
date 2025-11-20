from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from .models import Task, TaskList

class TaskModelTests(TestCase):
    def test_completed_at_set_on_completion(self):
        """Test that completed_at is set when completed becomes True."""
        task = Task.objects.create(title="Test Task")
        self.assertIsNone(task.completed_at)
        
        task.completed = True
        task.save()
        self.assertIsNotNone(task.completed_at)
        
    def test_completed_at_cleared_on_uncompletion(self):
        """Test that completed_at is cleared when completed becomes False."""
        task = Task.objects.create(title="Test Task", completed=True)
        self.assertIsNotNone(task.completed_at)
        
        task.completed = False
        task.save()
        self.assertIsNone(task.completed_at)

    def test_string_representation(self):
        """Test the string representation of the task."""
        task = Task.objects.create(title="My Task")
        self.assertEqual(str(task), "My Task")


class TaskViewTests(TestCase):
    def setUp(self):
        self.task_list = TaskList.objects.create(name="Work")
        self.task = Task.objects.create(
            title="Existing Task",
            task_list=self.task_list,
            priority=Task.PRIORITY_MEDIUM
        )

    def test_task_list_view(self):
        """Test that the task list page loads and contains tasks."""
        response = self.client.get(reverse('task_list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todos/task_list.html')
        self.assertContains(response, "Existing Task")

    def test_task_create_view(self):
        """Test creating a new task."""
        response = self.client.post(reverse('task_create'), {
            'title': 'New Task',
            'description': 'Description',
            'priority': Task.PRIORITY_HIGH,
            'task_list': self.task_list.pk
        })
        self.assertEqual(response.status_code, 302)  # Redirects after success
        self.assertTrue(Task.objects.filter(title='New Task').exists())

    def test_task_update_view(self):
        """Test updating an existing task."""
        response = self.client.post(reverse('task_update', args=[self.task.pk]), {
            'title': 'Updated Title',
            'description': 'Updated Description',
            'priority': Task.PRIORITY_LOW,
            'task_list': self.task_list.pk,
            'completed': False
        })
        self.assertEqual(response.status_code, 302)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, 'Updated Title')

    def test_task_delete_view(self):
        """Test deleting a task."""
        response = self.client.post(reverse('task_delete', args=[self.task.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Task.objects.filter(pk=self.task.pk).exists())

    def test_toggle_task_view(self):
        """Test toggling a task's completion status."""
        self.assertFalse(self.task.completed)
        response = self.client.post(reverse('task_toggle', args=[self.task.pk]))
        self.assertEqual(response.status_code, 302)
        self.task.refresh_from_db()
        self.assertTrue(self.task.completed)
        
        # Toggle back
        response = self.client.post(reverse('task_toggle', args=[self.task.pk]))
        self.task.refresh_from_db()
        self.assertFalse(self.task.completed)
