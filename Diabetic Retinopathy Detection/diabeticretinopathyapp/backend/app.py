from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from datetime import datetime, timedelta, timezone
import datetime
import jwt
from keras.models import load_model
import json
import cv2
import os



app = Flask(__name__) 
cors = CORS(app, support_credentials=True, resources={'/*':{'origins': 'http://localhost:3000'}})
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/diabeticRetinopathy'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


#app.config['JWT_TOKEN_LOCATION'] = ['headers', 'query_string']
app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

bcrypt = Bcrypt(app)
ma = Marshmallow(app)


def imgPreprocessing(imagePath):
    image = cv2.imread(imagePath)
    image = cv2.resize(image,(250, 250))
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    image = cv2.equalizeHist(image)
    image = cv2.medianBlur(image, 3)
    image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    image = image.reshape(1, 250, 250, 3)
    return image


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

class Patients(db.Model):
	__tablename__ = 'Patients'
	patientsId = db.Column(db.Integer, primary_key=True)
	patientsTcNumber = db.Column(db.BigInteger)
	nameSurname = db.Column(db.String(200))
	age = db.Column(db.Integer)
	gender = db.Column(db.String(10))
	doctorName = db.Column(db.String(25))
	doctorSurname = db.Column(db.String(30))

	def __init__(self, patientsTcNumber, nameSurname, age, gender, doctorName, doctorSurname):
		self.patientsTcNumber = patientsTcNumber
		self.nameSurname = nameSurname
		self.age = age
		self.gender = gender
		self.doctorName = doctorName
		self.doctorSurname = doctorSurname

class Diseases(db.Model):
	__tablename__ = 'Diseases'
	diseaseID = db.Column(db.Integer, primary_key=True)
	diseaseLevel = db.Column(db.String(30))
	imagePath = db.Column(db.String(100))
	patient_tcNumber = db.Column(db.BigInteger)
	date = db.Column(db.DateTime, default=datetime.datetime.now)

	def __init__(self, diseaseLevel, imagePath, patient_tcNumber):
		self.diseaseLevel = diseaseLevel
		self.imagePath = imagePath
		self.patient_tcNumber = patient_tcNumber



class DoctorType(db.Model):
	__tablename__ = 'DoctorType'
	userId = db.Column(db.Integer, primary_key=True)
	tcNumber = db.Column(db.BigInteger)
	email = db.Column(db.String(50))
	passwd = db.Column(db.String(300))
	disposition = db.Column(db.String(50))

	def __init__(self,tcNumber, email, passwd, disposition):
		self.tcNumber = tcNumber
		self.email = email
		self.passwd = passwd
		self.disposition = disposition
	

class Doctors(db.Model):
	__tablename__ = 'Doctors'
	doctorId = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100))
	surname = db.Column(db.String(100))
	age = db.Column(db.Integer)
	gender = db.Column(db.String(10))
	doctor_tcNumber = db.Column(db.BigInteger)

	def  __init__(self, name, surname, age, gender, doctor_tcNumber):
		self.name = name
		self.surname = surname
		self.age = age
		self.gender = gender
		self.doctor_tcNumber = doctor_tcNumber

class PatientsSchema(SQLAlchemyAutoSchema):
	class Meta:
		model = Patients
		
class DiseasesSchema(SQLAlchemyAutoSchema):
	class Meta:
		model = Diseases

patient_schema = PatientsSchema()
patients_schema = PatientsSchema(many=True)
disease_schema = DiseasesSchema()
diseases_schema = DiseasesSchema(many=True)




@app.route("/@currentUser")
def get_current_user():
	userId = session.get("userId")

	if not userId:
		return jsonify({"error": "Unauthorized"}), 401
	user = DoctorType.query.filter_by(userId = userId).first()
	doctor = Doctors.query.filter_by(doctor_tcNumber = user.tcNumber).first()
	
	return jsonify({
		"userId": user.userId,
		"tcNumber": user.tcNumber,
		"disposition": user.disposition,
		"name": doctor.name,
		"surname": doctor.surname
	})

@app.route('/login', methods = ['POST'])
def login_user():
	jsondata = request.get_json(force=True)
	tcNumber = jsondata['tcNumber']
	passwd = jsondata['passwd']

	user = DoctorType.query.filter_by(tcNumber=tcNumber).first()
	doctor = Doctors.query.filter_by(doctor_tcNumber=tcNumber).first()

	if user is None:
		return jsonify({"error": "Unauthorized"}), 401
	if not bcrypt.check_password_hash(user.passwd, passwd):
		return jsonify({"error": "Unauthorized"}), 401

	access_token = create_access_token(identity=tcNumber)
	response = {"access_token": access_token}

	return response

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.datetime.now(timezone.utc)
        target_timestamp = datetime.datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response

