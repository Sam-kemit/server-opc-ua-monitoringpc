"use strict";

/*global require,setInterval,console */
const opcua = require("node-opcua");
const path = require("path");
const fs = require("fs");
const pki = require("node-opcua-pki");

// the application URI of our server
// (note server certificate must reflex this application URI)
const applicationUri = "MyServer";

// the folder where the certificates and PKI will be found
// note:
//  - you can use any other places, but make sure not to use __dirname when creating the path
const certificateFolder = path.join(process.cwd(), "certificates");

// let's decide that the server certificate is in the certificate folder and called this way:
const certificateFile = path.join(certificateFolder,"server_certificate.pem");


(async function (){
    
    try {
        // let's create a dedicated CertificateManager
        //  - in our case, this step is required as we cannot use the default
        // certificate store that will not be handled appropriately during the
        // packaging operation
        const serverCertificateManager = new opcua.OPCUACertificateManager({
            automaticallyAcceptUnknownCertificate: true,
            rootFolder: certificateFolder
        });
        // let's make sure that the PKI , own/private key and rejected and truster folder
        // are created for us by calling initialize
        await serverCertificateManager.initialize();


        // little extra : 
        // let's automatically generate the  server certificate if it doesn't not exist already
        if (!fs.existsSync(certificateFile)) {
            console.log("creating certificate ", certificateFile);
            const pkiM = new pki.CertificateManager({
                location: certificateFolder
            });
            await pkiM.initialize();
            await pkiM.createSelfSignedCertificate({
                subject: "/CN=MyCommonName;/L=Paris",
                startDate: new Date(),
                dns:[],
                validity: 365 * 5, // five year
                applicationUri,
                outputFile: certificateFile,
            });
            console.log("certificate ", certificateFile, "created");
        }
        
         // the server private key location is given to us by the OPCUACertificateManager
        const privateKeyFile = serverCertificateManager.privateKey;
        console.log("certificateFile =", certificateFile)
        console.log("privateLeyFile  =", privateKeyFile);
        
        // Let's create an instance of OPCUAServer
        const server = new opcua.OPCUAServer({
            port: 4334, // the port of the listening socket of the server
            serverCertificateManager,

            // ------------------ IMPORTANT
            // let's make sure that we provide our own privateKeyFile, certifcatFile
            // and not use the default value
            privateKeyFile,
            certificateFile,  
            // ------------------ IMPORTANT

            serverInfo: {
                    applicationUri
                },
            nodeset_filename: [
                    opcua.nodesets.standard,
                    opcua.nodesets.di,
                ]
        });
        
        // display some useful information to help diagnostic
        console.log("Certificate rejected folder ", server.serverCertificateManager.rejectedFolder);
        console.log("Certificate trusted folder  ", server.serverCertificateManager.trustedFolder);
        console.log("Server private key          ", server.serverCertificateManager.privateKey);
        console.log("Server private key          ", server.privateKeyFile);
        console.log("Server certificateFile      ", server.certificateFile);
        
        await server.initialize();
        
        console.log("initialized");
        function construct_my_address_space(server) {
    
        const addressSpace = server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();
        
        // declare a new object
        const device = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "PC"
        });
            // add a object OS		
            const deviceOS = namespace.addObject({
                componentOf: device,
                browseName: "OS"
            });
            /* add a Object CPU */
            const deviceCPU = namespace.addObject({
                componentOf: device, 
                browseName:"CPU"
            });
                const deviceCPUprocessor = namespace.addObject({
                    componentOf: deviceCPU, 
                    browseName:"Processor"
                });
            const deviceSoftwareInstalled =  namespace.addObject({
                componentOf: device, 
                browseName: "Software Installed"
            });
            const deviceWindowsUpdate =  namespace.addObject({
                componentOf: device, 
                browseName: "Windows Update"
            });
            const deviceBios =  namespace.addObject({
                componentOf: device, 
                browseName: "BIOS"
            });
                const deviceBiosVersion = namespace.addObject({
                    componentOf: deviceBios, 
                    browseName:"Bios Version"
                });
            const deviceNetwork =  namespace.addObject({
                componentOf: device, 
                browseName: "Network"
            });	
        
        
        
        // declarations 
        const os = require("os");
        const osUtils = require('os-utils');
        
        const util = require('util');
        const execFile = util.promisify(require('child_process').execFile);
        
         /********* Create all variables of Object PC ****************/
  
        let myVar2;
        setInterval(function() {	
            
            osUtils.cpuUsage(function(v){
                //console.log( 'CPU Usage (%): ' + v * 100 );
                const myVar = v * 100.0; 
                myVar2 = myVar.toFixed(0);
                return myVar2;              
            });  
        }, 500 );
    
        namespace.addVariable({            
            componentOf: deviceCPU,        
            nodeId: "s=cpu_usage", // a string nodeID
            browseName: "CPU usage (%)",
            dataType: "Double",  
            valueRank: 0,
            value: {
            get: function () {return new opcua.Variant({dataType: opcua.DataType.Double, value: myVar2});}
                    }
            }); 
        
        
        let arrayCPU = new Array();
        let cp = [];   

        const child_1 = execFile('wmic',['path', 'win32_processor', 'get', 'name', ',description', ',maxclockspeed', ',numberofcores', ',processorid', '/format:CSV'], (error, stdout, stderr) => {
          if (error) {
            throw error;
          }
        arrayCPU = stdout.split(","); 
        arrayCPU.splice(0, 6); 

        for(let i=0; i<arrayCPU.length; i++){            
            
            if(i==0){
                 namespace.addVariable({
                            componentOf: deviceCPUprocessor, 
                            browseName: "Description",  
                            dataType: "String",
                            valueRank: 0,					
                            value:	{ 
                                get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: arrayCPU[i]});
                                }
                            }
                        });
            }
            if(i==1){
                namespace.addVariable({
                            componentOf: deviceCPUprocessor, 
                            browseName: "MaxClockSpeed",  
                            dataType: "UInt32",
                            valueRank: 0,					
                            value:	{ 
                                get: function() {return new opcua.Variant({ dataType: opcua.DataType.UInt32, value: arrayCPU[i]});
                                }
                            }
                        });
            }
            if(i==2){
                namespace.addVariable({
                            componentOf: deviceCPUprocessor, 
                            browseName: "Name",  
                            dataType: "String",
                            valueRank: 0,					
                            value:	{ 
                                get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: arrayCPU[i]});
                                }
                            }
                        });
            }
            if(i==3){
                namespace.addVariable({
                            componentOf: deviceCPUprocessor, 
                            browseName: "NumberOfCores",  
                            dataType: "UInt32",
                            valueRank: 0,					
                            value:	{ 
                                get: function() {return new opcua.Variant({ dataType: opcua.DataType.UInt32, value: arrayCPU[i]});
                                }
                            }
                        });
            }
            if(i==4){
                namespace.addVariable({
                            componentOf: deviceCPUprocessor, 
                            browseName: "ProcessorId",  
                            dataType: "String",
                            valueRank: 0,					
                            value:	{ 
                                get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: arrayCPU[i]});
                                }
                            }
                        });
                }
        }
        });

         /* Create all variables of Object OS */
        
		namespace.addVariable({            
            componentOf: deviceOS,            
            nodeId: "s=os_type", // a string nodeID
            browseName: "Type OS",
            dataType: "String",    
            value: {
                get: function () {return new opcua.Variant({dataType: opcua.DataType.String, value: os.type() });}
            }
        });
		namespace.addVariable({            
            componentOf: deviceOS,            
            nodeId: "s=os_pc", // a string nodeID
            browseName: "Platform OS",
            dataType: "String",    
            value: {
                get: function () {return new opcua.Variant({dataType: opcua.DataType.String, value: os.platform()});}
            }
        });
		namespace.addVariable({            
            componentOf: deviceOS,            
            nodeId: "s=os_version", // a string nodeID
            browseName: "Version OS",
            dataType: "String",    
            value: {
                get: function () {return new opcua.Variant({dataType: opcua.DataType.String, value: os.release()});}
            }
        });
		
        /**
         * returns the percentage of free memory on the running machine
         * @return {double}
         */
        function available_memory() {
            // var value = process.memoryUsage().heapUsed / 1000000;
            const percentageMemUsed = os.freemem() / os.totalmem() * 100.0;
            return percentageMemUsed;
        }
        namespace.addVariable({            
            componentOf: deviceOS,            
            nodeId: "s=free_memory", // a string nodeID
            browseName: "Memory Used (%)",
            dataType: "UInt32",    
            value: {
                get: function () {return new opcua.Variant({dataType: opcua.DataType.UInt32, value: available_memory() });}
            }
        });
		namespace.addVariable({            
            componentOf: deviceOS,            
            nodeId: "s=os_hostname", // a string nodeID
            browseName: "Hostname OS",
            dataType: "String",    
            value: {
                get: function () {return new opcua.Variant({dataType: opcua.DataType.String, value: os.hostname() });}
            }
        });
		
        
        /* create a script to get list of all software installed on the PC, and add a Object 
           named Software installed plus add a child Object nameSoftware with his dateInstall and version */
  
        let arrayListSoftware = new Array();
        let a = [];     
        
        async function getVersion() {            
            const { stdout } = await execFile('wmic',['product', 'get', 'name', ',version', ',installdate', '/format:CSV']);
            arrayListSoftware = stdout.split("\n"); 
            //array = stdout.replace(/\s+/g,"")
            arrayListSoftware.splice(0, 2);

            for(let i in arrayListSoftware){        
                a.push(arrayListSoftware[i].split(","));        
            }            
            	        
            for(let i=0; i<a.length; i++){            
                for(let j=1; j<a[i].length; j++){ 
                    if(j==3){
                        
                        const subNodeSoftInstall = namespace.addObject({componentOf: deviceSoftwareInstalled, browseName:a[i][2]});
                         namespace.addVariable({
                                    componentOf: subNodeSoftInstall, 
                                    browseName: "Installation Date",  
                                    dataType: "String",
                                    valueRank: 0,					
                                    value:	{ 
                                        get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: a[i][1]});
                                        }
                                    }
                                });
                        namespace.addVariable({
                                    componentOf: subNodeSoftInstall, 
                                    browseName: "Version",  
                                    dataType: "String",
                                    valueRank: 0,					
                                    value:	{ 
                                        get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: a[i][j]});
                                        }
                                    }
                                });
                    }  
                }  
            }  
        }   
        getVersion();
        
        /* Get a list of all windows patches  */ 
        let arrayPatchList = new Array();
        let q = [];
        
        const child_2 = execFile('wmic',['qfe', 'get', 'HotFixID', ',Description', ',InstalledOn', '/format:CSV'], (error, stdout, stderr) => {
          if (error) {
            throw error;
          }
            arrayPatchList = stdout.split("\n"); 
            arrayPatchList.splice(0, 2);
            for(let i in arrayPatchList){        
                q.push(arrayPatchList[i].split(","));        
            } 

            for(let i=0; i<q.length; i++){            
                for(let j=1; j<q[i].length; j++){            
                    if(j==3){                        
                         const subNodeUpdate = namespace.addObject({componentOf: deviceWindowsUpdate, browseName:q[i][2]});
                         namespace.addVariable({
                                    componentOf: subNodeUpdate, 
                                    browseName: "Description",  
                                    dataType: "String",
                                    valueRank: 0,					
                                    value:	{ 
                                        get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: q[i][1]});
                                        }
                                    }
                                });
                        
                        namespace.addVariable({
                                    componentOf: subNodeUpdate, 
                                    browseName: "InstalledOn",  
                                    dataType: "String",
                                    valueRank: 0,					
                                    value:	{ 
                                        get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: q[i][j]});
                                        }
                                    }
                                });
                    }
                }        
            }
        });
        
        /* Get a list of Win32_BIOS */
        let arrayBios = new Array();
        let z = [];   
        
        const child_3 = execFile('wmic',['bios', 'get', 'biosversion', ',SerialNumber', ',Manufacturer', '/format:CSV'], (error, stdout, stderr) => {
          if (error) {
            throw error;
          }
          //console.log(stdout);
            arrayBios = stdout.split(","); 
            arrayBios.splice(0, 4);
            for(let i in arrayBios){        
                z.push(arrayBios[i].split(";"));        
            }

            for(let i=0; i<z.length; i++){            
                for(let j=1; j<z[i].length; j++){            
                    if(j==2){
                        
                        namespace.addVariable({
                            componentOf: deviceBiosVersion, 
                            browseName: "Version",  
                            dataType: "String",
                            valueRank: 0,					
                            value:	{ 
                                get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: z[i][0]});
                                }
                            }
                        });
                        namespace.addVariable({
                                componentOf: deviceBiosVersion, 
                                browseName: "Caption",  
                                dataType: "String",
                                valueRank: 0,					
                                value:	{ 
                                    get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: z[i][1]});
                                    }
                                }
                            });
                    }
                }
                if (i==1){
                    namespace.addVariable({
                            componentOf: deviceBios, 
                            browseName: "Manufacturer",  
                            dataType: "String",
                            valueRank: 0,					
                            value:	{ 
                                get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: z[i][0]});
                                }
                            }
                        });
                }
                if (i==2){
                    namespace.addVariable({
                            componentOf: deviceBios, 
                            browseName: "SerialNumber",  
                            dataType: "String",
                            valueRank: 0,					
                            value:	{ 
                                get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: z[i][0]});
                                }
                            }
                        });
                }
            }
            
        });

        /**
        * Info network card => we can use all actives network cards with @IP.
        */		
		const ifaces = os.networkInterfaces();
		let array = new Array();

		Object.keys(ifaces).forEach(function (ifname) {
		  let alias = [];

		  ifaces[ifname].forEach(function (iface) {
			if ('IPv4' !== iface.family || iface.internal !== false) {
			  // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
			  return;
			}		
			if (alias >= 1) {
			  // this single interface has multiple ipv4 addresses
			  /* array.push([ifname + ':' + alias,iface.address,iface.netmask,iface.mac,iface.cidr]);*/
			} else {
			  // this interface has only one ipv4 adress
			  // console.log(ifname, iface.address);		   
			  array.push([ifname,iface.address,iface.netmask,iface.mac,iface.cidr]);
			}
			++alias;
		  });
		});
	
		function createList(liste ) {		
			let index = 0;
			let i;
            i = 0;
			
					
			function addNetworkCart(deviceNetwork, liste){		
				index += 1;
                
				let obj = namespace.addObject({componentOf: deviceNetwork, browseName: "deviceNetwork Interface-"+ index.toString() });
                
                if (index == 1){                    
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"name",  
                        dataType: "String",
                        valueRank: 0,					
                        value:	{ 
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[0][0]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"address",  
                        dataType: "String", 
                        valueRank: 0,
                        value: { 
                            get: function() {return new opcua.Variant({dataType: opcua.DataType.String, value: array[0][1]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"netmask", 
                        dataType: "String",
                        valueRank: 0,
                        value: {
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[0][2]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"mac",     
                        dataType: "String",
                        valueRank: 0,
                        value: {
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[0][3]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"cidr",  
                        dataType: "String", 
                        valueRank: 0,
                        value: {
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[0][4]});
                            }
                        }
                    });                 
                    
                }
                
                if (index == 2){                    
                        namespace.addVariable({
                        componentOf: obj, 
                        browseName:"name",  
                        dataType: "String",
                        valueRank: 0,					
                        value:	{ 
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[1][0]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"address",  
                        dataType: "String", 
                        valueRank: 0,
                        value: { 
                            get: function() {return new opcua.Variant({dataType: opcua.DataType.String, value: array[1][1]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"netmask", 
                        dataType: "String",
                        valueRank: 0,
                        value: {
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[1][2]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"mac",     
                        dataType: "String",
                        valueRank: 0,
                        value: {
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[1][3]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"cidr",  
                        dataType: "String", 
                        valueRank: 0,
                        value: {
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[1][4]});
                            }
                        }
                    });
                }
                if (index == 3){                    
                        namespace.addVariable({
                        componentOf: obj, 
                        browseName:"name",  
                        dataType: "String",
                        valueRank: 0,					
                        value:	{ 
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[2][0]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"address",  
                        dataType: "String", 
                        valueRank: 0,
                        value: { 
                            get: function() {return new opcua.Variant({dataType: opcua.DataType.String, value: array[2][1]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"netmask", 
                        dataType: "String",
                        valueRank: 0,
                        value: {
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[2][2]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"mac",     
                        dataType: "String",
                        valueRank: 0,
                        value: {
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[2][3]});
                            }
                        }
                    });
                    namespace.addVariable({
                        componentOf: obj, 
                        browseName:"cidr",  
                        dataType: "String", 
                        valueRank: 0,
                        value: {
                            get: function() {return new opcua.Variant({ dataType: opcua.DataType.String, value: array[2][4]});
                            }
                        }
                    });
                }
            
                }
			array.forEach(addNetworkCart.bind(array,deviceNetwork));            
		}
		createList(array);

    }
        construct_my_address_space(server);
        
        server.start(function() {
            console.log("Server is now listening ... ( press CTRL+C to stop)");
            console.log("port ", server.endpoints[0].port);
            const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
            console.log(" the primary server endpoint url is ", endpointUrl );
        });
        
        
    }
    catch (err) {
        console.log(err);
    }
})();
