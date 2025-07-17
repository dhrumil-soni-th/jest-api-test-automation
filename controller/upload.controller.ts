import supertest from "supertest";
import config from "../config/base.config";

const request = supertest(config.baseUrl);

class UploadController {
  postUploadSingleFile(filepath: string) {
    return request.post("/upload/single").attach("single", filepath);
  }

  postUploadMultipleFiles(files: string[]) {
    // Generic way to attach multiple files
    // request.post("/upload/multiple").attach("multiple", files[0]);
    // request.post("/upload/multiple").attach("multiple", files[1]);

    // Using a loop to attach multiple files
    const req = request.post("/upload/multiple");
    files.forEach((file) => {
      req.attach("multiple", file);
    });
    return req;
  }
}

export default new UploadController();
