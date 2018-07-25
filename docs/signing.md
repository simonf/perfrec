All requests must be signed. The request signature is a Base64-encoded SHA-256 hash signature of a payload calculated  by concatenating various components of th\
e request with a timestamp.

### Pre-requisites

Signatures require an App ID and an API Secret Key which can be obtained from developer@ondemand.colt.net.

### HTTP Headers

To sign a request, you must set two HTTP headers:

```x-colt-app-id``` - this is the App ID supplied by Colt

```x-colt-app-sig``` - this is an HMAC signature generated as described below.

### Steps

1. Obtain the current GMT date and time as a string formatted ```YYYYMMDDHH```. For example, when sending a request at 09:23 on 1st April 2019, construct the st\
ring ```2019040109```
2. Obtain the request path of the URL you are about to call. For example, when calling ```GET http://ondemand.colt.net/OnDemandPerformanceRecommendation/1.0.0/p\
erformance/recommendation/2```, extract the string ```/OnDemandPerformanceRecommendation/1.0.0/performance/recommendation/2```
3. Generate an HMAC signature of the stringified JSON payload being sent as part of the request.
    - If there is no payload (e.g. when making a GET request), sign an empty string ("").
    - If there is a payload, you may include any whitespace you desire in the actual request, but you should generate a signature for the canonical JSON represe\
ntation - see examples, below.
    - For instructions on generating an HMAC signature, see below. An example HMAC signature would be ```Q2TaxZZ42rUtyF/37hMx5qAF3GLb4IqTDNWw+L3prIg=```
4. Concatenate all of the above items and generate an HMAC signature for the concatenated string. For example, concatenating the above examples would give an in\
put string of ```2019040109/OnDemandPerformanceRecommendation\
   /1.0.0/performance/recommendation/2Q2TaxZZ42rUtyF/37hMx5qAF3GLb4IqTDNWw+L3prIg=``` and signing this with the Secret Key value of ```secret``` would give a fi\
nal signature of ```hvXfr6tWpbBThHZbAcVRVveoOnfaxaIHrc19rCMzMS8=```

### Generating an HMAC signature

The API expects a Base64-encoded SHA-256 HMAC signature using the secret key supplied by Colt. [See code examples in different languages.](https://www.jokecamp.\
com/blog/examples-of-creating-base64-hashes-using-hmac-sha256-in-different-languages)

For testing purposes, you can use the following sample inputs and signatures. All samples were generated with a secret key of ```secret```.

Input: ```test``` generates output ```Aymga2LNFrM+tnkr6MYLFY2Jou46h2/Omogeu0iMCRQ=```

Input ```<empty string>``` generates output ```Q2TaxZZ42rUtyF/37hMx5qAF3GLb4IqTDNWw+L3prIg=```

The following inputs should all generate the same signature: ```xkOVh0ynfGVzCyXKnERRT3lCwqkIwZr+JIYZgNlz2AA=```

 ```
{"rec_id":"A123"}
```

```
{
  "rec_id": "A123"
}
```

```
{\r\n  "rec_id": "A123"\r\n}
```
