PYTHON = .venv/bin/python

.PHONY: install migrate run test clean superuser shell

install:
	uv pip install -e .

migrate:
	$(PYTHON) manage.py makemigrations
	$(PYTHON) manage.py migrate

run:
	$(PYTHON) manage.py runserver

test:
	$(PYTHON) manage.py test

superuser:
	$(PYTHON) manage.py createsuperuser

shell:
	$(PYTHON) manage.py shell

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

resetdb:
	rm -f db.sqlite3
	$(PYTHON) manage.py migrate

collectstatic:
	$(PYTHON) manage.py collectstatic --noinput
