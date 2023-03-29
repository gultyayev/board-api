FROM node:18
WORKDIR /app
RUN apt-get update
RUN apt-get install -y software-properties-common
RUN apt-add-repository 'deb http://security.debian.org/debian-security stretch/updates main'
RUN apt-get update
RUN apt-get install -y openjdk-8-jdk
RUN java -version
RUN npm i -g serverless
COPY package*.json .
COPY post-install-fix.js .
RUN npm install
COPY serverless.yml .
RUN sls dynamodb install
COPY . .
RUN serverless config credentials --provider aws --key testKey --secret testSecret
EXPOSE 3000
CMD ["npm", "run", "sls:offline", "--", "--host", "0.0.0.0"]
