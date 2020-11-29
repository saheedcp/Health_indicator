from django.contrib import admin
from django.conf.urls import url

from . import views

urlpatterns = [
    	url(r'^$', views.index, name='index'),
    	url(r'healthInput',views.healthInput, name='healthInput'),
    	url(r'tableM',views.tableM, name='tableM'),
		url(r'^shiftManagementTemplate/$',    views.shiftManagementTemplate,                   name = 'shiftManagementTemplate'),
			
	#api view
	url(r'api/home/SetProductionEvent/$',               views.SetProductionEvent,                   name = 'SetProductionEvent'),
	url(r'api/home/GetTrend/$',               views.GetTrend,                   name = 'GetTrend'),
	url(r'api/home/GetTable/$',               views.GetTable,                   name = 'GetTable'),
	url(r'api/home/GetMachines/$',               views.GetMachines,                   name = 'GetMahines'),
	url(r'api/home/GetShifts/$',               views.GetShifts,                   name = 'GetShifts'),
	url(r'api/home/SetShift/$',               views.SetShift,                   name = 'SetShift'),
	url(r'api/home/GetCurrentShift/$',       views.GetCurrentShift,                   name = 'GetCurrentShift'),
	url(r'api/home/GetMachinesList/$',               views.GetMachinesList,                   name = 'GetMachinesList'),
]
