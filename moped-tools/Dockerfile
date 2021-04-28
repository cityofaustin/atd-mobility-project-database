# load python 3.8 dependencies using slim debian 10 image.
FROM python:3.8-buster

# We will need the Open JRE
RUN apt-get update \
 && apt-get install default-jre -y

# Install python requirement libraries
RUN pip install requests jaydebeapi

COPY . /app
WORKDIR /app
