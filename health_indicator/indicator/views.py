import json
import os
from datetime import date,time,datetime,timedelta
import ast
import sys

#django packages
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.template import RequestContext,loader
#from . import forms
from django.contrib.auth.models import Permission
from django.contrib.auth.models import Group
from django.contrib.sessions.models import Session
from django.contrib import messages

#rest_framework
from rest_framework import *
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

#bytematics package
from clita_legacy.dataconnector import mongoConnector
from clita_legacy.serverlogging.clita_log import clitaLogger


from health_indicator import settings
sys.path.insert(0,"../")

from data_service.logic import Logic
 


# Create your views here.
def index(request):
	context=RequestContext(request)
	return render_to_response('index.html',context)

def healthInput(request):
	company_url = '/indicator/'
        url_contexts = {'company_url': company_url}
        context = RequestContext(request)
        return render_to_response('health_data_input.html',url_contexts, context)

def tableM(request):
	company_url = '/indicator/'
        url_contexts = {'company_url': company_url}
        context = RequestContext(request)
        return render_to_response('tableM.html',url_contexts, context)

# @login_required
def shiftManagementTemplate(request):
	company_url = '/indicator/'
        url_contexts = {'company_url': company_url}
        context = RequestContext(request)
        return render_to_response('shiftManagementTemplate.html',url_contexts, context)








#api
@api_view(['POST','GET'])
def SetProductionEvent(request):
	if request.method == 'GET':
                reqDict = request.GET
        elif request.method == 'POST':
                reqDict = request.POST
        productionEvent = ast.literal_eval(reqDict["pEvent"])
        print productionEvent 
	productionEvent["date"] =  datetime.today()
	productionEvent["shift"] =  'A'
        mg = mongoConnector.MongoConnector.getInstance()
        db= mg.getDatabaseClient('Production')
        #db= mg.getDatabaseClient(settings.COMPANY_NAME)
        mg.updateCollection_dash(productionEvent,"ProductionEventsCollection" ,productionEvent)
	return Response({"pEvent":productionEvent})
@api_view(['POST','GET'])
def GetTrend(request):
	if request.method == 'GET':
        	reqDict = request.GET
    	elif request.method == 'POST':
        	reqDict = request.POST
    	reportParams = ast.literal_eval(reqDict["reportParams"])
	# print "sssssssssssssssssssssssssss",reportParams,"###################"
	lg = Logic('Production')
	gData = lg.GetGraph(reportParams)
	# print gData,"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
	
	return Response({"gData":gData})
@api_view(['POST','GET'])
def GetTable(request):
	if request.method == 'GET':
        	reqDict = request.GET
    	elif request.method == 'POST':
        	reqDict = request.POST
    	reportParams = ast.literal_eval(reqDict["reportParams"])
	lg = Logic('Production')
	tData = lg.GetTable(reportParams)
	# print lg
	return Response({"tData":tData})


@api_view(['POST','GET'])
def GetMachines(request):
	lg = Logic('Production')
	
	tData = lg.GetMachines()
	return Response({"machines":tData})
#####################################################################################
@api_view(['POST','GET'])
def GetMachinesList(request):
	lg = Logic('Production')
	
	MData = lg.GetMachinesList()
	return Response({"machines":MData})
#######################################################################################	
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
@api_view(['POST','GET'])

def GetShifts(request):
	lg = Logic('Production')
	# print lg
	st =  datetime.today()
	sessionDataObj = {}
	#if not request.session.session_key:
		#request.session.save()
	#sessionDataObj['production'] = request.user.username.split('@')[-1].split('.')[0]
	#print sessionDataObj['production']
	#lg = Logic(sessionDataObj["production"])
	
        dbh = mongoConnector.MongoConnector.getInstance()
	#lg = Logic(sessionDataObj["production"])
	dsDict,sList = lg.getDateShift(dbh)
	if sList:
		return Response(sList[0]["sList"])
	clitaLogger.info("Time : Get Shift...  %s" % ((datetime.today() - st).seconds))
	return Response(sList)
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
@api_view(['POST','GET'])
def SetShift(request):
	lg = Logic('Production')
	st = datetime.today()
	if request.method == 'GET':
                reqDict = request.GET
        elif request.method == 'POST':
                reqDict = request.POST
        sList = json.loads(reqDict.get("sList"))
        assert sList is not None, "sList not set"
        #sessionDataObj = {}
	#sessionDataObj['production'] = request.user.username.split('@')[-1].split('.')[0]
	#lg = Logic(sessionDataObj["production"])
	lg.SetShift(sList)
	clitaLogger.info("Time : Set Shift...  %s" % ((datetime.today() - st).seconds))
	return Response({"response":"ok"})
@authentication_classes((SessionAuthentication, BasicAuthentication))
@permission_classes((IsAuthenticated,))
@api_view(['POST','GET'])
def GetCurrentShift(request):
	lg = Logic('Production')	
	sessionDataObj = {}
	st =  datetime.today()
        sessionDataObj['Production'] = request.user.username.split('@')[-1].split('.')[0]
        useremail = request.user.username
	cls =  checkListStatus.CheckListStatus(sessionDataObj['Production'])
        dsDict = cls.GetNumberOfShifts(useremail,st)
        return Response(dsDict)

