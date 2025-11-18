# 01 - TODO homework Notes

I have some experience developing python, so the task itself is not a challenge, but using more AI tooling is the exercise.

I first queried the AI to create a README to give some context to the _tasks repo. It failed to do that well.
But it did give me most of the commands to finish the initial tasks.


# Introduction to AI-Assisted Development 

In this homework, we'll build an application with AI.

You can use any tool you want: ChatGPT, Claude, GitHub Copilot, Codex, Cursor, etc.

We will build a TODO application in Django. 

You will only need Python to get started. You don't need to know Python or Django for that.

## Answer 1: Install Django

The AI suggested just pip, but I used uv instead.
I executed for the setup:

```
uv init
uv venv
uv pip install django
```


## Answer 2: Project and App

Then I had to query for some more details about the setup, because I never setup a django project before.

```
uv run django-admin startproject todo_project .
uv run python manage.py startapp todos
# added "todos.apps.TodosConfig" to the settings.py
source ./.venv/bin/activate
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

I needed to edit the settings.py

## Answer 3: Django Models

I queried the AI for a model file. I wanted a Task and a TaskList model.
It obliged happily and didn't look to bad on first sight.

I executed these commands to register the models correctly

```
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
# todos/admin.py edited to register

python manage.py createsuperuser  # just used admin/admin :P
```


# Original Task

## Question 1: Install Django

We want to install Django. Ask AI to help you with that.

What's the command you used for that?

There could be multiple ways to do it. Put the one that AI suggested in the homework form.


## Question 2: Project and App

Now we need to create a project and an app for that.

Follow the instructions from AI to do it. At some point, you will need to include the app you created in the project.

What's the file you need to edit for that?

- `settings.py`
- `manage.py`
- `urls.py`
- `wsgi.py`


## Question 3: Django Models

Let's now proceed to creating models - the mapping from python objects to a relational database. 

For the TODO app, which models do we need? Implement them.

What's the next step you need to take?

- Run the application
- Add the models to the admin panel
- Run migrations
- Create a makefile

## Question 4. Templates

Let's finish it later

## Homework URL

Commit your code to GitHub. You can create a repository for this course. Within the repository, create a folder, e.g. "01-todo", where you put the code.

Use the link to this folder in the homework submission form. 


## Tip

You can copy-paste the homework description into the AI system of your choice. But make sure you understand (and follow) all the steps in the response. 




