.PHONY: install migrate run test clean superuser shell

install:
    uv pip install django

migrate:
    python manage.py makemigrations
    python manage.py migrate

run:
    python manage.py runserver

test:
    python manage.py test

superuser:
    python manage.py createsuperuser

shell:
    python manage.py shell

clean:
    find . -type d -name __pycache__ -exec rm -rf {} +
    find . -type f -name "*.pyc" -delete

resetdb:
    rm -f db.sqlite3
    python manage.py migrate

collectstatic:
    python manage.py collectstatic --noinput
