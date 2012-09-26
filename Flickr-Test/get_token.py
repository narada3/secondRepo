#-*- coding: utf-8 -*-
import flickr_api
FLICKR_API_KEY = '65b80ce96804e3376962384d44756e3e'
FLICKR_API_SECRET = 'e47d7b1f3f708938'
flickr_api.set_keys(api_key = FLICKR_API_KEY, api_secret = FLICKR_API_SECRET)

oauth_verifier = '6e8e38b08c36736b'
a = flickr_api.auth.AuthHandler()
a.set_verifier(oauth_verifier)
flickr_api.set_auth_handler(a)
a.save('key.txt')
