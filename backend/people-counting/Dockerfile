FROM python:3.6

WORKDIR /people-counting
COPY . .
RUN python3 -m pip install --upgrade pip \
    && pip3 install -r requirements.txt
CMD python3 src/main.py
