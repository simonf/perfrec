# Performance Recommendations

## Overview
This server implements the [OnDemandPerformanceRecommendation api](https://app.swaggerhub.com/apiproxy/schema/file/simonfarrell/OnDemandPerformanceRecommendation/1.0.0/swagger.yaml). 

### Running the server
To run the server, run:

```
npm start
```

To view the Swagger UI interface:

```
open http://localhost:8081/docs
```

### Building a docker image
Check out the project from [github](https://github.com/simonf/perfrec.git) and then run 

```docker build -t simonf/perfrec .
docker run -it simonf/perfrec```
