This repo demonstrate how to call a Pega Platform REST endpoint to create a case type and drive the different screens and interaction of this case type. The demo is done for Vodafone UK and uses some of the assets of the site to demonstrate the interaction.

To use the demo go to http://vf-vfdemo.apps.ca-central-1.starter.openshift-online.com/ and click on the 'Troubleshooting' main link.

Because the Pega Platform REST endpoint uses some certificates, it is not possible to call the API directly from the browser. As such a NodeJS server is used to both serve the static content of the web site as well as to expose an unauthenticated REST endpoint that acts as a proxy between the Pega platform. See the file 'server.js'. The proxy received a Json payload from the browser in the POST body that is sent when creating a case or moving to the next step and pass it directly to the Pega Platform endpoint. Once the response is received, it is sent back to the browser.

Best practices are followed in the NodeJS server to rely on environment variables for providing any sensitive information and other configuration settings and avoid storing them into github. The NodeJS server is deploy in a kubernete pod running on Redhat Openshift cloud. The environment variables are set as secrets and deployed inside the pod.

The browser code that generates the dynamic UI can be found in the file 'troubleshooter.js'. The code generates the payload to be sent to the Pega Platform and parse the reponse to generate the UI. If the reponseList contains multiple choices, a select control is used to render the different options.
