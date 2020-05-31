### Review Checklist  

1. two branches on git
- master  
- second-demo-dev  

2. npm run dev  
works without error    

3. follow typescript rule
Yes!

4. url validation test Works
- Axios used
```
when tried below
http://localhost:8082/filteredimage?image_url=https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg

result : Request failed with status code 404
```

5. Status code
- 200 : when it sends the properly processed file
- 422 : when it unable to process the request from user  

6. Screenshot
  

7. Validation Test  

- Invalid Link Example  
http://image-filter-demo-dev.ca-central-1.elasticbeanstalk.com/filteredimage?image_url=https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg

- Valid Link Example  
http://image-filter-demo-dev.ca-central-1.elasticbeanstalk.com/filteredimage?image_url=https://test.cdn.download.ams.birds.cornell.edu/api/v1/asset/60395561/1200