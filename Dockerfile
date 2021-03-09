FROM oraclelinux:7-slim

RUN  yum -y install oracle-release-el7 oracle-nodejs-release-el7 && \
    yum-config-manager --disable ol7_developer_EPEL && \
    yum -y install oracle-instantclient19.3-basiclite nodejs && \
    yum -y groupinstall "Development Tools" && \
    rm -rf /var/cache/yum

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g forever
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Copy tnsnames.ora
#COPY config/tnsnames.ora /usr/lib/oracle/19.3/client64/lib/network/admin/

EXPOSE 5400

CMD [ "forever", "server/server.js" ]
