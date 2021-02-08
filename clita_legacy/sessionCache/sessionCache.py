class SessionDataCache:

        #session data is of form {session_id1: session_data1, session_id2: session_data2 ...}
        session_data = {}
        @classmethod
        def get_session_data(cls, key):
		print "session data==\n\n\n\n",cls.session_data,key
                session_data = cls.session_data.get(key)
		print "session data_data==\n\n\n\n",session_data
                assert session_data is not None, "Get: Session Data is not created"
                assert isinstance(session_data, dict), "Session Data is not a dict"
                assert session_data['session_key'] == key
                return session_data

        @classmethod
        def set_session_data(cls, key, session_data):
                assert isinstance(session_data, dict), "Set: Session Data is not a dict"
                assert key == session_data['session_key']
                cls.session_data[key] = session_data


#if sessionDataObj is not None:
    #sessionDataObj['session_key'] = request.session.session_key
    # sd.set_session_data(request.session.session_key, sessionDataObj)
    # return Response(response)
#else:
     #response['response'] = EINVAL
      #response['response_str'] = "Error fetching data for selected items"
      #return Response(response)

