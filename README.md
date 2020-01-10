This repo demonstrates how to call a Pega Platform REST endpoint to create a case type and generate dynamically the different interactions of this case type. The demo is done for Vodafone UK and uses some of the assets of the customer consumer site to demonstrate the interaction.

To use the demo go to http://vfdemo-vfdemo.apps.us-east-2.starter.openshift-online.com/ and click on the 'Troubleshooting' main link.

Because the Pega Platform REST endpoint uses some cert/key certificates, it is not possible to call the API directly from the user browser. As such a NodeJS server is used to both serve the static content of the web site as well as to expose an unauthenticated REST endpoint that acts as a proxy between the Pega platform. You can open the file 'server.js' to get more details on the implementation. The proxy receives a Json payload from the user browser stored in the POST body that is sent when creating a case or moving to the next step. The payload is passed directly to the Pega Platform endpoint. Once the response is received, it is sent back to the browser without any conversation.

Best practices are followed in the NodeJS server to rely on environment variables for providing any sensitive information and other configuration settings and avoid storing them into github. The NodeJS server is deployed in a kubernete pod running on Redhat Openshift cloud. The environment variables are set as secrets and deployed inside the pod.

The browser code that generates the dynamic UI can be found in the file 'troubleshooter.js'. The code generates the payload to be sent to the Pega Platform and parses the reponse to generate the UI. If the reponseList contains multiple choices, a select control is used to render the different options.
