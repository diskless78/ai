# -*- coding: utf-8 -*-
import pymongo
from pymongo.message import query
from config import config
# import init keys and capture exception from sentry sdk
from sentry_sdk import capture_exception
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn=str(config.CLIENT_KEYS),
    integrations=[FlaskIntegration()],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0,
    auto_enabling_integrations=False

    # By default the SDK will try to use the SENTRY_RELEASE
    # environment variable, or infer a git commit
    # SHA as release, however you may want to set
    # something more human-readable.
    # release="myapp@1.0.0",
)
try:
    # connect db
    client = pymongo.MongoClient(config.MONGO_URI)
    print("Connect to database: {uri}".format(uri=config.MONGO_URI))
    db = client[config.MONGODB_NAME]
except BaseException as err:
    capture_exception(err)


def check_collection_exist(collection):
    return collection in db.list_collection_names()


# count record in collection
def count_record(collection, dict):
    try:
        return db[collection].count_documents(dict)
    except ValueError as error:
        capture_exception(error)


# find all
def find_all(collection,
             dict,
             order=None,
             distinct=None,
             page=None,
             limit=None,
             incre=-1, disable_field=None):
    # page = limit => "limit" get from argument url limit == offset => "offset" get from argument url disable_field
    # => use this for disable one or many fields you don't want to display on result distinct => finds the distinct
    # values for a specified field across a single collection or view and returns the results in an array
    if page:
        if not limit:
            limit = 20
        page = int(page)
        limit = int(limit)
        if order:
            res = db[collection].find(dict, disable_field) \
                .sort(order, incre) \
                .skip((page - 1) * limit) \
                .limit(limit)
        else:
            res = db[collection].find(dict, disable_field) \
                .skip((page - 1) * limit) \
                .limit(limit)
    elif order:
        res = db[collection].find(dict, {"_id": False}).sort(order, incre)
    else:
        res = db[collection].find(dict, {"_id": False})
    if distinct:
        res = res.distinct(distinct)
        res = filter(lambda r: r != "", res)
    return res


# find one document


def find_one(collection, dict=None, field_not=None):
    # try:
    #     if check_collection_exist(collection):
    return db[collection].find_one(dict, field_not)
    # except BaseException as error:
    #     capture_exception(error)


# save document into database


def add_document(collection, dict, field_unique=None):
    if field_unique:
        db[collection].create_index(
            field_unique, unique=True, sparse=True)
    try:
        db[collection].insert_one(dict)
        if "id" in dict:
            message = {"status": True, "message": "Insert success"}
            message.update({"data": dict})
    except BaseException as error:
        capture_exception(error)

# update document


def push_data_document(collection, query_dict, dict):
    try:
        return db[collection].update_one(query_dict, {"$push": {"data": {"$each": [dict]}}})
    except Exception as error:
        print(error)
        capture_exception(error)


# delete document
def update_document(collection, query_dict, dict):
    try:
        return db[collection].update_one(query_dict, {"set": dict})
    except ValueError as error:
        capture_exception(error)


def delete_document(collection, dict):
    try:
        return db[collection].delete_one(dict)
    except ValueError as error:
        capture_exception(error)
