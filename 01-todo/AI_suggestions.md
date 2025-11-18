# AI - Suggestions. Introduction to AI-Assisted Development — Homework Summary

This folder contains a short README summarizing the homework in
`cohorts/2025/01-overview/homework.md` and listing useful commands and
answers for Questions 1–3.

**Q1 — Install Django**:
- **Command:** `pip install django`

Notes: you can also use `python -m pip install django` for a specific
Python interpreter.

**Q2 — Project and App**:
- Create a Django project and app with:

```bash
django-admin startproject todo_project .
python manage.py startapp todos
```

- You must add the created app to `INSTALLED_APPS` in `settings.py`.

**Q3 — Django Models**:
- Example `Todo` model (place in `todos/models.py`):

```python
from django.db import models

class Todo(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

- After implementing models, the next step is: **Run migrations**.

Commands to apply migrations and run the server:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Optional: add the model to the admin in `todos/admin.py`:

```python
from django.contrib import admin
from .models import Todo

admin.site.register(Todo)
```

**Homework URL / GitHub**:
- Create a repository for the course and put your project in a folder
  such as `01-todo` at the repository root. Commit and push your
  project, then use the folder URL in the homework submission form.

Example Git commands to initialize and push (adjust remote URL):

```bash
git init
git add .
git commit -m "Add Django TODO project"
git remote add origin <your-repo-url>
git push -u origin main
```

If you want, I can create a minimal starter project in `ai-dev-tools-zoomcamp_tasks/01-todo` and run the migrations locally.

---
Generated from `cohorts/2025/01-overview/homework.md`.
