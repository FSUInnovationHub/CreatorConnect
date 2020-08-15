# Creator Connect API

Welcome to the CreatorConnect API, coded using Flask and MongoDB!

To connect Flask to your MongoDB instance, place your MongoDB URI in `config.ini` in section "MongoDB" under key "uri".

```
[MongoDB]
uri = mongodb://<username>:<password>@<url>:<port>/test
```

To run the server, You'll need to set some environment variables.

```
$ cd CreatorConnect/api/
$ pip install -r requirements.txt
$ python run_server.py
```

Now, run the server using `flask run`!

## Documentation

All documentation for the API will be located in `docs/`. 

## Contributing

We follow the same contributing guidelines as the main project! See our [CONTRIBUTING.md](https://github.com/FSUInnovationHub/CreatorConnect/blob/develop/CONTRIBUTING.md) for details on how to help out.