import sys
import mysql.connector
import boto3
import json
from mysql.connector import errorcode

bucket = 'kawlantrek'
face_recognition = {}

try:
	request = sys.argv[1]
	if len(sys.argv) == 4:
		ID = sys.argv[2]
		photo = sys.argv[3]
except Exception as e:
	print e
	print "Usage: [" + sys.argv[0] + "] [get]"
	print "Usage: [" + sys.argv[0] + "] [get] [ID] [path/to/photo]"
	print "Usage: [" + sys.argv[0] + "] [post] [ID] [path/to/photo]"
	print "Usage: [" + sys.argv[0] + "] [put] [ID] [path/to/photo]"
	print "Usage: [" + sys.argv[0] + "] [del] [ID] [path/to/photo]"
else:
	try:
		conn = mysql.connector.connect(
			user='frans', password='frans627',
			host='rekdatabase.cvfc8qhairbn.us-east-1.rds.amazonaws.com',
			database='testkawlant', port='3306')

	except mysql.connector.Error as err:
		if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
			print "Error on connection, Access denied, wrong user or password"
		elif err.errno == errorcode.ER_BAD_DB_ERROR:
			print "Database does not exist"
		else:
			print err
	else:

		if request == "get":
			if len(sys.argv) == 2:
				try:
					print "Pull information from database, Get data"
					cur = conn.cursor()
					query = ("SELECT * FROM datos")
					cur.execute(query)

					for (ID, foto, vectorFoto) in cur:
						print("{}, {}, {}".format(ID, foto, vectorFoto))
					cur.close()
				except Exception as excepPull:
					print excepPull
					face_recognition['description'] = "Error connecting to database RDS"
					face_recognition['validation'] = 'false'
					face_recognition['status'] = '500'


			elif len(sys.argv) == 4:
				try:
					print "Rekognition of ID: ", ID
					face_recognition['description'] = 'end of program, thank you!'
					face_recognition['validation'] = 'true'
					face_recognition['status'] = '200'
					face_json = json.dumps(face_recognition)
					print face_json
					cur = conn.cursor()
					query = ("SELECT foto FROM datos WHERE ID = ") + '\"' + ID + '\"'
					cur.execute(query)
					for (foto) in cur:
						photoDB = foto[0]
					print photoDB, "Compare to", photo
					cur.close()
				except Exception as excepPull1:
					print excepPull1
					face_recognition['description'] = "Error connecting to database RDS"
					face_recognition['validation'] = 'false'
					face_recognition['status'] = '500'
				else:
					try:
						s3 = boto3.resource('s3')
					except Exception as exc:
						print exc
						face_recognition['description'] = "Error connecting to AWS S3"
						face_recognition['validation'] = 'false'
						face_recognition['status'] = '500'
					else:
						print "Compare photos"
						s3.meta.client.upload_file(photo, bucket, photo)
						rekognition = boto3.client('rekognition')
						print photoDB, photo

						try:
							response = rekognition.compare_faces(SimilarityThreshold = 80,
								SourceImage={'S3Object':{'Bucket':bucket, 'Name':photoDB}},
								TargetImage={'S3Object':{'Bucket':bucket, 'Name':photo}})
							responseDelete = s3.meta.client.delete_object(
									Bucket = bucket,
									Key = photo
								)
							print response['FaceMatches'][0]['Similarity']

						except Exception as errorC:
							face_recognition['description'] = "No similarities"
							face_recognition['validation'] = 'false'
							face_recognition['status'] = '200'



		elif request == "put":
			try:
				s3 = boto3.resource('s3')
			except Exception as exc:
				print exc
				face_recognition['description'] = "Error connecting to AWS S3"
				face_recognition['validation'] = 'false'
				face_recognition['status'] = '500'
			else:
				print "Pushing foto to S3 bucket", photo
				s3.meta.client.upload_file(photo, bucket, ID + ".jpg")

				rekognition = boto3.client('rekognition')
				response = rekognition.index_faces(CollectionId='kawlantrek',
					DetectionAttributes=[],
					ExternalImageId=ID,
					Image={
						'S3Object': {
							'Bucket': bucket,
							'Name': ID + ".jpg",
						},
					},
				)
				print request, ID, photo
				try:
					vectorFoto = response['FaceRecords'][0]['Face']['FaceId']
				except Exception as excep:
					print excep
					face_recognition['description'] = "Error detecting face on photo"
					face_recognition['validation'] = 'false'
					face_recognition['status'] = '500'
				else:
					queryaddUser = """UPDATE datos SET foto = %s WHERE ID = %s"""
					data = (photo, ID)
					print queryaddUser
					print ID
					face_recognition['description'] = "Successfully uploaded information"
					face_recognition['validation'] = 'true'
					face_recognition['status'] = '200'
					try:
						curs = conn.cursor()
						curs.execute(queryaddUser, data)
						curs.close()
					except Exception as excep:
						print excep
						face_recognition['description'] = "Error connecting to database RDS"
						face_recognition['validation'] = 'false'
						face_recognition['status'] = '500'
		elif request == "del":
			try:
				s3 = boto3.resource('s3')
			except Exception as exc:
				print exc
				face_recognition['description'] = "Error connecting to AWS S3"
				face_recognition['validation'] = 'false'
				face_recognition['status'] = '500'
			else:
				try:
					print "deleting photo from S3 bucket", photo
					s3.meta.client.delete_object(bucket, ID + ".jpg")
				except Exception as e:
					print e
					face_recognition['description'] = "Error deleting photo from s3"
					face_recognition['validation'] = 'false'
					face_recognition['status'] = '500'					
				try:
					queryaddUser = """DELETE FROM datos WHERE ID = %s"""
					data = (ID)
					print queryaddUser
					print ID
					face_recognition['description'] = "Successfully deleted information"
					face_recognition['validation'] = 'true'
					face_recognition['status'] = '200'
					try:
						curs = conn.cursor()
						curs.execute(queryaddUser, data)
						curs.close()
					except Exception as excep:
						print excep
						face_recognition['description'] = "Error connecting to database RDS"
						face_recognition['validation'] = 'false'
						face_recognition['status'] = '500'
				except Exception as excep:
					print excep
					face_recognition['description'] = "Error on RDS query"
					face_recognition['validation'] = 'false'
					face_recognition['status'] = '500'


		else:
			try:
				s3 = boto3.resource('s3')
			except Exception as exc:
				print exc
				face_recognition['description'] = "Error connecting to AWS S3"
				face_recognition['validation'] = 'false'
				face_recognition['status'] = '500'
			else:
				print "Pushing foto to S3 bucket", photo
				s3.meta.client.upload_file(photo, bucket, ID + ".jpg")

				rekognition = boto3.client('rekognition')
				response = rekognition.index_faces(CollectionId='kawlantrek',
					DetectionAttributes=[],
					ExternalImageId=ID,
					Image={
						'S3Object': {
							'Bucket': bucket,
							'Name': ID + ".jpg",
						},
					},
				)
				print request, ID, photo
				try:
					vectorFoto = response['FaceRecords'][0]['Face']['FaceId']
				except Exception as excep:
					print excep
					face_recognition['description'] = "Error detecting face on photo"
					face_recognition['validation'] = 'false'
					face_recognition['status'] = '500'
				else:
					queryaddUser = ('INSERT INTO datos(ID, foto, vectorFoto) VALUES(') + '"' + ID + '\", \"' + ID + '.jpg' +'\", \"' + vectorFoto + '\")'
					print queryaddUser
					print ID
					face_recognition['description'] = "Successfully uploaded information"
					face_recognition['validation'] = 'true'
					face_recognition['status'] = '200'
					try:
						curs = conn.cursor()
						curs.execute(queryaddUser)
						curs.close()
					except Exception as excep:
						print excep
						face_recognition['description'] = "Error connecting to database RDS"
						face_recognition['validation'] = 'false'
						face_recognition['status'] = '500'

		conn.commit()
		conn.close()

finally:
	face_json = json.dumps(face_recognition)
	print face_json
