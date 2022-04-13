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

#resources={'/*':{'origins': 'http://localhost:3000'}}

app = Flask(__name__) 
CORS(app, support_credentials=True)


app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/diabeticRetinopathy'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

bcrypt = Bcrypt(app)
ma = Marshmallow(app)

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

	def __init__(self, patientsTcNumber, nameSurname, age, gender):
		self.patientsTcNumber = patientsTcNumber
		self.nameSurname = nameSurname
		self.age = age
		self.gender = gender

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
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
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
def add_patients():
	jsondata = request.get_json(force=True)
	patientsTcNumber = jsondata['patientsTcNumber']
	nameSurname = jsondata['nameSurname']
	age = jsondata['age']
	gender = jsondata['gender']
	diseaseLevel = jsondata['diseaseLevel']
	imagePath = jsondata['imagePath']

	patient = Patients(patientsTcNumber = patientsTcNumber, nameSurname = nameSurname, age = age, gender = gender)
	disease = Diseases(diseaseLevel = diseaseLevel, imagePath = imagePath, patient_tcNumber = patientsTcNumber)

	db.session.add(patient)
	db.session.add(disease)
	db.session.commit()

	dump_data = patient_schema.dump(patient)
	
	return jsonify(dump_data)

@app.route('/adduser', methods = ['POST'])
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
	#Check the user exists
	user_exists = Doctors.query.filter_by(doctor_tcNumber=doctor_tcNumber).first() is not None
	if user_exists:
		return jsonify({"error": "User already exists"}), 409
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


if __name__ == "__main__":
	app.run(debug=True)