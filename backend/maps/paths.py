
from flask import request, session
from db_connection import database
from Models.models import  Notes
from .maps import maps
from authentication import login_required
import gridfs
import io
import PIL.Image as Image
import base64
from functools import wraps

path_fs = gridfs.GridFS(database.cluster, collection="path_collection_pictures")

@maps.route("/getpaths/", methods=["GET"])
@login_required(["student","admin"])
def get_all_specialization_paths():
	paths = database.pathOperations.get_all_paths()
	response = {}
	for path in paths:
		file_contents = path_fs.get(path["name"]).read()
		image = Image.open(io.BytesIO(file_contents))
		img_byte_arr = io.BytesIO()
		image.save(img_byte_arr, format='PNG')
		response[path["name"]] = (base64.encodebytes(img_byte_arr.getvalue()).decode('ascii'))
	return response

@maps.route("/get_paths/<string:id>", methods=["GET"])
@login_required(["student","admin"])
def get_specialization_path(id):
	resp = database.pathOperations.get_paths_by_query(id)
	
	print("PATHS BACK",resp)
	return resp


@maps.route("/get_path/<string:id>", methods=["GET"])
@login_required(["student","admin"])
def get_specialization_path_by_name(id):
	resp = database.pathOperations.get_path_by_name(id)
	resp.pop('_id')
	print("PATHS BACK single",resp)
	return resp
