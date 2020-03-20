PDF Splitter Using External Web Service

Requirement: - To split PDF into multiple child PDFs and attaching the splits back to salesforce. To make the process multi threaded

Technologies Involved:- Apex , REST API, Nodejs , Python

Environment:- Salesforce, Github Desktop (https://github.com/), Heroku (http://heroku.com/ )

Steps to setup environment.

Fork Github repo
1.	Send a mail to syiqbal@deloitte.com to add you as the collaborator. 
2.	Fork the Github repo https://github.com/syedamberiqbal/Fax-Split
3.	Be sure to fork from develop_Fax_Release1 branch.

Setting up Connected App in Salesforce
1.	Go to App in salesforce and click on connected app.
2.	Give Connected App Name as ‘Fax Split App’.
3.	API Name as ‘Fax_Split_App’.
4.	Check Enable OAuth Settings.
5.	Set Callback URL :- http://localhost:3000/oauth/_callback
6.	Select all values to Selected OAuth Scope.
7.	Save the record.
8.	Copy the Consumer Key and Consumer Secret.
9.	Go to connected app and open the created connected app.
10.	Permitted User :- All user may self-authorize.
11.	IP Relaxation :- Relax IP Restriction

Upload the package content using Workbench, or ANT (apex class, visualforce page ,custom setting and remote site settings )to the org using the package.xml in (upload_package.zip)

Add a new button on the Sobject where the split needs to happen.
1.	Go to the buttons on the sobject and paste the following code.
2.	{!REQUIRESCRIPT("/soap/ajax/29.0/connection.js")} 
{!REQUIRESCRIPT("/soap/ajax/29.0/apex.js")} 

var attachments = sforce.connection.query("SELECT Id, ParentId FROM Attachment WHERE ParentId = '{!Account.Id}'"); 
records = attachments.getArray("records"); 
window.open('/apex/Fax_Split?attachmentId='+records[0].Id);
3.	NOTE:- Make sure you have only 1 attachment per the parent document.

Clone the Github repo
1.	Go to routes then index.js file.
2.	Update username, password+security token, loginurl ,clientid,clientsecret	 for your org .
3.	Make sure to keep redirecturl as the callback url from the connected app.
4.	Once the changes are made push the code to github.

Connect Github with Heroku Application
1.	Go to your heroku application and click on Deploy. In case of creating a new app
2.	Set Deployment method as GitHub and authenticate with your Github account. Once connected to your Github account and search for your Github fax split repo and click on connect.
3.	Go to settings and click on ‘Add Buildpack’ and add Python and Nodejs as buildpacks.
4.	Once done scroll down and in manual deploy section set the branch as develop_Fax_Release1 and click on deploy.
5.	Once deployment is done. Click on Open App from top right corner and copy the url and remove the last backslash. 
For ex. 				http://aquesous-retreat-94106.herokuapp.com/
Should be updated to 		http://aquesous-retreat-94106.herokuapp.com
6.	Go back to salesforce and update ‘Fax_Callout’ Remote site with remote site url populated with url from step 4. 

7.	Update the spreadsheet ‘Fax_Custom_URL Export.csv’ file URL column with the url from step 4. 


8.	Upload the spreadsheet to ‘Fax_Custom_URL__c’  custom setting using dataloader.


Document Created by – Syed Amber Iqbal
			   DC Consultant – Hyderabad



