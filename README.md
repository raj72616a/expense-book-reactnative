# expense-book-reactnative

a simple project that i made while i go thru the basics of developing with react native.
react navigation to handle multiple screens,
redux for state management,
local storage for user's data, and using fetch to upload/download user data to cloud backup.

the compiled app is published to Play Store:
https://play.google.com/store/apps/details?id=com.akashan.ExpenseBook


backend server as well as Reactjs version of the same app is containerized and uploaded here:
https://hub.docker.com/r/raj72616a/expense-book-web

deployment configs to Kubernetes, Docker-Compose, AWS ECS or AWS Elastic Beanstalk are in the /server-container/ folder. a sample deployed instance is on AWS:
http://exbk.us-east-2.elasticbeanstalk.com/