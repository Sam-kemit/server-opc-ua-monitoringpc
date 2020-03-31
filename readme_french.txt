************************************************
*	   PC & Machine Monitoring	       *
*	   Serveur OPC UA en Nodejs            *
*          V1.0 by : Samuel KUETA              *
*	        Septembre 2019                 *
************************************************

Description :

Dans le cadre du projet Industrial Data Capture & Publish, j'ai développé ce serveur
opc ua avec nodejs pour qu'il soit multiplateforme afin de pouvoir monitorer nos PC Industriels à distance.
Ce serveur met à disposition (à l'aide du standard OPC UA) les informations du Hardware et Software de la machine, 
par exemple, le numéro de série, le nom du fabricant, les logiciels installés ainsi que les patches, etc ...

Mise en place :

Vous trouverez dans le dossier, deux scripts :
1. Commencez par lancer le script "node get-userN-wmic-test.js" (celui-ci permet de copier ou créer le dossier openssl dans
	C:\Users\admin\AppData\Local\Programs\openssl) ;

2. Ensuite, lancez le "node server-opcua-nodejs-monitoringpc.js" (notre serveur opc ua) ;
3. Assurez-vous que le message suivant est présent dans votre terminal :

	initialized
	Server is now listening ... ( press CTRL+C to stop)
	port  4334
 	the primary server endpoint url is  opc.tcp://xxx:4334

4. Maintenant, votre serveur fonctionne correctement... Connectez-vous à son adresse url avec unclient opc ua tel que 
UAExpert pour pouvoir exploiter ses données.

P.S : openssl est l'outil qui permet de distribuer et/ou gérer les clés de certificats entre le client et le serveur.