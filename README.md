##Hello World Demo Extension

[Create a 'Hello World' Dashboard Extension](https://tableau.github.io/extensions-api/docs/trex_create.html)

##Tableau extension api library

Cloned from [Github](https://github.com/tableau/extensions-api)

'./lib' folder is from this repo

##Install Webserver

```bash
npm install http-server -g
```
> -g means install globally

##Webserver Homepage

[http-server](https://www.npmjs.com/package/http-server)

##Start Secure Webserver 

Start the webserver in the root of the project folder.

```bash
http-server -p 8765 -S -C /Users/rick/x509/pwpearson.com/cert.pem -K /Users/rick/x509/pwpearson.com/privkey.pem
```

Certs are created by `certbot`. See LetsEncrypt.

