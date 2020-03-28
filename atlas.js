module.exports = {
	mongoURI: "mongodb+srv://Nasser:<Mightycas001>@histolms-tuvv5.azure.mongodb.net/test?retryWrites=true&w=majority",
	mongoCFG:  {
	useNewUrlParser: true,
	ssl: true,
	replicaSet: 'Cluster0-shard-0',
	authSource:'admin',
	retryWrites: true
	}
};