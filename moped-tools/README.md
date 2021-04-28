# Moped Migration Tools

To run the migration you will need to follow a few steps:

1. Make sure the Hasura cluster is running locally

2. Make sure to rename your mdb access file as `database.mdb`
   and that it's in the same directory as main.py.
   This can later be changed to be dynamic.

3. Build the docker container:
```
$ docker build -f Dockerfile -t atd-moped-migration .
```

4. Run the container:
```
docker run -it --network=host -v ${PWD}:/app atd-moped-migration python main.py
```

At the moment, the output is very verbose for debugging.