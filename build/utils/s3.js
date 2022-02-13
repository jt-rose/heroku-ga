import dotenv from "dotenv";
dotenv.config();
import aws from "aws-sdk";
import fs from "fs";
var bucketName = process.env.S3_BUCKET;
var region = process.env.AWS_BUCKET_REGION;
var accessKeyId = process.env.AWS_ACCESS_KEY_ID;
var secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
if ([bucketName, region, accessKeyId, secretAccessKey].some(function (x) { return x === undefined; })) {
    console.log("ENV variables improperly loaded");
    console.log("Bucket", bucketName);
    console.log("region", region);
    console.log("accessKey", accessKeyId);
    console.log("secret", secretAccessKey);
}
else {
    console.log("ENV variables populated");
}
// create new instance of S3
var s3 = new aws.S3({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
});
// upload a file to s3
export function uploadFile(file) {
    var fileStream = fs.createReadStream(file.path);
    var uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
        ContentType: "image/jpeg",
    };
    return s3.upload(uploadParams).promise();
}
// download a file from s3
export function getFileStream(filekey) {
    var downloadParams = {
        Key: filekey,
        Bucket: bucketName,
    };
    return s3.getObject(downloadParams).createReadStream();
}
