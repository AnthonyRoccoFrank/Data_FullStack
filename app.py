# Import our pymongo library, which lets us connect our Flask app to our Mongo database and other dependencies
from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app) # adding this line to enable CORS

# Create connection variable
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# Declare the database
db = client.flu_vaccines_db

# Declare the collections
flu = db.flu
vaccine = db.vaccine

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/flu<br/>"
        f"/vaccine"
    )

@app.route("/flu", methods=["GET"])
def get_all_flu():
    flu_docs = list(flu.find({}))
    for doc in flu_docs:
        doc["_id"] = str(doc["_id"])
    return jsonify(flu_docs)

@app.route("/vaccine", methods=["GET"])
def get_all_vaccine():
    vaccine_docs = list(vaccine.find({}))
    for doc in vaccine_docs:
        doc["_id"] = str(doc["_id"])
    return jsonify(vaccine_docs)

@app.route("/flu", methods=["POST"])
def create_flu_doc():
    data = request.get_json()
    result = flu.insert_one(data)
    return jsonify({"Inserted_id": str(result.inserted_id)})

@app.route("/vaccine", methods=["POST"])
def create_vaccine_doc():
    data = request.get_json()
    result = vaccine.insert_one(data)
    return jsonify({"Inserted_id": str(result.inserted_id)})

@app.route("/flu/<id>", methods=["PUT"])
def update_flu_doc(id):
    data = request.get_json()
    result = flu.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"modified_count": result.modified_count})

@app.route("/vaccine/<id>", methods=["PUT"])
def update_vaccine_doc(id):
    data = request.get_json()
    result = vaccine.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"modified_count": result.modified_count})

if __name__ == "__main__":
    app.run(debug=True)
