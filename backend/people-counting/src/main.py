# -*- coding: utf-8 -*-
import os
import sys
import threading

import pytz
import sentry_sdk
from flask import Flask, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sentry_sdk.integrations.flask import FlaskIntegration

from config import config
from people_counting import (count_by_hour, count_by_weekend,
                             count_separated_weekend, get_list_static,
                             get_list_static_overall)
from people_counting.count_average_by_group import count_average_by_group
from people_counting.count_by_date_range import count_by_date_range
from people_counting.insert_record_people_counting import handle_data_kafka
from utilities import utilities

sentry_sdk.init(
    dsn=str(config.CLIENT_KEYS),
    integrations=[FlaskIntegration()],
    auto_enabling_integrations=False,

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0,

    # By default the SDK will try to use the SENTRY_RELEASE
    # environment variable, or infer a git commit
    # SHA as release, however you may want to set
    # something more human-readable.
    # release="myapp@1.0.0",
)
# flask app
app = Flask(__name__)  # still relative to module
app.config['JWT_SECRET_KEY'] = config.SECRET_KEY
app.config['JWT_BLACKLIST_ENABLED'] = False
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_FORM_KEY'] = 'access_token'
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
CORS(app)
jwt = JWTManager(app)
get_all_timezones = pytz.all_timezones

# run background task to handle data from kafka
run_function = threading.Thread(target=handle_data_kafka)
run_function.start()


@app.route('/', methods=['GET'])
@utilities.token_required
def get_method():
    user_info = utilities.get_user_info(request.headers["authorization"])
    return {"user": user_info}


@app.route('/api/v1/people-counting/handle-report/list-static', methods=['GET'])
@utilities.token_required
def report_list_static():
    return get_list_static.list_static()


@app.route('/api/v1/people-counting/handle-report/get-static-by-week', methods=['GET'])
@utilities.token_required
def report_get_static_by_week():
    return count_by_weekend.get_static_by_week_v2()


@app.route('/api/v1/people-counting/handle-report/count-separate-weekend', methods=['GET'])
@utilities.token_required
def report_count_separate_weekend():
    return count_separated_weekend.count_separated_weekend()


@app.route('/api/v1/people-counting/handle-report/count-by-hours', methods=['GET'])
@utilities.token_required
def report_count_by_hour():
    return count_by_hour.count_by_hours()


@app.route('/api/v1/people-counting/handle-report/count-people-by-date-range', methods=['GET'])
@utilities.token_required
def report_count_by_date_range():
    return count_by_date_range()


@app.route('/api/v1/people-counting/handle-report/count-average-by-group', methods=['GET'])
@utilities.token_required
def report_count_average_by_group():
    return count_average_by_group()


@app.route('/api/v1/people-counting/handle-report/list-static-overall', methods=['GET'])
@utilities.token_required
def report_list_static_overall():
    return get_list_static_overall.list_static_overall()


if __name__ == '__main__':
    try:
        port = int(sys.argv[1])
    except (TypeError, IndexError):
        port = os.getenv("PORT")
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=True)
