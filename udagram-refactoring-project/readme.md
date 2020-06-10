Tasks
1. Refactor the API
The API code currently contains logic for both /users and /feed endpoints. Let's decompose the API code so that we can have two separate projects that can be run independent of one another.

Tips
Using Git is recommended so you can revert any unwanted changes in your code!
You may find yourself copying a lot of duplicate code into the separate projects -- this is expected! For now, focus on breaking apart the monolith and we can focus on cleaning up the application code afterwards.
2. Containerize the Code
Start with creating Dockerfiles for the frontend and backend applications. Each project should have its own Dockerfile.

3. Build CICD Pipeline
After setting up your GitHub account to integrate with Travis CI, set up a GitHub repository with a .travis.yml file for a build pipeline to be generated.

Screenshots
So that we can verify your project’s pipeline is set up properly, please include the screenshots of the following:

DockerHub showing images that you have pushed
Travis CI showing a successful build job
4. Deploy to Kubernetes
Deploy the Docker containers for the API applications and web application as their own pods in AWS EKS.

We should be able to see the pods deployed successfully via the command against your EKS cluster:

kubectl get pods
Screenshots
So that we can verify that your project is deployed, please include the screenshots of the following commands with your completed project:

To verify Kubernetes pods are deployed properly
kubectl get pods
To verify Kubernetes services are properly set up
kubectl describe services
To verify that you have horizontal scaling set against CPU usage
kubectl describe hpa
5. Logging
Use logs to capture metrics. This can help us with debugging.

Screenshots
To verify that user activity is logged, please include a screenshot of:

kubectl logs <your pod name>
Suggestions to Make Your Project Stand Out (Optional)
Try one or more of these to take your project to the next level.

Reduce Duplicate Code
When we decomposed our API code into two separate applications, we likely had a lot of duplicate code. Optionally, you could reduce the duplicate code by abstracting them into a common library.

Secure the API
The API is only meant to be consumed by the frontend web application. Let's set up ingress rules so that only web requests from our web application can make successful API requests.

Submission Requirements
The project will be submitted as a link to a GitHub repo or a zip file and should include screenshots to document the application's infrastructure.

Required Screenshots
Docker images in your repository in DockerHub
TravisCI build pipeline showing successful build jobs
Kubernetes kubectl get pods output
Kubernetes kubectl describe services output
Kubernetes kubectl describe hpa output
Kubernetes kubectl logs <your pod name> output