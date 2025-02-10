# Test alembic migrations

## Start environment

```
docker compose build
docker compose up -d

# exec into python
docker compose exec python bash

# exec into db
docker compose exec db psql -Upostgres

# teardown everyhing after running your tests
docker compose down -v
```


## Running migrations

Add the model to the db (see models.py)

in the python container
```
alembic revision --autogenerate -m 'add test model'
alembic upgrade head
```


in the db container
```
select * from test;
select * from alembic_version;
```
