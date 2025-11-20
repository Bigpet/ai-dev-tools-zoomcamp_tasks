from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.utils import timezone
from .models import Task

class TaskListView(ListView):
    model = Task
    template_name = 'todos/task_list.html'
    context_object_name = 'tasks'

    def get_queryset(self):
        return Task.objects.all().order_by('completed', '-priority', 'due_date')

class TaskCreateView(CreateView):
    model = Task
    template_name = 'todos/task_form.html'
    fields = ['title', 'description', 'due_date', 'priority', 'task_list']
    success_url = reverse_lazy('task_list')

class TaskUpdateView(UpdateView):
    model = Task
    template_name = 'todos/task_form.html'
    fields = ['title', 'description', 'due_date', 'priority', 'task_list', 'completed']
    success_url = reverse_lazy('task_list')

class TaskDeleteView(DeleteView):
    model = Task
    template_name = 'todos/task_confirm_delete.html'
    success_url = reverse_lazy('task_list')

def toggle_task(request, pk):
    task = get_object_or_404(Task, pk=pk)
    task.completed = not task.completed
    task.save()
    return redirect('task_list')
