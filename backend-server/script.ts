import { ChildProcess } from "child_process";
import { exec } from 'child_process';
import path from "path";
import * as fs from 'fs';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as mime from "mime-types"

const PROJECT_ID = process.env.PROJECT_ID;

const s3Client = new S3Client({
    region : '',
    credentials : {
        accessKeyId : '',
        secretAccessKey: ''
    }
})

const init = async () => {
    console.log("building code...");
    const outDir : string = path.join(__dirname, "output");

    const p : ChildProcess = exec(`cd ${outDir} && npm install && npm run build.`);
    if(p.stdout){
        p.stdout.on("data", (data)=> {
            console.log(data);
        })
    }

    if(p.stderr){
        p.stderr.on("error", (error) => {
            console.log(error)
        })
    }

    p.on("close", async () => {
        console.log("build complete");
        const distFolderPath = path.join(__dirname, 'output', 'dist');
        const distFolderContents = fs.readdirSync(distFolderPath, {recursive : true});

        for (let filePath of distFolderContents){
            if(fs.lstatSync(filePath).isDirectory()) continue;

            const contentType : string  = mime.lookup(filePath as string) as string;

            const putObjectCommand = new PutObjectCommand({
                Bucket : '',
                Key : `__outputs/${PROJECT_ID}/${filePath}`,
                Body : fs.createReadStream(filePath),
                ContentType : mime.lookup(contentType) as string
            })

            await s3Client.send(putObjectCommand);
        }

        console.log("Build uploaded successfully.");
    })
}

init();