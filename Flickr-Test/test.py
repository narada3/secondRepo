#-*- coding: utf-8 -*-

import flickr_api
FLICKR_API_KEY = '65b80ce96804e3376962384d44756e3e'
FLICKR_API_SECRET = 'e47d7b1f3f708938'
flickr_api.set_keys(api_key = FLICKR_API_KEY, api_secret = FLICKR_API_SECRET)

oauth_token = '72157631626910485-9d22cb531c48a8ed'
oauth_verifier = '23d6db4a00f27f65'
oauth = {'access_token_key': oauth_token, 'access_token_secret': oauth_verifier}

a = flickr_api.auth.AuthHandler.fromdict(oauth)

username = 'coldhawaii'
user_id = flickr_api.Person.findByUsername(username)
print user_id