@app.route("/logout", methods=["POST"])
def logout_user():
	response = jsonify({"msg": "logout successful"})
	unset_jwt_cookies(response)
	return response

@app.route('/patients', methods = ['GET'])
def get_patients():
	all_patients = Patients.query.all()
	results = patients_schema.dump(all_patients)

	return jsonify(results)

@app.route('/detection', methods = ['POST'])
def prediction_disease():
	model = load_model('efficientModel2.h5')
	
	imageFile = request.files['file']
	imagePath = "./FundusImages/" + imageFile.filename
	imageFile.save(imagePath)
	image = imgPreprocessing(imagePath)

	pred = model.predict(image)

	maxNum = 0
	index = 0

	for i in pred:
		for ind,j in enumerate(i):
			if(j>maxNum):
				maxNum = j
				index = ind
	if(index==0):
		result = "No DR"
	elif(index==1):
		result = "Mild"
	elif(index==2):
		result = "Moderate"
	elif(index==3):
		result = "Severe"
	else:
		result = "Proliferative DR"

	maxNum = str(maxNum)
	return result + " --> " + maxNum + imagePath
	

@app.route('/savepatient', methods = ['POST'])
@jwt_required()
def save_patient():
	jsondata = request.get_json(force=True)
	patient_tcNumber = jsondata['patient_tcNumber']
	nameSurname = jsondata['nameSurname']
	age = jsondata['age']
	gender = jsondata['gender']
	imagePath = jsondata['imagePath']
	diseaseLevel = jsondata['diseaseLevel']

	#Getting current user
	user = Doctors.query.filter_by(doctor_tcNumber=get_jwt_identity()).first()
	doctorName = user.name
	doctorSurname = user.surname

	patient = Patients(patientsTcNumber = patient_tcNumber, nameSurname = nameSurname, age = age, gender = gender, doctorName=doctorName, doctorSurname=doctorSurname)
	disease = Diseases(diseaseLevel = diseaseLevel, imagePath=imagePath, patient_tcNumber = patient_tcNumber)

	db.session.add(patient)
	db.session.add(disease)
	db.session.commit()

	dump_data = patient_schema.dump(patient)
	
	return jsonify(dump_data)

@app.route('/adduser', methods = ['POST'])
@jwt_required()
def add_users():
	jsondata = request.get_json(force=True)
	name = jsondata['name']
	surname = jsondata['surname']
	age = jsondata['age']
	gender = jsondata['gender']
	doctor_tcNumber = jsondata['doctor_tcNumber']
	email = jsondata['email']
	passwd = jsondata['passwd']
	disposition = jsondata['disposition']

	current_user = DoctorType.query.filter_by(tcNumber=get_jwt_identity()).first()
	doctorDisposition = current_user.disposition
	#Check the user exists
	user_exists = Doctors.query.filter_by(doctor_tcNumber=doctor_tcNumber).first() is not None
	if user_exists:
		return jsonify({"error": "User already exists"}), 409
	elif(doctorDisposition != "Head of Department"):
		return jsonify({"error": "You don't have permission!"}), 409
	#Hash the password
	hashed_passwd = bcrypt.generate_password_hash(passwd)

	doctor = Doctors(name = name, surname = surname, age = age, gender = gender, doctor_tcNumber = doctor_tcNumber)
	doctor_user = DoctorType(tcNumber = doctor_tcNumber, email = email, passwd = hashed_passwd, disposition = disposition)

	db.session.add(doctor)
	db.session.add(doctor_user)
	db.session.commit()

	return jsonify({
		"userId": doctor_user.userId
	})
@app.route('/delete/<patientsId>', methods = ['DELETE'])
@jwt_required()
@cross_origin(supports_credentials=True, headers=['Content- Type','Authorization','Access-Control-Allow-Origin'])
def patient_delete(patientsId):
	patient = Patients.query.get(patientsId)
	tcNm = patient.patientsTcNumber
	disease = Diseases.query.filter_by(patient_tcNumber = tcNm).first()
	imgPath = disease.imagePath
	current_user = DoctorType.query.filter_by(tcNumber=get_jwt_identity()).first()
	doctorDisposition = current_user.disposition

	if(doctorDisposition != "Head of Department"):
		return jsonify({"error": "You don't have permission!"}), 409
	os.remove(imgPath)

	db.session.delete(disease)
	db.session.delete(patient)
	db.session.commit()

	dump_data = patient_schema.dump(patient)
	return jsonify(dump_data)


if __name__ == "__main__":
	app.run(debug=True)