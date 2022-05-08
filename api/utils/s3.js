const AWS = require('aws-sdk');
const s3Config = require('../config/s3.config');

var credentials = {
    accessKeyId: s3Config.ACCESSKEYID,
    secretAccessKey : s3Config.SECRET
};
AWS.config.update({credentials: credentials, region: 'eu-central-1'});
const s3 = new AWS.S3({});


module.exports.upload =  (imageName, contentType) => {
    return s3.getSignedUrl('putObject', {
        Bucket: s3Config.BUCKET_NAME,
        Key: imageName, //filename
        Expires: 200,//time to expire in seconds
        ContentType: contentType
    });
}

module.exports.download = (imageName, contentType) => {
    return s3.getSignedUrl('getObject', {
        Bucket: s3Config.BUCKET_NAME,
        Key: imageName, //filename
        Expires: 200, //time to expire in seconds
        ContentType: contentType
    });
}
